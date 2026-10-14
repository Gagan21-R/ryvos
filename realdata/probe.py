"""Live, real telemetry: HTTPS response time from this server to a few public endpoints, every 15 s.

The trained AEGIS detector runs on it online (same algorithm and learned threshold). Its history window is
the last 10 minutes, because live data only exists since the server started.
"""
import threading
import time
import urllib.request
from collections import deque

import numpy as np

from realdata import detector

TARGETS = [
    ("google", "Google", "https://www.google.com/generate_204"),
    ("cloudflare", "Cloudflare", "https://www.cloudflare.com/cdn-cgi/trace"),
    ("wikipedia", "Wikipedia", "https://en.wikipedia.org/static/favicon/wikipedia.ico"),
]
INTERVAL_S = 15
KEEP = 240                      # one hour of samples per endpoint
WINDOW = 40                     # 10 minutes of history for the online robust z-score

_buf = {tid: deque(maxlen=KEEP) for tid, _, _ in TARGETS}
_lock = threading.Lock()
_started = False


def measure(url):
    req = urllib.request.Request(url, headers={"User-Agent": "RYVO-resilience-probe/1.0"})
    t0 = time.perf_counter()
    try:
        with urllib.request.urlopen(req, timeout=8) as r:
            r.read(1)
            return round((time.perf_counter() - t0) * 1000, 1), r.status
    except Exception:
        return None, None


def _score(values):
    """Online detector over the samples so far: robust z against the previous WINDOW samples, then EWMA."""
    p = detector.model()["params"]
    x = np.array([v if v is not None else np.nan for v in values], dtype=float)
    out = []
    acc = 0.0
    run = 0
    for i, v in enumerate(x):
        hist = x[max(0, i - WINDOW):i]
        hist = hist[~np.isnan(hist)]
        if np.isnan(v):
            z = 50.0 if len(hist) >= 5 else 0.0          # a failed request is the strongest signal
        elif len(hist) < 10:
            z = 0.0
        else:
            med = np.median(hist)
            mad = np.median(np.abs(hist - med))
            z = min(50.0, abs(v - med) / max(1.4826 * mad, 1.0))
        acc = p["alpha"] * z + (1 - p["alpha"]) * acc
        run = run + 1 if acc > p["threshold"] else 0
        out.append((round(acc, 2), run >= p["persist"]))
    return out


def _loop():
    while True:
        for tid, _, url in TARGETS:
            ms, status = measure(url)
            with _lock:
                _buf[tid].append({"ts": time.strftime("%H:%M:%S"), "epoch": int(time.time()), "ms": ms, "status": status})
        time.sleep(INTERVAL_S)


def start():
    global _started
    if _started:
        return
    _started = True
    threading.Thread(target=_loop, daemon=True, name="ryvo-probe").start()


def snapshot():
    with _lock:
        data = {tid: list(b) for tid, b in _buf.items()}
    out = []
    for tid, name, url in TARGETS:
        rows = data[tid]
        scored = _score([r["ms"] for r in rows])
        samples = [{**r, "score": s, "alert": a} for r, (s, a) in zip(rows, scored)]
        ok = [r["ms"] for r in rows if r["ms"] is not None]
        out.append({"id": tid, "name": name, "url": url, "samples": samples,
                    "latest_ms": rows[-1]["ms"] if rows else None,
                    "median_ms": round(float(np.median(ok)), 1) if ok else None,
                    "failures": sum(1 for r in rows if r["ms"] is None),
                    "alerts": sum(1 for s in samples if s["alert"])})
    p = detector.model()["params"]
    return {"interval_s": INTERVAL_S, "window_samples": WINDOW, "threshold": p["threshold"], "persist": p["persist"],
            "alpha": p["alpha"], "targets": out}
