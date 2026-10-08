import { useState } from "react";
import ArenaMap, { useGeography } from "../components/map/ArenaMap.jsx";
import { openAssist, useArena } from "../state/arenaStore.js";

const LEVELS = ["national", "state", "district", "city", "local"];
const LAYER_NAMES = { boundaries: "Real boundaries (geoBoundaries)", coverage: "Response coverage (simulated)", zones: "Free-delivery zones (simulated)",
  flows: "Transaction flows (simulated)", incident: "Incident, route & GPS ghosts", units: "Units, sites & demand" };

export default function MapPage() {
  const s = useArena((st) => st.live?.state);
  const meta = useArena((st) => st.meta);
  const geo = useGeography(s?.domain);
  const [toggles, setT] = useState({ boundaries: true, coverage: true, zones: true, flows: true, incident: true, units: true });
  const D = meta?.domains?.[s?.domain];
  const focus = s?.focus;
  const g = s?.geo || {};
  const inc = g.incident;
  const wrong = (g.customers || []).filter((c) => c.truly_free && !c.free).length;
  return (
    <div className="page">
      <div className="eyebrow">Geographic intelligence · {D ? `${D.icon} ${D.title}` : "—"}</div>
      <h1 className="h-page">The Map</h1>
      <p className="lede" style={{ marginBottom: 18 }}>The camera is driven by the scenario's geometry: it fits the bounds of whatever is affected, from all of India down to a single incident.</p>
      <div className="map-page">
        <ArenaMap height={640} toggles={toggles} />
        <div className="grid" style={{ alignContent: "start" }}>
          <div className="card soft">
            <div className="card-title"><h3>Why this view?</h3><button className="explain-btn" onClick={() => openAssist("Why did the map zoom here?")}>Explain</button></div>
            <div className="hier" aria-label="Zoom hierarchy">
              {LEVELS.filter((l) => !geo || geo.hierarchy.includes(l)).map((l) => {
                const lv = geo?.levels.find((x) => x.level === l);
                return <div key={l} className={focus?.level === l ? "on" : ""}><b style={{ width: 70, textTransform: "uppercase", fontSize: 11 }}>{l}</b>{l === "local" ? focus?.level === "local" ? focus.label : "—" : lv?.name || "—"}</div>;
              })}
            </div>
            {focus && <p style={{ marginBottom: 0 }}><b>{focus.label}</b><br /><span className="muted">{focus.reason}</span></p>}
          </div>
          {inc && (
            <div className="card soft">
              <div className="card-title"><h3>🚑 Active emergency</h3><span className="chip sim">simulated</span></div>
              <dl className="kv">
                <dt>Caller</dt><dd>{inc.caller.label}, {inc.zone}</dd>
                <dt>Waiting</dt><dd>{inc.waiting_min} min ({inc.status})</dd>
                <dt>Crew</dt><dd>{inc.ambulance?.label || "not yet assigned"}</dd>
                <dt>Nearest free</dt><dd>{inc.nearest ? `${inc.nearest.label.split(": ").pop()} · ${inc.nearest.km} km` : "none free"}</dd>
                <dt>Hospital</dt><dd>{inc.hospital.label} ({inc.hospital.free_beds} beds)</dd>
                <dt>ETA</dt><dd>~{inc.eta_min ?? "?"} min · straight-line route</dd>
              </dl>
            </div>
          )}
          {s?.domain === "food" && (
            <div className="card soft">
              <div className="card-title"><h3>🛵 Free-delivery coverage</h3><span className="chip sim">simulated boundary</span></div>
              <dl className="kv">
                <dt>Zones</dt><dd>{(g.zones || []).length} · {(g.zones || []).filter((z) => z.status !== "ok").map((z) => `${z.name} (${z.status})`).join(", ") || "all configs match"}</dd>
                <dt>Recent customers</dt><dd>{(g.customers || []).length}</dd>
                <dt>Wrongly charged</dt><dd style={{ color: wrong ? "var(--bad)" : undefined }}>{wrong}</dd>
              </dl>
              <div className="row" style={{ marginTop: 10, fontSize: 12 }}>
                <span className="chip ok">● free delivery</span><span className="chip">● outside zone</span><span className="chip bad">● wrongly shown a fee</span>
              </div>
            </div>
          )}
          {s?.domain === "upi" && (
            <div className="card soft">
              <div className="card-title"><h3>💳 Payment network</h3><span className="chip sim">simulated</span></div>
              <p className="muted" style={{ marginTop: 0 }}>UPI has no delivery-style radius. The map shows transaction flows (city → gateway → partner bank) and highlights the affected region during a disruption.</p>
              <dl className="kv">
                <dt>Scope</dt><dd>{g.scope}</dd>
                <dt>Affected</dt><dd>{(g.affected || []).map((a) => a.label).join(", ") || "none"}</dd>
                <dt>Failing flows</dt><dd>{(g.flows || []).filter((f) => f.failing).length} / {(g.flows || []).length}</dd>
              </dl>
            </div>
          )}
          <div className="card soft">
            <div className="card-title"><h3>Layers</h3></div>
            <div className="layer-toggles">
              {Object.keys(toggles).map((k) => (
                <label key={k}><input type="checkbox" checked={toggles[k]} onChange={(e) => setT((t) => ({ ...t, [k]: e.target.checked }))} />{LAYER_NAMES[k]}</label>
              ))}
            </div>
            <p className="muted" style={{ fontSize: 11.5, marginBottom: 0 }}>{geo?.attribution?.join(" · ")}. {geo?.simulated_note}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
