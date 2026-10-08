// Top navigation + left navigation + toasts.
import { Activity, AlertTriangle, BookOpen, Bot, Brain, Gauge, LayoutDashboard, Map, Pause, Play, Shield, Swords } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { act, useArena } from "../../state/arenaStore.js";
import { api } from "../../services/api.js";

export const PAGES = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "arena", label: "Arena", icon: Swords },
  { id: "map", label: "Map", icon: Map },
  { id: "scenarios", label: "Scenarios", icon: BookOpen },
  { id: "agents", label: "Agents", icon: Bot },
  { id: "incidents", label: "Incidents", icon: AlertTriangle },
  { id: "metrics", label: "Metrics", icon: Gauge },
  { id: "learning", label: "Learning", icon: Brain },
  { id: "safety", label: "Safety", icon: Shield },
];
const DOMAINS = [["emergency", "🚑", "108"], ["food", "🛵", "Delivery"], ["upi", "💳", "UPI"], ["all", "🔁", "Rotate"]];

function systemStatus(live) {
  const nodes = live?.state?.topology?.nodes || [];
  if (nodes.some((n) => n.status === "degraded")) return ["bad", "Under attack"];
  if (Object.keys(live?.incidents || {}).length) return ["warn", "Recovering"];
  if (nodes.some((n) => n.status === "mitigated")) return ["", "Recovered"];
  return ["", "Healthy"];
}

export function TopBar() {
  const live = useArena((s) => s.live);
  const conn = useArena((s) => s.connection);
  const st = live?.status || {};
  const [tone, label] = systemStatus(live);
  const mode = st.domain_mode || live?.state?.domain;
  return (
    <header className="topbar">
      <div className="wordmark" aria-label="RYVO">
        <span className="dots" aria-hidden="true"><i style={{ background: "var(--rogue)" }} /><i style={{ background: "var(--oracle)" }} /><i style={{ background: "var(--aegis)" }} /></span>
        RYVO
      </div>
      <span className={`pill ${conn === "live" ? "" : "warn"}`}><span className="led" />{conn === "live" ? "Sandbox" : conn === "down" ? "Backend offline" : "Connecting"}</span>
      <span className="pill hide-sm">Round <b className="mono">#{live?.state?.round ?? "—"}</b></span>
      <span className={`pill ${tone} hide-sm`} aria-live="polite"><span className="led" />{label}</span>
      <div className="top-spacer" />
      <nav className="domain-tabs" aria-label="System under test">
        {DOMAINS.map(([id, ic, lbl]) => {
          const active = mode === id;
          const pending = active && id !== "all" && live?.state?.domain !== id;
          return (
            <button key={id} className={active ? "active" : ""} aria-pressed={active}
              onClick={() => act(`dom-${id}`, () => api.control({ cmd: "domain", domain: id }), `${ic} ${lbl}: switching at the next round`)}>
              {active && <motion.span layoutId="dom-bg" className="active-bg" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
              {ic} <span className="lbl">{lbl}</span>{pending && <span className="soon">next</span>}
            </button>
          );
        })}
      </nav>
      <button className={`icon-btn ${st.blue_enabled === false ? "" : "on"}`} title="AEGIS defenders on/off" aria-pressed={st.blue_enabled !== false}
        aria-label={st.blue_enabled === false ? "Turn AEGIS on" : "Turn AEGIS off"}
        onClick={() => act("blue", () => api.control({ cmd: "blue", enabled: st.blue_enabled === false }),
          st.blue_enabled === false ? "🛡 AEGIS back online" : "⚠ AEGIS switched off", st.blue_enabled === false ? "aegis" : "rogue")}>
        <Shield size={17} />
      </button>
      <button className="icon-btn" aria-label={st.paused ? "Resume simulation" : "Pause simulation"} title={st.paused ? "Resume" : "Pause"}
        onClick={() => act("pause", () => api.control({ cmd: st.paused ? "resume" : "pause" }))}>
        {st.paused ? <Play size={17} /> : <Pause size={17} />}
      </button>
    </header>
  );
}

export function SideNav({ page }) {
  return (
    <nav className="sidenav" aria-label="Pages">
      {PAGES.map(({ id, label, icon: Icon }) => (
        <a key={id} href={`#/${id}`} className={page === id ? "active" : ""} aria-current={page === id ? "page" : undefined}>
          {page === id && <motion.span layoutId="nav-bg" className="nav-bg" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
          <Icon size={18} aria-hidden="true" /><span className="label">{label}</span>
        </a>
      ))}
      <div className="foot"><Activity size={13} style={{ verticalAlign: -2 }} /> Sandbox simulation · prototype telemetry · simulated geography entities</div>
    </nav>
  );
}

export function Toasts() {
  const toasts = useArena((s) => s.toasts);
  return (
    <div className="toasts" aria-live="polite">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div key={t.id} className={`toast ${t.tone}`} initial={{ opacity: 0, y: 20, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10 }}>
            {t.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
