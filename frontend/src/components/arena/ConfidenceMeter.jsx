// Root-cause confidence: AEGIS's evidence-based estimate that its diagnosis is correct. Click for the evidence.
import { useState } from "react";
import { openAssist } from "../../state/arenaStore.js";
import { Mark } from "../common/ui.jsx";

export default function ConfidenceMeter({ confidence, oracleAccuracy = null }) {
  const [open, setOpen] = useState(false);
  if (!confidence) return null;
  const c = confidence;
  return (
    <div>
      <button className="conf" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label={`Root-cause confidence ${c.score} percent. Show evidence`}>
        <div className="conf-top">
          <span className="eyebrow">Root-cause confidence</span>
          <span className="chip aegis">{c.level}</span>
        </div>
        <div className="conf-top">
          <span className="conf-num">{c.score}%</span>
          <span className="muted" style={{ fontSize: 12.5 }}>{c.signals_aligned} of {c.signals_total} signals aligned</span>
        </div>
        <div className="bar"><i style={{ width: `${c.score}%` }} /></div>
        <div className="muted" style={{ fontSize: 12 }}>
          {open ? "Hide evidence" : "Show evidence"} · {oracleAccuracy != null ? `ORACLE validated: ${oracleAccuracy}%` : "ORACLE validates at round end"}
        </div>
      </button>
      {open && (
        <div>
          <ul className="evidence">
            {c.evidence.map((e, i) => <li key={i}><Mark ok={e.ok} />{e.text}</li>)}
          </ul>
          <div className="muted" style={{ fontSize: 12, marginTop: 8 }}>
            Score = 0.25 symptom match + 0.25 telemetry + 0.20 isolation + 0.15 history + 0.15 rule knowledge. Deterministic.
          </div>
          <button className="explain-btn" style={{ marginTop: 8 }} onClick={() => openAssist("Why is AEGIS's confidence this high?")}>Ask ORACLE</button>
        </div>
      )}
    </div>
  );
}
