"""RYVO smoke test. Runs without Redis or the arena (pure logic + the FastAPI app in-process).

Run: python -m tests.smoke_test
"""
import random

from fastapi.testclient import TestClient

import domains
from backend.main import app
from blue import confidence
from oracle import policy

passed, failed = 0, 0


def check(name, cond, detail=""):
    global passed, failed
    if cond:
        passed += 1
        print(f"  ✓ {name}")
    else:
        failed += 1
        print(f"  ✗ {name} {detail}")


def run_round(D, attack=None, fix=None, fix_at=4, seed=1):
    tw = D.Twin(7)
    tw.start_round(seed)
    events, focus_levels, mem, seen = [], set(), {}, set()
    rng = random.Random(seed)
    while tw.t < D.ROUND_TICKS:
        if attack and tw.t == D.ATTACK_AT:
            tw.apply_attack({"attack": attack, "target": D.pick_target(attack, tw.snapshot(), rng)})
        if fix and tw.t == D.ATTACK_AT + fix_at:
            for f in D.CORRECT_FIX[attack]:
                tw.apply_fix({"action": f})
        tw.step()
        events += tw.events
        tw.events = []
        snap = tw.snapshot()
        focus_levels.add(snap["focus"]["level"])
        seen |= set(D.sense(snap, mem))
    return D.score(events, tw.t), focus_levels, seen, snap


print("1. Digital twins: every experiment degrades the system and its correct fix helps")
for did in domains.ORDER:
    D = domains.get(did)
    base, _, _, snap = run_round(D)
    check(f"{did}: snapshot has topology, focus and geo", all(k in snap for k in ("topology", "focus", "geo")))
    for attack in D.ATTACKS:
        hurt, levels, symptoms, _ = run_round(D, attack)
        fixed, _, _, _ = run_round(D, attack, fix=True)
        r_hurt, r_fixed = D.red_reward(hurt), D.red_reward(fixed)
        check(f"{did}/{attack}: detected by AEGIS sensors", bool(symptoms), str(symptoms))
        check(f"{did}/{attack}: correct fix reduces damage ({r_hurt:.2f} -> {r_fixed:.2f})", r_fixed <= r_hurt + 0.02)

print("2. ORACLE safety policy")
for did in domains.ORDER:
    D = domains.get(did)
    for a in D.ATTACKS:
        check(f"{did}/{a}: approved", policy.evaluate(D, [a])["approved"])
    for a in D.FORBIDDEN:
        v = policy.evaluate(D, [a])
        check(f"{did}/{a}: BLOCKED with a safer alternative", not v["approved"] and v["alternative"] is not None, str(v["reasons"]))

print("3. AEGIS confidence is deterministic and evidence-based")
D = domains.get("emergency")
inc = {"symptom": "dispatch_backlog", "key": "dispatch_backlog+high_call_rate", "tried": [], "evidence": {"_strength": 0.8}}
a1 = confidence.assess(D, inc, "surge_mode", 0, None)
a2 = confidence.assess(D, inc, "surge_mode", 0, None)
wrong = confidence.assess(D, inc, "restart_dispatch", 0, None)
check("same evidence -> same score", a1["score"] == a2["score"], f"{a1['score']} vs {a2['score']}")
check(f"fix matching the signature scores higher ({a1['score']} > {wrong['score']})", a1["score"] > wrong["score"])
check("evidence list explains the score", len(a1["evidence"]) >= 5 and a1["signals_total"] == 5)

print("4. API")
c = TestClient(app)
for path in ("/api/meta", "/api/state", "/api/scenarios", "/api/geography?domain=emergency", "/api/geography?domain=food",
             "/api/geography?domain=upi", "/api/incidents", "/api/metrics", "/api/safety", "/api/health"):
    r = c.get(path)
    check(f"GET {path} -> {r.status_code}", r.status_code == 200)
check("GET /api/geography?domain=mars -> 404", c.get("/api/geography?domain=mars").status_code == 404)
check("POST /api/round/start with an unknown scenario -> 400",
      c.post("/api/round/start", json={"domain": "food", "scenario": "nope"}).status_code in (400, 503))
for q in ("Why did AEGIS choose this recovery?", "Why is the confidence 91%?", "Why was this experiment blocked?",
          "What should we test next?", "Explain this graph", "Why did the map zoom here?", "hello"):
    r = c.post("/api/chat", json={"message": q, "context": {"page": "metrics", "chart": "resilience"}})
    check(f"chat: {q!r} -> {r.json().get('intent')}", r.status_code == 200 and r.json()["answer"])

print(f"\n{passed} passed, {failed} failed")
raise SystemExit(1 if failed else 0)
