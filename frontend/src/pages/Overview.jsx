import { ArrowRight, Database, MapPinned, Play, ShieldAlert } from "lucide-react";
import { useEffect, useState } from "react";
import ProofPanel from "../components/common/ProofPanel.jsx";
import { AgentBadge, SYSTEMS } from "../components/common/ui.jsx";
import { api } from "../services/api.js";
import { act, useArena } from "../state/arenaStore.js";
import { useStory } from "../story/director.js";
import { startRound } from "./Arena.jsx";

const STEPS = [
  { n: "01", agent: "rogue", title: "Plan an experiment", text: "ROGUE picks the weakest spot it has found so far and proposes a controlled, reversible failure.", phases: ["DISCOVER", "PLAN"] },
  { n: "02", agent: "oracle", title: "Check it is safe", text: "ORACLE checks blast radius, severity and reversibility, and blocks anything destructive.", phases: ["SAFETY"] },
  { n: "03", agent: "rogue", title: "Inject the failure", text: "The failure runs inside the digital twin only. No live system is touched.", phases: ["DISRUPT"] },
  { n: "04", agent: "aegis", title: "Detect and recover", text: "AEGIS detects the anomaly, explains the root cause with evidence and applies a whitelisted fix.", phases: ["DETECT", "DIAGNOSE", "RECOVER"] },
  { n: "05", agent: "oracle", title: "Verify and learn", text: "ORACLE scores the recovery against what really happened. Both agents learn for the next round.", phases: ["VERIFY", "LEARN", "ADAPT"] },
];

function useRealModel() {
  const [m, setM] = useState(null);
  useEffect(() => { api.realModel().then(setM).catch(() => {}); }, []);
  return m;
}

export default function Overview() {
  const live = useArena((s) => s.live);
  const learn = useArena((s) => s.learn);
  const story = useStory();
  const model = useRealModel();
  const [sys, setSys] = useState(live?.state?.domain || "emergency");
  const go = (hash) => { window.location.hash = hash; };
  const latest = (d) => [...(learn.results || [])].reverse().find((r) => r.domain === d && r.resilience != null);
  const test = model?.test;
  const fewer = test ? Math.round(100 * (1 - test.trained.false_alarms / Math.max(1, test.untrained.false_alarms))) : null;
  const points = model ? model.per_series.reduce((a, s) => a + Math.round(s.days), 0) : null;

  return (
    <div className="page">
      <section className="hero">
        <div>
          <div className="eyebrow">Autonomous resilience testing</div>
          <h1>Find where your systems break, <em>before your users do.</em></h1>
          <p className="lede">
            RYVO runs safe failure experiments on a digital twin of a critical system, recovers from them automatically
            and learns from every round. Its anomaly detector is trained and checked on real, labelled server telemetry.
          </p>
          <div className="cta-row">
            <button className="btn primary large" onClick={async () => { await startRound(sys); go("#/arena"); }}><Play size={17} /> Start autonomous round</button>
            <button className="btn large" onClick={async () => { await act("safety", () => api.safetyTest(sys), "Safety test requested"); go("#/arena"); }}>
              <ShieldAlert size={17} /> Test safety controller
            </button>
            <a className="btn ghost large" href="#/realdata">See the real-data results <ArrowRight size={16} /></a>
          </div>
        </div>
        <div className="hero-facts" aria-label="Real-data validation at a glance">
          <div><b>{model ? model.per_series.length : "—"}</b><span>real telemetry series</span></div>
          <div><b>{model ? model.train.trained.incidents + model.test.trained.incidents : "—"}</b><span>expert-labelled real incidents</span></div>
          <div><b>{fewer != null ? `${fewer}%` : "—"}</b><span>fewer false alarms than a standard 3-sigma rule, on data it never trained on</span></div>
          <div><b>{points != null ? points.toLocaleString("en-IN") : "—"}</b><span>days of real data scored</span></div>
          <div className="src">Source: Numenta Anomaly Benchmark (MIT licence). The live arena below is a sandbox simulation.</div>
        </div>
      </section>

      <div className="section-head">
        <div><h2>Systems under test</h2><p>Choose one, then start a round. Scores update after every scored round.</p></div>
        <a className="btn ghost" href="#/metrics">All metrics <ArrowRight size={15} /></a>
      </div>
      <div className="systems">
        {SYSTEMS.map(({ id, name, sub, icon: Icon }) => {
          const r = latest(id);
          return (
            <button key={id} className={`system-card ${sys === id ? "sel" : ""}`} onClick={() => setSys(id)} aria-pressed={sys === id}>
              <div className="top">
                <span className="ico"><Icon size={21} strokeWidth={1.8} /></span>
                <div><h3>{name}</h3><div className="sub">{sub}</div></div>
                {sys === id && <span className="chip oracle" style={{ marginLeft: "auto" }}>Selected</span>}
              </div>
              <div className="score"><b>{r?.resilience ?? "—"}</b><span>/ 100 resilience</span></div>
              <div className="last">{r ? `Last round: ${r.verdict.toLowerCase()} · diagnosis accuracy ${r.oracle?.accuracy ?? "—"}% · next: ${r.next?.label}` : "No scored round yet"}</div>
            </button>
          );
        })}
      </div>
      <div className="row" style={{ marginTop: 12 }}>
        <button className="btn small" onClick={async () => { await startRound("food", { scenario: "Zone config drift" }); go("#/arena"); }}>
          <MapPinned size={15} /> Run the geographic demo (delivery zone drift)
        </button>
      </div>

      <div className="section-head"><div><h2>How a round works</h2><p>Three agents, one closed loop. The highlighted step is what is happening right now.</p></div></div>
      <div className="steps">
        {STEPS.map((s) => (
          <div key={s.n} className={s.phases.includes(story.phase) ? "step-on" : ""}>
            <div className="row" style={{ justifyContent: "space-between" }}><span className="n">{s.n}</span><AgentBadge agent={s.agent} /></div>
            <h4>{s.title}</h4>
            <p>{s.text}</p>
          </div>
        ))}
      </div>

      <div className="section-head"><div><h2>Validated on real data</h2></div></div>
      <div className="band">
        <div>
          <div className="eyebrow"><Database size={13} style={{ verticalAlign: -2 }} /> Real-data validation</div>
          <h3>Trained on 17 real AWS server series, tested on 7 real incidents it never saw.</h3>
          <p>
            Every number comes from public, expert-labelled telemetry (Numenta Anomaly Benchmark). You can open each series,
            see the labelled incidents and every alert, download the source CSV and retrain the model yourself.
          </p>
          <a className="btn dark" href="#/realdata" style={{ marginTop: 16 }}>Open real-data validation <ArrowRight size={15} /></a>
        </div>
        {test && (
          <div className="stats">
            <div><b>{test.trained.false_per_day}</b><span>false alarms / day<br />(untrained: {test.untrained.false_per_day})</span></div>
            <div><b>{test.trained.f1}</b><span>F1 on unseen data<br />(untrained: {test.untrained.f1})</span></div>
          </div>
        )}
      </div>

      <div className="section-head"><div><h2>Proof it learns in the arena</h2><p>AEGIS's first 10 rounds against its latest 10, per system (simulated).</p></div><a className="btn ghost" href="#/learning">Learning <ArrowRight size={15} /></a></div>
      <ProofPanel />

      <div className="section-head"><div><h2>Why it is different</h2></div></div>
      <div className="compare">
        <div className="card">
          <div className="card-title"><h3>Traditional resilience testing</h3></div>
          <ol>
            {["Chooses an experiment", "Runs the test", "Reads the logs", "Diagnoses the cause", "Recovers the system", "Writes the report"].map((t) => (
              <li key={t}><span className="who">ENGINEER</span>{t}</li>
            ))}
          </ol>
        </div>
        <div className="card">
          <div className="card-title"><h3>RYVO</h3></div>
          <ol>
            {[["ROGUE", "Finds a weak spot and proposes an experiment"], ["ORACLE", "Validates it against the safety policy"],
              ["ROGUE", "Injects a controlled, reversible failure"], ["AEGIS", "Detects, diagnoses with evidence, recovers"],
              ["ORACLE", "Verifies recovery, scores it, writes the report"], ["ALL", "Learn: the next experiment adapts"]].map(([w, t]) => (
              <li key={t}><span className="who">{w}</span>{t}</li>
            ))}
          </ol>
        </div>
      </div>
      <p className="footnote">
        The arena is a sandbox simulation: it is not connected to real 108 dispatch, the UPI network, banks or delivery companies.
        The real-data validation uses public server telemetry, not data from those services. Map tiles © OpenStreetMap contributors;
        boundaries from geoBoundaries.
      </p>
    </div>
  );
}
