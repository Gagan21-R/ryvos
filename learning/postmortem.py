"""G · ORACLE postmortem: writes a structured incident report after every round (rule-based, no LLM needed).

Reports go to round.report and are appended to data/postmortems.md.

Run: python -m learning.postmortem
"""
import domains
from shared import bus, config, names

REPORTS = config.DATA_DIR / "postmortems.md"


def fmt(D, sec):
    if sec is None:
        return "—"
    return f"{sec / 60:.0f} min" if D.TICK_UNIT == "min" else f"{sec:.0f} s"


def build(r, tl, res):
    D = domains.get(res["domain"])
    exps = [D.EXPERIMENTS.get(a, {"label": a, "services": []}) for a in res["attacks"]]
    svc = {s["id"]: s["name"] for s in D.SERVICES}
    targets = sorted({svc.get(s, s) for e in exps for s in e["services"]})
    fix_msgs = [d for d in tl["diagnoses"] if d["status"] == "fix"]
    conf = max((d.get("confidence") or {} for d in fix_msgs), key=lambda c: c.get("score", 0), default={})
    head = D.METRICS[0]
    geo = getattr(D, "GEOGRAPHY", {})
    rogue = tl.get("reflection") or {}
    lessons = [f"{d['key']} -> {' + '.join(d['fixes'])}" for d in tl["diagnoses"] if d["status"] == "learned"]
    blocked = [v for v in tl["verdicts"] if not v["approved"]]
    report = {
        "id": f"INC-{D.ID[:3].upper()}-{r:04d}", "round": r, "domain": D.ID, "domain_round": res["domain_round"],
        "title": f"Round {r} · {D.ICON} {D.TITLE} #{res['domain_round']}",
        "scenario": " + ".join(e["label"] for e in exps) or "No experiment",
        "mode": res.get("red_mode"), "targets": targets,
        "geography": " › ".join(x for x in (geo.get("country"), geo.get("state"), geo.get("city")) if x),
        "impact": {m["label"]: f"{res[m['key']]}{'' if m['unit'] == '₹' else m['unit']}" for m in D.METRICS},
        "headline": f"{head['label']}: {res[head['key']]}{head['unit']}",
        "detection": (f"{tl['alerts'][0]['key']} after {fmt(D, res['mttd_sec'])}" if tl["alerts"] else "Not detected"),
        "diagnosis": conf.get("root_cause", "—"),
        "aegis_confidence": conf.get("score"),
        "oracle_accuracy": res["oracle"]["accuracy"],
        "oracle_check": res["oracle"]["text"],
        "recovery": " + ".join(dict.fromkeys(res["fixes"])) or "None applied",
        "verification": res["verdict"],
        "mttd": fmt(D, res["mttd_sec"]), "mttr": fmt(D, res["mttr_sec"]),
        "resilience": res["resilience"], "resilience_prev": res.get("resilience_prev"),
        "safety": f"{res['safety']['approved']} approved, {res['safety']['blocked']} blocked",
        "learning": {
            "rogue": rogue.get("speech") or "—",
            "aegis": ("Saved: " + "; ".join(lessons)) if lessons
            else ("Re-used the playbook" if res["playbook_hits"] else "Nothing new to save"),
            "oracle": res["speech"],
        },
        "next": res["next"],
        "blocked": [{"attacks": v["attacks"], "reasons": v["reasons"]} for v in blocked],
    }
    lines = [
        f"**Experiment** ({report['mode']}): {report['scenario']} on {', '.join(targets) or '—'}.",
        f"**Detected** {report['detection']}.",
        f"**Diagnosis**: {report['diagnosis']} (AEGIS confidence {report['aegis_confidence'] or '—'}%, "
        f"ORACLE-validated accuracy {report['oracle_accuracy'] if report['oracle_accuracy'] is not None else '—'}%).",
        f"**Recovery**: {report['recovery']} · MTTR {report['mttr']} · {report['verification']}.",
        f"**Impact**: " + "; ".join(f"{k} {v}" for k, v in report["impact"].items()) + ".",
        f"**Resilience** {report['resilience_prev'] if report['resilience_prev'] is not None else '—'} → {report['resilience']}.",
        f"**Next**: {report['next']['label']} ({report['next']['why'].lower()}).",
    ]
    report["text"] = "\n".join(f"- {x}" for x in lines)
    report["lessons"] = lessons
    return report


def publish(r, tl):
    report = build(r, tl, tl["result"])
    bus.publish(names.ROUND_REPORT, report)
    with open(REPORTS, "a", encoding="utf-8") as f:
        f.write(f"### {report['id']} · {report['title']}\n{report['text']}\n\n")


def main():
    timelines = {}
    print("[oracle-postmortem] ready", flush=True)
    for channel, msg in bus.subscribe(names.BLUE_ALERT, names.BLUE_DIAGNOSIS, names.ORACLE_VERDICT, names.AGENT_SAY,
                                      names.ROUND_RESULT):
        r = msg.get("round")
        tl = timelines.setdefault(r, {"alerts": [], "diagnoses": [], "verdicts": [], "reflection": None,
                                      "result": None})
        if channel == names.BLUE_ALERT and msg["status"] == "new":
            tl["alerts"].append(msg)
        elif channel == names.BLUE_DIAGNOSIS:
            tl["diagnoses"].append(msg)
        elif channel == names.ORACLE_VERDICT:
            tl["verdicts"].append(msg)
        elif channel == names.AGENT_SAY and msg.get("agent") == "rogue" and "reward" in msg:
            tl["reflection"] = msg
            if tl["result"]:                    # ROGUE reflects right after the result: now the report is complete
                publish(r, timelines.pop(r))
        elif channel == names.ROUND_RESULT:
            if "verdict" not in msg:            # result from an older referee version: nothing to report
                timelines.pop(r, None)
                continue
            tl["result"] = msg
            if not msg["attacks"]:              # nothing to reflect on
                publish(r, timelines.pop(r))
            # a report still waiting from an earlier round (ROGUE never reflected) is published as it is
            for old in [k for k, v in timelines.items() if k is not None and k < r and v["result"]]:
                publish(old, timelines.pop(old))
            for old in [k for k in timelines if k is not None and k < r - 3]:
                timelines.pop(old)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        pass
