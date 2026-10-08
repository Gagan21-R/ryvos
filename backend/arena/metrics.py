"""Aggregates ORACLE's round results into the numbers the Metrics page and the chat assistant use.

All times are SIMULATED (1 tick = 1 simulated minute for 108/food, 1 simulated second for UPI).
"""
from statistics import mean

import domains


def _avg(xs):
    xs = [x for x in xs if x is not None]
    return round(mean(xs), 1) if xs else None


def domain_metrics(results, domain):
    D = domains.get(domain)
    rs = [r for r in results if r["domain"] == domain and "resilience" in r]
    on = [r for r in rs if r.get("blue_enabled", True)]
    unit = "min" if D.TICK_UNIT == "min" else "s"
    div = 60 if unit == "min" else 1
    conv = lambda v: None if v is None else round(v / div, 1)
    k = max(1, len(on) // 3) if on else 1
    first, last = on[:k], on[-k:]
    latest = rs[-1] if rs else None
    tested = sorted({a for r in rs for a in r.get("attacks", [])} & set(D.ATTACKS))
    scratch = [r["recovery_ticks"] for r in on if r.get("detected") and not r.get("playbook_hits")]
    learned = [r["recovery_ticks"] for r in on if r.get("detected") and r.get("playbook_hits")]
    return {
        "domain": domain, "title": D.TITLE, "icon": D.ICON, "unit": unit, "simulated": True,
        "rounds": len(rs),
        "resilience": latest["resilience"] if latest else None,
        "resilience_prev": latest.get("resilience_prev") if latest else None,
        "components": latest["components"] if latest else None,
        "mttd": conv(_avg([r.get("mttd_sec") for r in last])),
        "mttr": conv(_avg([r.get("mttr_sec") for r in last])),
        "mttd_first": conv(_avg([r.get("mttd_sec") for r in first])),
        "mttr_first": conv(_avg([r.get("mttr_sec") for r in first])),
        "recovery_success": round(100 * sum(1 for r in on if r.get("resolved")) / max(1, sum(1 for r in on if r.get("detected")))),
        "experiments": sum(len(r.get("attacks", [])) for r in rs),
        "modes_tested": len(tested), "modes_total": len(D.ATTACKS), "tested": tested,
        "untested": [a for a in D.ATTACKS if a not in tested],
        "oracle_accuracy": _avg([r["oracle"]["accuracy"] for r in last if r.get("oracle", {}).get("accuracy") is not None]),
        "aegis_confidence": _avg([r.get("aegis_confidence") for r in last]),
        "recovery_scratch": _avg(scratch), "recovery_playbook": _avg(learned),
        "series": [{"round": r["round"], "domain_round": r["domain_round"], "resilience": r["resilience"],
                    "round_score": r["round_score"], "mttd": conv(r.get("mttd_sec")), "mttr": conv(r.get("mttr_sec")),
                    "headline": r[D.METRICS[0]["key"]], "blue": r.get("blue_enabled", True),
                    "playbook": bool(r.get("playbook_hits")), "attacks": r.get("attacks", []),
                    "reward": r.get("red_reward"), "accuracy": (r.get("oracle") or {}).get("accuracy")}
                   for r in rs[-60:]],
        "headline_metric": D.METRICS[0],
    }
