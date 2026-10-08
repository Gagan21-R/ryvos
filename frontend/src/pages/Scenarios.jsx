import { Lock, Play } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { api } from "../services/api.js";
import { act, useArena } from "../state/arenaStore.js";
import { startRound } from "./Arena.jsx";

const DOMS = [["emergency", "🚑 108"], ["food", "🛵 Delivery"], ["upi", "💳 UPI"]];
const SEV = { low: "ok", medium: "warn", high: "bad", critical: "bad" };

export default function Scenarios() {
  const [all, setAll] = useState(null);
  const [error, setError] = useState(null);
  const current = useArena((s) => s.live?.state?.domain);
  const [dom, setDom] = useState(current || "emergency");
  useEffect(() => { api.scenarios().then(setAll).catch((e) => setError(e.message)); }, []);
  const list = (all || []).filter((s) => s.domain === dom);
  return (
    <div className="page">
      <div className="eyebrow">Scenario library</div>
      <h1 className="h-page">Scenarios</h1>
      <div className="row" style={{ justifyContent: "space-between", marginBottom: 18 }}>
        <p className="lede">Every experiment ROGUE can run, what it breaks, and how AEGIS should recover. Destructive requests are listed too: ORACLE always blocks them.</p>
        <div className="tabs" role="tablist">{DOMS.map(([id, l]) => <button key={id} className={dom === id ? "on" : ""} onClick={() => setDom(id)} role="tab" aria-selected={dom === id}>{l}</button>)}</div>
      </div>
      {error && <div className="banner">Couldn't load scenarios: {error}</div>}
      {!all && !error && <div className="empty">Loading…</div>}
      <div className="scenario-grid">
        {list.map((s, i) => (
          <motion.div key={s.id} className={`scenario ${s.allowed ? "" : "blocked"}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
            <div className="row" style={{ justifyContent: "space-between" }}>
              <span className="eyebrow">{s.category}</span>
              <span className={`chip ${SEV[s.severity]}`}>{s.severity}</span>
            </div>
            <h4>{s.name}</h4>
            <div className="muted" style={{ fontSize: 12.5 }}><b>Normal:</b> {s.baseline}<br /><b>Failure:</b> {s.failureState}</div>
            <div className="row" style={{ gap: 6 }}>
              <span className="chip">blast radius {s.blastRadius}</span>
              {s.target.map((t) => <span key={t} className="chip">{t}</span>)}
            </div>
            {s.recoveryStrategy.length > 0 && <div className="row" style={{ gap: 6 }}><span className="muted" style={{ fontSize: 12, fontWeight: 600 }}>Recovery:</span>{s.recoveryStrategy.map((f) => <span key={f} className="chip ok">{f}</span>)}</div>}
            <div className="muted" style={{ fontSize: 11.5 }}>{[s.geography.city, s.geography.state, s.geography.country].filter(Boolean).join(" · ")} · simulated</div>
            <div style={{ marginTop: "auto" }}>
              {s.allowed ? (
                <button className="btn small primary" onClick={() => startRound(s.domain, { attacks: s.attacks }).then(() => { window.location.hash = "#/arena"; })}>
                  <Play size={14} /> Run this scenario
                </button>
              ) : (
                <div>
                  <div className="chip bad" style={{ whiteSpace: "normal" }}><Lock size={12} /> Blocked: {(s.blockedBecause || []).join("; ")}</div>
                  {s.alternative && <div className="chip oracle" style={{ marginTop: 6 }}>ORACLE suggests: {s.alternative.label}</div>}
                  <div><button className="btn small oracle" style={{ marginTop: 8 }} onClick={() => act("safety", () => api.safetyTest(s.domain), "🛡 ROGUE will ask for it, ORACLE will decide", "oracle").then(() => { window.location.hash = "#/arena"; })}>
                    Ask ORACLE anyway
                  </button></div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
