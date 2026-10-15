import { palette } from "../../state/theme.js";
// Live service graph. Nodes are laid out by dependency depth; status is shown with text, not colour alone.
const statusStyle = () => {
  const p = palette();
  return {
    healthy: { fill: p.surface, stroke: p.lineStrong, text: p.ok, label: "Healthy" },
    strained: { fill: p.surface, stroke: p.warn, text: p.warn, label: "Strained" },
    degraded: { fill: p.surface2, stroke: p.bad, text: p.bad, label: "Degraded" },
    mitigated: { fill: p.surface, stroke: p.ok, text: p.ok, label: "Recovered" },
  };
};

function layout(nodes, edges) {
  const depth = Object.fromEntries(nodes.map((n) => [n.id, 0]));
  for (let i = 0; i < nodes.length; i++) for (const [a, b] of edges) depth[b] = Math.max(depth[b], depth[a] + 1);
  const cols = {};
  nodes.forEach((n) => (cols[depth[n.id]] = [...(cols[depth[n.id]] || []), n]));
  const ncols = Object.keys(cols).length;
  const W = 1000, colW = W / ncols, nodeW = Math.min(214, colW - 30), nodeH = 72;
  const maxRows = Math.max(...Object.values(cols).map((c) => c.length));
  const H = Math.max(140, maxRows * (nodeH + 16) + 16);
  const pos = {};
  Object.entries(cols).forEach(([d, list]) => {
    list.forEach((n, i) => {
      pos[n.id] = { x: d * colW + (colW - nodeW) / 2, y: (H - list.length * (nodeH + 16) + 16) / 2 + i * (nodeH + 16), w: nodeW, h: nodeH };
    });
  });
  return { pos, W, H };
}

export default function SystemTopology({ topology, highlight = [] }) {
  if (!topology?.nodes?.length) return <div className="empty">Waiting for the live system.</div>;
  const { nodes, edges } = topology;
  const { pos, W, H } = layout(nodes, edges);
  const status = Object.fromEntries(nodes.map((n) => [n.id, n.status]));
  const STATUS = statusStyle();
  const P = palette();
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
          <g key={n.id}>
            <title>{`${n.name}: ${st.label}. ${n.metric}. ${n.latency_ms} ms, ${n.error_pct}% errors (prototype telemetry)`}</title>
            <rect className={`node-rect ${n.status}`} x={p.x} y={p.y} width={p.w} height={p.h} rx="6" fill={st.fill} stroke={st.stroke} strokeWidth={focus ? 2 : 1} />
            <text x={p.x + 12} y={p.y + 22} fontSize="15" fontWeight="400" fill={P.ink}>{n.name}</text>
            <text x={p.x + p.w - 10} y={p.y + 22} fontSize="11" fill={st.text} textAnchor="end" fontFamily="Geist Mono" letterSpacing="-0.2">{st.label}</text>
            <text x={p.x + 12} y={p.y + 43} fontSize="12" fill={P.ink2} fontFamily="Geist Mono">{n.latency_ms} ms · {n.error_pct}% err</text>
            <text x={p.x + 12} y={p.y + 61} fontSize="12" fill={P.muted}>{n.metric}</text>
          </g>
        );
      })}
    </svg>
  );
}
