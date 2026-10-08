"""Records a narrated demo video of the live dashboard -> demo/code_blue_arena_demo.mp4

It drives a hidden (headless) Microsoft Edge through the Chrome DevTools Protocol: clicks the real dashboard
controls (domain tabs, attack-launcher cards, Blue switch), overlays captions that explain each agent action
as it happens, grabs ~5 screenshots per second and stitches them into an MP4 with ffmpeg.

NOTE: this recorder drives the PREVIOUS dashboard (web/). For RYVO's React app it needs new selectors.
1. Start the arena:     python run_all.py --domain emergency --legacy
2. In a 2nd terminal:   python -m tools.record_demo
Needs: pip install websocket-client imageio-ffmpeg
"""
import base64
import json
import re
import shutil
import socket
import subprocess
import tempfile
import time
import urllib.request
from pathlib import Path

import imageio_ffmpeg
import websocket

from shared import bus, config, names

URL = "http://localhost:8501"
W, H, FPS = 1440, 900, 5
OUT = config.ROOT / "demo" / "code_blue_arena_demo.mp4"
LIVE = config.DATA_DIR / "live.json"
EDGE = [r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
        r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
        r"C:\Program Files\Google\Chrome\Application\chrome.exe"]
WHO = {"red": ("⚔️ RED TEAM attacks", "#ff4d61"), "monitor": ("📡 MONITOR detects", "#f59e0b"),
       "diagnoser": ("🧠 DIAGNOSER decides", "#3b82f6"), "fixer": ("🛠️ FIXER applies a whitelisted fix", "#22d3ee"),
       "referee": ("⚖️ REFEREE scores the round", "#a78bfa"), "twin": ("🏙️ DIGITAL TWIN", "#94a3b8")}

OVERLAY_JS = """
window.__cap = function(scene, who, color, text) {
  let s = document.getElementById('demo-scene');
  if (!s) {
    s = document.createElement('div'); s.id = 'demo-scene';
    s.style.cssText = 'position:fixed;top:74px;left:50%;transform:translateX(-50%);z-index:2147483647;' +
      'background:linear-gradient(135deg,rgba(37,99,235,.95),rgba(99,102,241,.95));color:#fff;' +
      'font:700 19px Inter,system-ui,Segoe UI,sans-serif;padding:10px 22px;border-radius:14px;' +
      'box-shadow:0 10px 30px rgba(37,99,235,.45);max-width:84%;text-align:center;transition:all .4s ease;display:none';
    document.body.appendChild(s);
  }
  if (scene !== null) { s.textContent = scene; s.style.display = scene ? 'block' : 'none'; }
  let e = document.getElementById('demo-event');
  if (!e) {
    e = document.createElement('div'); e.id = 'demo-event';
    e.style.cssText = 'position:fixed;bottom:22px;left:50%;transform:translateX(-50%);z-index:2147483647;' +
      'background:rgba(15,23,42,.94);color:#e8eef8;font:500 17px Inter,system-ui,Segoe UI,sans-serif;' +
      'padding:12px 20px;border-radius:14px;box-shadow:0 10px 30px rgba(0,0,0,.5);width:min(1000px,74%);' +
      'border:1px solid rgba(148,163,184,.25);border-left:6px solid #3b82f6;backdrop-filter:blur(10px)';
    document.body.appendChild(e);
  }
  if (!who) { e.style.display = 'none'; return; }
  e.style.display = 'block'; e.style.borderLeftColor = color;
  e.innerHTML = '<div style="font-weight:800;color:' + color + ';margin-bottom:2px;font-size:14px;letter-spacing:.04em">' +
    who + '</div>' + text;
};
window.__card = function(title, sub) {
  let c = document.getElementById('demo-card');
  if (!title) { if (c) { c.style.opacity = 0; setTimeout(() => c.remove(), 500); } return; }
  if (!c) { c = document.createElement('div'); c.id = 'demo-card'; document.body.appendChild(c); }
  c.style.cssText = 'position:fixed;inset:0;z-index:2147483647;color:#fff;transition:opacity .5s ease;' +
    'background:radial-gradient(900px 500px at 20% 0%,rgba(255,77,97,.35),transparent 60%),' +
    'radial-gradient(900px 600px at 85% 10%,rgba(59,130,246,.45),transparent 60%),#060a13;' +
    'display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;' +
    'font-family:Inter,system-ui,Segoe UI,sans-serif;padding:40px';
  c.innerHTML = '<div style="font-size:60px;font-weight:800;letter-spacing:-.03em;margin-bottom:18px">' + title + '</div>' +
    '<div style="font-size:24px;line-height:1.55;max-width:1050px;color:#b6c2d6">' + sub + '</div>';
};
window.__click = function(sel) { const el = document.querySelector(sel); if (!el) return false; el.click(); return true; };
window.__scroll = function(sel) {
  if (!sel) { window.scrollTo({top: 0, behavior: 'smooth'}); return true; }
  const el = document.querySelector(sel); if (!el) return false;
  window.scrollTo({top: el.getBoundingClientRect().top + window.scrollY - 70, behavior: 'smooth'}); return true;
};
"""


class Browser:
    def __init__(self):
        exe = next((p for p in EDGE if Path(p).exists()), None)
        if not exe:
            raise SystemExit("Microsoft Edge / Chrome not found")
        self.profile = tempfile.mkdtemp(prefix="cba-edge-")
        with socket.socket() as sock:          # a fresh free port, so we never attach to an old browser
            sock.bind(("127.0.0.1", 0))
            self.port = sock.getsockname()[1]
        self.proc = subprocess.Popen([exe, "--headless=new", f"--remote-debugging-port={self.port}",
                                      f"--user-data-dir={self.profile}", f"--window-size={W},{H}",
                                      "--hide-scrollbars", "--mute-audio", "--no-first-run", "about:blank"],
                                     stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        for _ in range(100):
            try:
                pages = json.load(urllib.request.urlopen(f"http://127.0.0.1:{self.port}/json"))
                ws_url = next(p["webSocketDebuggerUrl"] for p in pages if p["type"] == "page")
                break
            except Exception:
                time.sleep(0.1)
        else:
            raise SystemExit("could not connect to the headless browser")
        self.ws = websocket.create_connection(ws_url, max_size=None, suppress_origin=True)
        self.n = 0
        self.call("Emulation.setDeviceMetricsOverride", width=W, height=H, deviceScaleFactor=1, mobile=False)

    def call(self, method, **params):
        self.n += 1
        self.ws.send(json.dumps({"id": self.n, "method": method, "params": params}))
        while True:
            msg = json.loads(self.ws.recv())
            if msg.get("id") == self.n:
                return msg.get("result", {})

    def js(self, code):
        return self.call("Runtime.evaluate", expression=code, returnByValue=True).get("result", {}).get("value")

    def shot(self, path):
        data = self.call("Page.captureScreenshot", format="jpeg", quality=85)["data"]
        path.write_bytes(base64.b64decode(data))

    def close(self):
        try:
            self.ws.close()
        finally:
            # Edge starts several child processes: kill the whole tree, not just the launcher
            subprocess.run(["taskkill", "/PID", str(self.proc.pid), "/T", "/F"], capture_output=True)
            name = Path(self.profile).name           # backup: anything still using our temporary profile
            subprocess.run(["powershell", "-NoProfile", "-Command",
                            "Get-CimInstance Win32_Process -Filter \"Name='msedge.exe' or Name='chrome.exe'\" | "
                            f"Where-Object {{ $_.CommandLine -match '{name}' }} | "
                            "ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }"],
                           capture_output=True)
            time.sleep(1)
            shutil.rmtree(self.profile, ignore_errors=True)


def read_live():
    try:
        return json.loads(LIVE.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return {}


def state(live):
    return live.get("state") or {}


def html(md):
    md = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", md)
    return re.sub(r"`(.+?)`", r"<code style='color:#22d3ee'>\1</code>", md)


class Recorder:
    def __init__(self, browser, frames_dir):
        self.b, self.dir = browser, frames_dir
        self.frame, self.scene, self.last_log, self.hold_until, self.events = 0, "", None, 0, True
        self.started = time.time()

    def caption_from_log(self):
        live = read_live()
        log = live.get("log", [])
        if not log or not self.events:
            return live
        e = log[-1]
        key = (e.get("round"), e.get("t"), e.get("text"))
        if key != self.last_log and time.time() >= self.hold_until:
            self.last_log = key
            if e["who"] == "referee":
                self.hold_until = time.time() + 3.5
            who, color = WHO.get(e["who"], (e["who"], "#94a3b8"))
            when = f"round {e['round']} · t = {e['t']}" if e.get("t") is not None else f"round {e['round']}"
            self.b.js(f"window.__cap(null, {json.dumps(who + '  ·  ' + when)}, {json.dumps(color)}, "
                      f"{json.dumps(html(e['text']))})")
        return live

    def set_scene(self, text, events=True):
        self.scene, self.events = text, events
        self.b.js(f"window.__cap({json.dumps(text)}, '', '', '')")

    def run(self, seconds, until=None):
        """Keep filming for `seconds` (or until `until(live)` is true)."""
        end = time.time() + seconds
        while time.time() < end:
            t0 = time.time()
            if self.b.js("typeof window.__cap") != "function":
                self.b.js(OVERLAY_JS)
                self.b.js(f"window.__cap({json.dumps(self.scene)}, '', '', '')")
            live = self.caption_from_log()
            self.b.shot(self.dir / f"f{self.frame:05d}.jpg")
            self.frame += 1
            if until and until(live):
                return True
            time.sleep(max(0.0, 1 / FPS - (time.time() - t0)))
        return False

    def click(self, sel):
        ok = self.b.js(f"window.__click({json.dumps(sel)})")
        print(f"  click {sel}: {'ok' if ok else 'NOT FOUND'}", flush=True)
        return ok

    def switch(self, domain):
        """Click the domain tab on camera AND send it on the bus, so the arena surely follows the script."""
        self.click(f'#domainSwitch button[data-domain="{domain}"]')
        bus.publish(names.CONTROL, {"cmd": "domain", "domain": domain})

    def scroll(self, sel=None, film=1.6):
        self.b.js(f"window.__scroll({json.dumps(sel)})")
        self.run(film)


def wait(pred, timeout=90):
    end = time.time() + timeout
    while time.time() < end:
        if pred(read_live()):
            return True
        time.sleep(0.2)
    return False


def main():
    if not read_live().get("state"):
        raise SystemExit("Start the arena first:  python run_all.py --domain emergency")
    frames = Path(tempfile.mkdtemp(prefix="cba-frames-"))
    b = Browser()
    try:
        for attempt in range(5):               # wait until the map, charts and live data are on screen
            b.call("Page.navigate", url=URL)
            for _ in range(60):
                if b.js("!!(window.Chart && document.querySelector('.leaflet-marker-icon') && "
                        "document.querySelectorAll('#feed li').length && document.querySelector('#tiles .tile'))"):
                    break
                time.sleep(0.5)
            else:
                print(f"  dashboard not ready (attempt {attempt + 1}), reloading...", flush=True)
                continue
            break
        b.js(OVERLAY_JS)
        b.js("document.querySelectorAll('.reveal').forEach(e => e.classList.add('shown'))")
        time.sleep(2)
        rec = Recorder(b, frames)

        if read_live().get("status", {}).get("blue_enabled") is False:
            rec.click("#blueToggle")
        rec.switch("emergency")

        # Title card (filmed), then wait off-camera until an emergency round is early enough to queue a disaster
        b.js("window.__card('🛡️ RYVO', 'Red AI agents attack a digital twin of a critical system to find "
             "its weak spots.<br>Blue AI agents detect, diagnose and fix failures on their own, and both sides learn "
             "every round.<br><br><b style=color:#fff>Disasters shouldn&#39;t be the first time your system "
             "gets tested.</b>')")
        rec.run(5.5)
        print("syncing to an emergency round...", flush=True)
        wait(lambda lv: state(lv).get("domain") == "emergency" and 7 <= state(lv).get("t", 0) <= 14, timeout=150)
        this_round = state(read_live())["round"]
        b.js("window.__card('')")
        rec.set_scene("🎯 Queue a disaster from the attack launcher: 'Monsoon night' = GPS dead zone + SMS outage",
                      events=False)
        rec.scroll(".launcher", film=2)
        rec.click('.launch[data-key="sc:Monsoon night"]')
        rec.run(2.5)
        rec.scroll(None, film=1.2)
        rec.set_scene("🏙️ A live digital twin of Bengaluru's 108 ambulance system: 20 ambulances, 10 hospitals")
        rec.run(25, until=lambda lv: state(lv).get("round") == this_round + 1 and state(lv).get("t", 99) <= 1)

        # 1. Emergency combo disaster
        rec.set_scene("🚑 Scene 1 · 'Monsoon night' hits: watch Blue detect, diagnose and fix it on its own")
        rec.run(4)
        rec.switch("food")        # next round: food delivery
        rec.run(25, until=lambda lv: state(lv).get("domain") == "food")

        # 2. Food delivery, Red's own choice
        rec.set_scene("🛵 Scene 2 · Same agents, new system: food delivery. Red's bandit AI picks the attack")
        rec.run(25, until=lambda lv: state(lv).get("domain") == "food" and state(lv).get("t", 0) >= 14)
        rec.switch("upi")
        rec.run(1.5)
        rec.set_scene("🎯 Next up: UPI payments on 'Diwali sale night' (10x traffic + fraud-bot burst)", events=False)
        rec.scroll(".launcher", film=2)
        rec.click('.launch[data-key="sc:Diwali sale night"]')
        rec.run(2.5)
        rec.scroll(None, film=1.2)
        rec.set_scene("🛵 Scene 2 · Food delivery, still running")
        rec.run(30, until=lambda lv: state(lv).get("domain") == "upi")

        # 3. UPI Diwali night
        rec.set_scene("💳 Scene 3 · UPI on Diwali sale night: money moves across 5 partner banks")
        rec.run(25, until=lambda lv: state(lv).get("domain") == "upi" and state(lv).get("t", 0) >= 42)
        rec.switch("emergency")
        rec.run(1.5)
        rec.scroll(".launcher", film=1.5)
        rec.click('.launch[data-key="at:call_surge"]')
        rec.run(1.5)
        rec.scroll(None, film=1)
        rec.run(15, until=lambda lv: state(lv).get("domain") == "emergency")
        rec.click("#blueToggle")                                       # Blue OFF for this round

        # 4. Blue switched off
        rec.set_scene("⚠️ Scene 4 · Blue defenders switched OFF: a mass-casualty call surge with nobody fixing it")
        start_round = state(read_live()).get("round")
        rec.run(25, until=lambda lv: state(lv).get("round") != start_round)
        rec.click("#blueToggle")                                       # back ON
        rec.run(4)

        # 5. Learning
        rec.set_scene("📈 Scene 5 · Is everyone learning? Blue gets faster as its playbook grows", events=False)
        rec.scroll(".learning", film=3)
        for d in ("emergency", "food", "upi"):
            rec.click(f'#learnTabs button[data-domain="{d}"]')
            rec.run(4)
        rec.set_scene("📘 Blue's playbook (symptom → fix that worked) + an auto-written postmortem every round",
                      events=False)
        rec.scroll(".two-col", film=5)
        rec.set_scene("⚙️ 8 systems, one Redis event bus: no agent calls another directly", events=False)
        rec.scroll(".how", film=4)
        b.js("window.__cap('', '', '', '')")
        b.js("window.__card('🛡️ RYVO', '3 systems · 13 attack types · 14 whitelisted fixes · learns every "
             "round<br><br>Scored in human impact: ambulance minutes, late orders, failed payments<br><br>"
             "<b style=color:#fff>Disasters shouldn&#39;t be the first time your system gets tested.</b>')")
        rec.run(5)

        elapsed = time.time() - rec.started
        fps = max(1.0, rec.frame / elapsed)
        print(f"captured {rec.frame} frames in {elapsed:.0f}s ({fps:.1f} fps). Encoding...", flush=True)
    finally:
        b.close()

    OUT.parent.mkdir(exist_ok=True)
    subprocess.run([imageio_ffmpeg.get_ffmpeg_exe(), "-y", "-loglevel", "error", "-framerate", f"{fps:.3f}",
                    "-i", str(frames / "f%05d.jpg"), "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "21",
                    "-r", "25", "-movflags", "+faststart", str(OUT)], check=True)
    shutil.rmtree(frames, ignore_errors=True)
    print(f"saved {OUT}", flush=True)


if __name__ == "__main__":
    main()
