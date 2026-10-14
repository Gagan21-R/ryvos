import { ChevronRight } from "lucide-react";
import { Fragment, useState } from "react";
import { AgentBadge, SystemTabs } from "../components/common/ui.jsx";
import { useArena } from "../state/arenaStore.js";

export default function Incidents() {
  const reports = useArena((s) => s.learn.reports) || [];
  const [dom, setDom] = useState("all");
  const list = [...reports].reverse().filter((r) => dom === "all" || r.domain === dom);
  return (
    <div className="page">
      <div className="page-head">
        <div>
          <div className="eyebrow">Incident reports</div>
          <h1 className="h-page">Incidents</h1>
          <p className="lede">Written automatically by ORACLE after every round: what ROGUE did, how AEGIS responded, what was verified and what was learned.</p>
        </div>
        <SystemTabs value={dom} onChange={setDom} withAll />
      </div>
      {!list.length && <div className="empty">No incident reports yet. Run an autonomous round.</div>}
      <div className="list">
        {list.map((r, i) => (
          <details key={r.id} className="report" open={i === 0}>
            <summary>
              <span className="chip mono">{r.id}</span>
              <span><b>{r.scenario}</b> <span className="muted">· {r.title}</span></span>
              <span className={`chip ${r.verification === "RECOVERED" ? "ok" : "bad"}`}>{r.verification === "RECOVERED" ? "Recovered" : r.verification}</span>
              <span className="mono" style={{ fontWeight: 500 }}>{r.resilience_prev ?? "—"} → {r.resilience} <ChevronRight size={14} style={{ verticalAlign: -2 }} /></span>
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
                <div style={{ marginTop: 14, display: "grid", gap: 10, fontSize: 13 }}>
                  {["rogue", "aegis", "oracle"].map((a) => (
                    <div key={a} style={{ display: "grid", gridTemplateColumns: "32px 1fr", gap: 10, alignItems: "start" }}><AgentBadge agent={a} /><span>{r.learning[a]}</span></div>
                  ))}
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
