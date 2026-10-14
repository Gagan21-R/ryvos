// One Leaflet map for the whole app (never recreated). Pages "borrow" it by re-parenting its element.
// All geography comes from the backend: static layers via /api/geography, dynamic layers via city.state.
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const COLORS = {
  unit_free: "#1f5fc4", unit_busy: "#4b2bb3", unit_problem: "#b3261e", unit_reserve: "#8d8a9c",
  site: "#17784b", site_bad: "#c27a12", demand: "#b4490f", demand_urgent: "#b3261e", hub: "#1c1836",
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
    L.geoJSON(f, { style: { color: "#1c1836", weight: op ? 1.8 : 1, dashArray: op ? null : "4 6", fillColor: op ? "#4b2bb3" : "#1c1836", fillOpacity: op ? 0.04 : 0.015 } })
      .bindTooltip(`${f.properties.label} · ${f.properties.source}`, { className: "tip", sticky: true })
      .addTo(layers.boundaries);
  }
  for (const c of geo.layers.coverage) {
    L.circle([c.lat, c.lon], { radius: c.radius_km * 1000, color: "#1f5fc4", weight: 1, opacity: 0.35, fillOpacity: 0.035, interactive: false })
      .addTo(layers.coverage);
  }
  for (const z of geo.layers.zones) {
    L.polygon(z.polygon, { color: "#17784b", weight: 1.4, dashArray: "5 5", fillColor: "#17784b", fillOpacity: 0.07 })
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

const SVG = (paths) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;
const ICONS = {   // lucide icon paths (ISC licence)
  phone: SVG('<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>'),
  ambulance: SVG('<path d="M10 10H6"/><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.28a1 1 0 0 0-.684-.948l-1.923-.641a1 1 0 0 1-.578-.502l-1.539-3.076A1 1 0 0 0 16.382 8H14"/><path d="M8 8v4"/><path d="M9 18h6"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>'),
  hospital: SVG('<path d="M12 6v4"/><path d="M14 14h-4"/><path d="M14 18h-4"/><path d="M14 8h-4"/><path d="M18 12h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2h2"/><path d="M18 22V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v18"/>'),
};

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
      L.polyline(inc.route, { color: "#b3261e", weight: 3, opacity: 0.85, className: "route-line" })
        .bindTooltip(`Simulated response route (straight-line) · ETA ~${inc.eta_min ?? "?"} min`, { className: "tip", sticky: true })
        .addTo(layers.incident);
    }
    L.marker([inc.caller.lat, inc.caller.lon], { icon: big(ICONS.phone, "caller"), zIndexOffset: 1000 }).bindTooltip(inc.caller.label, { className: "tip" }).addTo(layers.incident);
    if (inc.ambulance) L.marker([inc.ambulance.lat, inc.ambulance.lon], { icon: big(ICONS.ambulance), zIndexOffset: 900 }).bindTooltip(inc.ambulance.label, { className: "tip" }).addTo(layers.incident);
    if (inc.nearest && !inc.ambulance) L.marker([inc.nearest.lat, inc.nearest.lon], { icon: big(ICONS.ambulance), zIndexOffset: 900 }).bindTooltip(`${inc.nearest.label} · ${inc.nearest.km} km`, { className: "tip" }).addTo(layers.incident);
    L.marker([inc.hospital.lat, inc.hospital.lon], { icon: big(ICONS.hospital), zIndexOffset: 800 }).bindTooltip(`${inc.hospital.label} · ${inc.hospital.free_beds} beds free`, { className: "tip" }).addTo(layers.incident);
  }
  for (const g of geo.ghosts || []) {
    L.circleMarker([g.lat, g.lon], { radius: 6, color: "#b3261e", weight: 1.5, dashArray: "2 3", fillOpacity: 0 })
      .bindTooltip(`${g.id}: frozen GPS position (what dispatch believes)`, { className: "tip" }).addTo(layers.incident);
  }
  }

  // affected areas: circles (108 surge) and named regions (UPI)
  if (changed("affected", geo.affected)) {
  layers.affected.clearLayers();
  for (const a of geo.affected || []) {
    if (a.type === "circle") {
      L.circle([a.lat, a.lon], { radius: a.radius_km * 1000, color: "#b3261e", weight: 1.6, fillColor: "#b3261e", fillOpacity: 0.1, className: "route-line" })
        .bindTooltip(a.label, { className: "tip" }).addTo(layers.affected);
    } else if (a.type === "region" && boundaryByName?.[a.name]) {
      L.geoJSON(boundaryByName[a.name], { style: { color: "#b3261e", weight: 2, fillColor: "#b3261e", fillOpacity: 0.1 } })
        .bindTooltip(a.label, { className: "tip", sticky: true }).addTo(layers.affected);
    }
  }
  }

  // free-delivery zones: configured (drifted) polygon + customers
  if (changed("customers", [geo.zones, geo.customers])) {
  layers.customers.clearLayers();
  for (const z of geo.zones || []) {
    if (z.configured) {
      L.polygon(z.configured, { color: z.status === "restored" ? "#17784b" : "#b3261e", weight: 2, fillOpacity: 0.1,
        fillColor: z.status === "restored" ? "#17784b" : "#b3261e" })
        .bindTooltip(`${z.name}: configured free-delivery boundary (${z.status})`, { className: "tip", sticky: true }).addTo(layers.customers);
    }
  }
  for (const c of geo.customers || []) {
    const wrong = c.truly_free && !c.free;
    L.circleMarker([c.lat, c.lon], { radius: wrong ? 5 : 3.5, weight: wrong ? 2 : 1, color: wrong ? "#b3261e" : c.free ? "#17784b" : "#8d8a9c",
      fillColor: wrong ? "#b3261e" : c.free ? "#17784b" : "#8d8a9c", fillOpacity: 0.8 })
      .bindTooltip(wrong ? "Inside the service area but shown a delivery fee" : c.free ? "Free delivery" : "Outside free-delivery zone", { className: "tip" })
      .addTo(layers.customers);
  }
  }

  // UPI transaction flows: city -> gateway -> bank
  if (changed("flows", geo.flows)) {
  layers.flows.clearLayers();
  for (const f of geo.flows || []) {
    L.polyline([f.from, f.via, f.to], { color: f.failing ? "#b3261e" : "#4b2bb3", weight: f.failing ? 2.2 : 1.3, opacity: 0.7, className: "flow-line" })
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
