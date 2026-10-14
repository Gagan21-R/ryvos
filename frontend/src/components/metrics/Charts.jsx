// Charts (Recharts) + the resilience gauge. Every chart card has an "Explain" button wired to ORACLE ASSIST.
import { MessageSquare } from "lucide-react";
import {
  Bar, BarChart, CartesianGrid, Cell, Line, LineChart, ReferenceLine, ResponsiveContainer, Scatter, ScatterChart,
  Tooltip, XAxis, YAxis, ZAxis,
} from "recharts";
import { openAssist } from "../../state/arenaStore.js";

export const C = { ink: "#1c1836", accent: "#4b2bb3", accentLight: "#a796e3", aegis: "#1f5fc4", rogue: "#b4490f", ok: "#17784b",
  warn: "#9a5b06", bad: "#b3261e", muted: "#6c6981", grid: "#ecebf0", line: "#cbc8d6" };
const INK = C.ink, GRID = C.grid, MUTED = C.muted;
export const axis = { stroke: MUTED, fontSize: 11.5, tickLine: false, axisLine: { stroke: C.line } };
export const tip = { contentStyle: { background: "#fff", border: `1px solid ${C.line}`, borderRadius: 4, color: INK, fontSize: 12.5, boxShadow: "0 4px 14px rgba(28,24,54,.12)" },
  itemStyle: { color: INK }, labelStyle: { color: MUTED } };

export function ChartCard({ title, hint, chart, question, children, height = 250 }) {
  return (
    <div className="card">
      <div className="card-title">
        <div><h3>{title}</h3>{hint && <div className="sub">{hint}</div>}</div>
        <button className="explain-btn" onClick={() => openAssist(question || "Explain this graph", chart)} aria-label={`Explain the ${title} graph`}>
          <MessageSquare size={13} /> Explain
        </button>
      </div>
      <div className="chart-box" style={{ height }}>{children}</div>
    </div>
  );
}

export function ResilienceGauge({ value, prev, size = 170 }) {
  const r = 70, c = 2 * Math.PI * r, v = value ?? 0;
  const color = v >= 80 ? C.ok : v >= 60 ? C.warn : C.bad;
  return (
    <svg width={size} height={size} viewBox="0 0 180 180" role="img" aria-label={`Resilience score ${value ?? "unknown"} out of 100`}>
      <circle cx="90" cy="90" r={r} fill="none" stroke={C.grid} strokeWidth="12" />
      <circle cx="90" cy="90" r={r} fill="none" stroke={color} strokeWidth="12" transform="rotate(-90 90 90)"
        strokeDasharray={c} strokeDashoffset={c * (1 - v / 100)} />
      <text x="90" y="98" textAnchor="middle" fontFamily="IBM Plex Sans" fontWeight="600" fontSize="44" fill={INK}>{value ?? "—"}</text>
      <text x="90" y="122" textAnchor="middle" fontFamily="IBM Plex Sans" fontSize="12.5" fill={MUTED}>of 100{prev != null ? ` · was ${prev}` : ""}</text>
    </svg>
  );
}

export function ComponentBars({ components }) {
  if (!components) return null;
  return (
    <div className="comp-bars">
      {Object.entries(components).map(([k, v]) => (
        <div className="cb" key={k}>
          <span style={{ textTransform: "capitalize" }}>{k}</span>
          <div className="track"><i style={{ width: `${v}%` }} /></div>
          <b className="num" style={{ fontWeight: 500, textAlign: "right" }}>{v}</b>
        </div>
      ))}
    </div>
  );
}

export function ResilienceChart({ series }) {
  return (
    <ResponsiveContainer>
      <LineChart data={series} margin={{ top: 8, right: 12, left: -18, bottom: 0 }}>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis dataKey="domain_round" {...axis} />
        <YAxis domain={[0, 100]} {...axis} />
        <Tooltip {...tip} />
        <Line dataKey="round_score" name="Round score" stroke={C.accentLight} strokeWidth={1.2} dot={false} isAnimationActive={false} />
        <Line dataKey="resilience" name="Resilience" stroke={C.accent} strokeWidth={2.2} dot={false} isAnimationActive={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function TimesChart({ series, unit }) {
  return (
    <ResponsiveContainer>
      <LineChart data={series} margin={{ top: 8, right: 12, left: -18, bottom: 0 }}>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis dataKey="domain_round" {...axis} />
        <YAxis {...axis} unit={unit === "min" ? "m" : "s"} />
        <Tooltip {...tip} />
        <Line dataKey="mttd" name={`MTTD (${unit}, simulated)`} stroke={C.rogue} strokeWidth={1.8} dot={false} connectNulls isAnimationActive={false} />
        <Line dataKey="mttr" name={`MTTR (${unit}, simulated)`} stroke={C.aegis} strokeWidth={1.8} dot={false} connectNulls isAnimationActive={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function ImpactChart({ series, metric, baseline }) {
  return (
    <ResponsiveContainer>
      <LineChart data={series} margin={{ top: 8, right: 12, left: -18, bottom: 0 }}>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis dataKey="domain_round" {...axis} />
        <YAxis {...axis} />
        <Tooltip {...tip} />
        {baseline != null && <ReferenceLine y={baseline} stroke={MUTED} strokeDasharray="6 6" label={{ value: "normal day", fill: MUTED, fontSize: 11, position: "insideTopLeft" }} />}
        <Line dataKey="headline" name={metric?.label} stroke={INK} strokeWidth={1.6} isAnimationActive={false}
          dot={(p) => <circle key={p.index} cx={p.cx} cy={p.cy} r={p.payload.blue ? 1.8 : 4.5} fill={p.payload.blue ? INK : C.bad} />} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function RecoveryBars({ series }) {
  return (
    <ResponsiveContainer>
      <BarChart data={series} margin={{ top: 8, right: 12, left: -18, bottom: 0 }}>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis dataKey="domain_round" {...axis} />
        <YAxis {...axis} />
        <Tooltip {...tip} />
        <Bar dataKey="mttr" name="Time incidents stayed open" isAnimationActive={false}>
          {series.map((s, i) => <Cell key={i} fill={!s.blue ? C.bad : s.playbook ? C.aegis : C.line} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function BeliefBars({ q, labels }) {
  const data = Object.entries(q || {}).map(([k, v]) => ({ name: labels?.[k]?.label || k, value: Math.round(v * 100) })).sort((a, b) => b.value - a.value);
  return (
    <ResponsiveContainer>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 24, left: 20, bottom: 0 }}>
        <XAxis type="number" domain={[0, 100]} {...axis} unit="%" />
        <YAxis type="category" dataKey="name" width={170} {...axis} />
        <Tooltip {...tip} />
        <Bar dataKey="value" name="Expected damage" isAnimationActive={false}>
          {data.map((d, i) => <Cell key={i} fill={C.rogue} fillOpacity={0.35 + d.value / 150} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function ChoiceScatter({ series, attacks }) {
  const cats = Object.keys(attacks || {});
  const data = series.filter((s) => s.attacks.length).map((s) => ({ x: s.domain_round, y: Math.max(0, cats.indexOf(s.attacks[0])), z: 20 + (s.reward || 0) * 300, reward: s.reward }));
  return (
    <ResponsiveContainer>
      <ScatterChart margin={{ top: 8, right: 12, left: 40, bottom: 0 }}>
        <CartesianGrid stroke={GRID} />
        <XAxis type="number" dataKey="x" name="Round" {...axis} />
        <YAxis type="number" dataKey="y" domain={[-0.5, cats.length - 0.5]} ticks={cats.map((_, i) => i)} tickFormatter={(i) => (attacks?.[cats[i]]?.label || "").split(" ").slice(0, 2).join(" ")} width={110} {...axis} />
        <ZAxis dataKey="z" range={[30, 320]} />
        <Tooltip {...tip} formatter={(v, n, p) => (n === "y" ? attacks?.[cats[v]]?.label : v)} />
        <Scatter data={data} fill={C.rogue} fillOpacity={0.45} stroke={C.rogue} isAnimationActive={false} />
      </ScatterChart>
    </ResponsiveContainer>
  );
}
