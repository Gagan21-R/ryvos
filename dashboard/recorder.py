"""H · Recorder: listens to every channel and keeps two files up to date for the web app.

  data/live.json   (~4x per second) latest twin state, arena status, open incidents, last 150 story events
  data/learn.json  (when it changes) every round result, incident reports, ORACLE verdicts

The backend streams these to the browser, so the browser never needs its own bus connection.

Run: python -m dashboard.recorder
"""
import itertools
import json
import os
import threading
import time
from collections import deque

from shared import bus, config, names

LIVE = config.DATA_DIR / "live.json"
LEARN = config.DATA_DIR / "learn.json"
RESULTS = config.DATA_DIR / "results.jsonl"


def load_results():
    try:
        return [json.loads(line) for line in RESULTS.read_text(encoding="utf-8").splitlines() if line.strip()]
    except FileNotFoundError:
        return []


def write_atomic(path, data):
    tmp = path.with_suffix(".tmp")
    tmp.write_text(data, encoding="utf-8")
    for _ in range(20):
        try:
            os.replace(tmp, path)
            return
        except PermissionError:          # Windows: someone is reading it, try again
            time.sleep(0.05)


def light(msg, drop=("q_values", "info", "evidence")):
    return {k: v for k, v in msg.items() if k not in drop}


def to_event(channel, m):
    """One story event per interesting message: who acted, what happened, what they said."""
    base = {"round": m.get("round"), "domain": m.get("domain"), "t": m.get("t")}
    if channel == names.ROGUE_PROPOSAL:
        return {**base, "agent": "rogue", "kind": "proposal", "speech": m["speech"],
                "text": f"proposes {' + '.join(e['label'] for e in m['experiments'])}", "data": light(m)}
    if channel == names.ORACLE_VERDICT:
        return {**base, "agent": "oracle", "kind": "verdict", "speech": m["speech"],
                "text": ("APPROVED " if m["approved"] else "BLOCKED ") + " + ".join(m["attacks"]), "data": light(m)}
    if channel == names.RED_ATTACK:
        return {**base, "agent": "rogue", "kind": "attack", "speech": m.get("speech"),
                "text": f"launches {m['attack']} on {', '.join(map(str, m['target'][:4]))}", "data": light(m)}
    if channel == names.BLUE_ALERT:
        if m["status"] == "new":
            return {**base, "agent": "aegis", "kind": "detect", "speech": m.get("speech"),
                    "text": f"detected {m['key']}", "data": light(m, drop=())}
        return {**base, "agent": "aegis", "kind": "resolved", "speech": m.get("speech"),
                "text": f"{m['symptom']} resolved", "data": light(m)}
    if channel == names.BLUE_DIAGNOSIS:
        return {**base, "agent": "aegis", "kind": f"diagnosis_{m['status']}", "speech": m.get("speech"),
                "text": f"{m['status']}: {m['key']}" + (f" -> {' + '.join(m['fixes'])}" if m["fixes"] else ""),
                "data": light(m)}
    if channel == names.BLUE_FIX:
        return {**base, "agent": "aegis", "kind": "fix", "speech": m.get("speech"),
                "text": f"applied {m['action']}", "data": light(m)}
    if channel == names.ROUND_RESULT:
        return {**base, "agent": "oracle", "kind": "result", "speech": m.get("speech"),
                "text": f"round verdict: {m.get('verdict', '—')}, resilience {m.get('resilience', '—')}", "data": m}
    if channel == names.AGENT_SAY:
        return {**base, "agent": m["agent"], "kind": "say", "speech": m["speech"], "text": m["speech"],
                "data": light(m)}
    if channel == names.CITY_EVENTS:
        kind = m["type"]
        if kind == "round_start":
            return {**base, "agent": "twin", "kind": "round_start", "text": f"round {m['round']} begins",
                    "data": {"domain_round": m.get("domain_round"), "round_ticks": m.get("round_ticks")}}
        if kind == "round_end":
            return {**base, "agent": "twin", "kind": "round_aborted" if m.get("aborted") else "round_end",
                    "text": "round aborted: new round requested" if m.get("aborted") else "round complete"}
        if kind == "chaos":
            return {**base, "agent": "twin", "kind": "chaos", "text": m["text"]}
        if kind == "arena_idle":
            return {**base, "agent": "twin", "kind": "idle", "text": "waiting for the next autonomous round"}
        if kind == "bank_removed":
            return {**base, "agent": "twin", "kind": "chaos", "text": f"{m['bank']} removed from routing"}
    return None


def main():
    seq = itertools.count(1)
    live = {"state": None, "events": deque(maxlen=150), "incidents": {},
            "status": {"paused": False, "blue_enabled": True, "domain_mode": config.DOMAIN, "autoplay": True,
                       "idle": False}}
    learn = {"results": load_results(), "reports": deque(maxlen=60), "verdicts": deque(maxlen=60)}
    learn_version = [1]
    lock = threading.Lock()

    def writer():
        written = 0
        while True:
            time.sleep(0.25)
            with lock:
                data = json.dumps({**live, "events": list(live["events"]), "updated": time.time(),
                                   "learn_version": learn_version[0]})
                learn_data = None
                if learn_version[0] != written:
                    written = learn_version[0]
                    learn_data = json.dumps({"version": written, "results": learn["results"],
                                             "reports": list(learn["reports"]), "verdicts": list(learn["verdicts"])})
            write_atomic(LIVE, data)
            if learn_data:
                write_atomic(LEARN, learn_data)

    threading.Thread(target=writer, daemon=True).start()
    print("[recorder] writing data/live.json + data/learn.json", flush=True)

    for channel, m in bus.subscribe(*names.ALL_CHANNELS):
        with lock:
            if channel == names.CITY_STATE:
                live["state"] = m
                live["status"]["idle"] = False
                continue
            if channel == names.CONTROL:
                st, cmd = live["status"], m.get("cmd")
                if cmd in ("pause", "resume"):
                    st["paused"] = cmd == "pause"
                elif cmd == "blue":
                    st["blue_enabled"] = bool(m.get("enabled"))
                elif cmd in ("domain", "start_round") and m.get("domain"):
                    st["domain_mode"] = m["domain"]
                elif cmd == "autoplay":
                    st["autoplay"] = bool(m.get("enabled", True))
                elif cmd == "reset_learning":
                    learn["results"], learn["reports"] = [], deque(maxlen=60)
                    learn_version[0] += 1
                continue
            if channel == names.ROUND_RESULT:
                learn["results"].append(m)
                learn_version[0] += 1
            elif channel == names.ROUND_REPORT:
                learn["reports"].append(m)
                learn_version[0] += 1
            elif channel == names.ORACLE_VERDICT:
                learn["verdicts"].append(light(m))
                learn_version[0] += 1
            elif channel == names.BLUE_ALERT:
                if m["status"] == "new":
                    live["incidents"][m["symptom"]] = {"key": m["key"], "t": m["t"], "round": m["round"],
                                                       "speech": m.get("speech")}
                else:
                    live["incidents"].pop(m["symptom"], None)
            elif channel == names.CITY_EVENTS and m["type"] == "round_start":
                live["incidents"] = {}
            elif channel == names.CITY_EVENTS and m["type"] == "arena_idle":
                live["status"]["idle"] = True
            ev = to_event(channel, m)
            if ev:
                live["events"].append({"id": next(seq), **ev})


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        pass
