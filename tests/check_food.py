import json
import statistics as st
from domains import food as F

# 1. false alarms + drift detection + damage
for label, attack in (("baseline", None), ("drift", "coverage_drift"), ("drift+fix@3", "fix")):
    alarms, rewards, detect = 0, [], []
    for r in range(1, 9):
        tw = F.Twin(7); tw.start_round(r); ev = []; mem = {}
        first = None
        while tw.t < F.ROUND_TICKS:
            if attack and tw.t == F.ATTACK_AT:
                tw.apply_attack({"attack": "coverage_drift", "target": ["indiranagar"]})
            if attack == "fix" and tw.t == F.ATTACK_AT + 6:
                tw.apply_fix({"action": "restore_zone_config"})
            tw.step(); ev += tw.events; tw.events = []
            if "coverage_mismatch" in F.sense(tw.snapshot(), mem):
                alarms += 1
                first = first if first is not None else tw.t
        rewards.append(F.red_reward(F.score(ev, tw.t)))
        detect.append(first)
    print(f"{label:12s} mismatch-ticks/round={alarms / 8:.1f} reward={st.mean(rewards):.2f} first_detect={detect}")

tw = F.Twin(7); tw.start_round(1)
for i in range(12):
    if tw.t == 5:
        tw.apply_attack({"attack": "coverage_drift", "target": ["indiranagar"]})
    tw.step()
s = tw.snapshot()
print([(n["id"], n["status"]) for n in s["topology"]["nodes"]])
print(json.dumps(s["focus"]))
print([z for z in s["geo"]["zones"] if z["status"] != "ok"][0]["status"], len(s["geo"]["customers"]))
