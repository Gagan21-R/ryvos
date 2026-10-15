// The RYVO loop as a large ring: ten phases around a circle, a marker that orbits continuously, and the phase the
// live arena is in right now drawn solid. White strokes + mix-blend-difference, so it reads on light and dark.
const STEPS = ["Discover", "Plan", "Safety", "Disrupt", "Detect", "Diagnose", "Recover", "Verify", "Learn", "Adapt"];
const KEYS = ["DISCOVER", "PLAN", "SAFETY", "DISRUPT", "DETECT", "DIAGNOSE", "RECOVER", "VERIFY", "LEARN", "ADAPT"];

export default function LoopRing({ phase }) {
  const C = 300, R = 210, now = KEYS.indexOf(phase);
  return (
    <svg viewBox="0 0 600 600" className="w-full h-auto overflow-visible" role="img" aria-label={`The RYVO loop. Current phase: ${phase || "idle"}`}>
      <circle cx={C} cy={C} r={R} fill="none" stroke="#fff" strokeOpacity="0.55" strokeWidth="1" />
      <circle cx={C} cy={C} r={R - 34} fill="none" stroke="#fff" strokeOpacity="0.2" strokeWidth="1" strokeDasharray="2 6" />
      {STEPS.map((s, i) => {
        const a = (i / STEPS.length) * Math.PI * 2 - Math.PI / 2;
        const x = C + R * Math.cos(a), y = C + R * Math.sin(a);
        const lx = C + (R + 30) * Math.cos(a), ly = C + (R + 30) * Math.sin(a);
        const on = i === now;
        return (
          <g key={s}>
            <rect x={x - (on ? 8 : 5)} y={y - (on ? 8 : 5)} width={on ? 16 : 10} height={on ? 16 : 10} fill={on ? "#fff" : "#000"} stroke="#fff" strokeWidth="1.2" />
            <text x={lx} y={ly + 4} fill="#fff" fillOpacity={on ? 1 : 0.6} fontFamily="JetBrains Mono" fontSize="12" letterSpacing="2.5"
              textAnchor={Math.abs(Math.cos(a)) < 0.2 ? "middle" : Math.cos(a) > 0 ? "start" : "end"} fontWeight={on ? 600 : 400}>
              {String(i + 1).padStart(2, "0")} {s.toUpperCase()}
            </text>
          </g>
        );
      })}
      <g>
        <animateTransform attributeName="transform" type="rotate" from={`0 ${C} ${C}`} to={`360 ${C} ${C}`} dur="24s" repeatCount="indefinite" />
        <circle cx={C} cy={C - R} r="4" fill="#fff" />
        <path d={`M ${C} ${C - R} A ${R} ${R} 0 0 0 ${C - R * Math.sin(0.5)} ${C - R * Math.cos(0.5)}`} fill="none" stroke="#fff" strokeWidth="2" />
      </g>
      <text x={C} y={C - 14} fill="#fff" fontFamily="JetBrains Mono" fontSize="11" letterSpacing="3" textAnchor="middle" fillOpacity="0.6">THE LOOP</text>
      <text x={C} y={C + 18} fill="#fff" fontFamily="Inter" fontSize="30" fontWeight="500" letterSpacing="-1" textAnchor="middle">{now >= 0 ? STEPS[now] : "Ready"}</text>
      <text x={C} y={C + 42} fill="#fff" fontFamily="JetBrains Mono" fontSize="10" letterSpacing="2.5" textAnchor="middle" fillOpacity="0.55">LIVE ARENA PHASE</text>
    </svg>
  );
}
