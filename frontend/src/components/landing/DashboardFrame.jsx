// Factory-style product window for the hero: traffic-light chrome, a mono title bar with a live status dot and
// metric tiles with sparklines drawn from real arena results and the real-data model.
import { palette } from "../../state/theme.js";
import { CountUp } from "../common/motion.jsx";

function Spark({ values, color }) {
  if (!values || values.length < 2) return <div className="h-10" />;
  const W = 160, H = 40, min = Math.min(...values), max = Math.max(...values);
  const d = values.map((v, i) => `${i ? "L" : "M"}${((i / (values.length - 1)) * W).toFixed(1)},${(H - 3 - ((v - min) / (max - min || 1)) * (H - 6)).toFixed(1)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="w-full h-10 block overflow-visible" aria-hidden="true">
      <path d={d} fill="none" stroke={color} strokeWidth="1" vectorEffect="non-scaling-stroke" pathLength="1"
        style={{ strokeDasharray: 1, animation: "drawLine 1.6s cubic-bezier(0.16,1,0.3,1) both" }} />
    </svg>
  );
}

function Tile({ label, value, decimals = 0, unit, note, values, color }) {
  return (
    <div className="p-5 border-b border-r border-carbon">
      <div className="font-mono text-[12px] uppercase tracking-caption text-stone">{label}</div>
      <div className="mt-2 text-[36px] leading-[1.1] tracking-heading text-bone tabular-nums">
        <CountUp value={value} decimals={decimals} /><span className="text-[14px] text-granite ml-1 tracking-normal">{unit}</span>
      </div>
      <div className="mt-1 text-[12px] text-granite truncate">{note}</div>
      <div className="mt-3"><Spark values={values} color={color} /></div>
    </div>
  );
}

export default function DashboardFrame({ system, round, phase, results, model }) {
  const P = palette();
  const last = results.slice(-40);
  const latest = last[last.length - 1];
  const unitMin = latest && latest.mttr_sec != null && latest.domain !== "upi";
  const mttr = (r) => (r.mttr_sec == null ? null : unitMin ? r.mttr_sec / 60 : r.mttr_sec);
  const mttrs = last.map(mttr).filter((v) => v != null);
  return (
    <div className="rounded-card border border-carbon bg-surface overflow-hidden" style={{ animation: "frameIn 1.2s cubic-bezier(0.16,1,0.3,1) 0.5s both" }}>
      <div className="flex items-center gap-3 px-4 h-10 border-b border-carbon">
        <span className="flex gap-1.5" aria-hidden="true">
          <i className="w-2.5 h-2.5 rounded-full bg-ash block" /><i className="w-2.5 h-2.5 rounded-full bg-ash block" /><i className="w-2.5 h-2.5 rounded-full bg-ash block" />
        </span>
        <span className="font-mono text-[12px] uppercase tracking-caption text-stone flex-1 truncate">ryvo / live arena / {system || "connecting"}</span>
        <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-caption text-granite">
          <span className="status-dot live" />{phase || "—"} · #{round ?? "—"}
        </span>
      </div>
      <div className="grid grid-cols-2 -mr-px -mb-px">
        <Tile label="Resilience" value={latest?.resilience} unit="/100" note={`${system || "—"} · running score`} values={last.map((r) => r.resilience)} color={P.ok} />
        <Tile label="MTTR" value={mttrs[mttrs.length - 1]} decimals={unitMin ? 0 : 0} unit={unitMin ? "min" : "s"} note="time incidents stayed open (sim)" values={mttrs} color={P.bad} />
        <Tile label="Real-data F1" value={model?.test?.trained?.f1} decimals={1} note={model ? `untrained rule: ${model.test.untrained.f1}` : "loading"} values={null} color={P.ok} />
        <Tile label="Failure damage" value={latest ? Math.round(latest.red_reward * 100) : null} unit="%" note="ROGUE's last experiment" values={last.map((r) => r.red_reward * 100)} color={P.bad} />
      </div>
    </div>
  );
}
