// The live map: borrows the shared Leaflet instance, shows the hierarchy level, the focus reason and a legend.
import { Crosshair, MessageCircleQuestion } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { api } from "../../services/api.js";
import { openAssist, useArena } from "../../state/arenaStore.js";
import { LEGEND_COLORS, attach, recenter, setGeography, setToggles, update } from "./mapEngine.js";

const geoCache = {};
const LEVELS = ["national", "state", "district", "city", "local"];

export function useGeography(domain) {
  const [geo, setGeo] = useState(geoCache[domain] || null);
  useEffect(() => {
    if (!domain) return;
    if (geoCache[domain]) { setGeo(geoCache[domain]); return; }
    api.geography(domain).then((g) => { geoCache[domain] = g; setGeo(g); }).catch(() => setGeo(null));
  }, [domain]);
  return geo;
}

export default function ArenaMap({ height = 460, toggles, compact = false, state = null }) {
  const slot = useRef(null);
  const [offline, setOffline] = useState(false);
  const liveState = useArena((st) => st.live?.state);
  const s = state || liveState;
  const meta = useArena((st) => st.meta);
  const geo = useGeography(s?.domain);
  const boundaryByName = useMemo(() => Object.fromEntries((geo?.layers.boundaries || []).map((f) => [f.properties.name, f])), [geo]);

  useEffect(() => attach(slot.current, setOffline), []);
  useEffect(() => { if (geo) setGeography(geo); }, [geo]);
  useEffect(() => {
    if (!s || !geo || geo.domain !== s.domain) return;
    try { update(s, boundaryByName); } catch (e) { console.warn("map update skipped:", e.message); }   // never break the page
  }, [s, geo, boundaryByName]);
  useEffect(() => { if (toggles) setToggles(toggles); }, [toggles]);

  const focus = s?.focus;
  const legend = meta?.domains?.[s?.domain]?.legend || {};
  const groups = [...new Set((s?.map?.points || []).map((p) => p.group))].filter((g) => legend[g]);
  const hierarchy = geo?.hierarchy || LEVELS;

  return (
    <div className={`map-shell ${offline ? "offline" : ""}`} style={{ height }}>
      <div ref={slot} className="map-slot" role="application" aria-label="Live geographic map of the active scenario" />
      <div className="map-overlay map-crumbs" aria-label="Map level">
        {hierarchy.map((lv) => <span key={lv} className={focus?.level === lv ? "on" : ""}>{lv}</span>)}
        <span className="on" style={{ background: "transparent", color: "var(--muted)", borderStyle: "dashed", borderColor: "var(--line)" }}>simulated entities</span>
      </div>
      <div className="map-overlay map-tools">
        <button className="icon-btn" onClick={recenter} aria-label="Re-centre on the active focus" title="Re-centre"><Crosshair size={17} /></button>
        <button className="icon-btn" onClick={() => openAssist("Why did the map zoom here?")} aria-label="Ask ORACLE about this map" title="Explain this map"><MessageCircleQuestion size={17} /></button>
      </div>
      {focus && !compact && (
        <div className="map-overlay map-focus">
          <div className="eyebrow">{focus.level} view</div>
          <b>{focus.label}</b>
          <div className="muted" style={{ marginTop: 2 }}>{focus.reason}</div>
        </div>
      )}
      {!compact && groups.length > 0 && (
        <div className="map-overlay map-legend" aria-label="Legend">
          {groups.map((g) => <div key={g}><i style={{ background: LEGEND_COLORS[g] }} />{legend[g]}</div>)}
        </div>
      )}
      {offline && <div className="map-overlay" style={{ top: 50, left: 12 }}><span className="chip warn">Map tiles unavailable: showing data only</span></div>}
    </div>
  );
}
