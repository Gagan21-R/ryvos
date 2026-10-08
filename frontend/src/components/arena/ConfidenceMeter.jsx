// ROOT-CAUSE CONFIDENCE: AEGIS's evidence-based estimate that its diagnosis is correct. Click for "why".
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { openAssist } from "../../state/arenaStore.js";

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
          <motion.span className="conf-num" key={c.score} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>{c.score}%</motion.span>
          <span className="muted" style={{ fontWeight: 600, fontSize: 12 }}>{c.signals_aligned}/{c.signals_total} signals aligned</span>
        </div>
        <div className="bar"><motion.i initial={{ width: 0 }} animate={{ width: `${c.score}%` }} transition={{ duration: 0.9, ease: "easeOut" }} /></div>
        <div className="muted" style={{ fontSize: 11.5, fontWeight: 600 }}>
          {open ? "Hide" : "Why"} {c.score}%? · {oracleAccuracy != null ? `ORACLE validated: ${oracleAccuracy}%` : "ORACLE validates at round end"}
        </div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: "hidden" }}>
            <ul className="evidence">
              {c.evidence.map((e, i) => (
                <li key={i}><span className={`m ${e.ok === true ? "ok" : e.ok === null ? "alt" : "no"}`}>{e.ok === true ? "✓" : e.ok === null ? "△" : "✕"}</span>{e.text}</li>
              ))}
            </ul>
            <div className="muted" style={{ fontSize: 11.5, marginTop: 8 }}>
              Score = 0.25 symptom match + 0.25 telemetry + 0.20 isolation + 0.15 history + 0.15 rule knowledge. Deterministic, no randomness.
            </div>
            <button className="explain-btn" style={{ marginTop: 8 }} onClick={() => openAssist("Why is AEGIS's confidence this high?")}>Ask ORACLE</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
