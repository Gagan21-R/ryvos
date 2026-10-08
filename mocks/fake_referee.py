"""Mock Referee: answers every red.attack with a made-up round.result, so you can test Red's bandit alone.

Pretend world: call_surge always hurts most. Watch Red's Q-values converge on it.
Run: python -m mocks.fake_referee      (together with: python -m red.executor and a twin or fake city)
"""
import random

from shared import bus, names

DAMAGE = {"freeze_gps": 0.2, "stale_beds": 0.1, "kill_sms": 0.4, "call_surge": 0.8, "slow_dispatch": 0.5}

print("[fake_referee] scoring attacks with fake rewards", flush=True)
for _, msg in bus.subscribe(names.RED_ATTACK):
    reward = round(min(1, max(0, DAMAGE.get(msg["attack"], 0.3) + random.gauss(0, 0.1))), 2)
    bus.publish(names.ROUND_RESULT, {"round": msg["round"], "domain": msg["domain"], "red_reward": reward})
    print(f"[fake_referee] round {msg['round']}: {msg['attack']} -> reward {reward}", flush=True)
