// Top bar, side navigation and toasts.
import { Activity, AlertTriangle, BookOpen, Bot, Brain, Database, Gauge, LayoutDashboard, Map, Moon, Pause, Play, Shield, Sun, Swords } from "lucide-react";
import { api } from "../../services/api.js";
import { act, useArena } from "../../state/arenaStore.js";
import { toggleTheme, useTheme } from "../../state/theme.js";
import { ROTATE, SYSTEMS } from "./ui.jsx";

export const PAGES = [
  { id: "overview", label: "Overview", icon: LayoutDashboard, group: "Platform" },
  { id: "arena", label: "Live arena", icon: Swords, group: "Platform" },
  { id: "map", label: "Map", icon: Map, group: "Platform" },
  { id: "scenarios", label: "Scenarios", icon: BookOpen, group: "Platform" },
  { id: "agents", label: "Agents", icon: Bot, group: "Platform" },
  { id: "incidents", label: "Incidents", icon: AlertTriangle, group: "Results" },
  { id: "metrics", label: "Metrics", icon: Gauge, group: "Results" },
  { id: "learning", label: "Learning", icon: Brain, group: "Results" },
  { id: "realdata", label: "Real-data validation", icon: Database, group: "Results" },
  { id: "safety", label: "Safety", icon: Shield, group: "Governance" },
];

function systemStatus(live) {
  const nodes = live?.state?.topology?.nodes || [];
  if (nodes.some((n) => n.status === "degraded")) return ["bad", "Experiment running"];
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
      <a className="wordmark" href="#/overview" aria-label="RYVO home">RYVO<small>Resilience testing</small></a>
      <span className={`pill ${conn === "live" ? "" : "warn"}`}>{conn === "live" ? "Sandbox connected" : conn === "down" ? "Backend offline" : "Connecting"}</span>
      <span className="pill hide-sm">Round <b className="mono">{live?.state?.round ?? "—"}</b></span>
      <span className={`pill ${tone} hide-sm`} aria-live="polite">{label}</span>
      <div className="top-spacer" />
      <div className="segmented" role="group" aria-label="System under test">
        {[...SYSTEMS, ROTATE].map(({ id, short, icon: Icon }) => {
          const active = mode === id;
          const pending = active && id !== "all" && live?.state?.domain !== id;
          return (
            <button key={id} className={active ? "on" : ""} aria-pressed={active} title={short}
              onClick={() => act(`dom-${id}`, () => api.control({ cmd: "domain", domain: id }), `${short}: switching at the next round`)}>
              <Icon size={15} aria-hidden="true" /><span className="lbl">{short}</span>{pending && <span className="soon">next</span>}
            </button>
          );
        })}
      </div>
      <button className={`icon-btn ${st.blue_enabled === false ? "" : "on"}`} title={st.blue_enabled === false ? "AEGIS is off" : "AEGIS is on"} aria-pressed={st.blue_enabled !== false}
        aria-label={st.blue_enabled === false ? "Turn AEGIS on" : "Turn AEGIS off"}
        onClick={() => act("blue", () => api.control({ cmd: "blue", enabled: st.blue_enabled === false }),
          st.blue_enabled === false ? "AEGIS is back online" : "AEGIS switched off")}>
        <Shield size={16} />
      </button>
      <ThemeButton />
      <button className="icon-btn" aria-label={st.paused ? "Resume simulation" : "Pause simulation"} title={st.paused ? "Resume" : "Pause"}
        onClick={() => act("pause", () => api.control({ cmd: st.paused ? "resume" : "pause" }))}>
        {st.paused ? <Play size={16} /> : <Pause size={16} />}
      </button>
    </header>
  );
}

export function ThemeButton({ className = "icon-btn theme-btn" }) {
  const theme = useTheme();
  return (
    <button className={className} onClick={toggleTheme} aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"} title={theme === "dark" ? "Light mode" : "Dark mode"}>
      {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}

export function SideNav({ page }) {
  let group = null;
  return (
    <nav className="sidenav" aria-label="Pages">
      {PAGES.map(({ id, label, icon: Icon, group: g }) => {
        const head = g !== group ? <div className="group" key={`g-${g}`}>{g}</div> : null;
        group = g;
        return [head, (
          <a key={id} href={`#/${id}`} className={page === id ? "active" : ""} aria-current={page === id ? "page" : undefined} title={label}>
            <Icon size={17} aria-hidden="true" /><span className="label">{label}</span>
          </a>
        )];
      })}
      <div className="foot"><Activity size={12} style={{ verticalAlign: -1 }} /> Arena: sandbox simulation. Real-data validation: public NAB telemetry.</div>
    </nav>
  );
}

export function Toasts() {
  const toasts = useArena((s) => s.toasts);
  return (
    <div className="toasts" aria-live="polite">
      {toasts.map((t) => <div key={t.id} className={`toast ${t.tone === "bad" ? "bad" : ""}`}>{t.text}</div>)}
    </div>
  );
}
