import { Fragment, useState } from "react";
import { useArena } from "../state/arenaStore.js";

const DOMS = [["all", "All"], ["emergency", "🚑 108"], ["food", "🛵 Delivery"], ["upi", "💳 UPI"]];

export default function Incidents() {
  const reports = useArena((s) => s.learn.reports) || [];
  const [dom, setDom] = useState("all");
  const list = [...reports].reverse().filter((r) => dom === "all" || r.domain === dom);
  return (
    <div className="page">
      <div className="eyebrow">ORACLE incident reports</div>
      <h1 className="h-page">Incidents</h1>
      <div className="row" style={{ justifyContent: "space-between", marginBottom: 18 }}>
        <p className="lede">Written automatically after every round: what ROGUE did, how AEGIS responded, what ORACLE verified, and what everyone learned.</p>
        <div className="tabs">{DOMS.map(([id, l]) => <button key={id} className={dom === id ? "on" : ""} onClick={() => setDom(id)}>{l}</button>)}</div>
      </div>
      {!list.length && <div className="empty">No incident reports yet. Run an autonomous round.</div>}
      <div className="list">
        {list.map((r, i) => (
          <details key={r.id} className="report" open={i === 0}>
            <summary>
              <span className="chip oracle mono">{r.id}</span>
              <span><b>{r.scenario}</b> <span className="muted">· {r.title}</span></span>
              <span className={`chip ${r.verification === "RECOVERED" ? "ok" : "bad"}`}>{r.verification}</span>
              <span className="mono" style={{ fontWeight: 700 }}>{r.resilience_prev ?? "—"} → {r.resilience}</span>
            </summary>
            <div className="body">
              <dl className="kv">
                <dt>Target</dt><dd>{r.targets.join(", ") || "—"}</dd>
                <dt>Geography</dt><dd>{r.geography} <span className="chip sim">simulated</span></dd>
                <dt>Mode</dt><dd>{r.mode}</dd>
                <dt>Safety</dt><dd>{r.safety}</dd>
              </dl>
              <dl className="kv">
                <dt>Detection</dt><dd>{r.detection}</dd>
                <dt>Diagnosis</dt><dd>{r.diagnosis}</dd>
                <dt>AEGIS confidence</dt><dd>{r.aegis_confidence ?? "—"}%</dd>
                <dt>ORACLE accuracy</dt><dd>{r.oracle_accuracy ?? "—"}% · {r.oracle_check}</dd>
                <dt>Recovery</dt><dd>{r.recovery}</dd>
                <dt>MTTD / MTTR</dt><dd>{r.mttd} / {r.mttr} (simulated)</dd>
              </dl>
              <div>
                <dl className="kv">{Object.entries(r.impact).map(([k, v]) => <Fragment key={k}><dt>{k}</dt><dd>{v}</dd></Fragment>)}</dl>
                <div style={{ marginTop: 10, display: "grid", gap: 6, fontSize: 12.5 }}>
                  <div><span className="chip rogue">ROGUE</span> {r.learning.rogue}</div>
                  <div><span className="chip aegis">AEGIS</span> {r.learning.aegis}</div>
                  <div><span className="chip oracle">ORACLE</span> {r.learning.oracle}</div>
                  <div><b>Next:</b> {r.next.label} ({r.next.why.toLowerCase()})</div>
                </div>
              </div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
