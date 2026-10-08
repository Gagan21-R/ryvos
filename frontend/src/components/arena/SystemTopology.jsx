// Live service graph. Nodes are laid out by dependency depth; status is shown with text + icon, not colour alone.
import { motion } from "motion/react";

const STATUS = {
  healthy: { fill: "#dcf4e6", stroke: "#0f9d58", label: "HEALTHY", icon: "●" },
  strained: { fill: "#fdeed3", stroke: "#e8920c", label: "STRAINED", icon: "▲" },
  degraded: { fill: "#fde0e8", stroke: "#e5194f", label: "DEGRADED", icon: "✕" },
  mitigated: { fill: "#dbf1fb", stroke: "#0a8fc9", label: "RECOVERED", icon: "✓" },
};

function layout(nodes, edges) {
  const depth = Object.fromEntries(nodes.map((n) => [n.id, 0]));
  for (let i = 0; i < nodes.length; i++) for (const [a, b] of edges) depth[b] = Math.max(depth[b], depth[a] + 1);
  const cols = {};
  nodes.forEach((n) => (cols[depth[n.id]] = [...(cols[depth[n.id]] || []), n]));
  const ncols = Object.keys(cols).length;
  const W = 1000, colW = W / ncols, nodeW = Math.min(210, colW - 26), nodeH = 74;
  const maxRows = Math.max(...Object.values(cols).map((c) => c.length));
  const H = Math.max(140, maxRows * (nodeH + 18) + 20);
  const pos = {};
  Object.entries(cols).forEach(([d, list]) => {
    list.forEach((n, i) => {
      pos[n.id] = { x: d * colW + (colW - nodeW) / 2, y: (H - list.length * (nodeH + 18) + 18) / 2 + i * (nodeH + 18), w: nodeW, h: nodeH };
    });
  });
  return { pos, W, H };
}

export default function SystemTopology({ topology, highlight = [] }) {
  if (!topology?.nodes?.length) return <div className="empty">Waiting for the live system…</div>;
  const { nodes, edges } = topology;
  const { pos, W, H } = layout(nodes, edges);
  const status = Object.fromEntries(nodes.map((n) => [n.id, n.status]));
  return (
    <svg className="topo" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Live service topology">
      {edges.map(([a, b]) => {
        const p = pos[a], q = pos[b];
        const hot = status[a] === "degraded" || status[b] === "degraded";
        const x1 = p.x + p.w, y1 = p.y + p.h / 2, x2 = q.x, y2 = q.y + q.h / 2, mx = (x1 + x2) / 2;
        return <path key={`${a}-${b}`} className={`edge ${hot ? "hot" : ""}`} d={`M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`} />;
      })}
      {nodes.map((n) => {
        const p = pos[n.id];
        const st = STATUS[n.status] || STATUS.healthy;
        const focus = highlight.includes(n.id) || n.status === "degraded";
        return (
          <motion.g key={n.id} animate={{ scale: focus ? 1.06 : 1 }} transition={{ type: "spring", stiffness: 200, damping: 14 }}
            style={{ originX: `${p.x + p.w / 2}px`, originY: `${p.y + p.h / 2}px` }}>
            <title>{`${n.name}: ${st.label}. ${n.metric}. ${n.latency_ms} ms, ${n.error_pct}% errors (prototype telemetry)`}</title>
            <motion.rect x={p.x} y={p.y} width={p.w} height={p.h} rx="14" animate={{ fill: st.fill, stroke: st.stroke }}
              strokeWidth={focus ? 3.5 : 2} />
            {n.status === "degraded" && (
              <motion.rect x={p.x - 4} y={p.y - 4} width={p.w + 8} height={p.h + 8} rx="17" fill="none" stroke={st.stroke} strokeWidth="2"
                animate={{ opacity: [0.9, 0], scale: [1, 1.06] }} transition={{ duration: 1.2, repeat: Infinity }}
                style={{ originX: `${p.x + p.w / 2}px`, originY: `${p.y + p.h / 2}px` }} />
            )}
            <text x={p.x + 12} y={p.y + 22} fontSize="15" fontWeight="700" fill="#0e0e10">{n.name}</text>
            <text x={p.x + p.w - 10} y={p.y + 22} fontSize="11" fontWeight="800" fill={st.stroke} textAnchor="end">{st.icon} {st.label}</text>
            <text x={p.x + 12} y={p.y + 43} fontSize="12" fill="#3a3a40" fontFamily="JetBrains Mono">{n.latency_ms} ms · {n.error_pct}% err</text>
            <text x={p.x + 12} y={p.y + 62} fontSize="11.5" fill="#77746c">{n.metric}</text>
          </motion.g>
        );
      })}
    </svg>
  );
}
