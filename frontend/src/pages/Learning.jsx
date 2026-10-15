import { useState } from "react";
import ProofPanel from "../components/common/ProofPanel.jsx";
import { AgentBadge, SystemTabs } from "../components/common/ui.jsx";
import { BeliefBars, ChartCard, ChoiceScatter } from "../components/metrics/Charts.jsx";
import { useArena } from "../state/arenaStore.js";
import { useMetrics } from "./Metrics.jsx";

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
  const cards = [
    ["rogue", "What ROGUE learned", report?.learning.rogue, `Tested ${metrics?.modes_tested ?? 0} of ${metrics?.modes_total ?? "—"} failure modes · bandit (ε = 0.15, α = 0.35)`],
    ["aegis", "What AEGIS learned", report?.learning.aegis, `${book.length} playbook lessons · recovery ${metrics?.recovery_playbook ?? "—"} vs ${metrics?.recovery_scratch ?? "—"} ticks from scratch`],
    ["oracle", "What ORACLE verified", report?.learning.oracle, report ? `Next experiment: ${report.next.label} (${report.next.why.toLowerCase()})` : "Next experiment: —"],
  ];
  return (
    <div className="page">
      <div className="page-head">
        <div>
          <div className="eyebrow">Learning across rounds</div>
          <h1 className="h-page">Learning</h1>
          <p className="lede">ROGUE learns where the system is weak. AEGIS learns how to fix it. ORACLE checks both, and the next experiment adapts.</p>
        </div>
        <SystemTabs value={dom} onChange={setDom} />
      </div>
      <div className="learn-cards">
        {cards.map(([agent, title, text, foot]) => (
          <div key={agent} className="learn-card">
            <div className="who"><AgentBadge agent={agent} /><b style={{ fontSize: 14, letterSpacing: 0 }}>{title}</b></div>
            <blockquote>{text || "Nothing yet."}</blockquote>
            <div className="muted" style={{ fontSize: 12.5, marginTop: "auto" }}>{foot}</div>
          </div>
        ))}
      </div>
      <div className="section-head"><div><h2>Proof it learns</h2><p>AEGIS's first 10 rounds against its latest 10, per system (simulated).</p></div></div>
      <ProofPanel />

      <div className="charts2" style={{ marginTop: 16 }}>
        <ChartCard title="ROGUE's current belief" hint="Learned expected damage per experiment (Q-value)" chart="rogue_belief"><BeliefBars q={brain.q} labels={D?.experiments} /></ChartCard>
        <ChartCard title="ROGUE's choices over time" hint="Larger point = more damage caused" chart="rogue_choices">{metrics ? <ChoiceScatter series={metrics.series} attacks={D?.experiments} /> : null}</ChartCard>
      </div>
      <div className="card flush" style={{ marginTop: 16 }}>
        <div className="card-title" style={{ padding: "16px 20px 0" }}><div><h3>AEGIS playbook</h3><div className="sub">Symptom signature → fix recipe that worked</div></div></div>
        {book.length ? (
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Symptom signature</th><th>Fix recipe</th><th className="n">Wins</th><th className="n">Avg recovery</th><th>Fixes that failed</th></tr></thead>
              <tbody>
                {book.map((e) => (
                  <tr key={e.symptom}>
                    <td><span className="chip mono">{e.symptom}</span></td>
                    <td><div className="row" style={{ gap: 4 }}>{e.fixes.map((f) => <span key={f} className="chip ok">{f}</span>)}</div></td>
                    <td className="n"><b>{e.successes}</b></td>
                    <td className="n">{e.avg_recovery_ticks ?? "—"} {D?.tick_unit}</td>
                    <td><div className="row" style={{ gap: 4 }}>{Object.entries(e.failed_fixes).map(([f, n]) => <span key={f} className="chip bad">{f} ×{n}</span>)}</div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <div className="empty" style={{ margin: 20 }}>AEGIS hasn't solved anything here yet.</div>}
      </div>
    </div>
  );
}
