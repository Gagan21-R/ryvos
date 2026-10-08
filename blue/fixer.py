"""F · AEGIS Fixer: applies the Diagnoser's fixes - but ONLY fixes on the domain's safe whitelist.

Safety by design: anything not in names.DOMAINS[domain]["fixes"] is refused (and the twin checks again).

Run: python -m blue.fixer
"""
from shared import bus, names


def main():
    enabled = True
    applied = set()
    print("[fixer] ready (whitelist enforced)", flush=True)
    for channel, msg in bus.subscribe(names.BLUE_DIAGNOSIS, names.CONTROL):
        if channel == names.CONTROL:
            if msg.get("cmd") == "blue":
                enabled = bool(msg.get("enabled"))
                print(f"[fixer] blue team {'ON' if enabled else 'OFF'}", flush=True)
            continue
        if msg.get("status") != "fix" or not enabled:
            continue
        whitelist = names.DOMAINS[msg["domain"]]["fixes"]
        for action in msg["fixes"]:
            if action not in whitelist:
                print(f"[fixer] REFUSED {action!r}: not on the {msg['domain']} whitelist", flush=True)
                continue
            if (msg["round"], action) in applied:
                continue
            applied.add((msg["round"], action))
            bus.publish(names.BLUE_FIX, {"round": msg["round"], "domain": msg["domain"], "t": msg["t"],
                                         "action": action, "target": msg.get("target", []),
                                         "reason": msg.get("cause", ""), "source": msg.get("source"),
                                         "speech": f"Recovery in progress: {action.replace('_', ' ')}."})
            print(f"[fixer] r{msg['round']} applied {action}", flush=True)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        pass
