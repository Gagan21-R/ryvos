# RYVO

*Team **Tech-Architects** · Autonomous AI Resilience Testing Platform*

**Where AI challenges systems, protects them, and learns from every failure.**

Three AI characters run an autonomous resilience-testing loop on a sandboxed digital twin:

| | Character | Role |
|---|---|---|
| 🔴 | **ROGUE** · the challenger | Finds weak spots and proposes controlled, reversible failures (multi-armed bandit RL) |
| 🔵 | **AEGIS** · the guardian | Monitors, detects, diagnoses (with evidence-based root-cause confidence), recovers with whitelisted fixes, learns a playbook |
| 🟣 | **ORACLE** · the referee | Safety-checks every experiment, validates AEGIS against the experiment record, scores resilience, narrates, explains (ORACLE ASSIST) |

`DISCOVER → PLAN → SAFETY CHECK → DISRUPT → DETECT → DIAGNOSE → RECOVER → VERIFY → LEARN → ADAPT`

Three systems can be put in the arena: **🚑 108 emergency response**, **🛵 food delivery (with free-delivery zones)** and **💳 UPI payments**.

> Honest by design: this is a **sandbox simulation**. There is no connection to real 108 dispatch, the UPI network, banks
> or delivery companies. Telemetry is prototype telemetry derived from the simulation; stations, zones, routes and banks are
> simulated. Map tiles © OpenStreetMap contributors; administrative boundaries from geoBoundaries.

## Run it

```
pip install -r requirements.txt
cd frontend && npm install && npm run build && cd ..
python run_all.py --domain all
```

Open **http://localhost:8501**. `run_all.py` starts the bus (real Redis if running, otherwise the built-in mini Redis),
all agents, and the FastAPI backend that serves the React app.

On this PC, use the full Python path: `& "C:\Users\Gagan R\AppData\Local\Programs\Python\Python313\python.exe" run_all.py --domain all`

| Command | What it does |
|---|---|
| `python run_all.py --domain emergency` | one system (`emergency`, `food`, `upi`) or `all` to rotate |
| `python run_all.py --domain all --fast --rounds 30 --no-dashboard` | train quickly (0.05 s per simulated minute) |
| `python run_all.py --reset` | forget everything learned |
| `python run_all.py --legacy` / `--streamlit` | previous dashboards |
| `cd frontend && npm run dev` | frontend dev server on :5173 (proxies /api to :8501) |
| `python -m tests.smoke_test` | 70 automated checks (twins, safety policy, confidence, API, chat) |
| `python -m tools.build_geo` | re-download the boundary GeoJSON from geoBoundaries |

## Deploy

The `Dockerfile` builds the React app and runs everything (mini Redis bus, all agents, FastAPI) in one container,
listening on `$PORT` (default 8501).

```
docker build -t ryvo . && docker run -p 8501:8501 ryvo
```

**Render (free):** New → Blueprint → select this repository (`render.yaml` is included). The free plan sleeps after ~15
minutes without visitors; the first visit after that takes about a minute to wake up.

## Demo in 60 seconds

1. **Overview → START AUTONOMOUS ROUND.** ROGUE explains why it picked its target, ORACLE approves it, the failure lands,
   the map flies to the affected area, AEGIS detects, diagnoses (click the confidence meter for *why*), recovers, and ORACLE
   delivers the verdict: MTTD, MTTR, diagnosis accuracy and resilience before → after.
2. **Test safety controller.** ROGUE asks to *crash the dispatch database*; ORACLE blocks it (blast radius 5 > 3, critical,
   not reversible) and offers a safer alternative.
3. **Geographic demo.** Food delivery: one free-delivery zone's configured boundary drifts; customers inside the real service
   area are wrongly shown a fee. The map zooms to that zone; AEGIS restores the config.
4. **Ask ORACLE** (bottom-right orb): "Why did AEGIS choose this recovery?", "Why is the confidence 91%?", "Why did the map zoom here?"

## Architecture

```
            ┌──────────── Redis pub/sub event bus (shared/names.py) ────────────┐
 twin/simulator.py  ←→  domains/{emergency,food,upi}.py   (digital twins + services + chaos hooks)
 red/      ROGUE    : strategist.py (bandit + memory) · executor.py (propose → wait for ORACLE → execute → reflect)
 oracle/   ORACLE   : policy.py (sandbox policy) · safety.py (verdict agent)
 blue/     AEGIS    : monitor.py → diagnoser.py (+ confidence.py) → fixer.py (whitelist only)
 learning/ ORACLE   : referee.py (validation, MTTD/MTTR, resilience) · postmortem.py (incident reports) · playbook.py
 dashboard/recorder.py  → data/live.json + data/learn.json
 backend/  FastAPI  : main.py · arena/{state,metrics}.py · geography/map_data.py (+ data/*.geojson) · chatbot/oracle_assist.py
 frontend/ React    : Vite + Motion + Leaflet + Recharts (pages, characters, story director, map engine, ORACLE ASSIST)
```

No agent calls another directly; everything goes through the bus. The frontend never holds geographic logic: it fits whatever
bounds the scenario's `focus` gives it.

### Bus channels
`city.state` · `city.events` · `rogue.proposal` · `oracle.verdict` · `red.attack` · `blue.alert` · `blue.diagnosis` ·
`blue.fix` · `round.result` · `round.report` · `agent.say` · `arena.control`

### API
| Method | Path | |
|---|---|---|
| GET | `/api/state` | live twin state, status, incidents, story events |
| GET | `/api/stream` | Server-Sent Events: `live` (~4/s) and `learn` (per round) |
| GET | `/api/meta` | domains, services, experiments, scenarios, policy |
| GET | `/api/scenarios` | scenario library (id, category, geography, target, severity, blastRadius, baseline, failureState, recoveryStrategy, allowed) |
| GET | `/api/geography?domain=` | real boundaries + simulated layers + zoom hierarchy |
| GET | `/api/incidents` | ORACLE incident reports |
| GET | `/api/metrics` | resilience, components, MTTD/MTTR, coverage, accuracy, series |
| GET | `/api/safety` | policy + recent verdicts |
| POST | `/api/round/start` | start an autonomous round now (`domain`, optional `scenario` or `attacks`) |
| POST | `/api/safety/test` | ROGUE requests a destructive experiment; ORACLE must block it |
| POST | `/api/control` | pause/resume, AEGIS on/off, domain, autoplay, reset_learning |
| POST | `/api/chat` | ORACLE ASSIST `{message, context: {page, domain, chart}}` → `{answer, relatedData, suggestedActions}` |

The individual agent steps (decide / approve / execute / detect / diagnose / recover / verify / learn) run autonomously as
bus agents rather than as separate HTTP endpoints, so the loop never depends on a client clicking through it.

### How the key numbers are computed
- **AEGIS root-cause confidence** (`blue/confidence.py`), deterministic:
  `0.25·symptom match + 0.25·telemetry correlation + 0.20·dependency isolation + 0.15·playbook history + 0.15·rule knowledge`,
  with a ✓/✗/△ evidence list and the alternative hypotheses.
- **ORACLE validated accuracy** (`learning/referee.py`): F1 of AEGIS's fixes against the experiment record (precision =
  fixes that were needed, recall = injected failures addressed). AEGIS learns from it: unnecessary fixes are pruned from the playbook.
- **Resilience score**: running average of each round's `0.20·detection + 0.20·diagnosis + 0.25·recovery + 0.15·safety + 0.20·adaptability`
  (adaptability = failure-mode coverage + playbook reuse).
- **MTTD / MTTR**: simulated time from experiment to first alert / time incidents stayed open.
- **ROGUE**: ε-greedy bandit (ε = 0.15, constant step α = 0.35) per system: it keeps chasing whatever AEGIS hasn't mastered.

### Geography
- 108: Bengaluru Urban district boundary (real), simulated stations with 15-min coverage circles, hospitals; during an
  incident the camera fits the caller, the nearest/assigned ambulance and the hospital (simulated straight-line route).
- Food: simulated irregular free-delivery polygons per zone (labelled simulated); config drift shrinks one zone's configured
  polygon; customers inside the real area but wrongly charged are highlighted; the camera fits that zone.
- UPI: national view of India (no fake "UPI radius"), city → gateway → bank transaction flows; a slow partner bank or bot
  farm highlights the real state boundary and the camera fits that state.

## Data written while running (`data/`)
`results.jsonl` (every scored round) · `playbook.json` (AEGIS) · `red_brain.json` (ROGUE) · `postmortems.md` · `live.json` · `learn.json`

## Notes for this machine
- Windows Application Control blocks pandas here; nothing in RYVO needs it.
- `shared/bus.py` connects to `127.0.0.1` (Windows `localhost` stalls ~4 s per connection trying IPv6 first).
- Leaflet, Motion and Recharts are bundled by Vite; map tiles need internet (without it the map still shows all data on a grid).
