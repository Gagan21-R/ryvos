"""ORACLE ASSIST: a context-aware, deterministic assistant (no external LLM or API key needed).

It detects the intent of a question, then explains the data the arena has actually produced:
the current round, ROGUE's proposal, ORACLE's verdicts, AEGIS's diagnosis and confidence, metrics, map and memory.
"""
import re

import domains
from backend.arena.metrics import domain_metrics
from backend.geography.map_data import resolve_focus
from oracle.policy import POLICY

INTENTS = [   # (intent, keywords) - the best keyword match wins, earlier entries win ties
    ("safety_block", ["block", "blocked", "refuse", "denied", "rejected"]),
    ("confidence", ["confidence", "accura", "certain", "sure", "evidence", "%"]),
    ("graph", ["graph", "chart", "plot", "trend", "line", "bars"]),
    ("mttd", ["mttd", "mttr", "time to detect", "time to recover", "detection time", "recovery time"]),
    ("resilience", ["resilience", "score"]),
    ("rogue_choice", ["rogue", "why this experiment", "why was this experiment", "selected", "select", "choose",
                      "chose", "pick", "target"]),
    ("recovery", ["recover", "recovery", "fix", "aegis", "repair", "restore"]),
    ("ambulance", ["ambulance", "closest", "nearest", "caller", "hospital", "route", "108"]),
    ("delivery", ["free delivery", "free-delivery", "outside", "coverage", "zone", "polygon", "delivery"]),
    ("map", ["map", "zoom", "here", "region", "where", "geograph", "bengaluru", "karnataka", "india", "camera"]),
    ("unhealthy", ["unhealthy", "which service", "status", "down", "degraded", "health", "broken"]),
    ("cause", ["cause", "spike", "what caused", "latency", "root", "why did this happen"]),
    ("next", ["next", "should we test", "recommend", "suggest"]),
    ("learned", ["learn", "remember", "memory", "playbook", "adapt"]),
    ("last_round", ["last round", "what happened", "previous round", "incident", "report", "summary"]),
    ("policy", ["safety", "policy", "sandbox", "allowed", "rules"]),
    ("help", ["help", "what can you", "hello", "hey", "who are you"]),
]
SUGGEST = ["Why was this experiment selected?", "Why is AEGIS's confidence this high?", "Explain this graph",
           "What should we test next?", "Why did the map zoom here?", "What did the agents learn?"]


def detect(message, ctx):
    m = message.lower()
    if ctx.get("chart") and any(w in m for w in ("graph", "chart", "this", "explain", "mean")):
        return "graph"
    if ctx.get("page") == "map" and any(w in m for w in ("here", "happening", "this", "explain")):
        return "map"
    scores = []
    for i, (intent, words) in enumerate(INTENTS):
        hits = sum(1 for w in words if w in m)
        scores.append((hits, -i, intent))
    hits, _, intent = max(scores)
    if hits:
        return intent
    page = ctx.get("page")
    return {"map": "map", "metrics": "resilience", "learning": "learned", "safety": "policy",
            "incidents": "last_round", "scenarios": "next"}.get(page, "overview")


class Ctx:
    """Everything a handler needs, resolved once."""

    def __init__(self, snap, ctx):
        self.live = snap["live"] or {}
        self.learn = snap["learn"] or {}
        self.book = snap["playbook"] or {}
        self.brain = snap["brain"] or {}
        self.state = self.live.get("state") or {}
        self.domain = ctx.get("domain") or self.state.get("domain") or "emergency"
        self.D = domains.get(self.domain)
        self.ctx = ctx
        self.events = [e for e in self.live.get("events", []) if e.get("domain") == self.domain]
        self.results = [r for r in self.learn.get("results", []) if r["domain"] == self.domain and "resilience" in r]
        self.latest = self.results[-1] if self.results else None
        self.m = domain_metrics(self.learn.get("results", []), self.domain)

    def last(self, kind, agent=None, round_only=False):
        for e in reversed(self.events):
            if e["kind"] == kind and (agent is None or e["agent"] == agent):
                if round_only and e.get("round") != self.state.get("round"):
                    continue
                return e
        return None

    def unit(self):
        return "min" if self.D.TICK_UNIT == "min" else "s"


def pct(x):
    return "—" if x is None else f"{x:.0f}%"


# ---------------------------------------------------------------- handlers
def h_confidence(c):
    ev = c.last("diagnosis_fix")
    if not ev or not ev["data"].get("confidence"):
        return "AEGIS hasn't made a diagnosis yet in this system. Run a round and ask again.", [], []
    conf = ev["data"]["confidence"]
    lines = [f"**Root-cause confidence {conf['score']}% ({conf['level']})** for *{conf['root_cause']}* "
             f"(round {ev['round']}). This is AEGIS's estimate that its diagnosis is correct, not how confident it sounds."]
    lines.append(f"{conf['signals_aligned']} of {conf['signals_total']} evidence signals aligned:")
    for e in conf["evidence"]:
        mark = "✓" if e["ok"] else ("△" if e["ok"] is None else "✗")
        lines.append(f"{mark} {e['text']}")
    w = conf["weights"]
    lines.append("Formula: " + " + ".join(f"{w[k]:.2f}×{k.replace('_', ' ')} ({v:.2f})"
                                          for k, v in conf["factors"].items()) + ".")
    res = next((r for r in reversed(c.results) if r["round"] == ev["round"]), None)
    if res and res.get("oracle", {}).get("accuracy") is not None:
        lines.append(f"**ORACLE's independent validation: {res['oracle']['accuracy']}% accuracy**: "
                     f"{res['oracle']['text']} (checked against the experiment record).")
    related = [{"label": "AEGIS confidence", "value": f"{conf['score']}%"}]
    if res:
        related.append({"label": "ORACLE validated", "value": pct(res["oracle"]["accuracy"])})
    return "\n".join(lines), related, ["Why did AEGIS choose this recovery?", "What should we test next?"]


def h_recovery(c):
    ev = c.last("diagnosis_fix")
    if not ev:
        return "No recovery has happened yet in this system.", [], ["Why was this experiment selected?"]
    d = ev["data"]
    src = ("its **playbook**: this exact symptom signature was solved before, so it skipped the investigation"
           if d["source"] == "playbook" else
           "its **rule book**: a new signature, so it investigated first and tried the most likely fix")
    conf = d.get("confidence") or {}
    lines = [f"In round {ev['round']}, AEGIS saw *{d['key']}* and chose **{' + '.join(d['fixes'])}** using {src}.",
             f"Root cause it identified: **{conf.get('root_cause', d.get('root_cause', '—'))}** "
             f"(confidence {conf.get('score', '—')}%)."]
    fails = [e for e in c.events if e["kind"] == "diagnosis_no_effect" and e["round"] == ev["round"]]
    if fails:
        lines.append(f"It first tried something that didn't work ({fails[-1]['data']['cause']}), recorded that "
                     "failure, and moved to the next hypothesis.")
    res = next((r for r in reversed(c.results) if r["round"] == ev["round"]), None)
    if res:
        lines.append(f"Outcome: **{res['verdict']}**, MTTR {fmt_sec(c, res.get('mttr_sec'))}, "
                     f"ORACLE accuracy {pct(res['oracle']['accuracy'])}.")
    lines.append("Every fix is from a whitelist. The Fixer and the twin both refuse anything else.")
    return "\n".join(lines), [{"label": "Fix", "value": " + ".join(d["fixes"])}], ["Why is AEGIS's confidence this high?"]


def h_rogue(c):
    ev = c.last("proposal", "rogue")
    if not ev:
        return "ROGUE hasn't proposed an experiment yet.", [], []
    p = ev["data"]
    meaning = {"exploit": "exploit: it picked the experiment it currently believes does the most damage",
               "explore": "explore: it deliberately tried something else to keep learning",
               "explore (untried)": "explore: this failure mode had never been tested",
               "scenario": "scenario: a person queued it from the launcher",
               "alternative": "alternative: ORACLE blocked the first request and suggested this safer one",
               "safety test": "safety test: a deliberately unsafe request to prove ORACLE blocks it"}.get(p["mode"], p["mode"])
    q = c.brain.get(c.domain, {}).get("q", {})
    top = sorted(q.items(), key=lambda kv: -kv[1])[:3]
    lines = [f"ROGUE said: “{ev['speech']}”",
             f"Mode: **{meaning}**.",
             f"Target {p['target_service']}, severity {p['severity']}, blast radius {p['blast_radius']} service(s)."]
    if p.get("expected_impact") is not None:
        lines.append(f"Its learned expected impact was {p['expected_impact']:.0%} (tested {p['tested_before']}× before).")
    if top:
        lines.append("ROGUE's current beliefs (expected damage): " +
                     ", ".join(f"{a.replace('_', ' ')} {v:.0%}" for a, v in top) + ".")
    lines.append("ROGUE is a multi-armed bandit: attacks that AEGIS learns to beat score lower, so it moves on.")
    return "\n".join(lines), [{"label": "Mode", "value": p["mode"]}], ["What should we test next?", "Why was it approved?"]


def h_block(c):
    blocked = [v for v in (c.learn.get("verdicts") or []) if not v["approved"] and v["domain"] == c.domain]
    if not blocked:
        return ("No experiment has been blocked in this system yet. Try **Test safety controller**: ROGUE will ask "
                "for something destructive and ORACLE will refuse it."), [], ["What is the safety policy?"]
    v = blocked[-1]
    lines = [f"ORACLE blocked **{' + '.join(v['attacks'])}** in round {v['round']}."]
    for c_ in v["checks"]:
        lines.append(f"{'✓' if c_['ok'] else '✗'} {c_['name']}: {c_['detail']}")
    if v.get("alternative"):
        lines.append(f"Safer alternative offered: **{v['alternative']['label']}** "
                     f"(severity {v['alternative']['severity']}, {len(v['alternative']['services'])} service).")
    return "\n".join(lines), [{"label": "Blocked", "value": str(len(blocked))}], ["What is the safety policy?"]


def h_policy(c):
    p = POLICY
    return (f"ORACLE's sandbox policy: environment **{p['environment']}**, max severity **{p['max_severity']}**, "
            f"max blast radius **{p['max_blast_radius']} services**, destructive experiments "
            f"**{'allowed' if p['allow_destructive'] else 'never allowed'}**, auto-rollback "
            f"**{'ON' if p['auto_rollback'] else 'OFF'}** (every chaos flag resets at round end). "
            "Every ROGUE proposal is checked before anything runs."), [], ["Why was this experiment blocked?"]


def h_resilience(c):
    m = c.m
    if m["resilience"] is None:
        return "No scored rounds yet for this system.", [], []
    comp = m["components"]
    weakest = min(comp, key=comp.get)
    strongest = max(comp, key=comp.get)
    lines = [f"**Resilience {m['resilience']}/100** for {c.D.TITLE}"
             + (f" (previous {m['resilience_prev']})" if m["resilience_prev"] is not None else "") + ".",
             "It's a running average of each round's score: 20% detection + 20% diagnosis + 25% recovery + "
             "15% safety + 20% adaptability.",
             "Latest components: " + ", ".join(f"{k} {v}" for k, v in comp.items()) + ".",
             f"Strongest: **{strongest}**. Weakest: **{weakest}**" + (
                 f", because {len(m['untested'])} failure mode(s) are still untested ({', '.join(m['untested'])})"
                 if weakest == "adaptability" and m["untested"] else "") + "."]
    if m["mttd_first"] is not None and m["mttd"] is not None:
        lines.append(f"Detection moved from {m['mttd_first']} to {m['mttd']} {m['unit']}, recovery from "
                     f"{m['mttr_first']} to {m['mttr']} {m['unit']} (simulated).")
    return "\n".join(lines), [{"label": "Resilience", "value": f"{m['resilience']}/100"}], ["Explain this graph"]


def h_mttd(c):
    m = c.m
    lines = ["**MTTD** (mean time to detect) is the time from ROGUE's experiment to AEGIS's first alert. "
             "**MTTR** (mean time to recover) is how long incidents stayed open until AEGIS's fix cleared them.",
             f"Recent averages for {c.D.TITLE}: MTTD **{m['mttd']} {m['unit']}**, MTTR **{m['mttr']} {m['unit']}** "
             f"(first rounds: {m['mttd_first']} / {m['mttr_first']} {m['unit']}). These are simulated times."]
    if m["mttr"] is not None and m["mttr_first"] is not None:
        if m["mttr"] > m["mttr_first"]:
            lines.append("MTTR rose because ROGUE now concentrates on the attacks that are hardest to fix "
                         "(its bandit exploits what still hurts), even though repeat incidents are fixed faster.")
        else:
            lines.append("MTTR fell mainly because repeat incidents are answered from the playbook without investigation.")
    if m["recovery_scratch"] is not None and m["recovery_playbook"] is not None:
        lines.append(f"Like-for-like: {m['recovery_scratch']} ticks when investigating from scratch vs "
                     f"{m['recovery_playbook']} ticks with the playbook.")
    return "\n".join(lines), [{"label": "MTTD", "value": f"{m['mttd']} {m['unit']}"},
                              {"label": "MTTR", "value": f"{m['mttr']} {m['unit']}"}], ["Why is the resilience score this?"]


def h_graph(c):
    chart = c.ctx.get("chart") or "resilience"
    m = c.m
    s = m["series"]
    if not s:
        return "This graph has no data yet. Play a few rounds first.", [], []
    k = max(1, len(s) // 3)
    avg = lambda xs: round(sum(xs) / len(xs), 1) if xs else None
    if chart == "resilience":
        a, b = avg([x["resilience"] for x in s[:k]]), avg([x["resilience"] for x in s[-k:]])
        txt = (f"The resilience score moved from about **{a}** to **{b}** across the last {len(s)} rounds. "
               f"The biggest driver right now is *{min(m['components'], key=m['components'].get)}* (weakest) vs "
               f"*{max(m['components'], key=m['components'].get)}* (strongest). "
               + ("It dips when ROGUE switches to a failure AEGIS hasn't seen, then recovers as the playbook learns it."))
    elif chart == "mttd_mttr":
        return h_mttd(c)
    elif chart == "impact":
        hm = m["headline_metric"]
        a, b = avg([x["headline"] for x in s[:k]]), avg([x["headline"] for x in s[-k:]])
        off = [x for x in s if not x["blue"]]
        txt = (f"{hm['label']} per round: about **{a}{hm['unit']}** early vs **{b}{hm['unit']}** recently. "
               f"The dashed line is a normal day without attacks ({baseline(c.D)}{hm['unit']}). "
               + (f"{len(off)} red point(s) are rounds with AEGIS switched off: that's what the damage looks like "
                  "without defenders. " if off else "")
               + "Spikes are rounds where ROGUE tried a failure AEGIS had not learned yet.")
    elif chart == "recovery":
        txt = (f"Each bar is how long the system stayed broken in a round. Teal bars were answered from the playbook "
               f"({m['recovery_playbook']} ticks on average) and grey bars were investigated from scratch "
               f"({m['recovery_scratch']} ticks). That gap is AEGIS's learning.")
    elif chart == "rogue_belief":
        q = sorted(c.brain.get(c.domain, {}).get("q", {}).items(), key=lambda kv: -kv[1])
        txt = ("ROGUE's Q-values are its learned expected damage per experiment: "
               + ", ".join(f"{a.replace('_', ' ')} {v:.0%}" for a, v in q) +
               ". It usually picks the highest (exploit) and sometimes explores. When AEGIS masters an attack, "
               "its Q-value falls and ROGUE's choices shift.")
    elif chart == "rogue_choices":
        from collections import Counter
        cnt = Counter("+".join(x["attacks"]) for x in s if x["attacks"])
        txt = ("Each dot is an experiment ROGUE ran. Bigger and brighter dots did more damage. Most frequent: "
               + ", ".join(f"{k} ({v}×)" for k, v in cnt.most_common(3)) +
               ". Clusters show ROGUE exploiting a weak spot, and gaps show it moving on once AEGIS adapts.")
    elif chart == "coverage":
        txt = (f"{m['modes_tested']} of {m['modes_total']} failure modes have been tested. "
               + (f"Untested: {', '.join(m['untested'])}. " if m["untested"] else "Full coverage reached. ")
               + "Coverage is half of the adaptability score.")
    elif chart == "components":
        return h_resilience(c)
    else:
        txt = "I can explain the resilience, impact, recovery, MTTD/MTTR, ROGUE choice and ROGUE belief graphs."
    return txt, [{"label": "Rounds", "value": str(len(s))}], ["What should we test next?", "Why is MTTR changing?"]


def h_map(c):
    focus = resolve_focus(c.state.get("focus")) if c.state.get("domain") == c.domain else None
    if not focus:
        return "The map shows the current system once a round is running.", [], []
    level = focus["level"]
    lines = [f"The map is at **{level}** level: *{focus['label']}*.", f"Why: {focus['reason']}."]
    rule = {"emergency": "108 is a local dispatch problem, so the camera zooms from the Bengaluru Urban district "
                         "boundary down to the caller, the nearest ambulance and the hospital when an incident is active.",
            "food": "Food delivery is bounded by service areas, so the camera fits the free-delivery zone polygons "
                    "(simulated) and zooms into a single zone when its boundary misbehaves.",
            "upi": "UPI is a national network with no delivery-style radius, so the camera shows India and only "
                   "zooms to a state when a simulated regional disruption hits a partner bank there."}[c.domain]
    lines.append(rule)
    lines.append("Bounds come from the scenario's geometry and are applied with fitBounds and padding. Boundaries are real "
                 "geoBoundaries data; stations, zones, routes and banks are simulated.")
    return "\n".join(lines), [{"label": "Map level", "value": level}], ["Which ambulance is closest?" if c.domain == "emergency"
                                                                         else "Which area is outside free delivery?"]


def h_ambulance(c):
    if c.domain != "emergency":
        return "Ambulance questions apply to the 🚑 108 system. Switch to it to see the response map.", [], []
    inc = (c.state.get("geo") or {}).get("incident")
    if not inc:
        return "No open emergency call right now.", [], []
    near = inc.get("nearest")
    lines = [f"Featured call: **{inc['caller']['label']}** in {inc['zone']}, waiting {inc['waiting_min']} min "
             f"(status {inc['status']})."]
    if inc.get("ambulance"):
        lines.append(f"Assigned crew: {inc['ambulance']['label']} (ETA ~{inc['eta_min']} min, simulated straight-line route).")
    if near:
        lines.append(f"Nearest *free* ambulance: **{near['label'].split(': ')[-1]}**, {near['km']} km away.")
    lines.append(f"Destination: {inc['hospital']['label']} ({inc['hospital']['free_beds']} beds free).")
    lines.append("Response coverage circles show how far each station reaches in 15 simulated minutes.")
    return "\n".join(lines), [{"label": "Nearest", "value": f"{near['km']} km" if near else "—"}], ["Why did the map zoom here?"]


def h_delivery(c):
    if c.domain != "food":
        return "Free-delivery coverage applies to the 🛵 food system. Switch to it to see the zones.", [], []
    geo = c.state.get("geo") or {}
    drifted = [z for z in geo.get("zones", []) if z["status"] != "ok"]
    cust = geo.get("customers", [])
    wrong = [x for x in cust if x["truly_free"] and not x["free"]]
    outside = [x for x in cust if not x["truly_free"]]
    lines = [f"Each zone polygon is a **simulated free-delivery boundary**. Recent customers: {len(cust)}, of which "
             f"{len(outside)} are genuinely outside free delivery."]
    if drifted:
        z = drifted[0]
        lines.append(f"**{z['name']}** is *{z['status']}*: its configured polygon shrank, so {len(wrong)} customer(s) "
                     "inside the real service area were wrongly shown a delivery fee (some left: lost sales).")
    else:
        lines.append("All zone configurations match their service areas right now.")
    return "\n".join(lines), [{"label": "Wrongly charged", "value": str(len(wrong))}], ["Why did the map zoom here?"]


def h_unhealthy(c):
    nodes = (c.state.get("topology") or {}).get("nodes", [])
    bad = [n for n in nodes if n["status"] in ("degraded", "strained")]
    if not bad:
        fixed = [n["name"] for n in nodes if n["status"] == "mitigated"]
        return (f"No service is unhealthy in {c.D.TITLE} right now."
                + (f" Recovered this round: {', '.join(fixed)} (AEGIS's fix is active)." if fixed else "")), [], []
    lines = [f"**{n['name']}**: {n['status']} · {n['metric']} · {n['latency_ms']} ms · {n['error_pct']}% errors"
             + (f" (hit by {', '.join(n['attacked_by'])})" if n["attacked_by"] else " (side-effect)")
             for n in bad]
    return "\n".join(lines) + "\nTelemetry is prototype telemetry derived from the simulation.", \
        [{"label": "Unhealthy", "value": str(len(bad))}], ["What caused this?"]


def h_cause(c):
    attacks = (c.state.get("truth") or {}).get("attacks", [])
    if not attacks:
        return "Nothing has been injected in the current round, so there is no cause to explain yet.", [], []
    lines = ["From the experiment record (ORACLE knows what ROGUE injected):"]
    for a in attacks:
        e = c.D.EXPERIMENTS.get(a, {})
        lines.append(f"• **{e.get('label', a)}** ({e.get('category', '')}): {e.get('failure_state', '')}. "
                     f"Normally: {e.get('baseline', '')}.")
    inc = c.live.get("incidents", {})
    if inc:
        lines.append("AEGIS currently sees: " + ", ".join(v["key"] for v in inc.values()) + ".")
    return "\n".join(lines), [], ["Why did AEGIS choose this recovery?"]


def h_next(c):
    if not c.latest:
        return "Play a round first, then I can recommend the next experiment.", [], []
    n = c.latest["next"]
    q = c.brain.get(c.domain, {}).get("q", {})
    intent = max(q, key=q.get) if q else None
    lines = [f"ORACLE recommends **{n['label']}**: {n['why'].lower()}."]
    if intent:
        lines.append(f"ROGUE's own instinct is **{c.D.EXPERIMENTS[intent]['label']}** (expected damage {q[intent]:.0%}). "
                     "It exploits what hurts, while ORACLE pushes for coverage.")
    lines.append("You can run either from the Scenarios page.")
    return "\n".join(lines), [{"label": "Recommended", "value": n["label"]}], ["Why is adaptability low?"]


def h_learned(c):
    book = [e for e in c.book.values() if e["domain"] == c.domain]
    q = c.brain.get(c.domain, {}).get("q", {})
    top = max(q, key=q.get) if q else None
    lines = [f"**AEGIS** has {len(book)} playbook lessons for {c.D.TITLE}, re-used "
             f"{sum(e['successes'] for e in book)} times" + (": e.g. " + "; ".join(
                 f"{e['symptom']} → {' + '.join(e['fixes'])}" for e in sorted(book, key=lambda e: -e['successes'])[:2])
                 if book else "") + "."]
    if top:
        lines.append(f"**ROGUE** believes {c.D.EXPERIMENTS[top]['label'].lower()} hurts most ({q[top]:.0%}) and "
                     "keeps lowering its belief in attacks AEGIS has mastered.")
    if c.latest:
        lines.append(f"**ORACLE** verified: {c.latest['speech']} Coverage {len(c.latest['coverage']['tested'])}/"
                     f"{c.latest['coverage']['total']} failure modes.")
    return "\n".join(lines), [{"label": "Lessons", "value": str(len(book))}], ["What should we test next?"]


def h_last(c):
    reports = [r for r in (c.learn.get("reports") or []) if r["domain"] == c.domain]
    if not reports:
        return "No incident report yet for this system.", [], []
    r = reports[-1]
    lines = [f"**{r['id']}** · {r['scenario']} on {', '.join(r['targets'])}.",
             f"Detected: {r['detection']}. Diagnosis: {r['diagnosis']} (AEGIS {r['aegis_confidence'] or '—'}%, "
             f"ORACLE-validated {r['oracle_accuracy'] if r['oracle_accuracy'] is not None else '—'}%).",
             f"Recovery: {r['recovery']} · MTTD {r['mttd']} · MTTR {r['mttr']} · **{r['verification']}**.",
             f"Impact: {r['headline']}. Resilience {r['resilience_prev']} → {r['resilience']}.",
             f"ROGUE: “{r['learning']['rogue']}”"]
    return "\n".join(lines), [{"label": "Incident", "value": r["id"]}], ["What should we test next?"]


def h_help(c):
    return ("I'm **ORACLE ASSIST**. I explain what the arena is doing: why ROGUE chose an experiment, why ORACLE "
            "approved or blocked it, how AEGIS diagnosed and recovered (and how sure it was), what each graph means, "
            "why the map is zoomed where it is, and what everyone learned."), [], SUGGEST[:4]


def h_overview(c):
    s = c.state
    if not s:
        return "The arena isn't running yet. Start it with run_all.py.", [], SUGGEST[:3]
    attacks = (s.get("truth") or {}).get("attacks", [])
    inc = c.live.get("incidents", {})
    lines = [f"Round {s['round']} of {c.D.ICON} {c.D.TITLE}, t = {s['t']}/{s['round_ticks']} {c.D.TICK_UNIT} (simulated)."]
    lines.append(f"ROGUE's experiment: {', '.join(attacks) or 'not launched yet'}. "
                 f"AEGIS: {', '.join(v['key'] for v in inc.values()) or 'no open incidents'}.")
    if c.latest:
        lines.append(f"Resilience {c.latest['resilience']}/100 after the last scored round.")
    return "\n".join(lines), [], SUGGEST[:4]


HANDLERS = {"confidence": h_confidence, "recovery": h_recovery, "rogue_choice": h_rogue, "safety_block": h_block,
            "policy": h_policy, "resilience": h_resilience, "mttd": h_mttd, "graph": h_graph, "map": h_map,
            "ambulance": h_ambulance, "delivery": h_delivery, "unhealthy": h_unhealthy, "cause": h_cause,
            "next": h_next, "learned": h_learned, "last_round": h_last, "help": h_help, "overview": h_overview}


def fmt_sec(c, sec):
    if sec is None:
        return "—"
    return f"{sec / 60:.0f} min" if c.D.TICK_UNIT == "min" else f"{sec:.0f} s"


def answer(message, ctx, snap):
    message = re.sub(r"\s+", " ", (message or "").strip())[:500]
    if not message:
        return {"answer": "Ask me about the experiment, the agents, a graph, the map or the incident.",
                "relatedData": [], "suggestedActions": SUGGEST[:4], "intent": "empty"}
    c = Ctx(snap, ctx or {})
    intent = detect(message, ctx or {})
    try:
        text, related, suggestions = HANDLERS[intent](c)
    except Exception as e:                     # never let the assistant crash the page
        text, related, suggestions = f"I couldn't read that part of the arena state ({type(e).__name__}).", [], SUGGEST[:3]
    return {"answer": text, "relatedData": related, "suggestedActions": suggestions or SUGGEST[:3], "intent": intent,
            "context": {"domain": c.domain, "page": (ctx or {}).get("page"), "round": c.state.get("round")}}


def baseline(D):
    return next((getattr(D, n) for n in ("BASELINE", "BASELINE_LATE_PCT", "BASELINE_FAILED_PCT") if hasattr(D, n)), "—")
