// Round panels: ROGUE's proposal, ORACLE's safety verdict, AEGIS's diagnosis and ORACLE's final verdict.
import { Check, CircleDot, X } from "lucide-react";
import ConfidenceMeter from "./ConfidenceMeter.jsx";

export function DecisionPanel({ proposal }) {
  if (!proposal) return <div className="panel"><h4>Experiment proposal</h4><div className="muted">ROGUE is observing the system.</div></div>;
  return (
    <div className="panel">
      <h4><span>Experiment proposal</span><span className="chip rogue">{proposal.mode}</span></h4>
      <div className="grid2">
        <span>Target</span><b>{proposal.target_service}</b>
        <span>Experiment</span><b>{proposal.experiments.map((e) => e.label).join(" + ")}</b>
        <span>Category</span><b>{proposal.experiments.map((e) => e.category).join(", ")}</b>
        <span>Severity</span><b style={{ textTransform: "capitalize" }}>{proposal.severity}</b>
        <span>Blast radius</span><b>{proposal.blast_radius} service{proposal.blast_radius > 1 ? "s" : ""}</b>
        <span>Expected impact</span><b>{proposal.expected_impact != null ? `${Math.round(proposal.expected_impact * 100)}% (learned)` : "Unknown (untested)"}</b>
      </div>
    </div>
  );
}

export function SafetyPanel({ verdict, pending }) {
  if (pending) return <div className="panel"><h4>Safety check</h4><div className="muted">Evaluating against the sandbox policy.</div></div>;
  if (!verdict) return <div className="panel"><h4>Safety check</h4><div className="muted">Every experiment is checked before it runs.</div></div>;
  return (
    <div className="panel">
      <h4><span>Safety check</span><span className="chip sim">sandbox</span></h4>
      <span className={`verdict ${verdict.approved ? "ok" : "bad"}`}>
        {verdict.approved ? <Check size={15} strokeWidth={2.4} /> : <X size={15} strokeWidth={2.4} />}{verdict.approved ? "Approved" : "Blocked"}
      </span>
      <ul className="checks">
        {verdict.checks.map((c) => (
          <li key={c.name}><span className={`mark ${c.ok ? "ok" : "bad"}`}>{c.ok ? <Check size={14} strokeWidth={2.4} /> : <X size={14} strokeWidth={2.4} />}</span><span><b>{c.name}</b>: {c.detail}</span></li>
        ))}
      </ul>
      {verdict.alternative && <div style={{ marginTop: 10 }} className="chip oracle">Safer alternative: {verdict.alternative.label}</div>}
    </div>
  );
}

export function DiagnosisPanel({ diagnosis, incidents, oracleAccuracy }) {
  const conf = diagnosis?.confidence;
  if (diagnosis) {
    return (
      <div className="panel">
        <h4><span>Diagnosis</span><span className="chip aegis">{diagnosis.source === "playbook" ? "From playbook" : "Investigated"}</span></h4>
        <div className="eyebrow">Root cause</div>
        <div style={{ fontWeight: 600, fontSize: 16, margin: "2px 0 12px" }}>{conf?.root_cause || diagnosis.root_cause}</div>
        <ConfidenceMeter confidence={conf} oracleAccuracy={oracleAccuracy} />
        <div className="row" style={{ marginTop: 12 }}>
          <span className="muted" style={{ fontSize: 12.5 }}>Recovery</span>
          {diagnosis.fixes.map((f) => <span key={f} className="chip ok">{f}</span>)}
        </div>
      </div>
    );
  }
  if (incidents?.length) {
    return (
      <div className="panel">
        <h4>Detection</h4>
        <div className="row">{incidents.map((i) => <span key={i.key} className="chip warn">{i.key}</span>)}</div>
        <div className="muted" style={{ marginTop: 10 }}>Investigating the dependency chain.</div>
      </div>
    );
  }
  return <div className="panel"><h4>Diagnosis</h4><div className="muted">No anomaly detected.</div></div>;
}

export function RecoveryPanel({ fixes, resolved }) {
  return (
    <div className="panel">
      <h4>Recovery</h4>
      {fixes.length ? (
        <ul className="checks" style={{ marginTop: 0 }}>
          {fixes.map((f, i) => <li key={i}><span className="mark ok"><Check size={14} strokeWidth={2.4} /></span><span><b>{f.action}</b> (whitelisted fix)</span></li>)}
          {resolved.map((r, i) => <li key={`r${i}`}><span className="mark fix"><CircleDot size={13} /></span><span>{r.symptom.replace(/_/g, " ")} cleared</span></li>)}
        </ul>
      ) : <div className="muted">Nothing to recover yet.</div>}
    </div>
  );
}

export function FinalVerdict({ result, meta }) {
  if (!result) return null;
  const D = meta?.domains?.[result.domain];
  const unit = D?.tick_unit === "min" ? "min" : "s";
  const conv = (s) => (s == null ? "—" : unit === "min" ? `${Math.round(s / 60)} min` : `${s} s`);
  const ok = result.verdict === "RECOVERED";
  const label = ok ? "Recovered" : result.verdict.charAt(0) + result.verdict.slice(1).toLowerCase();
  return (
    <div className="final-verdict">
      <div className="row" style={{ justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div className="eyebrow">Round {result.round} result</div>
          <div className="title">{result.attacks.map((a) => D?.experiments?.[a]?.label || a).join(" + ") || "No experiment"}</div>
        </div>
        <span className={`verdict ${ok ? "ok" : "bad"}`}>{ok ? <Check size={15} strokeWidth={2.4} /> : <X size={15} strokeWidth={2.4} />}{label}</span>
      </div>
      <div className="fv-grid">
        <div><span>Diagnosis</span><b>{result.oracle?.validated ? "Validated" : result.oracle?.accuracy == null ? "—" : "Partial"}</b></div>
        <div><span>Agent accuracy</span><b>{result.oracle?.accuracy ?? "—"}%</b></div>
        <div><span>MTTD (simulated)</span><b>{conv(result.mttd_sec)}</b></div>
        <div><span>MTTR (simulated)</span><b>{conv(result.mttr_sec)}</b></div>
        <div><span>Resilience</span><b>{result.resilience_prev ?? "—"} → {result.resilience}</b></div>
        <div><span>{D?.metrics?.[0]?.label || "Impact"}</span><b>{result[D?.metrics?.[0]?.key]}{D?.metrics?.[0]?.unit}</b></div>
        <div><span>Experiment damage</span><b>{Math.round(result.red_reward * 100)}%</b></div>
        <div><span>Next test</span><b style={{ fontSize: 14 }}>{result.next?.label}</b></div>
      </div>
    </div>
  );
}
