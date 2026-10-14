import { Lock, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { SystemTabs } from "../components/common/ui.jsx";
import { api } from "../services/api.js";
import { act, useArena } from "../state/arenaStore.js";
import { startRound } from "./Arena.jsx";

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
      <div className="page-head">
        <div>
          <div className="eyebrow">Scenario library</div>
          <h1 className="h-page">Scenarios</h1>
          <p className="lede">Every experiment ROGUE can run, what it breaks and how AEGIS should recover. Destructive requests are listed too: ORACLE always blocks them.</p>
        </div>
        <SystemTabs value={dom} onChange={setDom} />
      </div>
      {error && <div className="banner">Couldn't load scenarios: {error}</div>}
      {!all && !error && <div className="empty">Loading.</div>}
      <div className="scenario-grid">
        {list.map((s) => (
          <div key={s.id} className={`scenario ${s.allowed ? "" : "blocked"}`}>
            <div className="row" style={{ justifyContent: "space-between" }}>
              <span className="eyebrow">{s.category}</span>
              <span className={`chip ${SEV[s.severity]}`} style={{ textTransform: "capitalize" }}>{s.severity}</span>
            </div>
            <h4>{s.name}</h4>
            <dl className="kv" style={{ fontSize: 13 }}>
              <dt>Normal</dt><dd style={{ fontWeight: 400 }}>{s.baseline}</dd>
              <dt>Failure</dt><dd style={{ fontWeight: 400 }}>{s.failureState}</dd>
            </dl>
            <div className="row" style={{ gap: 6 }}>
              <span className="chip">Blast radius {s.blastRadius}</span>
              {s.target.map((t) => <span key={t} className="chip mono">{t}</span>)}
            </div>
            {s.recoveryStrategy.length > 0 && <div className="row" style={{ gap: 6 }}><span className="muted" style={{ fontSize: 12.5 }}>Recovery</span>{s.recoveryStrategy.map((f) => <span key={f} className="chip ok">{f}</span>)}</div>}
            <div className="muted" style={{ fontSize: 12 }}>{[s.geography.city, s.geography.state, s.geography.country].filter(Boolean).join(" · ")} · simulated</div>
            <div style={{ marginTop: "auto", paddingTop: 4 }}>
              {s.allowed ? (
                <button className="btn small primary" onClick={() => startRound(s.domain, { attacks: s.attacks }).then(() => { window.location.hash = "#/arena"; })}>
                  <Play size={14} /> Run this scenario
                </button>
              ) : (
                <div className="grid" style={{ gap: 8 }}>
                  <div className="chip bad" style={{ whiteSpace: "normal" }}><Lock size={12} /> Blocked: {(s.blockedBecause || []).join("; ")}</div>
                  {s.alternative && <div className="chip oracle" style={{ whiteSpace: "normal" }}>ORACLE suggests: {s.alternative.label}</div>}
                  <div><button className="btn small" onClick={() => act("safety", () => api.safetyTest(s.domain), "Safety test requested: ORACLE will decide").then(() => { window.location.hash = "#/arena"; })}>
                    Ask ORACLE anyway
                  </button></div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
