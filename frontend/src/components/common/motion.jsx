// One motion language for every page:
//   useAutoReveal  cards, panels, tables and charts rise into place (staggered) as they enter the viewport,
//                  including content that appears later (new verdicts, new incidents).
//   TelemetryStrip live trace of the arena's service latency on every console page: orange while ROGUE's
//                  failure is active, green once AEGIS has recovered it.
//   CountUp        numbers count to their value on the landing curve.
import { useEffect, useRef, useState } from "react";
import { useArena } from "../../state/arenaStore.js";
import { useStory } from "../../story/director.js";
import { systemById } from "./ui.jsx";

const REVEAL = [".card", ".panel", ".learn-card", ".scenario", ".report", ".kpis", ".final-verdict", ".agent-card", ".referee",
  ".map-shell", ".stat-strip > *", ".live-grid > *", ".params", ".section-head", ".empty", ".hier"].join(",");

export function useAutoReveal(rootRef, key) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return undefined;
    let batch = 0, batchTimer = 0;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        el.style.setProperty("--rd", `${Math.min(batch, 6) * 70}ms`);
        batch += 1;
        clearTimeout(batchTimer);
        batchTimer = setTimeout(() => { batch = 0; }, 120);
        el.dataset.reveal = "in";
        io.unobserve(el);
      });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.05 });
    const watch = (el) => {
      el.dataset.reveal = "out";
      io.observe(el);
      // safety net: anything on screen that the observer has not reported within 1.5 s is shown anyway
      setTimeout(() => {
        if (el.dataset.reveal === "out" && el.getBoundingClientRect().top < window.innerHeight) el.dataset.reveal = "in";
      }, 1500);
    };
    const mark = (scope) => {
      scope.querySelectorAll?.(REVEAL).forEach((el) => {
        if (el.dataset.reveal || el.closest("[data-reveal-skip]")) return;
        watch(el);
      });
    };
    mark(root);
    const mo = new MutationObserver((muts) => muts.forEach((m) => m.addedNodes.forEach((n) => {
      if (n.nodeType !== 1) return;
      if (n.matches?.(REVEAL) && !n.dataset.reveal) watch(n);
      mark(n);
    })));
    mo.observe(root, { childList: true, subtree: true });
    // fallback for environments where IntersectionObserver is throttled: check positions on scroll
    let st = 0;
    const onScroll = () => {
      if (st) return;
      st = setTimeout(() => {
        st = 0;
        let k = 0;
        root.querySelectorAll('[data-reveal="out"]').forEach((el) => {
          const r = el.getBoundingClientRect();
          if (r.top < window.innerHeight * 0.94 && r.bottom > 0) {
            el.style.setProperty("--rd", `${Math.min(k++, 6) * 70}ms`);
            el.dataset.reveal = "in";
            io.unobserve(el);
          }
        });
      }, 90);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { io.disconnect(); mo.disconnect(); clearTimeout(batchTimer); clearTimeout(st); window.removeEventListener("scroll", onScroll); };
  }, [rootRef, key]);
}

export function CountUp({ value, decimals = 0, duration = 1100 }) {
  const n = typeof value === "number" ? value : parseFloat(value);
  const [shown, setShown] = useState(Number.isFinite(n) ? 0 : value);
  const from = useRef(0);
  useEffect(() => {
    if (!Number.isFinite(n)) { setShown(value); return undefined; }
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) { setShown(n); return undefined; }
    const a = from.current, start = performance.now();
    let raf = 0;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const e = 1 - Math.pow(1 - t, 4);
      setShown(a + (n - a) * e);
      if (t < 1) raf = requestAnimationFrame(tick);
      else from.current = n;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [n]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!Number.isFinite(n)) return <>{value ?? "—"}</>;
  return <>{Number(shown).toLocaleString("en-IN", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}</>;
}

// ring buffer shared across pages so the trace keeps its history while you navigate
const trace = [];
let lastKey = null;
const PHASE = { DISCOVER: "Discover", PLAN: "Plan", SAFETY: "Safety check", DISRUPT: "Disrupt", DETECT: "Detect", DIAGNOSE: "Diagnose",
  RECOVER: "Recover", VERIFY: "Verify", LEARN: "Learn", ADAPT: "Adapt" };

export function TelemetryStrip() {
  const s = useArena((st) => st.live?.state);
  const paused = useArena((st) => st.live?.status?.paused);
  const story = useStory();
  const nodes = s?.topology?.nodes || [];
  const key = s ? `${s.round}:${s.t}` : null;
  if (key && key !== lastKey && nodes.length) {
    lastKey = key;
    const avg = nodes.reduce((a, n) => a + (n.latency_ms || 0), 0) / nodes.length;
    const status = nodes.some((n) => n.status === "degraded") ? "bad" : nodes.some((n) => n.status === "mitigated") ? "ok" : "idle";
    trace.push({ v: avg, status });
    if (trace.length > 140) trace.shift();
  }
  const W = 600, H = 32, n = trace.length;
  const max = Math.max(1, ...trace.map((p) => p.v)), min = Math.min(...trace.map((p) => p.v), max);
  const X = (i) => W - (n - 1 - i) * (W / 139);
  const Y = (v) => H - 3 - ((v - min) / (max - min || 1)) * (H - 6);
  const segs = [];
  for (let i = 1; i < n; i++) segs.push({ d: `M${X(i - 1).toFixed(1)},${Y(trace[i - 1].v).toFixed(1)} L${X(i).toFixed(1)},${Y(trace[i].v).toFixed(1)}`, status: trace[i].status, i });
  const cur = trace[n - 1];
  const color = { bad: "#ee6018", ok: "#a0ca92", idle: "#8a8380" };
  const sys = systemById(s?.domain);
  return (
    <div className="telemetry" aria-label="Live arena telemetry">
      <span className="lbl"><span className={`status-dot ${cur?.status === "bad" ? "live" : cur?.status === "ok" ? "ok" : "idle"}`} />
        {paused ? "Paused" : "Live"} · Round {s?.round ?? "—"} · {sys?.name || "Connecting"}</span>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" role="img" aria-label="Average service latency, last 140 ticks">
        <line x1="0" x2={W} y1={H - 1} y2={H - 1} stroke="#262321" strokeWidth="1" />
        {segs.map((g) => <path key={g.i} d={g.d} stroke={color[g.status]} strokeWidth={g.status === "idle" ? 1 : 1.6} fill="none" vectorEffect="non-scaling-stroke" />)}
        {cur && <circle cx={X(n - 1)} cy={Y(cur.v)} r="2.5" fill={color[cur.status]} />}
      </svg>
      <span className="state">{PHASE[story.phase] || "—"} · {cur ? `${Math.round(cur.v)} ms avg` : "waiting"}</span>
    </div>
  );
}
