// One Leaflet map for the whole app (never recreated). Pages "borrow" it by re-parenting its element.
// All geography comes from the backend: static layers via /api/geography, dynamic layers via city.state.
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const COLORS = {
  unit_free: "#1f6bff", unit_busy: "#7a4dff", unit_problem: "#e5194f", unit_reserve: "#8a877e",
  site: "#0f9d58", site_bad: "#e8920c", demand: "#ff8a3d", demand_urgent: "#e5194f", hub: "#00b8d9",
};
const SHAPE = { site: "sq", site_bad: "sq", hub: "sq" };
const PULSE = new Set(["unit_problem", "site_bad", "demand_urgent"]);
export const LEGEND_COLORS = COLORS;

let map = null;
let el = null;
let holder = null;
let layers = {};
let markers = new Map();
let geoDomain = null;
let focusKey = null;
let lastFocus = null;
let toggles = { boundaries: true, coverage: true, zones: true, flows: true, incident: true, units: true };
let onTileError = () => {};
const sigs = {};      // last drawn data per layer: redraw only when it changes
const changed = (k, v) => { const j = JSON.stringify(v ?? null); if (sigs[k] === j) return false; sigs[k] = j; return true; };

export function getMap() {
  if (map) return map;
  el = document.createElement("div");
  el.className = "map-el";
  holder = document.createElement("div");
  holder.style.display = "none";
  document.body.appendChild(holder);
  holder.appendChild(el);
  map = L.map(el, { zoomControl: false, minZoom: 3, maxZoom: 17, zoomSnap: 0.25, worldCopyJump: false })
    .setView([20.6, 78.9], 4.5);
  L.control.zoom({ position: "bottomright" }).addTo(map);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors · boundaries: geoBoundaries',
  }).on("tileerror", () => onTileError(true)).on("tileload", () => onTileError(false)).addTo(map);
  for (const k of ["boundaries", "coverage", "zones", "affected", "flows", "incident", "labels", "customers"]) {
    layers[k] = L.layerGroup().addTo(map);
  }
  map.on("zoomstart", () => el.classList.add("no-anim"));
  map.on("zoomend", () => setTimeout(() => el.classList.remove("no-anim"), 80));
  return map;
}

export function attach(slot, tileErrorCb) {
  getMap();
  onTileError = tileErrorCb || (() => {});
  slot.appendChild(el);
  map.invalidateSize(false);           // the element just moved: Leaflet must re-measure before any camera move
  setTimeout(() => {
    map.invalidateSize();
    if (lastFocus) fit(lastFocus, false);
  }, 60);
  return () => { if (holder && el.parentNode === slot) holder.appendChild(el); };
}

export function setToggles(t) {
  toggles = { ...toggles, ...t };
  for (const [k, on] of Object.entries(toggles)) {
    const group = k === "units" ? null : layers[k];
    if (!group) continue;
    if (on && !map.hasLayer(group)) group.addTo(map);
    if (!on && map.hasLayer(group)) map.removeLayer(group);
  }
  markers.forEach(({ m }) => (toggles.units ? m.addTo(map) : map.removeLayer(m)));
}

// ---------------------------------------------------------------- static geography (per domain)
export function setGeography(geo) {
  if (!map || !geo || geoDomain === geo.domain) return;
  geoDomain = geo.domain;
  for (const k of Object.keys(layers)) layers[k].clearLayers();
  for (const k of Object.keys(sigs)) delete sigs[k];
  markers.forEach(({ m }) => map.removeLayer(m));
  markers.clear();
  for (const f of geo.layers.boundaries) {
    const op = f.properties.role === "operational";
    L.geoJSON(f, { style: { color: "#0e0e10", weight: op ? 2.2 : 1.2, dashArray: op ? null : "4 6", fillColor: op ? "#7a4dff" : "#0e0e10", fillOpacity: op ? 0.04 : 0.015 } })
      .bindTooltip(`${f.properties.label} · ${f.properties.source}`, { className: "tip", sticky: true })
      .addTo(layers.boundaries);
  }
  for (const c of geo.layers.coverage) {
    L.circle([c.lat, c.lon], { radius: c.radius_km * 1000, color: "#1f6bff", weight: 1, opacity: 0.35, fillOpacity: 0.035, interactive: false })
      .addTo(layers.coverage);
  }
  for (const z of geo.layers.zones) {
    L.polygon(z.polygon, { color: "#0f9d58", weight: 1.6, dashArray: "5 5", fillColor: "#0f9d58", fillOpacity: 0.07 })
      .bindTooltip(z.label, { className: "tip", sticky: true }).addTo(layers.zones);
    const c = z.polygon.reduce((a, p) => [a[0] + p[0] / z.polygon.length, a[1] + p[1] / z.polygon.length], [0, 0]);
    L.marker(c, { interactive: false, icon: L.divIcon({ className: "zone-label", html: z.name, iconSize: [110, 12], iconAnchor: [55, 6] }) }).addTo(layers.labels);
  }
}

// ---------------------------------------------------------------- dynamic layers (every tick)
function markerIcon(p) {
  const s = Math.max(9, Math.round((p.size || 9) * 1.05));
  return L.divIcon({ className: "mk-wrap", iconSize: [s, s], iconAnchor: [s / 2, s / 2],
    html: `<div class="mk ${SHAPE[p.group] || ""} ${PULSE.has(p.group) ? "pulse" : ""}" style="--s:${s}px;--c:${COLORS[p.group] || "#888"}"></div>` });
}

function big(icon, cls = "") {
  return L.divIcon({ className: "mk-wrap", iconSize: [34, 34], iconAnchor: [17, 17], html: `<div class="mk-big ${cls}">${icon}</div>` });
}

export function update(state, boundaryByName) {
  if (!map || !state) return;
  const pts = state.map?.points || [];
  const seen = new Set();
  pts.forEach((p, i) => {
    const id = p.id || `${p.group}-${i}`;
    seen.add(id);
    const sig = `${p.group}|${p.size}`;
    const cur = markers.get(id);
    if (!cur) {
      const m = L.marker([p.lat, p.lon], { icon: markerIcon(p), riseOnHover: true, keyboard: false });
      m.bindTooltip(p.label, { className: "tip", direction: "top", offset: [0, -6] });
      if (toggles.units) m.addTo(map);
      markers.set(id, { m, sig });
    } else {
      cur.m.setLatLng([p.lat, p.lon]);
      if (cur.sig !== sig) { cur.m.setIcon(markerIcon(p)); cur.sig = sig; }
      cur.m.setTooltipContent(p.label);
    }
  });
  markers.forEach((v, id) => {
    if (seen.has(id)) return;
    markers.delete(id);
    v.m.getElement()?.classList.add("leaving");
    setTimeout(() => map.removeLayer(v.m), 420);
  });

  const geo = state.geo || {};
  // incident (108): caller, nearest ambulance, assigned crew, hospital, simulated route
  const inc = geo.incident;
  if (changed("incident", [inc, geo.ghosts])) {
  layers.incident.clearLayers();
  if (inc) {
    if (inc.route?.length > 1) {
      L.polyline(inc.route, { color: "#e5194f", weight: 4, opacity: 0.85, className: "route-line" })
        .bindTooltip(`Simulated response route (straight-line) · ETA ~${inc.eta_min ?? "?"} min`, { className: "tip", sticky: true })
        .addTo(layers.incident);
    }
    L.marker([inc.caller.lat, inc.caller.lon], { icon: big("📞", "caller"), zIndexOffset: 1000 }).bindTooltip(inc.caller.label, { className: "tip" }).addTo(layers.incident);
    if (inc.ambulance) L.marker([inc.ambulance.lat, inc.ambulance.lon], { icon: big("🚑"), zIndexOffset: 900 }).bindTooltip(inc.ambulance.label, { className: "tip" }).addTo(layers.incident);
    if (inc.nearest && !inc.ambulance) L.marker([inc.nearest.lat, inc.nearest.lon], { icon: big("🚑"), zIndexOffset: 900 }).bindTooltip(`${inc.nearest.label} · ${inc.nearest.km} km`, { className: "tip" }).addTo(layers.incident);
    L.marker([inc.hospital.lat, inc.hospital.lon], { icon: big("✚"), zIndexOffset: 800 }).bindTooltip(`${inc.hospital.label} · ${inc.hospital.free_beds} beds free`, { className: "tip" }).addTo(layers.incident);
  }
  for (const g of geo.ghosts || []) {
    L.circleMarker([g.lat, g.lon], { radius: 6, color: "#e5194f", weight: 1.5, dashArray: "2 3", fillOpacity: 0 })
      .bindTooltip(`${g.id}: frozen GPS position (what dispatch believes)`, { className: "tip" }).addTo(layers.incident);
  }
  }

  // affected areas: circles (108 surge) and named regions (UPI)
  if (changed("affected", geo.affected)) {
  layers.affected.clearLayers();
  for (const a of geo.affected || []) {
    if (a.type === "circle") {
      L.circle([a.lat, a.lon], { radius: a.radius_km * 1000, color: "#e5194f", weight: 2, fillColor: "#e5194f", fillOpacity: 0.12, className: "route-line" })
        .bindTooltip(a.label, { className: "tip" }).addTo(layers.affected);
    } else if (a.type === "region" && boundaryByName?.[a.name]) {
      L.geoJSON(boundaryByName[a.name], { style: { color: "#e5194f", weight: 2.5, fillColor: "#e5194f", fillOpacity: 0.14 } })
        .bindTooltip(a.label, { className: "tip", sticky: true }).addTo(layers.affected);
    }
  }
  }

  // free-delivery zones: configured (drifted) polygon + customers
  if (changed("customers", [geo.zones, geo.customers])) {
  layers.customers.clearLayers();
  for (const z of geo.zones || []) {
    if (z.configured) {
      L.polygon(z.configured, { color: z.status === "restored" ? "#0f9d58" : "#e5194f", weight: 2.5, fillOpacity: 0.12,
        fillColor: z.status === "restored" ? "#0f9d58" : "#e5194f" })
        .bindTooltip(`${z.name}: configured free-delivery boundary (${z.status})`, { className: "tip", sticky: true }).addTo(layers.customers);
    }
  }
  for (const c of geo.customers || []) {
    const wrong = c.truly_free && !c.free;
    L.circleMarker([c.lat, c.lon], { radius: wrong ? 5 : 3.5, weight: wrong ? 2 : 1, color: wrong ? "#e5194f" : c.free ? "#0f9d58" : "#8a877e",
      fillColor: wrong ? "#e5194f" : c.free ? "#0f9d58" : "#8a877e", fillOpacity: 0.8 })
      .bindTooltip(wrong ? "Inside the service area but shown a delivery fee" : c.free ? "Free delivery" : "Outside free-delivery zone", { className: "tip" })
      .addTo(layers.customers);
  }
  }

  // UPI transaction flows: city -> gateway -> bank
  if (changed("flows", geo.flows)) {
  layers.flows.clearLayers();
  for (const f of geo.flows || []) {
    L.polyline([f.from, f.via, f.to], { color: f.failing ? "#e5194f" : "#00b8d9", weight: f.failing ? 2.5 : 1.6, opacity: 0.7, className: "flow-line" })
      .bindTooltip(`${f.city} → gateway → ${f.bank}${f.failing ? " · failing" : ""}`, { className: "tip", sticky: true }).addTo(layers.flows);
  }
  }

  if (state.focus) fit(state.focus, true);
}

function fit(focus, animate) {
  if (!focus?.bounds) return;
  // the camera only moves when the focus TARGET changes (not every time a moving ambulance nudges the bounds)
  const key = `${focus.level}|${focus.label}`;
  lastFocus = focus;
  if (key === focusKey && animate) return;
  focusKey = key;
  const maxZoom = { national: 5.5, state: 8, district: 11, city: 11.5, local: 14 }[focus.level] || 13;
  const opts = { padding: [60, 60], maxZoom };
  map.invalidateSize(false);
  const size = map.getSize();
  if (!size.x || !size.y) { focusKey = null; return; }   // not on screen yet: try again on the next update
  try {
    if (animate) map.flyToBounds(focus.bounds, { ...opts, duration: 1.2 });
    else map.fitBounds(focus.bounds, opts);
  } catch {
    map.fitBounds(focus.bounds, { ...opts, animate: false });
  }
}

export function recenter() {
  if (lastFocus) { focusKey = null; fit(lastFocus, true); }
}
