import { AnimatePresence, motion } from "motion/react";
import { Component, useEffect, useState } from "react";
import OracleAssist from "./components/chatbot/OracleAssist.jsx";
import { PAGES, SideNav, Toasts, TopBar } from "./components/common/Layout.jsx";
import Agents from "./pages/Agents.jsx";
import Arena from "./pages/Arena.jsx";
import Incidents from "./pages/Incidents.jsx";
import Learning from "./pages/Learning.jsx";
import MapPage from "./pages/MapPage.jsx";
import Metrics from "./pages/Metrics.jsx";
import Overview from "./pages/Overview.jsx";
import Safety from "./pages/Safety.jsx";
import Scenarios from "./pages/Scenarios.jsx";
import { useArena } from "./state/arenaStore.js";

const VIEWS = { overview: Overview, arena: Arena, map: MapPage, scenarios: Scenarios, agents: Agents,
  incidents: Incidents, metrics: Metrics, learning: Learning, safety: Safety };

function usePage() {
  const read = () => {
    const id = window.location.hash.replace(/^#\/?/, "") || "overview";
    return PAGES.some((p) => p.id === id) ? id : "overview";
  };
  const [page, setPage] = useState(read);
  useEffect(() => {
    const on = () => { setPage(read()); window.scrollTo({ top: 0, behavior: "smooth" }); };
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  return page;
}

class Boundary extends Component {        // a broken page never takes the whole app down
  constructor(p) { super(p); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  componentDidUpdate(prev) { if (prev.page !== this.props.page && this.state.error) this.setState({ error: null }); }
  render() {
    if (this.state.error) return <div className="banner">Something went wrong on this page: {String(this.state.error.message)}</div>;
    return this.props.children;
  }
}

export default function App() {
  const page = usePage();
  const conn = useArena((s) => s.connection);
  const View = VIEWS[page];
  return (
    <div className="app">
      <TopBar />
      <SideNav page={page} />
      <main className="main" id="main">
        {conn === "down" && <div className="banner">Backend unavailable: retrying. Start everything with <code className="mono">python run_all.py</code>.</div>}
        {conn === "idle" && <div className="banner info">No live updates for a few seconds: the arena may be stopped or between rounds.</div>}
        <AnimatePresence mode="wait">
          <motion.div key={page} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: "easeOut" }}>
            <Boundary page={page}><View /></Boundary>
          </motion.div>
        </AnimatePresence>
      </main>
      <OracleAssist page={page} />
      <Toasts />
    </div>
  );
}
