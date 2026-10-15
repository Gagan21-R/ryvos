// Puts a 3D scene into the current page's header (portal into .page-head), chosen per page and fed with live data.
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { api } from "../../services/api.js";
import { useArena } from "../../state/arenaStore.js";
import Scene3D from "./Scene3D.jsx";
import { agents, core, shield, terrain, topology, towers } from "./scenes.js";

const LABEL = {
  arena: "3D view of the live service topology", realdata: "3D waterfall of a real AWS latency series", metrics: "3D resilience towers per system",
  agents: "ROGUE, AEGIS and ORACLE as 3D objects", safety: "3D safety dome deflecting destructive experiments",
};

export default function PageScene({ page }) {
  const [slot, setSlot] = useState(null);
  const live = useArena((s) => s.live?.state);
  const learn = useArena((s) => s.learn);
  const data = useRef({});
  data.current.topo = live?.topology;
  data.current.rows = ["emergency", "food", "upi"].map((d) => (learn.results || []).filter((r) => r.domain === d && r.resilience != null).map((r) => r.resilience));
  const v = learn.verdicts || [];
  data.current.blocked = v.length ? v.filter((x) => !x.approved).length / v.length : 0.3;

  useEffect(() => {
    if (page !== "realdata" || data.current.series) return;
    api.realSeries("realKnownCause/machine_temperature_system_failure").then((s) => { data.current.series = s; }).catch(() => {});
  }, [page]);

  useEffect(() => {          // wait for the page header to exist, then render into it
    setSlot(null);
    let tries = 0;
    const find = () => {
      const el = document.querySelector(".main .page-head");
      if (el) setSlot(el);
      else if (tries++ < 40) setTimeout(find, 50);
    };
    find();
  }, [page]);

  const build = useMemo(() => {
    switch (page) {
      case "arena": return topology(() => data.current.topo);
      case "realdata": return terrain(() => data.current.series);
      case "metrics": return towers(() => data.current.rows);
      case "agents": return agents();
      case "safety": return shield(() => data.current.blocked);
      case "map": return core("knot");
      case "scenarios": return core("cubes");
      case "learning": return core("cloud");
      default: return core("ico");
    }
  }, [page]);

  if (!slot) return null;
  return createPortal(<Scene3D key={page} build={build} className="hero3d" label={LABEL[page] || "3D animation"} />, slot);
}
