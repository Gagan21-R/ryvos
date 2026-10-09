"""A + C · Runs the digital twin of whichever system (domain) is in the arena.

Every tick it applies Red attacks / Blue fixes (chaos hooks), advances the twin one step,
then publishes city.state (snapshot) and city.events (what happened).

Run: python -m twin.simulator          (domain from CBA_DOMAIN: emergency | food | upi | all)
"""
import json
import queue
import threading
import time

import domains
from shared import bus, config, names


def main():
    inbox = queue.Queue()

    def listen():
        for channel, msg in bus.subscribe(names.RED_ATTACK, names.BLUE_FIX, names.CONTROL):
            inbox.put((channel, msg))

    threading.Thread(target=listen, daemon=True).start()
    time.sleep(0.5)

    mode = config.DOMAIN            # a domain id, or "all" to rotate through the three
    twins, domain_rounds = {}, {d: 0 for d in domains.ORDER}
    paused, round_no, tick = False, 1, 0
    # Continue numbering after earlier runs so the learning graphs keep growing
    results = config.DATA_DIR / "results.jsonl"
    if results.exists():
        for line in results.read_text(encoding="utf-8").splitlines():
            if line.strip():
                r = json.loads(line)
                round_no = max(round_no, r["round"] + 1)
                domain_rounds[r["domain"]] = max(domain_rounds[r["domain"]], r["domain_round"])
    start_round = round_no
    print(f"[twin] online. domain={mode} tick={config.TICK_SEC}s", flush=True)

    autoplay = True                 # False: wait between rounds for "start_round" (demo mode)
    request = {"start": False}      # a "start_round" command: abort the current round and start a fresh one

    def handle_control(msg):
        nonlocal paused, mode, autoplay
        cmd = msg.get("cmd")
        if cmd == "pause":
            paused = True
        elif cmd == "resume":
            paused = False
        elif cmd == "autoplay":
            autoplay = bool(msg.get("enabled", True))
        elif cmd in ("domain", "start_round"):
            if msg.get("domain") in domains.REGISTRY or msg.get("domain") == "all":
                mode = msg["domain"]       # "domain" takes effect next round, "start_round" right now
            if cmd == "start_round":
                request["start"] = True
                paused = False
            print(f"[twin] {cmd}: domain={mode}", flush=True)

    def drain(tw, round_no, did):
        while not inbox.empty():
            channel, msg = inbox.get()
            if channel == names.CONTROL:
                handle_control(msg)
                continue
            if tw is None or msg.get("round") != round_no or msg.get("domain", did) != did:
                continue                                       # stale message from another round
            allowed = names.DOMAINS[did]
            if channel == names.RED_ATTACK and msg.get("attack") in allowed["attacks"]:
                tw.apply_attack(msg)
                tw.emit("chaos", text=f"attack {msg['attack']} hit {', '.join(map(str, msg.get('target', [])))}")
            elif channel == names.BLUE_FIX:
                if msg.get("action") in allowed["fixes"]:      # safety: whitelist checked again here
                    tw.apply_fix(msg)
                    tw.emit("chaos", text=f"fix {msg['action']} is now active")
                else:
                    tw.emit("chaos", text=f"REFUSED non-whitelisted fix {msg.get('action')!r}")

    while True:
        request["start"] = False
        did = domains.ORDER[(round_no - 1) % 3] if mode == "all" else mode
        D = domains.get(did)
        tw = twins.setdefault(did, D.Twin(config.SEED))
        domain_rounds[did] += 1
        base = {"round": round_no, "domain": did, "domain_round": domain_rounds[did]}
        tw.start_round(round_no)
        bus.publish(names.CITY_EVENTS, {"type": "round_start", "t": 0, "round_ticks": D.ROUND_TICKS, **base})

        aborted = False
        while tw.t < D.ROUND_TICKS:
            started = time.time()
            drain(tw, round_no, did)
            if request["start"]:
                aborted = True
                break
            if paused:
                time.sleep(0.1)
                continue
            tw.step()
            tick += 1
            for ev in tw.events:
                bus.publish(names.CITY_EVENTS, {**ev, **base})
            tw.events.clear()
            bus.publish(names.CITY_STATE, {**base, "tick": tick, "t": tw.t, "round_ticks": D.ROUND_TICKS,
                                           "ts": time.time(), **tw.snapshot()})
            time.sleep(max(0.0, config.TICK_SEC - (time.time() - started)))

        bus.publish(names.CITY_EVENTS, {"type": "round_end", "t": tw.t, "aborted": aborted, **base})
        if aborted:
            print(f"[twin] round {round_no} aborted: a new round was requested", flush=True)
        if config.MAX_ROUNDS and round_no - start_round + 1 >= config.MAX_ROUNDS:
            print(f"[twin] finished {round_no - start_round + 1} rounds", flush=True)
            bus.publish(names.CITY_EVENTS, {"type": "arena_done", "t": tw.t, **base})
            break
        round_no += 1
        if aborted:
            continue
        time.sleep(max(0.3, config.TICK_SEC * 3))   # breathing room so scores land before the next round
        while paused and not request["start"]:      # stopped: stay on this scenario until Play (or a new round is started)
            drain(None, round_no, did)
            time.sleep(0.1)
        if not autoplay:                            # demo mode: wait for "Start autonomous round"
            bus.publish(names.CITY_EVENTS, {"type": "arena_idle", "t": 0, "round": round_no, "domain": did})
            while not request["start"]:
                drain(None, round_no, did)
                if autoplay:
                    break
                time.sleep(0.1)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        pass
