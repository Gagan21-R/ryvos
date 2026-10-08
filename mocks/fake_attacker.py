"""Mock Red team: fires one fixed attack every round, so you can test the twin + Blue without the real Red.

Run: python -m mocks.fake_attacker [attack]      (default: the domain's first attack)
"""
import random
import sys

import domains
from shared import bus, names

chosen = sys.argv[1] if len(sys.argv) > 1 else None
done = set()
print("[fake_attacker] waiting for city.state...", flush=True)
for _, state in bus.subscribe(names.CITY_STATE):
    D = domains.get(state["domain"])
    if state["t"] != D.ATTACK_AT or state["round"] in done:
        continue
    attack = chosen if chosen in D.ATTACKS else D.ATTACKS[0]
    target = D.pick_target(attack, state, random.Random())
    bus.publish(names.RED_ATTACK, {"round": state["round"], "domain": D.ID, "t": state["t"], "attack": attack,
                                   "target": target, "mode": "mock", "scenario": None,
                                   "info": D.ATTACK_INFO[attack], "q_values": {}})
    done.add(state["round"])
    print(f"[fake_attacker] round {state['round']}: {attack} -> {target}", flush=True)
