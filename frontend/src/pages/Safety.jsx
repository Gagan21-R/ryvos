import { Check, ShieldAlert, X } from "lucide-react";
import { AgentBadge } from "../components/common/ui.jsx";
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
      <div className="page-head">
        <div>
          <div className="eyebrow">Governance</div>
          <h1 className="h-page">Safety controller</h1>
          <p className="lede">No experiment runs without ORACLE's approval. Everything runs in a sandbox and is rolled back automatically at the end of each round.</p>
        </div>
      </div>
      <div className="grid" style={{ gridTemplateColumns: "minmax(0,1fr) minmax(0,1.5fr)" }}>
        <div className="card">
          <div className="card-title">
            <div className="row" style={{ gap: 12 }}><AgentBadge agent="oracle" /><h3>Sandbox policy</h3></div>
          </div>
          {policy && (
            <dl className="kv">
              <dt>Environment</dt><dd><span className="chip oracle">{policy.environment}</span></dd>
              <dt>Max severity</dt><dd style={{ textTransform: "capitalize" }}>{policy.max_severity}</dd>
              <dt>Max blast radius</dt><dd>{policy.max_blast_radius} services</dd>
              <dt>Destructive actions</dt><dd>{policy.allow_destructive ? "Allowed" : "Never allowed"}</dd>
              <dt>Auto rollback</dt><dd>{policy.auto_rollback ? "On, every round" : "Off"}</dd>
            </dl>
          )}
          <div className="row" style={{ marginTop: 18, paddingTop: 16, borderTop: "1px solid var(--line)" }}>
            <button className="btn primary" onClick={() => act("safety", () => api.safetyTest(), "Safety test requested: ROGUE will ask for something destructive").then(() => { window.location.hash = "#/arena"; })}>
              <ShieldAlert size={16} /> Test safety controller
            </button>
            <span className="chip ok">{verdicts.length - blocked} approved</span><span className="chip bad">{blocked} blocked</span>
          </div>
        </div>
        <div className="card flush">
          <div className="card-title" style={{ padding: "16px 16px 0" }}><h3>Recent verdicts</h3></div>
          {!list.length && <div className="empty" style={{ margin: 16 }}>No proposals yet.</div>}
          <div>
            {list.slice(0, 14).map((v) => (
              <div key={v.proposal_id} className="verdict-row">
                <span className={`verdict ${v.approved ? "ok" : "bad"}`}>{v.approved ? <Check size={14} strokeWidth={2.4} /> : <X size={14} strokeWidth={2.4} />}{v.approved ? "Approved" : "Blocked"}</span>
                <div>
                  <b style={{ fontWeight: 500 }}>{v.attacks.map((a) => meta?.domains?.[v.domain]?.experiments?.[a]?.label || meta?.domains?.[v.domain]?.forbidden?.[a]?.label || a).join(" + ")}</b>
                  <div className="muted" style={{ fontSize: 12.5 }}>
                    Round {v.round} · {v.domain} · blast radius {v.blast_radius} · {v.severity}
                    {!v.approved && <> · {v.reasons.join("; ")}{v.alternative ? ` · alternative: ${v.alternative.label}` : ""}</>}
                  </div>
                </div>
                {v.test && <span className="chip oracle">Safety test</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
