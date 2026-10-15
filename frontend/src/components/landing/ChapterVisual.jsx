// The image for each chapter in the dark section: a line drawing of real project data, white on black.
import { palette } from "../../state/theme.js";

const W = 440, H = 300, PAD = 28;
const mono = { fontFamily: "Geist Mono", letterSpacing: -0.2 };

function path(values, x0 = PAD, x1 = W - PAD, y0 = 70, y1 = H - 60) {
  if (values.length < 2) return "";
  const min = Math.min(...values), max = Math.max(...values), span = max - min || 1;
  return values.map((v, i) => `${i ? "L" : "M"}${(x0 + (i / (values.length - 1)) * (x1 - x0)).toFixed(1)},${(y1 - ((v - min) / span) * (y1 - y0)).toFixed(1)}`).join(" ");
}

function endY(values, y0 = 70, y1 = H - 60) {
  const min = Math.min(...values), max = Math.max(...values);
  return y1 - ((values[values.length - 1] - min) / (max - min || 1)) * (y1 - y0);
}

function Frame({ kicker, big, unit, foot, children }) {
  const P = palette();
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" role="img" aria-label={`${kicker}: ${big}${unit || ""}`}>
      <text x={PAD} y={34} fill={P.ink} fillOpacity=".55" fontSize="10" style={mono}>{kicker.toUpperCase()}</text>
      <text x={W - PAD} y={44} fill={P.ink} fontFamily="Geist" fontSize="40" fontWeight="400" letterSpacing="-1.6" textAnchor="end">
        {big}<tspan fontSize="16" fillOpacity=".6" dx="4">{unit}</tspan>
      </text>
      {children}
      <line x1={PAD} x2={W - PAD} y1={H - 36} y2={H - 36} stroke={P.ink} strokeOpacity=".2" />
      <text x={PAD} y={H - 14} fill={P.ink} fillOpacity=".6" fontSize="10" style={mono}>{foot.toUpperCase()}</text>
    </svg>
  );
}

export function SystemVisual({ name, results, proof }) {
  const P = palette();
  const series = results.map((r) => r.resilience).slice(-80);
  const scores = results.map((r) => r.round_score ?? r.resilience).slice(-80);
  const last = series[series.length - 1];
  const foot = proof?.ready
    ? `Recovery ${proof.early.recover} → ${proof.now.recover} ${proof.unit} · first vs last 10 rounds`
    : `${results.length} scored rounds`;
  return (
    <Frame kicker={`${name} · resilience`} big={last ?? "—"} unit="/100" foot={foot}>
      <path d={path(scores)} fill="none" stroke={P.ink} strokeOpacity=".25" strokeWidth="1" />
      <path d={path(series)} fill="none" stroke={P.ok} strokeWidth="1.6" pathLength="1" style={{ strokeDasharray: 1, animation: "drawLine 1.4s cubic-bezier(0.16,1,0.3,1) both" }} />
      {series.length > 1 && <circle cx={W - PAD} cy={endY(series)} r="4" fill={P.ok} />}
    </Frame>
  );
}

export function RealDataVisual({ series, model }) {
  const P = palette();
  if (!series) return <Frame kicker="Real AWS latency" big="—" foot="Loading real data" />;
  const pts = series.points;
  const vals = pts.map((p) => p.v);
  const iMax = pts[pts.length - 1].i;
  const x = (i) => PAD + (i / iMax) * (W - 2 * PAD);
  const min = Math.min(...vals), max = Math.max(...vals);
  const y = (v) => H - 60 - ((v - min) / (max - min || 1)) * (H - 130);
  return (
    <Frame kicker="Real AWS latency · labelled failures" big={model?.test?.trained?.f1 ?? "—"} unit=" F1"
      foot={`${series.evaluation.detected} of ${series.evaluation.incidents} incidents caught · ${series.evaluation.false_alarms} false alarms`}>
      {series.windows.map((w) => <rect key={w.i} x={x(w.i)} y={70} width={Math.max(2, x(w.j) - x(w.i))} height={H - 130} fill={w.detected ? P.ok : P.bad} fillOpacity={0.16} />)}
      <path d={pts.map((p, k) => `${k ? "L" : "M"}${x(p.i).toFixed(1)},${y(p.v).toFixed(1)}`).join(" ")} fill="none" stroke={P.ink} strokeWidth="1" />
      {series.alerts.map((a) => <circle key={a.i} cx={x(a.i)} cy={y(a.v)} r="5" fill={P.bg} stroke={P.ok} strokeWidth="1.8" />)}
    </Frame>
  );
}

export function SafetyVisual({ verdicts }) {
  const P = palette();
  const recent = verdicts.slice(-48);
  const blocked = verdicts.filter((v) => !v.approved).length;
  const bw = (W - 2 * PAD) / Math.max(24, recent.length);
  return (
    <Frame kicker="ORACLE verdicts · latest experiments" big={verdicts.length - blocked} unit={` approved · ${blocked} blocked`} foot="Blast radius ≤ 3 · severity ≤ high · always reversible">
      {recent.map((v, i) => (
        <rect key={v.proposal_id || i} x={PAD + i * bw} y={v.approved ? 110 : 150} width={Math.max(2, bw - 3)} height={v.approved ? 120 : 80}
          fill={v.approved ? P.ok : "none"} fillOpacity={v.approved ? 0.75 : 0} stroke={v.approved ? P.ok : P.bad} strokeWidth="1" />
      ))}
    </Frame>
  );
}
