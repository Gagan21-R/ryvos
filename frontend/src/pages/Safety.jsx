import { ShieldAlert } from "lucide-react";
import { motion } from "motion/react";
import OracleOrb from "../components/agents/OracleOrb.jsx";
import { api } from "../services/api.js";
import { act, useArena } from "../state/arenaStore.js";

export default function Safety() {
  const meta = useArena((s) => s.meta);
  const verdicts = useArena((s) => s.learn.verdicts) || [];
  const policy = meta?.policy;
  const list = [...verdicts].reverse();
  const blocked = verdicts.filter((v) => !v.approved).length;
  return (
    <div className="page">
      <div className="eyebrow">ORACLE safety controller</div>
      <h1 className="h-page">Safety</h1>
      <p className="lede" style={{ marginBottom: 18 }}>No experiment runs without ORACLE's approval. Everything is a reversible sandbox simulation that rolls back automatically at the end of each round.</p>
      <div className="grid" style={{ gridTemplateColumns: "minmax(0,1fr) minmax(0,1.4fr)" }}>
        <div className="card hard">
          <div className="row" style={{ justifyContent: "space-between" }}>
            <h3 style={{ fontFamily: "var(--display)", margin: 0 }}>Sandbox policy</h3>
            <OracleOrb size={64} mood="idle" />
          </div>
          {policy && (
            <dl className="kv" style={{ fontSize: 14 }}>
              <dt>Environment</dt><dd><span className="chip oracle">{policy.environment}</span></dd>
              <dt>Max severity</dt><dd>{policy.max_severity}</dd>
              <dt>Max blast radius</dt><dd>{policy.max_blast_radius} services</dd>
              <dt>Destructive</dt><dd>{policy.allow_destructive ? "allowed" : "never allowed"}</dd>
              <dt>Auto rollback</dt><dd>{policy.auto_rollback ? "ON (every round)" : "OFF"}</dd>
            </dl>
          )}
          <div className="row" style={{ marginTop: 14 }}>
            <button className="btn oracle" onClick={() => act("safety", () => api.safetyTest(), "🛡 ROGUE will ask for something destructive…", "oracle").then(() => { window.location.hash = "#/arena"; })}>
              <ShieldAlert size={16} /> Test safety controller
            </button>
          </div>
          <div className="row" style={{ marginTop: 14 }}>
            <span className="chip ok">{verdicts.length - blocked} approved</span><span className="chip bad">{blocked} blocked</span>
          </div>
        </div>
        <div className="card soft">
          <div className="card-title"><h3>Recent verdicts</h3></div>
          {!list.length && <div className="empty">No proposals yet.</div>}
          <div className="list">
            {list.slice(0, 14).map((v) => (
              <motion.div key={v.proposal_id} className="verdict-row" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                <span className={`chip ${v.approved ? "ok" : "bad"}`}>{v.approved ? "✓ APPROVED" : "✕ BLOCKED"}</span>
                <div>
                  <b>{v.attacks.map((a) => meta?.domains?.[v.domain]?.experiments?.[a]?.label || meta?.domains?.[v.domain]?.forbidden?.[a]?.label || a).join(" + ")}</b>
                  <div className="muted" style={{ fontSize: 12 }}>
                    round {v.round} · {v.domain} · blast {v.blast_radius} · {v.severity}
                    {!v.approved && <> · {v.reasons.join("; ")}{v.alternative ? ` · alternative: ${v.alternative.label}` : ""}</>}
                  </div>
                </div>
                {v.test && <span className="chip oracle">safety test</span>}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
