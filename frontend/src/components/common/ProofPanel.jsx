// Proof it learns: AEGIS in its first rounds vs its latest rounds, per system (from /api/proof, simulated data).
import { useEffect, useState } from "react";
import { api } from "../../services/api.js";

const SYSTEMS = [["emergency", "🚑", "108 Emergency"], ["food", "🛵", "Free Delivery"], ["upi", "💳", "UPI Payments"]];
const inr = (v) => `₹${Math.round(v).toLocaleString("en-IN")}`;

function impact(id, p) {
  const saved = Math.max(0, p.early.recover - p.now.recover);
  if (id === "emergency") return `Each incident now disrupts ambulance dispatch ~${saved.toFixed(0)} ${p.unit} less.`;
  if (id === "food") return `Riders and deliveries are back on track ~${saved.toFixed(0)} ${p.unit} sooner per incident.`;
  return `Money stuck per round ${inr(p.early.stuck_money_inr)} → ${inr(p.now.stuck_money_inr)} · double debits ${p.early.double_debits} → ${p.now.double_debits}.`;
}

function Row({ label, early, now, unit = "", lowerIsBetter = true }) {
  const better = lowerIsBetter ? now < early : now > early;
  const pct = early ? Math.round((Math.abs(early - now) / early) * 100) : 0;
  return (
    <div className="proof-row">
      <span className="muted">{label}</span>
      <span className="proof-val">{early}{unit} <span className="muted">→</span> <b>{now}{unit}</b></span>
      <span className={`proof-pct ${better ? "up" : ""}`}>{pct && better ? `${lowerIsBetter ? "−" : "+"}${pct}%` : "—"}</span>
    </div>
  );
}

export default function ProofPanel() {
  const [proof, setProof] = useState(null);
  useEffect(() => {
    let alive = true;
    const load = () => api.proof().then((p) => alive && setProof(p)).catch(() => {});
    load();
    const t = setInterval(load, 30000);
    return () => { alive = false; clearInterval(t); };
  }, []);
  if (!proof) return null;
  return (
    <div className="stat-strip">
      {SYSTEMS.map(([id, ic, name]) => {
        const p = proof[id];
        if (!p?.ready) {
          return (
            <div className="card hard" key={id}>
              <div className="eyebrow">{ic} {name}</div>
              <p className="muted" style={{ fontWeight: 600 }}>Needs 20 defended rounds ({p?.rounds ?? 0} so far).</p>
            </div>
          );
        }
        const harder = p.now.rogue > p.early.rogue;
        return (
          <div className="card hard" key={id}>
            <div className="eyebrow">{ic} {name} · {p.rounds} rounds</div>
            <div className="proof-head muted">First {p.window} rounds → last {p.window}</div>
            <Row label="Detection" early={p.early.detect} now={p.now.detect} unit={` ${p.unit}`} />
            <Row label="Recovery" early={p.early.recover} now={p.now.recover} unit={` ${p.unit}`} />
            <Row label="Fixes / round" early={p.early.fixes} now={p.now.fixes} />
            <Row label="Playbook reuse" early={p.early.playbook} now={p.now.playbook} lowerIsBetter={false} />
            <p className="proof-impact">{impact(id, p)}</p>
            <p className="muted proof-note">{harder ? "…while ROGUE kept picking harder failures." : "ROGUE is running out of easy wins."}</p>
          </div>
        );
      })}
    </div>
  );
}
