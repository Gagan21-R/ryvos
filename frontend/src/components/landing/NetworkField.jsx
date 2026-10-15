// Hero background: a living service network. Requests flow between services; every few seconds ROGUE injects a
// failure into one service (its traffic drops), AEGIS detects it (scan rings) and recovers it (traffic flows again).
// Monochrome, drawn on a canvas. Experiment names come from the live arena when available.
import { useEffect, useRef } from "react";

const INK = "238,238,238";
const ORANGE = "238,96,24", GREEN = "160,202,146";
const PHASES = [
  { id: "steady", ms: 2200 },
  { id: "inject", ms: 1700 },
  { id: "detect", ms: 1500 },
  { id: "recover", ms: 1900 },
];
const FALLBACK = ["Latency injection", "Dependency outage", "Traffic surge", "Packet loss", "Config drift"];

function rand(seed) {                       // small deterministic PRNG so the network is the same every load
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) / 2147483647);
}

function build(w, h) {
  const r = rand(11);
  const nodes = [];
  const cols = 7, rows = 4;
  const x0 = w * 0.3, x1 = w * 0.64, y0 = h * 0.36, y1 = h * 0.95;
  for (let c = 0; c < cols; c++) {
    for (let k = 0; k < rows; k++) {
      if (r() < 0.32) continue;
      nodes.push({
        x: x0 + ((c + 0.5 + (r() - 0.5) * 0.7) / cols) * (x1 - x0),
        y: y0 + ((k + 0.5 + (r() - 0.5) * 0.7) / rows) * (y1 - y0),
        core: r() < 0.18, fail: 0, heal: 0,
      });
    }
  }
  const edges = [];
  const seen = new Set();
  nodes.forEach((a, i) => {
    nodes.map((b, j) => ({ j, d: Math.hypot(a.x - b.x, a.y - b.y) })).filter((o) => o.j !== i).sort((p, q) => p.d - q.d).slice(0, 2)
      .forEach(({ j }) => {
        const key = i < j ? `${i}-${j}` : `${j}-${i}`;
        if (!seen.has(key)) { seen.add(key); edges.push([i, j]); }
      });
  });
  return { nodes, edges };
}

export default function NetworkField({ experiments = [], className = "" }) {
  const canvas = useRef(null);
  const names = useRef(FALLBACK);
  names.current = experiments.length ? experiments : FALLBACK;

  useEffect(() => {
    const cv = canvas.current;
    const ctx = cv.getContext("2d");
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    let W = 0, H = 0, net = { nodes: [], edges: [] }, packets = [], drops = [], raf = 0;
    let phase = 0, phaseStart = performance.now(), target = -1, expNo = 14, expName = "";
    const r = rand(97);

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      W = cv.clientWidth; H = cv.clientHeight;
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      net = build(W, H);
      packets = [];
    };
    const ro = new ResizeObserver(resize);
    ro.observe(cv);
    resize();

    const failing = () => target >= 0 && (PHASES[phase].id === "inject" || PHASES[phase].id === "detect");

    function nextPhase(now) {
      phase = (phase + 1) % PHASES.length;
      phaseStart = now;
      if (PHASES[phase].id === "inject") {
        const pool = net.nodes.map((n, i) => i).filter((i) => net.edges.some((e) => e.includes(i)));
        target = pool[Math.floor(r() * pool.length)] ?? -1;
        expNo += 1;
        expName = names.current[expNo % names.current.length];
      }
    }

    function spawn() {
      if (!net.edges.length) return;
      const e = net.edges[Math.floor(r() * net.edges.length)];
      const dir = r() < 0.5;
      packets.push({ e, from: dir ? e[0] : e[1], to: dir ? e[1] : e[0], t: 0, v: 0.004 + r() * 0.006 });
    }

    function label(text, x, y, alpha = 1, bold = false) {
      ctx.font = `400 11px "Geist Mono", "JetBrains Mono", monospace`;
      if ("letterSpacing" in ctx) ctx.letterSpacing = "-0.2px";
      ctx.fillStyle = bold === "bad" ? `rgba(${ORANGE},1)` : bold === "ok" ? `rgba(${GREEN},1)` : `rgba(${INK},${alpha})`;
      ctx.fillText(text.toUpperCase(), x, y);
    }

    function frame(now) {
      ctx.clearRect(0, 0, W, H);
      const P = PHASES[phase];
      const k = Math.min(1, (now - phaseStart) / P.ms);
      if (k >= 1 && !reduce) nextPhase(now);
      const tn = net.nodes[target];

      // edges
      net.edges.forEach(([a, b]) => {
        const A = net.nodes[a], B = net.nodes[b];
        const hit = failing() && (a === target || b === target);
        ctx.strokeStyle = hit ? `rgba(${ORANGE},0.7)` : `rgba(${INK},0.1)`;
        ctx.lineWidth = 1;
        ctx.setLineDash(hit ? [3, 4] : []);
        ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(B.x, B.y); ctx.stroke();
      });
      ctx.setLineDash([]);

      // recovery trace: the restored node's edges light up from the node outwards
      if (P.id === "recover" && tn) {
        net.edges.filter((e) => e.includes(target)).forEach(([a, b]) => {
          const O = net.nodes[a === target ? b : a];
          const q = Math.min(1, k * 1.6);
          ctx.strokeStyle = `rgba(${GREEN},${0.9 * (1 - k)})`;
          ctx.lineWidth = 1.6;
          ctx.beginPath(); ctx.moveTo(tn.x, tn.y); ctx.lineTo(tn.x + (O.x - tn.x) * q, tn.y + (O.y - tn.y) * q); ctx.stroke();
        });
      }

      // packets (requests)
      if (!reduce && packets.length < 70 && r() < 0.5) spawn();
      packets = packets.filter((p) => {
        p.t += p.v;
        const A = net.nodes[p.from], B = net.nodes[p.to];
        if (failing() && p.to === target && p.t > 0.82) {      // the failed service drops the request
          drops.push({ x: A.x + (B.x - A.x) * 0.82, y: A.y + (B.y - A.y) * 0.82, life: 1 });
          return false;
        }
        if (p.t >= 1) return false;
        const x = A.x + (B.x - A.x) * p.t, y = A.y + (B.y - A.y) * p.t;
        ctx.fillStyle = `rgba(${INK},0.75)`;
        ctx.fillRect(x - 1.5, y - 1.5, 3, 3);
        return true;
      });
      drops = drops.filter((d) => {
        d.life -= 0.03;
        ctx.strokeStyle = `rgba(${ORANGE},${Math.max(0, d.life) * 0.9})`;
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(d.x - 3, d.y - 3); ctx.lineTo(d.x + 3, d.y + 3); ctx.moveTo(d.x + 3, d.y - 3); ctx.lineTo(d.x - 3, d.y + 3); ctx.stroke();
        return d.life > 0;
      });

      // nodes
      net.nodes.forEach((n, i) => {
        const s = n.core ? 9 : 6;
        const isT = i === target;
        let fill = "#101010", stroke = `rgba(${INK},0.5)`;
        if (isT && P.id === "inject") stroke = `rgba(${ORANGE},1)`;
        if (isT && P.id === "detect") stroke = `rgba(${ORANGE},1)`;
        if (isT && P.id === "recover") { fill = `rgba(${GREEN},${1 - k * 0.8})`; stroke = `rgba(${GREEN},1)`; }
        const jx = isT && P.id === "inject" ? (r() - 0.5) * 2.2 : 0;
        ctx.fillStyle = fill; ctx.strokeStyle = stroke; ctx.lineWidth = n.core ? 1.4 : 1;
        ctx.fillRect(n.x - s / 2 + jx, n.y - s / 2, s, s);
        ctx.strokeRect(n.x - s / 2 + jx, n.y - s / 2, s, s);
        if (isT && P.id === "inject") {                     // failure: cross through the service
          ctx.beginPath(); ctx.moveTo(n.x - s, n.y - s); ctx.lineTo(n.x + s, n.y + s); ctx.moveTo(n.x + s, n.y - s); ctx.lineTo(n.x - s, n.y + s);
          ctx.strokeStyle = `rgba(${ORANGE},1)`; ctx.stroke();
        }
      });

      // detection rings + status label
      if (tn) {
        if (P.id === "inject") {
          const rad = 10 + k * 26;
          ctx.strokeStyle = `rgba(${ORANGE},${0.7 * (1 - k)})`; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.arc(tn.x, tn.y, rad, 0, Math.PI * 2); ctx.stroke();
        }
        if (P.id === "detect") {
          for (let i = 0; i < 3; i++) {
            const q = (k * 1.5 + i / 3) % 1;
            ctx.strokeStyle = `rgba(${INK},${0.5 * (1 - q)})`;
            ctx.beginPath(); ctx.arc(tn.x, tn.y, 8 + q * 60, 0, Math.PI * 2); ctx.stroke();
          }
          ctx.strokeStyle = `rgba(${INK},0.8)`;
          ctx.strokeRect(tn.x - 16, tn.y - 16, 32, 32);         // AEGIS bracket around the failing service
        }
        const tag = `EXP ${String(expNo).padStart(3, "0")}`;
        const lines = {
          steady: null,
          inject: [`${tag} · ROGUE`, `Injecting: ${expName}`],
          detect: [`${tag} · AEGIS`, `Anomaly detected · ${(1.1 + (expNo % 7) * 0.3).toFixed(1)} s`],
          recover: [`${tag} · AEGIS`, `Recovered · MTTR ${(2.4 + (expNo % 5) * 0.4).toFixed(1)} s`],
        }[P.id];
        if (lines) {
          const lx = Math.min(tn.x + 26, W - 250), ly = Math.max(tn.y - 30, 20);
          ctx.strokeStyle = `rgba(${INK},0.35)`; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(tn.x + 10, tn.y - 10); ctx.lineTo(lx - 4, ly + 4); ctx.stroke();
          label(lines[0], lx, ly, 0.55);
          label(lines[1], lx, ly + 15, 0.95, P.id === "recover" ? "ok" : P.id === "inject" ? "bad" : false);
        }
      }
      if (!reduce) raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  return <canvas ref={canvas} className={className} aria-hidden="true" />;
}
