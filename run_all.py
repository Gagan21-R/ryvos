"""RYVO: starts the whole arena (agents + bus + API + web app) with one command.

    python run_all.py                         # live demo: all agents + dashboard (http://localhost:8501)
    python run_all.py --domain all            # rotate 🚑 108 -> 🛵 food -> 💳 UPI every round
    python run_all.py --domain upi --fast --rounds 25 --no-dashboard   # train quickly, produce learning graphs
    python run_all.py --reset                 # forget everything learned (playbook, Red's brain, results)

If Redis isn't running on localhost:6379, it starts the built-in mini Redis (tools/redis_server.py).
"""
import argparse
import os
import subprocess
import sys
import time

ROOT = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(ROOT, "data")

AGENTS = ["oracle.safety",                                    # ORACLE: safety controller
          "blue.monitor", "blue.diagnoser", "blue.fixer",        # AEGIS
          "red.executor",                                         # ROGUE
          "learning.referee", "learning.postmortem",             # ORACLE: referee + incident reports
          "dashboard.recorder"]


def redis_up():
    import redis
    try:
        return redis.Redis(host="127.0.0.1", socket_connect_timeout=0.5).ping()
    except Exception:
        return False


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--domain", default="emergency", choices=["emergency", "food", "upi", "all"])
    ap.add_argument("--rounds", type=int, default=0, help="stop after N rounds (0 = run forever)")
    ap.add_argument("--fast", action="store_true", help="0.05 s per tick instead of 0.45 s")
    ap.add_argument("--tick", type=float, default=None, help="real seconds per tick")
    ap.add_argument("--no-dashboard", action="store_true")
    ap.add_argument("--port", type=int, default=8501)
    ap.add_argument("--streamlit", action="store_true", help="use the old Streamlit dashboard instead")
    ap.add_argument("--legacy", action="store_true", help="use the previous vanilla-JS dashboard instead")
    ap.add_argument("--reset", action="store_true", help="delete learned playbook, Red brain and results")
    args = ap.parse_args()

    os.makedirs(DATA, exist_ok=True)
    if args.reset:
        for f in ("playbook.json", "red_brain.json", "results.jsonl", "postmortems.md", "live.json", "learn.json"):
            p = os.path.join(DATA, f)
            if os.path.exists(p):
                os.remove(p)
        print("[run_all] learning reset")

    env = dict(os.environ, PYTHONUNBUFFERED="1", PYTHONIOENCODING="utf-8", CBA_DOMAIN=args.domain,
               CBA_MAX_ROUNDS=str(args.rounds),
               CBA_TICK_SEC=str(args.tick if args.tick else (0.05 if args.fast else 0.45)))   # 0.45 s: story-friendly pace
    procs = []

    def start(module_args):
        procs.append(subprocess.Popen([sys.executable, *module_args], cwd=ROOT, env=env))
        return procs[-1]

    try:
        if not redis_up():
            print("[run_all] no Redis on :6379 -> starting built-in mini Redis")
            start(["-m", "tools.redis_server"])
            for _ in range(50):
                if redis_up():
                    break
                time.sleep(0.1)
            else:
                sys.exit("could not start Redis")
        for agent in AGENTS:
            start(["-m", agent])
        time.sleep(1.5)                       # let everyone subscribe before the city starts
        twin = start(["-m", "twin.simulator"])
        if not args.no_dashboard:
            env["CBA_WEB_PORT"] = str(args.port)
            if args.streamlit:   # the old Streamlit dashboard, kept as a fallback
                start(["-m", "streamlit", "run", "dashboard/app.py", "--server.port", str(args.port),
                       "--server.headless", "true", "--browser.gatherUsageStats", "false"])
            elif args.legacy:    # the previous vanilla-JS dashboard
                start(["-m", "web.server"])
            else:                # RYVO: FastAPI backend serving the React frontend
                if not os.path.exists(os.path.join(ROOT, "frontend", "dist", "index.html")):
                    print("[run_all] frontend not built yet: cd frontend && npm install && npm run build")
                start(["-m", "backend.main"])
            print(f"[run_all] dashboard: http://localhost:{args.port}")
        if args.rounds:
            twin.wait()
            time.sleep(2)                     # let the last scores and reports land
            print("[run_all] done. Results in data/results.jsonl, lessons in data/playbook.json")
        else:
            while True:
                time.sleep(1)
    except KeyboardInterrupt:
        pass
    finally:
        for p in procs:
            p.terminate()


if __name__ == "__main__":
    main()
