// The story panels that appear as the round unfolds: ROGUE's decision, ORACLE's safety verdict,
// AEGIS's diagnosis, and ORACLE's final verdict.
import { AnimatePresence, motion } from "motion/react";
import ConfidenceMeter from "./ConfidenceMeter.jsx";

const pop = { initial: { opacity: 0, y: 14, scale: 0.97 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: -8 },
  transition: { type: "spring", stiffness: 240, damping: 22 } };

export function DecisionPanel({ proposal, meta }) {
  return (
    <AnimatePresence mode="wait">
      {proposal ? (
        <motion.div key={proposal.id} className="panel" {...pop} style={{ borderColor: "var(--rogue)" }}>
          <h4><span>ROGUE · experiment proposal</span><span className="chip rogue">{proposal.mode}</span></h4>
          <div className="grid2">
            <span>Target</span><b>{proposal.target_service}</b>
            <span>Experiment</span><b>{proposal.experiments.map((e) => e.label).join(" + ")}</b>
            <span>Category</span><b>{proposal.experiments.map((e) => e.category).join(", ")}</b>
            <span>Severity</span><b style={{ textTransform: "capitalize" }}>{proposal.severity}</b>
            <span>Blast radius</span><b>{proposal.blast_radius} service{proposal.blast_radius > 1 ? "s" : ""}</b>
            <span>Expected impact</span><b>{proposal.expected_impact != null ? `${Math.round(proposal.expected_impact * 100)}% (learned)` : "unknown: untested"}</b>
          </div>
        </motion.div>
      ) : (
        <motion.div key="none" className="panel" {...pop}><h4>ROGUE · experiment proposal</h4><div className="muted">ROGUE is observing the system…</div></motion.div>
      )}
    </AnimatePresence>
  );
}

export function SafetyPanel({ verdict, pending }) {
  return (
    <AnimatePresence mode="wait">
      {pending ? (
        <motion.div key="pending" className="panel" {...pop} style={{ borderColor: "var(--oracle)" }}>
          <h4>ORACLE · safety check</h4>
          <div className="row"><span className="typing"><i /><i /><i /></span><b>Evaluating against sandbox policy…</b></div>
        </motion.div>
      ) : verdict ? (
        <motion.div key={verdict.proposal_id} className="panel" {...pop} style={{ borderColor: "var(--oracle)" }}>
          <h4><span>ORACLE · safety check</span><span className="chip sim">sandbox</span></h4>
          <motion.div className={`verdict-stamp ${verdict.approved ? "ok" : "bad"}`} initial={{ scale: 2, opacity: 0, rotate: -12 }}
            animate={{ scale: 1, opacity: 1, rotate: -3 }} transition={{ type: "spring", stiffness: 300, damping: 15 }}>
            {verdict.approved ? "✓ APPROVED" : "✕ BLOCKED"}
          </motion.div>
          <ul className="checks">
            {verdict.checks.map((c) => (
              <li key={c.name}><span className="mark" style={{ color: c.ok ? "var(--ok)" : "var(--bad)" }}>{c.ok ? "✓" : "✕"}</span><span><b>{c.name}</b> · {c.detail}</span></li>
            ))}
          </ul>
          {verdict.alternative && <div style={{ marginTop: 8 }} className="chip oracle">Safer alternative: {verdict.alternative.label}</div>}
        </motion.div>
      ) : (
        <motion.div key="idle" className="panel" {...pop}><h4>ORACLE · safety check</h4><div className="muted">Every experiment is validated before it runs.</div></motion.div>
      )}
    </AnimatePresence>
  );
}

export function DiagnosisPanel({ diagnosis, incidents, oracleAccuracy }) {
  const conf = diagnosis?.confidence;
  return (
    <AnimatePresence mode="wait">
      {diagnosis ? (
        <motion.div key={`${diagnosis.round}-${diagnosis.key}-${diagnosis.t}`} className="panel" {...pop} style={{ borderColor: "var(--aegis)" }}>
          <h4><span>AEGIS · diagnosis</span><span className="chip aegis">{diagnosis.source === "playbook" ? "from playbook" : "investigated"}</span></h4>
          <div className="eyebrow">Root cause</div>
          <div style={{ fontFamily: "var(--display)", fontWeight: 700, fontSize: 19, letterSpacing: "-.02em", margin: "2px 0 10px" }}>{conf?.root_cause || diagnosis.root_cause}</div>
          <ConfidenceMeter confidence={conf} oracleAccuracy={oracleAccuracy} />
          <div className="row" style={{ marginTop: 10 }}>
            <span className="muted" style={{ fontSize: 12, fontWeight: 600 }}>Recovery:</span>
            {diagnosis.fixes.map((f) => <span key={f} className="chip ok">✓ {f}</span>)}
          </div>
        </motion.div>
      ) : incidents?.length ? (
        <motion.div key="inv" className="panel" {...pop} style={{ borderColor: "var(--aegis)" }}>
          <h4>AEGIS · detection</h4>
          {incidents.map((i) => <div key={i.key} className="chip warn" style={{ marginRight: 6 }}>⚠ {i.key}</div>)}
          <div className="muted" style={{ marginTop: 8 }}>Investigating the dependency chain…</div>
        </motion.div>
      ) : (
        <motion.div key="calm" className="panel" {...pop}><h4>AEGIS · diagnosis</h4><div className="muted">No anomaly detected.</div></motion.div>
      )}
    </AnimatePresence>
  );
}

export function FinalVerdict({ result, meta }) {
  if (!result) return null;
  const D = meta?.domains?.[result.domain];
  const unit = D?.tick_unit === "min" ? "min" : "s";
  const conv = (s) => (s == null ? "—" : unit === "min" ? `${Math.round(s / 60)} min` : `${s} s`);
  const ok = result.verdict === "RECOVERED";
  return (
    <motion.div className="final-verdict" {...pop} key={result.round}>
      <div className="row" style={{ justifyContent: "space-between" }}>
        <div>
          <div className="eyebrow">ORACLE verdict · round {result.round}</div>
          <div style={{ fontFamily: "var(--display)", fontWeight: 700, fontSize: 24, letterSpacing: "-.03em" }}>
            {result.attacks.map((a) => D?.experiments?.[a]?.label || a).join(" + ") || "No experiment"}
          </div>
        </div>
        <span className={`verdict-stamp ${ok ? "ok" : "bad"}`}>{ok ? "✓" : "!"} {result.verdict}</span>
      </div>
      <div className="fv-grid">
        <div><span>Diagnosis</span><b>{result.oracle?.validated ? "Validated" : result.oracle?.accuracy == null ? "—" : "Partial"}</b></div>
        <div><span>Agent accuracy</span><b>{result.oracle?.accuracy ?? "—"}%</b></div>
        <div><span>MTTD (sim)</span><b>{conv(result.mttd_sec)}</b></div>
        <div><span>MTTR (sim)</span><b>{conv(result.mttr_sec)}</b></div>
        <div><span>Resilience</span><b>{result.resilience_prev ?? "—"} → {result.resilience}</b></div>
        <div><span>{D?.metrics?.[0]?.label || "Impact"}</span><b>{result[D?.metrics?.[0]?.key]}{D?.metrics?.[0]?.unit}</b></div>
        <div><span>ROGUE damage</span><b>{Math.round(result.red_reward * 100)}%</b></div>
        <div><span>Next test</span><b style={{ fontSize: 15 }}>{result.next?.label}</b></div>
      </div>
    </motion.div>
  );
}
