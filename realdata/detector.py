"""AEGIS anomaly detector, trained and evaluated on real labelled telemetry.

Model (deterministic, explainable):
  1. robust z-score of each point against the trailing `window_h` hours: (x - median) / (1.4826 * MAD)
  2. smooth |z| with an exponential moving average (`alpha`)
  3. raise an alert when the smoothed score stays above `threshold` for `persist` points in a row,
     then stay quiet for `cooldown_h` hours (one alert per incident)
  Windows are in hours, not points, so the learned settings mean the same thing on series sampled every
  5 minutes, 30 minutes or hourly.

Training = choosing window, threshold, persist and alpha by grid search on the TRAIN series only,
maximising F1 against the expert-labelled windows. The TEST series are scored once, afterwards.

Scoring (per labelled incident window, like NAB):
  - an incident is detected if at least one alert falls inside its window
  - an alert outside every window is a false alarm
  - precision = alerts inside windows / all alerts, recall = detected incidents / all incidents
"""
import csv
import json
import time
from functools import lru_cache

import numpy as np
from numpy.lib.stride_tricks import sliding_window_view

from realdata import catalog

MODEL_FILE = catalog.DIR.parent / "real_model.json"
DEFAULTS = {"window_h": 8, "threshold": 3.0, "persist": 1, "alpha": 1.0, "cooldown_h": 4}   # textbook 3-sigma rule, untrained
GRID = {"window_h": [6, 12, 24, 48], "threshold": [3.0, 4.0, 5.0, 6.0, 8.0, 10.0, 12.0],
        "persist": [1, 2, 3, 4], "alpha": [1.0, 0.5, 0.2], "cooldown_h": [6, 24, 72]}


@lru_cache(maxsize=None)
def labels():
    return json.loads((catalog.DIR / "combined_windows.json").read_text(encoding="utf-8"))


@lru_cache(maxsize=None)
def load(series_id):
    """(timestamps as datetime64[s], values as float array, labelled windows as index pairs)."""
    with open(catalog.DIR / f"{series_id}.csv", newline="", encoding="utf-8") as f:
        rows = list(csv.reader(f))[1:]
    ts = np.array([r[0] for r in rows], dtype="datetime64[s]")
    x = np.array([float(r[1]) for r in rows])
    wins = []
    for start, end in labels().get(f"{series_id}.csv", []):
        s, e = np.datetime64(start[:19]), np.datetime64(end[:19])
        i, j = int(np.searchsorted(ts, s)), int(np.searchsorted(ts, e, side="right")) - 1
        if j >= i:
            wins.append((i, j))
    return ts, x, wins


@lru_cache(maxsize=None)
def step_minutes(series_id):
    ts, _, _ = load(series_id)
    return max(1.0, float(np.median(np.diff(ts).astype("timedelta64[s]").astype(float))) / 60)


def points(series_id, hours, minimum=12):
    return max(minimum, int(round(hours * 60 / step_minutes(series_id))))


@lru_cache(maxsize=None)
def robust_z(series_id, window):
    _, x, _ = load(series_id)
    z = np.zeros_like(x)
    if len(x) <= window:
        return z
    past = sliding_window_view(x[:-1], window)            # past[k] = x[k : k+window], scores x[k+window]
    med = np.median(past, axis=1)
    mad = np.median(np.abs(past - med[:, None]), axis=1)
    floor = 1e-6 + 1e-3 * (np.std(x) or 1.0)
    z[window:] = (x[window:] - med) / np.maximum(1.4826 * mad, floor)
    return np.clip(np.abs(z), 0, 50)


def smooth(z, alpha):
    if alpha >= 1.0:
        return z
    out, acc = np.empty_like(z), 0.0
    for i, v in enumerate(z):
        acc = alpha * v + (1 - alpha) * acc
        out[i] = acc
    return out


@lru_cache(maxsize=4096)
def _scores(series_id, window, alpha):
    return smooth(robust_z(series_id, window), alpha)


def alerts_from(score, threshold, persist, window, cool):
    above = (score > threshold).astype(np.int8)
    if persist > 1:
        above = (np.convolve(above, np.ones(persist, dtype=np.int8), mode="full")[: len(above)] >= persist)
    idx = np.flatnonzero(above)
    idx = idx[idx >= window]                                  # warm-up: no alerts before a full window of history
    out, last = [], -10**9
    for i in idx:
        if i - last > cool:
            out.append(int(i))
            last = i
    return out


def detect(series_id, p):
    window = points(series_id, p["window_h"])
    score = _scores(series_id, window, p["alpha"])
    return alerts_from(score, p["threshold"], p["persist"], window, points(series_id, p["cooldown_h"], 1)), score


def evaluate(series_id, p):
    ts, _, wins = load(series_id)
    alerts, _ = detect(series_id, p)
    inside = [a for a in alerts if any(i <= a <= j for i, j in wins)]
    detected = [w for w in wins if any(w[0] <= a <= w[1] for a in alerts)]
    days = max(1e-9, (ts[-1] - ts[0]).astype("timedelta64[s]").astype(float) / 86400)
    false_alarms = len(alerts) - len(inside)
    return {"incidents": len(wins), "detected": len(detected), "alerts": len(alerts), "true_alerts": len(inside),
            "false_alarms": false_alarms, "false_per_day": round(false_alarms / days, 2), "days": round(days, 1)}


def summarize(rows):
    inc = sum(r["incidents"] for r in rows)
    det = sum(r["detected"] for r in rows)
    al = sum(r["alerts"] for r in rows)
    good = sum(r["true_alerts"] for r in rows)
    precision = good / al if al else 0.0
    recall = det / inc if inc else 0.0
    f1 = 2 * precision * recall / (precision + recall) if precision + recall else 0.0
    days = sum(r["days"] for r in rows)
    fa = sum(r["false_alarms"] for r in rows)
    return {"series": len(rows), "incidents": inc, "detected": det, "alerts": al, "false_alarms": fa,
            "false_per_day": round(fa / days, 2) if days else 0, "precision": round(100 * precision, 1),
            "recall": round(100 * recall, 1), "f1": round(100 * f1, 1)}


def ids(split):
    return [k for k, v in catalog.SERIES.items() if v["split"] == split]


def train():
    """Grid search on the train series only; returns the full model report."""
    started = time.time()
    train_ids, test_ids = ids("train"), ids("test")
    best, best_key, tried = None, None, 0
    for w in GRID["window_h"]:
        for a in GRID["alpha"]:
            for k in GRID["threshold"]:
                for pe in GRID["persist"]:
                    for c in GRID["cooldown_h"]:
                        p = {"window_h": w, "threshold": k, "persist": pe, "alpha": a, "cooldown_h": c}
                        s = summarize([evaluate(sid, p) for sid in train_ids])
                        tried += 1
                        key = (s["f1"], -s["false_alarms"])
                        if best_key is None or key > best_key:
                            best, best_key = p, key
    report = {
        "trained_at": time.strftime("%Y-%m-%d %H:%M:%S"), "seconds": round(time.time() - started, 1),
        "combinations_tried": tried, "grid": GRID, "params": best, "defaults": DEFAULTS,
        "train": {"untrained": summarize([evaluate(s, DEFAULTS) for s in train_ids]),
                  "trained": summarize([evaluate(s, best) for s in train_ids])},
        "test": {"untrained": summarize([evaluate(s, DEFAULTS) for s in test_ids]),
                 "trained": summarize([evaluate(s, best) for s in test_ids])},
        "per_series": [{"id": s, **catalog.SERIES[s], **evaluate(s, best), "untrained": evaluate(s, DEFAULTS)}
                       for s in test_ids + train_ids],
        "source": {"name": catalog.SOURCE, "url": catalog.SOURCE_URL, "licence": catalog.LICENCE},
    }
    MODEL_FILE.write_text(json.dumps(report, indent=1), encoding="utf-8")
    return report


def model():
    if MODEL_FILE.exists():
        try:
            return json.loads(MODEL_FILE.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            pass
    return train()


def sweep(thresholds=(2.0, 2.5, 3.0, 4.0, 5.0, 6.0, 8.0, 10.0, 12.0, 15.0)):
    """Precision / recall on the unseen TEST series as the alert threshold changes (other learned settings fixed)."""
    base = model()["params"]
    out = []
    for k in thresholds:
        s = summarize([evaluate(sid, {**base, "threshold": k}) for sid in ids("test")])
        out.append({"threshold": k, "trained": k == base["threshold"], **s})
    return out


def series_payload(series_id, max_points=1500):
    """Everything the chart needs, with the series bucketed down to ~max_points (min/max kept so spikes survive)."""
    if series_id not in catalog.SERIES:
        raise KeyError(series_id)
    p = model()["params"]
    ts, x, wins = load(series_id)
    alerts, score = detect(series_id, p)
    n = len(x)
    step = max(1, int(np.ceil(n / (max_points / 2))))
    keep = set()
    for b in range(0, n, step):
        seg = x[b:b + step]
        keep.update((b + int(np.argmin(seg)), b + int(np.argmax(seg))))
    keep.update(alerts)
    for i, j in wins:
        keep.update((i, j))
    idx = sorted(keep)
    stamp = lambda i: str(ts[i]).replace("T", " ")
    return {
        "id": series_id, **catalog.SERIES[series_id], "source_csv": catalog.RAW_URL.format(id=series_id),
        "points_total": n, "points_shown": len(idx), "params": p,
        "points": [{"i": i, "t": stamp(i), "v": round(float(x[i]), 4), "score": round(float(score[i]), 2)} for i in idx],
        "windows": [{"start": stamp(i), "end": stamp(j), "i": i, "j": j,
                     "detected": any(i <= a <= j for a in alerts)} for i, j in wins],
        "alerts": [{"i": a, "t": stamp(a), "v": round(float(x[a]), 4), "score": round(float(score[a]), 2),
                    "true": any(i <= a <= j for i, j in wins)} for a in alerts],
        "evaluation": evaluate(series_id, p),
    }


if __name__ == "__main__":
    r = train()
    print(json.dumps({k: r[k] for k in ("seconds", "combinations_tried", "params", "train", "test")}, indent=1))
