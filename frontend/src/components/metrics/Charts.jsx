// Charts (Recharts) + the resilience gauge. Every chart card has an "Explain" button wired to ORACLE ASSIST.
import { Sparkles } from "lucide-react";
import { motion } from "motion/react";
import {
  Bar, BarChart, CartesianGrid, Cell, Line, LineChart, ReferenceLine, ResponsiveContainer, Scatter, ScatterChart,
  Tooltip, XAxis, YAxis, ZAxis,
} from "recharts";
import { openAssist } from "../../state/arenaStore.js";

const INK = "#0e0e10", GRID = "rgba(14,14,16,.08)", MUTED = "#77746c";
const axis = { stroke: MUTED, fontSize: 11, tickLine: false, axisLine: { stroke: "rgba(14,14,16,.25)" } };
const tip = { contentStyle: { background: INK, border: 0, borderRadius: 10, color: "#f3efe6", fontSize: 12 }, itemStyle: { color: "#f3efe6" }, labelStyle: { color: "#b8b3a6" } };

export function ChartCard({ title, hint, chart, question, children, height = 250 }) {
  return (
    <div className="card soft">
      <div className="card-title">
        <div><h3>{title}</h3>{hint && <div className="muted" style={{ fontSize: 12, fontWeight: 600 }}>{hint}</div>}</div>
        <button className="explain-btn" onClick={() => openAssist(question || "Explain this graph", chart)} aria-label={`Explain the ${title} graph`}>
          <Sparkles size={13} /> Explain
        </button>
      </div>
      <div className="chart-box" style={{ height }}>{children}</div>
    </div>
  );
}

export function ResilienceGauge({ value, prev, size = 170 }) {
  const r = 70, c = 2 * Math.PI * r, v = value ?? 0;
  const color = v >= 80 ? "#0f9d58" : v >= 60 ? "#e8920c" : "#e5194f";
  return (
    <svg width={size} height={size} viewBox="0 0 180 180" role="img" aria-label={`Resilience score ${value ?? "unknown"} out of 100`}>
      <circle cx="90" cy="90" r={r} fill="none" stroke="#e9e3d6" strokeWidth="16" />
      <motion.circle cx="90" cy="90" r={r} fill="none" stroke={color} strokeWidth="16" strokeLinecap="round" transform="rotate(-90 90 90)"
        strokeDasharray={c} initial={{ strokeDashoffset: c }} animate={{ strokeDashoffset: c * (1 - v / 100) }} transition={{ duration: 1.2, ease: "easeOut" }} />
      <text x="90" y="96" textAnchor="middle" fontFamily="Space Grotesk" fontWeight="700" fontSize="46" fill={INK}>{value ?? "—"}</text>
      <text x="90" y="122" textAnchor="middle" fontSize="12" fontWeight="700" fill={MUTED}>/ 100{prev != null ? ` · was ${prev}` : ""}</text>
    </svg>
  );
}

export function ComponentBars({ components }) {
  if (!components) return null;
  const colors = { detection: "#ff8a3d", diagnosis: "#1f6bff", recovery: "#0f9d58", safety: "#7a4dff", adaptability: "#e5194f" };
  return (
    <div className="comp-bars">
      {Object.entries(components).map(([k, v]) => (
        <div className="cb" key={k}>
          <span style={{ textTransform: "capitalize" }}>{k}</span>
          <div className="track"><motion.i style={{ background: colors[k] }} initial={{ width: 0 }} animate={{ width: `${v}%` }} transition={{ duration: 0.9 }} /></div>
          <b className="mono">{v}</b>
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
        <Line dataKey="round_score" name="Round score" stroke="#b49bff" strokeWidth={1.5} dot={false} isAnimationActive />
        <Line dataKey="resilience" name="Resilience" stroke="#7a4dff" strokeWidth={3} dot={false} isAnimationActive animationDuration={900} />
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
        <Line dataKey="mttd" name={`MTTD (${unit}, simulated)`} stroke="#ff8a3d" strokeWidth={2.5} dot={{ r: 2 }} connectNulls />
        <Line dataKey="mttr" name={`MTTR (${unit}, simulated)`} stroke="#1f6bff" strokeWidth={2.5} dot={{ r: 2 }} connectNulls />
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
        <Line dataKey="headline" name={metric?.label} stroke={INK} strokeWidth={2.5}
          dot={(p) => <circle key={p.index} cx={p.cx} cy={p.cy} r={p.payload.blue ? 2.5 : 6} fill={p.payload.blue ? INK : "#e5194f"} />} />
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
        <Bar dataKey="mttr" name="Time incidents stayed open" radius={[5, 5, 0, 0]}>
          {series.map((s, i) => <Cell key={i} fill={!s.blue ? "#e5194f" : s.playbook ? "#0a8fc9" : "#b8b3a6"} />)}
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
        <Bar dataKey="value" name="Expected damage" radius={[0, 6, 6, 0]}>
          {data.map((d, i) => <Cell key={i} fill={`rgba(255,59,107,${0.35 + d.value / 150})`} />)}
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
        <Scatter data={data} fill="#ff3b6b" fillOpacity={0.55} stroke="#0e0e10" />
      </ScatterChart>
    </ResponsiveContainer>
  );
}
