import { useState } from "react";
import Bot from "../components/agents/Bot.jsx";
import OracleOrb from "../components/agents/OracleOrb.jsx";
import { BeliefBars, ChartCard, ChoiceScatter } from "../components/metrics/Charts.jsx";
import { useArena } from "../state/arenaStore.js";
import { useMetrics } from "./Metrics.jsx";

const DOMS = [["emergency", "🚑 108"], ["food", "🛵 Delivery"], ["upi", "💳 UPI"]];

export default function Learning() {
  const current = useArena((s) => s.live?.state?.domain);
  const learn = useArena((s) => s.learn);
  const meta = useArena((s) => s.meta);
  const [dom, setDom] = useState(current || "emergency");
  const metrics = useMetrics()?.[dom];
  const D = meta?.domains?.[dom];
  const report = [...(learn.reports || [])].reverse().find((r) => r.domain === dom);
  const book = Object.values(learn.playbook || {}).filter((e) => e.domain === dom).sort((a, b) => b.successes - a.successes);
  const brain = learn.brain?.[dom] || { q: {}, n: {} };
  return (
    <div className="page">
      <div className="eyebrow">Memory across rounds</div>
      <h1 className="h-page">Learning</h1>
      <div className="row" style={{ justifyContent: "space-between", marginBottom: 18 }}>
        <p className="lede">ROGUE learns where the system is weak. AEGIS learns how to fix it. ORACLE checks both, and the next experiment adapts.</p>
        <div className="tabs">{DOMS.map(([id, l]) => <button key={id} className={dom === id ? "on" : ""} onClick={() => setDom(id)}>{l}</button>)}</div>
      </div>
      <div className="learn-cards">
        <div className="learn-card rogue">
          <div className="row"><Bot kind="rogue" mood="thoughtful" size={64} /><div><div className="eyebrow">What ROGUE learned</div></div></div>
          <blockquote>“{report?.learning.rogue || "Nothing yet."}”</blockquote>
          <div className="muted" style={{ fontSize: 12.5 }}>Tested {metrics?.modes_tested ?? 0}/{metrics?.modes_total ?? "—"} failure modes · bandit (ε = 0.15, α = 0.35)</div>
        </div>
        <div className="learn-card aegis">
          <div className="row"><Bot kind="aegis" mood="thoughtful" size={64} /><div><div className="eyebrow">What AEGIS learned</div></div></div>
          <blockquote>“{report?.learning.aegis || "Nothing yet."}”</blockquote>
          <div className="muted" style={{ fontSize: 12.5 }}>{book.length} playbook lessons · recovery {metrics?.recovery_playbook ?? "—"} vs {metrics?.recovery_scratch ?? "—"} ticks from scratch</div>
        </div>
        <div className="learn-card oracle">
          <div className="row"><OracleOrb mood="idle" size={64} /><div><div className="eyebrow">What ORACLE verified</div></div></div>
          <blockquote>“{report?.learning.oracle || "Nothing yet."}”</blockquote>
          <div className="muted" style={{ fontSize: 12.5 }}><b>Next experiment:</b> {report?.next.label || "—"}{report ? ` · ${report.next.why.toLowerCase()}` : ""}</div>
        </div>
      </div>
      <div className="charts2" style={{ marginTop: 18 }}>
        <ChartCard title="ROGUE's current belief" hint="learned expected damage per experiment (Q-value)" chart="rogue_belief"><BeliefBars q={brain.q} labels={D?.experiments} /></ChartCard>
        <ChartCard title="ROGUE's choices over time" hint="bigger = more damage caused" chart="rogue_choices">{metrics ? <ChoiceScatter series={metrics.series} attacks={D?.experiments} /> : null}</ChartCard>
      </div>
      <div className="card soft" style={{ marginTop: 18 }}>
        <div className="card-title"><h3>AEGIS's playbook</h3><span className="chip aegis">symptom → fix recipe that worked</span></div>
        {book.length ? (
          <table className="table">
            <thead><tr><th>Symptom signature</th><th>Fix recipe</th><th>Wins</th><th>Avg recovery</th><th>Fixes that failed</th></tr></thead>
            <tbody>
              {book.map((e) => (
                <tr key={e.symptom}>
                  <td><span className="chip warn">{e.symptom}</span></td>
                  <td>{e.fixes.map((f) => <span key={f} className="chip ok" style={{ marginRight: 4 }}>{f}</span>)}</td>
                  <td><b>{e.successes}</b></td>
                  <td>{e.avg_recovery_ticks ?? "—"} {D?.tick_unit}</td>
                  <td>{Object.entries(e.failed_fixes).map(([f, n]) => <span key={f} className="chip bad" style={{ marginRight: 4, textDecoration: "line-through" }}>{f} ×{n}</span>)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <div className="empty">AEGIS hasn't solved anything here yet.</div>}
      </div>
    </div>
  );
}
