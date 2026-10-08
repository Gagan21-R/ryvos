"""H · Web dashboard server (replaces Streamlit). Python standard library only.

  GET  /               the dashboard (web/static/index.html)
  GET  /api/meta       names, attacks, fixes, scenarios and metrics of the 3 domains
  GET  /api/stream     live updates pushed with Server-Sent Events (~5 per second)
  POST /api/control    dashboard buttons -> arena.control on the bus

The recorder (dashboard/recorder.py) keeps data/live.json up to date; this server just streams it.

Run: python -m web.server        -> http://localhost:8501
"""
import json
import os
import time
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse

import domains
from shared import bus, config, names

STATIC = Path(__file__).resolve().parent / "static"
DATA = config.DATA_DIR
PORT = int(os.getenv("CBA_WEB_PORT", "8501"))
ALL_ATTACKS = {a for spec in names.DOMAINS.values() for a in spec["attacks"]}


def meta():
    out = {}
    for did in domains.ORDER:
        D = domains.get(did)
        baseline = next((getattr(D, n) for n in ("BASELINE", "BASELINE_LATE_PCT", "BASELINE_FAILED_PCT")
                         if hasattr(D, n)), None)
        out[did] = {"id": did, "title": D.TITLE, "icon": D.ICON, "stake": D.STAKE, "tick_unit": D.TICK_UNIT,
                    "round_ticks": D.ROUND_TICKS, "attack_at": D.ATTACK_AT, "metrics": D.METRICS,
                    "baseline": baseline, "attacks": D.ATTACK_INFO, "fixes": D.FIX_INFO,
                    "scenarios": D.SCENARIOS, "legend": D.MAP_LEGEND}
    return {"order": domains.ORDER, "domains": out}


class FileCache:
    """Re-reads a JSON file only when it changed on disk."""

    def __init__(self, path, default):
        self.path, self.default, self.mtime, self.value = path, default, None, default

    def get(self):
        try:
            m = self.path.stat().st_mtime
            if m != self.mtime:
                self.value, self.mtime = json.loads(self.path.read_text(encoding="utf-8")), m
        except (OSError, json.JSONDecodeError):
            if not self.path.exists():
                self.value, self.mtime = self.default, None
        return self.value


live_file = FileCache(DATA / "live.json", {})
playbook_file = FileCache(DATA / "playbook.json", {})
brain_file = FileCache(DATA / "red_brain.json", {})


class Handler(SimpleHTTPRequestHandler):
    extensions_map = {**SimpleHTTPRequestHandler.extensions_map, ".js": "application/javascript",
                      ".css": "text/css", ".svg": "image/svg+xml", ".json": "application/json",
                      ".mp4": "video/mp4", "": "application/octet-stream"}

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(STATIC), **kwargs)

    def log_message(self, *args):
        pass

    def end_headers(self):
        self.send_header("Cache-Control", "no-cache")
        super().end_headers()

    def send_json(self, obj, code=200):
        body = json.dumps(obj).encode()
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        path = urlparse(self.path).path
        if path == "/api/meta":
            return self.send_json(meta())
        if path == "/api/stream":
            return self.stream()
        if path == "/demo.mp4":
            video = config.ROOT / "demo" / "code_blue_arena_demo.mp4"
            if video.exists():
                data = video.read_bytes()
                self.send_response(200)
                self.send_header("Content-Type", "video/mp4")
                self.send_header("Content-Length", str(len(data)))
                self.end_headers()
                self.wfile.write(data)
                return None
        return super().do_GET()

    def stream(self):
        self.send_response(200)
        self.send_header("Content-Type", "text/event-stream")
        self.send_header("Connection", "keep-alive")
        self.end_headers()
        last_live, last_learn, last_beat = None, None, time.time()
        try:
            while True:
                live = live_file.get()
                if live.get("updated") != last_live and live.get("state"):
                    last_live = live.get("updated")
                    self.event("live", {"state": live["state"], "status": live.get("status", {}),
                                        "incidents": live.get("incidents", {}), "log": live.get("log", [])[-80:]})
                book, brain = playbook_file.get(), brain_file.get()
                results, reports = live.get("results", []), live.get("reports", [])
                key = (len(results), results[-1]["round"] if results else None, len(reports),
                       playbook_file.mtime, brain_file.mtime)
                if key != last_learn:
                    last_learn = key
                    self.event("learn", {"results": results, "reports": reports[-15:], "playbook": book,
                                         "brain": brain})
                if time.time() - last_beat > 10:
                    self.wfile.write(b": ping\n\n")
                    self.wfile.flush()
                    last_beat = time.time()
                time.sleep(0.2)
        except (BrokenPipeError, ConnectionResetError, ConnectionAbortedError):
            return

    def event(self, name, data):
        self.wfile.write(f"event: {name}\ndata: {json.dumps(data)}\n\n".encode())
        self.wfile.flush()

    def do_POST(self):
        if urlparse(self.path).path != "/api/control":
            return self.send_json({"error": "not found"}, 404)
        try:
            msg = json.loads(self.rfile.read(int(self.headers.get("Content-Length", 0))) or b"{}")
        except json.JSONDecodeError:
            return self.send_json({"error": "bad json"}, 400)
        cmd = msg.get("cmd")
        if cmd in ("pause", "resume", "reset_learning"):
            out = {"cmd": cmd}
        elif cmd == "blue":
            out = {"cmd": cmd, "enabled": bool(msg.get("enabled"))}
        elif cmd == "domain" and (msg.get("domain") in domains.REGISTRY or msg.get("domain") == "all"):
            out = {"cmd": cmd, "domain": msg["domain"]}
        elif cmd == "scenario" and all(a in ALL_ATTACKS for a in msg.get("attacks", [])):
            out = {"cmd": cmd, "name": msg.get("name"), "attacks": list(msg.get("attacks", []))}
        else:
            return self.send_json({"error": "unknown command"}, 400)
        if cmd == "reset_learning":
            for f in ("results.jsonl", "playbook.json", "postmortems.md"):
                (DATA / f).unlink(missing_ok=True)
        try:
            bus.publish(names.CONTROL, out)
        except Exception as e:
            return self.send_json({"error": f"arena not reachable: {e}"}, 503)
        return self.send_json({"ok": True, "sent": out})


def main():
    server = ThreadingHTTPServer(("0.0.0.0", PORT), Handler)
    server.daemon_threads = True
    print(f"[web] dashboard on http://localhost:{PORT}", flush=True)
    server.serve_forever()


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        pass
