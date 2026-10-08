"""ORACLE's safety policy: every experiment ROGUE proposes is checked against it before anything runs.

The arena is a sandbox simulation, so "safe" here means: limited blast radius, limited severity,
nothing destructive (everything must roll back automatically at the end of the round), known targets only.
"""
from domains.common import SEVERITY_ORDER

POLICY = {
    "environment": "SANDBOX",
    "max_severity": "high",
    "max_blast_radius": 3,          # services touched by one round's experiments
    "allow_destructive": False,
    "auto_rollback": True,          # every chaos flag is reset at the end of the round
}


def describe(D, attack):
    return D.EXPERIMENTS.get(attack) or D.FORBIDDEN.get(attack)


def evaluate(D, attacks):
    """Returns ORACLE's verdict for a set of experiments in domain module D."""
    infos = [describe(D, a) for a in attacks]
    unknown = [a for a, i in zip(attacks, infos) if i is None]
    infos = [i for i in infos if i]
    services = sorted({s for i in infos for s in i["services"]})
    severity = max((i["severity"] for i in infos), key=SEVERITY_ORDER.index, default="low")
    destructive = any(i.get("destructive") for i in infos)
    known = {s["id"] for s in D.SERVICES}
    checks = [
        {"name": "Environment", "ok": True, "detail": "Sandbox simulation: no live systems are touched"},
        {"name": "Known experiment", "ok": not unknown,
         "detail": "All experiments are in the catalogue" if not unknown else f"Unknown: {', '.join(unknown)}"},
        {"name": "Allowed targets", "ok": all(s in known for s in services),
         "detail": f"Targets: {', '.join(services) or 'none'}"},
        {"name": "Blast radius", "ok": len(services) <= POLICY["max_blast_radius"],
         "detail": f"{len(services)} service(s), limit {POLICY['max_blast_radius']}"},
        {"name": "Severity", "ok": SEVERITY_ORDER.index(severity) <= SEVERITY_ORDER.index(POLICY["max_severity"]),
         "detail": f"{severity}, limit {POLICY['max_severity']}"},
        {"name": "Reversible", "ok": not destructive or POLICY["allow_destructive"],
         "detail": "Auto-rollback at round end" if not destructive else "Destructive: cannot be rolled back"},
    ]
    approved = all(c["ok"] for c in checks)
    failed = [c for c in checks if not c["ok"]]
    alternative = None
    if not approved:
        alt = next((i.get("alternative") for i in infos if i.get("alternative")), None)
        if alt is None:   # the mildest catalogued experiment that touches one of the same services
            same = [a for a, i in D.EXPERIMENTS.items() if set(i["services"]) & set(services)] or list(D.EXPERIMENTS)
            alt = min(same, key=lambda a: (SEVERITY_ORDER.index(D.EXPERIMENTS[a]["severity"]),
                                           len(D.EXPERIMENTS[a]["services"])))
        alternative = {"attack": alt, "label": D.EXPERIMENTS[alt]["label"],
                       "services": D.EXPERIMENTS[alt]["services"], "severity": D.EXPERIMENTS[alt]["severity"]}
    if approved:
        speech = f"Blast radius {len(services)} of {POLICY['max_blast_radius']}, severity {severity}. Experiment approved."
    else:
        why = failed[0]
        speech = f"Experiment blocked. {why['name']}: {why['detail']}."
        if alternative:
            speech += f" Safer alternative: {alternative['label']}."
    return {"approved": approved, "checks": checks, "services": services, "blast_radius": len(services),
            "severity": severity, "destructive": destructive, "alternative": alternative, "speech": speech,
            "reasons": [f"{c['name']}: {c['detail']}" for c in failed]}
