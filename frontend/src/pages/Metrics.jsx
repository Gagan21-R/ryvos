import { useEffect, useState } from "react";
import { CountUp } from "../components/common/motion.jsx";
import { SystemTabs } from "../components/common/ui.jsx";
import { ChartCard, ComponentBars, ImpactChart, RecoveryBars, ResilienceChart, ResilienceGauge, TimesChart } from "../components/metrics/Charts.jsx";
import { api } from "../services/api.js";
import { openAssist, useArena } from "../state/arenaStore.js";

export function useMetrics() {
  const version = useArena((s) => s.learn.results?.length);
  const [m, setM] = useState(null);
  useEffect(() => { api.metrics().then(setM).catch(() => {}); }, [version]);
  return m;
}

export default function Metrics() {
  const current = useArena((s) => s.live?.state?.domain);
  const meta = useArena((s) => s.meta);
  const [dom, setDom] = useState(current || "emergency");
  const all = useMetrics();
  const m = all?.[dom];
  const D = meta?.domains?.[dom];
  return (
    <div className="page">
      <div className="page-head">
        <div>
          <div className="eyebrow">Arena scoring · simulated</div>
          <h1 className="h-page">Metrics</h1>
          <p className="lede">Scored in human impact, not server uptime. Every number comes from scored rounds; times are simulated.</p>
        </div>
        <SystemTabs value={dom} onChange={setDom} />
      </div>
      {!m ? <div className="empty">Loading metrics.</div> : !m.rounds ? <div className="empty">No scored rounds yet for this system. Run an autonomous round.</div> : (
        <>
          <div className="grid" style={{ gridTemplateColumns: "minmax(0,1fr) minmax(0,1.15fr)" }}>
            <div className="card">
              <div className="card-title"><h3>Resilience score</h3><button className="explain-btn" onClick={() => openAssist("Why is the resilience score this?", "components")}>Explain</button></div>
              <div className="gauge-wrap">
                <ResilienceGauge value={m.resilience} prev={m.resilience_prev} />
                <ComponentBars components={m.components} />
              </div>
            </div>
            <div className="kpis">
              <div className="kpi"><span>MTTD</span><b><CountUp value={m.mttd} decimals={1} /><small> {m.unit}</small></b><small>first rounds: {m.mttd_first ?? "—"}</small></div>
              <div className="kpi"><span>MTTR</span><b><CountUp value={m.mttr} decimals={1} /><small> {m.unit}</small></b><small>first rounds: {m.mttr_first ?? "—"}</small></div>
              <div className="kpi"><span>Recovery success</span><b><CountUp value={m.recovery_success} />%</b><small>of detected incidents</small></div>
              <div className="kpi"><span>Experiments</span><b><CountUp value={m.experiments} /></b><small>{m.rounds} rounds</small></div>
              <div className="kpi"><span>Failure modes tested</span><b>{m.modes_tested} / {m.modes_total}</b><small>{m.untested.length ? `untested: ${m.untested.length}` : "full coverage"}</small></div>
              <div className="kpi"><span>Diagnosis accuracy</span><b><CountUp value={m.oracle_accuracy} decimals={1} />%</b><small>validated by ORACLE · AEGIS said {m.aegis_confidence ?? "—"}%</small></div>
            </div>
          </div>
          <div className="charts2" style={{ marginTop: 16 }}>
            <ChartCard title="Resilience over rounds" hint="Running score vs each round's score" chart="resilience"><ResilienceChart series={m.series} /></ChartCard>
            <ChartCard title="MTTD and MTTR per round" hint={`Simulated ${m.unit}`} chart="mttd_mttr" question="What is the difference between MTTD and MTTR?"><TimesChart series={m.series} unit={m.unit} /></ChartCard>
            <ChartCard title={`${m.headline_metric.label} per round`} hint="Orange points: AEGIS switched off · dashed line: a normal day" chart="impact"><ImpactChart series={m.series} metric={m.headline_metric} baseline={D?.baseline} /></ChartCard>
            <ChartCard title="Time incidents stayed open" hint="Green: from playbook · grey: investigated · orange: AEGIS off" chart="recovery"><RecoveryBars series={m.series} /></ChartCard>
          </div>
        </>
      )}
    </div>
  );
}
