"""G · ORACLE referee: scores every round in HUMAN terms and validates what the agents claimed.

  - domain impact metrics (avg ambulance arrival, late orders %, failed payments %...)
  - red_reward (0..1): damage ROGUE caused vs a normal day -> ROGUE's bandit learns from this
  - MTTD / MTTR (simulated time) and blue_recovery_sec (MTTD + time incidents stayed open)
  - ORACLE validation: AEGIS's fixes vs the experiment record -> diagnosis accuracy (F1 of precision/recall)
  - resilience score (0-100) from 5 components: detection, diagnosis, recovery, safety, adaptability
  - next recommended experiment (the biggest coverage gap)

Results go to round.result and data/results.jsonl (used for every graph).

Run: python -m learning.referee
"""
import json

import domains
from shared import bus, config, names

RESULTS = config.DATA_DIR / "results.jsonl"
WEIGHTS = {"detection": 0.20, "diagnosis": 0.20, "recovery": 0.25, "safety": 0.15, "adaptability": 0.20}


def load_history():
    hist = {d: [] for d in domains.ORDER}
    try:
        for line in RESULTS.read_text(encoding="utf-8").splitlines():
            if line.strip():
                r = json.loads(line)
                hist.setdefault(r["domain"], []).append(r)
    except FileNotFoundError:
        pass
    return hist


def validate(D, attacks, fixes):
    """ORACLE compares AEGIS's fixes with what ROGUE actually did (the experiment record)."""
    if not attacks:
        return {"accuracy": None, "precision": None, "recall": None, "validated": None, "text": "No experiment ran"}
    correct = {f for a in attacks for f in D.CORRECT_FIX.get(a, [])}
    applied = list(dict.fromkeys(fixes))
    hit = [f for f in applied if f in correct]
    covered = [a for a in attacks if any(f in applied for f in D.CORRECT_FIX.get(a, []))]
    precision = len(hit) / len(applied) if applied else 0.0
    recall = len(covered) / len(attacks)
    f1 = 2 * precision * recall / (precision + recall) if precision + recall else 0.0
    wrong = [f for f in applied if f not in correct]
    text = (f"{len(covered)}/{len(attacks)} injected failure(s) correctly addressed"
            + (f"; {len(wrong)} unnecessary fix(es): {', '.join(wrong)}" if wrong else ""))
    return {"accuracy": round(100 * f1), "precision": round(100 * precision), "recall": round(100 * recall),
            "validated": recall == 1.0, "text": text, "unnecessary": wrong}


def main():
    rounds, history = {}, load_history()
    blue_enabled = True
    print("[oracle-referee] ready", flush=True)
    for channel, msg in bus.subscribe(names.CITY_EVENTS, names.RED_ATTACK, names.BLUE_ALERT, names.BLUE_DIAGNOSIS,
                                      names.BLUE_FIX, names.ORACLE_VERDICT, names.CONTROL):
        if channel == names.CONTROL:
            if msg.get("cmd") == "blue":
                blue_enabled = bool(msg.get("enabled"))
            elif msg.get("cmd") == "reset_learning":
                history = {d: [] for d in domains.ORDER}
            continue
        r = msg.get("round")
        if channel == names.CITY_EVENTS and msg["type"] == "round_start":
            rounds[r] = {"domain": msg["domain"], "domain_round": msg["domain_round"], "events": [],
                         "attacks": [], "mode": None, "attack_t": None, "open": {}, "intervals": [],
                         "first_alert_t": None, "fixes": [], "playbook_hits": 0, "blue_enabled": blue_enabled,
                         "confidence": [], "blocked": 0, "approved": 0, "proposal_ids": set()}
            continue
        rd = rounds.get(r)
        if rd is None:
            continue
        if channel == names.CITY_EVENTS:
            if msg["type"] == "round_end":
                del rounds[r]
                if msg.get("aborted"):
                    continue                     # a new round was requested mid-way: don't score half a round
                result = score(r, rd, msg["t"], history)
                history.setdefault(rd["domain"], []).append(result)
                bus.publish(names.ROUND_RESULT, result)
                with open(RESULTS, "a", encoding="utf-8") as f:
                    f.write(json.dumps(result) + "\n")
                print(f"[oracle-referee] r{r} {rd['domain']} resilience {result['resilience']} "
                      f"accuracy {result['oracle']['accuracy']} reward {result['red_reward']}", flush=True)
            elif msg["type"] not in ("round_start", "arena_done"):
                rd["events"].append(msg)
        elif channel == names.RED_ATTACK:
            rd["attacks"].append(msg["attack"])
            rd["mode"] = msg.get("mode")
            rd["attack_t"] = msg["t"] if rd["attack_t"] is None else rd["attack_t"]
            rd["blue_enabled"] = blue_enabled          # was AEGIS defending when the attack hit?
        elif channel == names.ORACLE_VERDICT:
            rd["approved" if msg["approved"] else "blocked"] += 1
        elif channel == names.BLUE_ALERT:
            if msg["status"] == "new":
                rd["open"][msg["symptom"]] = msg["t"]
                if rd["first_alert_t"] is None:
                    rd["first_alert_t"] = msg["t"]
            elif msg["symptom"] in rd["open"]:
                rd["intervals"].append((rd["open"].pop(msg["symptom"]), msg["t"]))
        elif channel == names.BLUE_DIAGNOSIS:
            if msg["status"] == "fix":
                if msg["source"] == "playbook":
                    rd["playbook_hits"] += 1
                if msg.get("confidence"):
                    rd["confidence"].append(msg["confidence"]["score"])
        elif channel == names.BLUE_FIX:
            rd["fixes"].append(msg["action"])


def score(round_no, rd, end_t, history):
    D = domains.get(rd["domain"])
    sec = D.SIM_SEC_PER_TICK
    metrics = D.score(rd["events"], end_t)
    attack_t = rd["attack_t"] if rd["attack_t"] is not None else D.ATTACK_AT
    detected = rd["first_alert_t"] is not None
    resolved = detected and not rd["open"]
    spans = sorted(rd["intervals"] + [(start, end_t) for start in rd["open"].values()])
    busy, cur_start, cur_end = 0, None, None
    for a, b in spans:                         # minutes with at least one open incident (overlaps counted once)
        if cur_end is None or a > cur_end:
            busy += (cur_end - cur_start) if cur_end is not None else 0
            cur_start, cur_end = a, b
        else:
            cur_end = max(cur_end, b)
    busy += (cur_end - cur_start) if cur_end is not None else 0
    detect_ticks = max(0, rd["first_alert_t"] - attack_t) if detected else None
    recovery_ticks = detect_ticks + busy if detected else end_t - attack_t
    oracle = validate(D, rd["attacks"], rd["fixes"])

    # ---- resilience components (0-100), all from this round's events + history
    budget = D.ROUND_TICKS / 3
    past = [h for h in history.get(D.ID, [])]
    tested = {a for h in past for a in h.get("attacks", [])} | set(rd["attacks"])
    coverage = len(tested & set(D.ATTACKS)) / len(D.ATTACKS)
    recent = (past + [{"detected": detected, "playbook_hits": rd["playbook_hits"]}])[-10:]
    det_recent = [h for h in recent if h.get("detected")]
    reuse = sum(1 for h in det_recent if h.get("playbook_hits")) / len(det_recent) if det_recent else 0
    components = {
        "detection": 0 if not detected else round(100 * max(0.1, 1 - detect_ticks / budget)),
        "diagnosis": oracle["accuracy"] or 0,
        "recovery": (round(100 * max(0.3, 1 - busy / (D.ROUND_TICKS / 2))) if resolved
                     else 30 if detected and rd["fixes"] else 0),
        "safety": 100,                                   # every executed experiment passed ORACLE's policy
        "adaptability": round(50 * coverage + 50 * reuse),
    }
    round_score = round(sum(WEIGHTS[k] * v for k, v in components.items()))
    prev = next((h["resilience"] for h in reversed(past) if "resilience" in h), None)
    resilience = round_score if prev is None else round(0.65 * prev + 0.35 * round_score)

    counts = {a: sum(1 for h in past if a in h.get("attacks", [])) for a in D.ATTACKS}
    gap = min(D.ATTACKS, key=lambda a: (counts[a] + (1 if a in rd["attacks"] else 0), a))
    nxt = {"attack": gap, "label": D.EXPERIMENTS[gap]["label"], "tested": counts[gap],
           "why": f"Least-tested failure mode in {D.TITLE} ({counts[gap]} past runs)"}
    if not rd["attacks"]:
        verdict, speech = "NO EXPERIMENT", "No experiment ran this round."
    elif not detected:
        verdict, speech = "UNDETECTED", "The failure went undetected. That's a monitoring gap."
    elif resolved and oracle["validated"]:
        verdict, speech = "RECOVERED", "Recovery verified. Diagnosis validated against the experiment record."
    elif resolved:
        verdict, speech = "RECOVERED · PARTIAL DIAGNOSIS", "Symptoms cleared, but not every injected failure was addressed."
    else:
        verdict, speech = "NOT RECOVERED", "Recovery not verified: an incident was still open at round end."
    return {
        "round": round_no, "domain": rd["domain"], "domain_round": rd["domain_round"],
        **metrics,
        "red_reward": D.red_reward(metrics),
        "blue_recovery_sec": recovery_ticks * sec,
        "recovery_ticks": recovery_ticks,
        "detect_ticks": detect_ticks,
        "mttd_sec": detect_ticks * sec if detected else None,
        "mttr_sec": busy * sec if detected else None,
        "detected": detected, "resolved": resolved,
        "attacks": rd["attacks"], "red_mode": rd["mode"], "fixes": rd["fixes"],
        "playbook_hits": rd["playbook_hits"], "blue_enabled": rd["blue_enabled"],
        "aegis_confidence": max(rd["confidence"]) if rd["confidence"] else None,
        "oracle": oracle,
        "components": components, "round_score": round_score,
        "resilience": resilience, "resilience_prev": prev,
        "coverage": {"tested": sorted(tested & set(D.ATTACKS)), "total": len(D.ATTACKS)},
        "safety": {"approved": rd["approved"], "blocked": rd["blocked"]},
        "next": nxt, "verdict": verdict, "speech": speech,
    }


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        pass
