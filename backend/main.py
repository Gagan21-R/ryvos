"""RYVO backend (FastAPI).

The agents (ROGUE, AEGIS, ORACLE) run as separate processes on the Redis event bus. This API is the window
into the arena: it streams what they do, takes commands from the UI, explains things (ORACLE ASSIST),
and serves the React frontend (frontend/dist).

Run: python -m backend.main          -> http://localhost:8501   (normally started by run_all.py)
"""
import asyncio
import json
import os
from contextlib import asynccontextmanager

import uvicorn
from fastapi import FastAPI, HTTPException, Query
from fastapi.responses import FileResponse, JSONResponse, StreamingResponse
from fastapi.staticfiles import StaticFiles

import domains
from backend.arena import state
from backend.arena.metrics import domain_metrics
from backend.chatbot import oracle_assist
from backend.geography.map_data import geography, resolve_focus
from backend.models.schemas import ChatRequest, ChatResponse, Control, RoundStart, SafetyTest
from oracle.policy import POLICY, evaluate
from shared import bus, config, names

DIST = config.ROOT / "frontend" / "dist"


@asynccontextmanager
async def lifespan(_app):
    loop = asyncio.get_running_loop()
    default = loop.get_exception_handler()

    def quiet(lp, ctx):         # a browser tab closing its live stream mid-write is normal: don't log a traceback
        if isinstance(ctx.get("exception"), (ConnectionResetError, ConnectionAbortedError, BrokenPipeError)):
            return
        if default:
            default(lp, ctx)
        else:
            lp.default_exception_handler(ctx)
    loop.set_exception_handler(quiet)
    yield


app = FastAPI(title="RYVO", version="2.0", lifespan=lifespan,
              description="ROGUE challenges, AEGIS protects, ORACLE judges. Sandbox simulation.")


def baseline(D):
    return next((getattr(D, n) for n in ("BASELINE", "BASELINE_LATE_PCT", "BASELINE_FAILED_PCT") if hasattr(D, n)), None)


def publish(msg):
    try:
        bus.publish(names.CONTROL, msg)
    except Exception as e:                       # Redis / arena not running
        raise HTTPException(503, f"Arena not reachable: {e}") from e


def live_payload():
    live = state.live.get()
    s = live.get("state")
    if s and s.get("focus"):
        s = {**s, "focus": resolve_focus(s["focus"])}
    return {"state": s, "status": live.get("status", {}), "incidents": live.get("incidents", {}),
            "events": live.get("events", [])[-80:], "updated": live.get("updated"),
            "learn_version": live.get("learn_version")}


# ------------------------------------------------------------------ read
@app.get("/api/meta")
def meta():
    out = {}
    for did in domains.ORDER:
        D = domains.get(did)
        out[did] = {"id": did, "title": D.TITLE, "icon": D.ICON, "stake": D.STAKE, "tick_unit": D.TICK_UNIT,
                    "round_ticks": D.ROUND_TICKS, "attack_at": D.ATTACK_AT, "metrics": D.METRICS,
                    "baseline": baseline(D), "attacks": D.ATTACK_INFO, "fixes": D.FIX_INFO, "scenarios": D.SCENARIOS,
                    "legend": D.MAP_LEGEND, "services": D.SERVICES, "edges": D.EDGES, "experiments": D.EXPERIMENTS,
                    "forbidden": D.FORBIDDEN, "geography": D.GEOGRAPHY, "root_cause": D.ROOT_CAUSE}
    return {"order": domains.ORDER, "domains": out, "policy": POLICY, "simulated": True}


@app.get("/api/state")
def get_state():
    return live_payload()


@app.get("/api/stream")
async def stream():
    """Server-Sent Events: 'live' ~4x per second, 'learn' whenever a round is scored."""
    async def gen():
        last_live, last_learn, beat = None, None, 0
        while True:
            live = state.live.get()
            if live.get("updated") != last_live and live.get("state"):
                last_live = live.get("updated")
                yield f"event: live\ndata: {json.dumps(live_payload())}\n\n"
            lv = (live.get("learn_version"), state.playbook.mtime, state.brain.mtime)
            if lv != last_learn:
                last_learn = lv
                learn = state.learn.get()
                yield ("event: learn\ndata: " + json.dumps({
                    "results": learn.get("results", [])[-300:], "reports": learn.get("reports", [])[-30:],
                    "verdicts": learn.get("verdicts", [])[-40:], "playbook": state.playbook.get(),
                    "brain": state.brain.get()}) + "\n\n")
            beat += 1
            if beat % 50 == 0:
                yield ": ping\n\n"
            await asyncio.sleep(0.2)
    return StreamingResponse(gen(), media_type="text/event-stream",
                             headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"})


@app.get("/api/scenarios")
def scenarios():
    out = []
    for did in domains.ORDER:
        D = domains.get(did)
        geo = D.GEOGRAPHY
        for a, e in D.EXPERIMENTS.items():
            out.append({"id": f"{did}:{a}", "domain": did, "name": e["label"], "category": e["category"],
                        "attacks": [a], "geography": geo, "target": e["services"], "severity": e["severity"],
                        "blastRadius": len(e["services"]), "baseline": e["baseline"],
                        "failureState": e["failure_state"], "recoveryStrategy": D.CORRECT_FIX.get(a, []),
                        "allowed": evaluate(D, [a])["approved"]})
        for name, attacks in D.SCENARIOS.items():
            v = evaluate(D, attacks)
            out.append({"id": f"{did}:combo:{name}", "domain": did, "name": name, "category": "Combo disaster",
                        "attacks": attacks, "geography": geo, "target": v["services"], "severity": v["severity"],
                        "blastRadius": v["blast_radius"], "baseline": "Normal operation",
                        "failureState": " + ".join(D.EXPERIMENTS[a]["label"] for a in attacks),
                        "recoveryStrategy": [f for a in attacks for f in D.CORRECT_FIX.get(a, [])],
                        "allowed": v["approved"]})
        for a, e in D.FORBIDDEN.items():
            v = evaluate(D, [a])
            out.append({"id": f"{did}:forbidden:{a}", "domain": did, "name": e["label"], "category": e["category"],
                        "attacks": [a], "geography": geo, "target": e["services"], "severity": e["severity"],
                        "blastRadius": len(e["services"]), "baseline": "—", "failureState": "Destructive",
                        "recoveryStrategy": [], "allowed": False, "blockedBecause": v["reasons"],
                        "alternative": v["alternative"]})
    return out


@app.get("/api/geography")
def get_geography(domain: str = Query("emergency")):
    if domain not in domains.REGISTRY:
        raise HTTPException(404, f"Unknown domain {domain!r}")
    return geography(domain)


@app.get("/api/incidents")
def incidents(domain: str | None = None, limit: int = 30):
    reps = state.learn.get().get("reports", [])
    if domain:
        reps = [r for r in reps if r["domain"] == domain]
    return list(reversed(reps[-limit:]))


@app.get("/api/metrics")
def metrics(domain: str | None = None):
    results = state.learn.get().get("results", [])
    doms = [domain] if domain in domains.REGISTRY else domains.ORDER
    return {d: domain_metrics(results, d) for d in doms}


PROOF_EXTRA = {"emergency": ["avg_arrival_min", "critical_over_15"], "food": ["late_pct", "cancelled"],
               "upi": ["failed_pct", "stuck_money_inr", "double_debits"]}


@app.get("/api/proof")
def proof(window: int = 10):
    """AEGIS early vs now: the first `window` defended rounds of each system against the latest `window` (simulated)."""
    rows = []
    path = config.DATA_DIR / "results.jsonl"
    if path.exists():
        for line in path.read_text(encoding="utf-8").splitlines():
            try:
                rows.append(json.loads(line))
            except json.JSONDecodeError:
                pass
    out = {}
    for did in domains.ORDER:
        r = [x for x in rows if x.get("domain") == did and x.get("blue_enabled", True)]
        if len(r) < 2 * window:
            out[did] = {"ready": False, "rounds": len(r)}
            continue
        early, now = r[:window], r[-window:]

        def avg(rs, key):
            return round(sum(float(x.get(key) or 0) for x in rs) / len(rs), 2)

        def side(rs):
            return {"detect": avg(rs, "detect_ticks"), "recover": avg(rs, "recovery_ticks"),
                    "playbook": avg(rs, "playbook_hits"), "fixes": round(sum(len(x.get("fixes", [])) for x in rs) / len(rs), 2),
                    "resolved": round(100 * sum(bool(x.get("resolved")) for x in rs) / len(rs)),
                    "rogue": avg(rs, "red_reward"), **{k: avg(rs, k) for k in PROOF_EXTRA[did]}}

        out[did] = {"ready": True, "rounds": len(r), "window": window, "unit": domains.get(did).TICK_UNIT,
                    "early": side(early), "now": side(now), "simulated": True}
    return out


@app.get("/api/safety")
def safety():
    verdicts = state.learn.get().get("verdicts", [])
    return {"policy": POLICY, "recent": list(reversed(verdicts[-30:])),
            "blocked": sum(1 for v in verdicts if not v["approved"]),
            "approved": sum(1 for v in verdicts if v["approved"])}


# ------------------------------------------------------------------ act
@app.post("/api/round/start")
def round_start(body: RoundStart):
    """Start an autonomous round now (aborts the current one). Optional: a scenario or explicit experiments."""
    s = state.live.get().get("state") or {}
    dom = body.domain or s.get("domain") or "emergency"
    D = domains.get(dom if dom != "all" else (s.get("domain") or "emergency"))
    attacks = body.attacks or (D.SCENARIOS.get(body.scenario) if body.scenario else None)
    if body.scenario and not attacks:
        raise HTTPException(400, f"Unknown scenario {body.scenario!r} for {D.ID}")
    if attacks:
        unknown = [a for a in attacks if a not in D.EXPERIMENTS]
        if unknown:
            raise HTTPException(400, f"Unknown experiment(s) for {D.ID}: {unknown}")
        publish({"cmd": "scenario", "name": body.scenario or " + ".join(attacks), "attacks": attacks})
    else:
        publish({"cmd": "scenario", "name": None, "attacks": []})     # let ROGUE's bandit decide
    publish({"cmd": "start_round", "domain": dom})
    return {"ok": True, "domain": dom, "attacks": attacks or "ROGUE decides"}


@app.post("/api/safety/test")
def safety_test(body: SafetyTest):
    """ROGUE asks for something destructive; ORACLE must block it (takes a few seconds)."""
    if body.domain:
        publish({"cmd": "start_round", "domain": body.domain})
    publish({"cmd": "safety_test"})
    return {"ok": True}


@app.post("/api/control")
def control(body: Control):
    msg = {k: v for k, v in body.model_dump().items() if v is not None}
    if body.cmd == "domain" and body.domain not in (*domains.ORDER, "all"):
        raise HTTPException(400, "unknown domain")
    if body.cmd == "reset_learning":
        for f in ("results.jsonl", "playbook.json", "postmortems.md", "learn.json"):
            (config.DATA_DIR / f).unlink(missing_ok=True)
    publish(msg)
    return {"ok": True, "sent": msg}


@app.post("/api/chat", response_model=ChatResponse)
def chat(body: ChatRequest):
    return oracle_assist.answer(body.message, body.context.model_dump(), state.snapshot())


@app.get("/api/health")
def health():
    live = state.live.get()
    try:
        bus.ping()
        redis_ok = True
    except Exception:
        redis_ok = False
    return {"backend": "ok", "redis": redis_ok, "arena_live": bool(live.get("state")),
            "frontend_built": (DIST / "index.html").exists()}


# ------------------------------------------------------------------ frontend
if (DIST / "assets").exists():
    app.mount("/assets", StaticFiles(directory=DIST / "assets"), name="assets")


@app.get("/{path:path}", include_in_schema=False)
def spa(path: str):
    if path.startswith("api/"):
        raise HTTPException(404)
    f = DIST / path
    if path and f.is_file():
        return FileResponse(f)
    if (DIST / "index.html").exists():
        return FileResponse(DIST / "index.html", headers={"Cache-Control": "no-cache"})
    return JSONResponse({"error": "Frontend not built yet. Run: cd frontend && npm install && npm run build"}, 503)


def main():
    port = int(os.getenv("CBA_WEB_PORT", "8501"))
    print(f"[api] RYVO on http://localhost:{port}", flush=True)
    uvicorn.run(app, host="0.0.0.0", port=port, log_level="warning")


if __name__ == "__main__":
    main()
