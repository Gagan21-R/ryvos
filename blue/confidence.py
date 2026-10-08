"""AEGIS · root-cause confidence: how likely the diagnosis is correct, from the evidence AEGIS can see.

Deterministic and reproducible (no randomness):

  confidence = 0.25 * symptom_match          does the symptom signature point to one cause?
             + 0.25 * telemetry_correlation  how strongly the telemetry deviates from normal
             + 0.20 * dependency_evidence    is the anomaly isolated (no other incident confounding it)?
             + 0.15 * historical_match       did this fix solve this exact signature before (playbook)?
             + 0.15 * scenario_knowledge     is the fix in the rule book for this symptom?

ORACLE later checks the diagnosis against the experiment record (see learning/referee.py) and reports
its own "validated accuracy" - so agent belief and referee validation stay separate.
"""
WEIGHTS = {"symptom_match": 0.25, "telemetry_correlation": 0.25, "dependency_evidence": 0.20,
           "historical_match": 0.15, "scenario_knowledge": 0.15}


def assess(D, inc, fix, other_open, book_entry):
    candidates = D.RULES.get(inc["symptom"], [])
    root = D.ROOT_CAUSE.get(fix, fix)
    hint = getattr(D, "SIGNATURE_HINT", {}).get(inc["key"])
    specific = (hint == fix) or (hint is None and ("+" in inc["key"] or len(candidates) == 1))
    if hint and hint != fix and fix not in inc["tried"]:
        symptom = 0.4          # the signature points somewhere else: honest low confidence
    elif specific:
        symptom = 1.0
    elif inc["tried"] and fix not in inc["tried"]:
        symptom = 0.8          # the earlier hypothesis was ruled out
    else:
        symptom = 0.6 if candidates and fix == candidates[0] else 0.5
    telemetry = round(min(1.0, max(0.2, inc["evidence"].get("_strength", 0.6))), 2)
    dependency = 1.0 if not other_open else 0.7
    if book_entry and fix in book_entry.get("fixes", []) and book_entry.get("successes"):
        historical = min(1.0, 0.55 + 0.15 * book_entry["successes"])
    elif book_entry and book_entry.get("failed_fixes", {}).get(fix):
        historical = 0.2
    else:
        historical = 0.5
    knowledge = 1.0 if fix in candidates else 0.5
    factors = {"symptom_match": symptom, "telemetry_correlation": telemetry, "dependency_evidence": dependency,
               "historical_match": historical, "scenario_knowledge": knowledge}
    score = round(100 * sum(WEIGHTS[k] * v for k, v in factors.items()))

    evidence = [
        {"ok": symptom >= 0.8, "factor": "symptom_match",
         "text": (f"Signature '{inc['key']}' points to one cause: {root.lower()}" if specific else
                  f"Signature '{inc['key']}' points to {D.ROOT_CAUSE.get(hint, hint).lower()}, not {root.lower()}"
                  if symptom == 0.4 else
                  f"Earlier hypothesis ruled out, leaving {root.lower()}" if symptom == 0.8 else
                  f"'{inc['symptom']}' fits several causes; {root.lower()} is the most common")},
        {"ok": telemetry >= 0.6, "factor": "telemetry_correlation",
         "text": f"Telemetry deviation is {'strong' if telemetry >= 0.6 else 'weak'} ({telemetry:.0%} of the alarm scale)"},
        {"ok": dependency == 1.0, "factor": "dependency_evidence",
         "text": "No other incident is open: the anomaly is isolated" if dependency == 1.0
         else f"{other_open} other incident(s) open, so signals may be confounded"},
        {"ok": historical >= 0.6, "factor": "historical_match",
         "text": (f"Playbook: this fix resolved '{inc['key']}' {book_entry['successes']}x before" if historical >= 0.6 else
                  "This fix failed for this signature before" if historical == 0.2 else
                  "No prior incident with this exact signature")},
        {"ok": knowledge == 1.0, "factor": "scenario_knowledge",
         "text": f"'{fix}' is in the rule book for '{inc['symptom']}'" if knowledge == 1.0
         else f"'{fix}' is not the usual rule for '{inc['symptom']}'"},
    ]
    alternatives = [{"fix": f, "root_cause": D.ROOT_CAUSE.get(f, f)} for f in candidates
                    if f != fix and f not in inc["tried"]]
    for alt in alternatives:
        evidence.append({"ok": None, "factor": "alternative",
                         "text": f"{alt['root_cause']} remains a lower-probability alternative"})
    level = "High" if score >= 80 else "Medium" if score >= 60 else "Low"
    return {"score": score, "level": level, "factors": factors, "weights": WEIGHTS, "evidence": evidence,
            "signals_aligned": sum(1 for e in evidence if e["ok"]), "signals_total": 5,
            "root_cause": root, "alternatives": alternatives}
