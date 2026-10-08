"use strict";
/* RYVO dashboard: live stream (SSE) -> map, scoreboard, agent pipeline, battle log, learning charts. */

const $ = (s, r = document) => r.querySelector(s);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const md = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/`(.+?)`/g, "<code>$1</code>");
const plain = (s) => String(s ?? "").replace(/\*\*|`/g, "");
const cssVar = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
const store = { get(k) { try { return localStorage.getItem(k); } catch { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch { /* private mode */ } } };

let META = null, LIVE = null, LEARN = null;
let curDomain = null, learnDomain = null, userPickedLearn = false, launcherDomain = null;
let lastLogKey = null, lastLiveAt = 0, queued = null;
let prevAttackCount = 0, prevFixCount = 0;

const SHORT = { emergency: "108 Emergency", food: "Food delivery", upi: "UPI payments", all: "Rotate all" };
const GROUP = {
  unit_free: ["--sky", "", false], unit_busy: ["--violet", "", false], unit_problem: ["--red", "", true],
  unit_reserve: ["--slate", "", false], site: ["--green", "sq", false], site_bad: ["--amber", "sq", true],
  demand: ["--orange", "", false], demand_urgent: ["--pink", "", true], hub: ["--cyan", "hub", false],
};
const WHO = {
  red: ["RED", "--red", "⚔️", "Attacker AI"], monitor: ["MONITOR", "--amber", "📡", "Watches signals"],
  diagnoser: ["DIAGNOSER", "--blue", "🧠", "Finds root cause"], fixer: ["FIXER", "--cyan", "🛠️", "Safe fixes only"],
  referee: ["REFEREE", "--violet", "⚖️", "Scores impact"], twin: ["TWIN", "--slate", "🏙️", ""],
};
const VIEWS = { emergency: [[12.975, 77.63], 11], food: [[12.975, 77.63], 11], upi: [[21.6, 79.2], 5] };

/* ------------------------------------------------------------------ helpers */
function toast(msg, color = "--blue") {
  const t = document.createElement("div");
  t.className = "toast"; t.style.setProperty("--c", `var(${color})`); t.innerHTML = msg;
  $("#toasts").appendChild(t);
  setTimeout(() => { t.classList.add("out"); setTimeout(() => t.remove(), 400); }, 3200);
}
async function post(body, okMsg, color) {
  try {
    const r = await fetch("/api/control", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const j = await r.json();
    if (!r.ok) throw new Error(j.error || r.statusText);
    if (okMsg) toast(okMsg, color);
    return true;
  } catch (e) { toast(`⚠️ ${esc(e.message)}`, "--red"); return false; }
}
function countTo(el, value, decimals = 0) {
  if (typeof value !== "number" || Number.isNaN(value)) { el.textContent = value ?? "–"; delete el.dataset.v; return; }
  const from = el.dataset.v !== undefined ? parseFloat(el.dataset.v) : value;
  el.dataset.v = value;
  const start = performance.now(), dur = 650;
  const step = (now) => {
    const k = Math.min(1, (now - start) / dur), e = 1 - Math.pow(1 - k, 3);
    el.textContent = (from + (value - from) * e).toFixed(decimals);
    if (k < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
const decimalsOf = (v) => (Number.isInteger(v) ? 0 : 1);
function setHTML(el, html) {           // only touch the DOM when something changed (keeps animations smooth)
  if (el._html !== html) { el.innerHTML = html; el._html = html; }
}
function flash(el) { el.classList.remove("flash"); void el.offsetWidth; el.classList.add("flash"); }

/* ------------------------------------------------------------------ top bar */
function buildDomainSwitch() {
  const nav = $("#domainSwitch");
  [...META.order, "all"].forEach((d) => {
    const b = document.createElement("button");
    b.dataset.domain = d;
    b.innerHTML = `${d === "all" ? "🔁" : META.domains[d].icon} ${SHORT[d]}<span class="next">next round</span>`;
    b.onclick = () => {
      const label = d === "all" ? "Rotating all three systems" : `${META.domains[d].icon} ${META.domains[d].title}`;
      post({ cmd: "domain", domain: d }, `${label}: switching at the next round`, "--blue");
    };
    nav.appendChild(b);
  });
  window.addEventListener("resize", moveIndicator);
}
function moveIndicator() {
  const active = $("#domainSwitch button.active"), ind = $("#domainIndicator");
  if (!active) return;
  ind.style.left = active.offsetLeft + "px"; ind.style.width = active.offsetWidth + "px";
}
function setConn(state, text) {
  const c = $("#conn"); c.className = `conn ${state}`; $("#connText").textContent = text;
}

/* ------------------------------------------------------------------ pipeline + feed */
function buildPipeline() {
  $("#pipeline").innerHTML = ["red", "monitor", "diagnoser", "fixer", "referee"].map((w) => {
    const [nm, c, ic, st] = WHO[w];
    return `<div class="pipe-node" id="pipe-${w}" style="--c:var(${c})"><div class="ic">${ic}</div><div class="nm">${nm}</div><div class="st">${st}</div></div>`;
  }).join("");
}
const activeTimers = {};
function pulseNode(who, text) {
  const n = $(`#pipe-${who}`); if (!n) return;
  n.classList.add("active"); $(".st", n).textContent = plain(text).slice(0, 70);
  clearTimeout(activeTimers[who]);
  activeTimers[who] = setTimeout(() => n.classList.remove("active"), 1800);
}
function feedItem(e) {
  const [nm, c] = WHO[e.who] || [e.who.toUpperCase(), "--slate"];
  const dm = META.domains[e.domain];
  const when = e.t !== null && e.t !== undefined ? `r${e.round} · t${e.t}` : `r${e.round}`;
  const li = document.createElement("li");
  li.style.setProperty("--c", `var(${c})`);
  li.innerHTML = `<span class="who">${nm}</span><div><span class="meta">${dm ? dm.icon : ""} ${when}</span><span class="txt">${md(e.text)}</span></div>`;
  return li;
}
function updateFeed(log) {
  const feed = $("#feed");
  const key = (e) => `${e.round}|${e.t}|${e.who}|${e.text}`;
  let fresh;
  const idx = lastLogKey ? log.map(key).lastIndexOf(lastLogKey) : -1;
  if (idx === -1) {
    feed.innerHTML = "";
    log.slice(-40).forEach((e) => feed.prepend(feedItem(e)));
    fresh = lastLogKey ? log.slice(-3) : [];
  } else {
    fresh = log.slice(idx + 1);
    fresh.forEach((e) => feed.prepend(feedItem(e)));
  }
  while (feed.children.length > 60) feed.lastChild.remove();
  if (log.length) lastLogKey = key(log[log.length - 1]);
  fresh.forEach((e) => { if (WHO[e.who]) pulseNode(e.who, e.text); checkLaunched(e); });
  $("#feedCount").textContent = `${feed.children.length} recent events`;
}

/* ------------------------------------------------------------------ map */
let map, tiles, mapDomain = null;
const markers = new Map(), lines = new Map(), labelLayer = L.layerGroup();
function initMap() {
  map = L.map("map", { zoomControl: false, minZoom: 3, zoomSnap: 0.25 }).setView(VIEWS.emergency[0], VIEWS.emergency[1]);
  L.control.zoom({ position: "bottomright" }).addTo(map);
  labelLayer.addTo(map);
  setTiles();
  const el = $("#map");
  map.on("zoomstart", () => el.classList.add("no-anim"));
  map.on("zoomend", () => setTimeout(() => el.classList.remove("no-anim"), 80));
  new ResizeObserver(() => map.invalidateSize()).observe(el);
}
function setTiles() {
  if (tiles) map.removeLayer(tiles);
  // OpenStreetMap tiles need no API key; the dark theme re-colours them with a CSS filter
  tiles = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  });
  const card = $(".map-card");
  tiles.on("tileerror", () => card.classList.add("offline"));
  tiles.on("tileload", () => card.classList.remove("offline"));
  tiles.addTo(map);
}
function markerIcon(p) {
  const [c, shape, pulse] = GROUP[p.group] || ["--slate", "", false];
  const s = Math.max(8, Math.round((p.size || 9) * 1.05));
  return L.divIcon({
    className: "mk-wrap", iconSize: [s, s], iconAnchor: [s / 2, s / 2],
    html: `<div class="mk ${shape} ${pulse ? "pulse" : ""}" style="--s:${s}px;--c:var(${c})"></div>`,
  });
}
function clearMap() {
  markers.forEach(({ m }) => map.removeLayer(m)); markers.clear();
  lines.forEach(({ l }) => map.removeLayer(l)); lines.clear();
  labelLayer.clearLayers();
}
function updateMap(s) {
  const m = s.map || { points: [], lines: [], labels: [] };
  if (mapDomain !== s.domain) {
    clearMap(); mapDomain = s.domain;
    const [c, z] = VIEWS[s.domain] || VIEWS.emergency;
    map.flyTo(c, z, { duration: 1.4 });
    (m.labels || []).forEach((lb) => L.marker([lb.lat, lb.lon], {
      interactive: false, icon: L.divIcon({ className: "zone-label", html: esc(lb.text), iconSize: [120, 14], iconAnchor: [60, -4] }),
    }).addTo(labelLayer));
  }
  const seen = new Set();
  m.points.forEach((p, i) => {
    const id = p.id || `${p.group}-${i}`;
    seen.add(id);
    const sig = `${p.group}|${p.size}`;
    const cur = markers.get(id);
    if (!cur) {
      const mk = L.marker([p.lat, p.lon], { icon: markerIcon(p), riseOnHover: true, zIndexOffset: p.group.startsWith("site") || p.group === "hub" ? -100 : 0 });
      mk.bindTooltip(esc(p.label), { className: "tip", direction: "top", offset: [0, -8] });
      mk.addTo(map);
      markers.set(id, { m: mk, sig });
    } else {
      cur.m.setLatLng([p.lat, p.lon]);
      if (cur.sig !== sig) { cur.m.setIcon(markerIcon(p)); cur.sig = sig; }
      cur.m.setTooltipContent(esc(p.label));
    }
  });
  markers.forEach((v, id) => {
    if (seen.has(id)) return;
    markers.delete(id);
    const el = v.m.getElement();
    if (el) el.classList.add("leaving");
    setTimeout(() => map.removeLayer(v.m), 420);
  });
  const seenL = new Set();
  (m.lines || []).forEach((ln, i) => {
    const id = ln.id || `line-${i}`; seenL.add(id);
    const cur = lines.get(id);
    const [c] = GROUP[ln.group] || ["--slate"];
    if (cur && cur.group === ln.group) return;
    if (cur) map.removeLayer(cur.l);
    const l = L.polyline([ln.from, ln.to], { color: cssVar(c), weight: 3, opacity: 0.85, className: `flow-line ${ln.group === "site" ? "" : "bad"}`, interactive: false }).addTo(map);
    lines.set(id, { l, group: ln.group });
  });
  lines.forEach((v, id) => { if (!seenL.has(id)) { map.removeLayer(v.l); lines.delete(id); } });

  const D = META.domains[s.domain];
  const groups = new Set(m.points.map((p) => p.group));
  const present = Object.keys(GROUP).filter((g) => groups.has(g));   // stable order = no legend flicker
  setHTML($("#mapLegend"), present.filter((g) => D.legend[g]).map((g) => {
    const [c, shape] = GROUP[g];
    return `<span><i class="${shape ? "sq" : ""}" style="background:var(${c})"></i>${esc(D.legend[g])}</span>`;
  }).join(""));
}

/* ------------------------------------------------------------------ live update */
function onLive(p) {
  LIVE = p; lastLiveAt = Date.now();
  const s = p.state, st = p.status || {}, D = META.domains[s.domain];
  if (!D) return;
  setConn(st.paused ? "" : "live", st.paused ? "Paused" : "Live");

  if (curDomain !== s.domain) {
    curDomain = s.domain;
    const rc = $(".round-card"); rc.classList.add("swap"); setTimeout(() => rc.classList.remove("swap"), 600);
    if (!userPickedLearn) { learnDomain = s.domain; renderLearning(); }
    renderScore();
  }
  $("#domainIcon").textContent = D.icon;
  $("#domainName").textContent = D.title;
  $("#stakeLabel").textContent = `${D.stake} at stake`;
  countTo($("#roundNo"), s.round);

  // round progress + phase
  const truth = s.truth || {}, attacks = truth.attacks || [], fixes = truth.fixes || [];
  const incidents = Object.values(p.incidents || {}).filter((i) => i.round === s.round);
  $("#progressFill").style.width = `${Math.min(100, (100 * s.t) / s.round_ticks)}%`;
  $("#progressFill").classList.toggle("attacked", attacks.length > 0);
  $("#attackMark").style.left = `${(100 * D.attack_at) / s.round_ticks}%`;
  const ph = $("#phase");
  if (s.t >= s.round_ticks - 2) { ph.className = "phase scoring"; ph.textContent = "Referee scoring the round"; }
  else if (!attacks.length) { ph.className = "phase calm"; ph.textContent = s.t < D.attack_at ? `Calm before the storm · Red strikes at t=${D.attack_at}` : "Calm"; }
  else if (incidents.length) { ph.className = "phase attack"; ph.textContent = st.blue_enabled === false ? "Under attack · no defenders!" : "Under attack · Blue responding"; }
  else if (fixes.length) { ph.className = "phase recover"; ph.textContent = "Recovered · system stable"; }
  else { ph.className = "phase attack"; ph.textContent = "Attack landed · waiting for symptoms"; }
  $("#clock").textContent = `t = ${s.t} / ${s.round_ticks} ${D.tick_unit}`;

  // top-bar status
  const blueOn = st.blue_enabled !== false;
  $("#blueToggle").checked = blueOn;
  $("#blueOffBanner").classList.toggle("show", !blueOn);
  const pb = $("#pauseBtn"); pb.textContent = st.paused ? "▶" : "⏸"; pb.classList.toggle("paused", !!st.paused);
  document.querySelectorAll("#domainSwitch button").forEach((b) => {
    const d = b.dataset.domain;
    b.classList.toggle("active", d === (st.domain_mode || s.domain));
    b.classList.toggle("pending", d === st.domain_mode && d !== "all" && d !== s.domain);
  });
  moveIndicator();

  // red / blue cards
  const redLog = [...p.log].reverse().find((e) => e.who === "red" && e.round === s.round);
  const mode = redLog ? (plain(redLog.text).split("·").pop() || "").trim() : "";
  $("#redMain").textContent = attacks.length ? attacks.map((a) => a.replace(/_/g, " ")).join(" + ") : (s.t < D.attack_at ? "Choosing a target…" : "Holding fire");
  setHTML($("#redChips"), attacks.map((a) => `<span class="chip red" title="${esc(D.attacks[a] || "")}">⚡ ${esc(a)}</span>`).join(""));
  $("#redFoot").textContent = attacks.length
    ? (mode.startsWith("scenario") ? `Scenario planner: ${mode.replace("scenario", "").trim()}` : mode.startsWith("exploit") ? "Exploit: picked the attack it believes hurts most" : mode.startsWith("explore") ? "Explore: trying something new to learn" : D.attacks[attacks[0]] || "")
    : "Multi-armed bandit · learns which attack hurts most";
  $("#redCard").classList.toggle("hot", attacks.length > 0 && incidents.length > 0);
  if (attacks.length > prevAttackCount) flash($("#redCard"));
  prevAttackCount = attacks.length;

  const blueCard = $("#blueCard");
  blueCard.classList.toggle("off", !blueOn);
  blueCard.classList.toggle("hot", blueOn && incidents.length > 0);
  $("#blueMain").textContent = !blueOn ? "Defenders offline" : incidents.length ? `Handling ${incidents.length} incident${incidents.length > 1 ? "s" : ""}` : fixes.length ? "Threat neutralised ✓" : "All systems normal";
  setHTML($("#blueChips"), incidents.map((i) => `<span class="chip amber">⚠ ${esc(i.key)}</span>`).join("") + fixes.map((f) => `<span class="chip teal" title="${esc(D.fixes[f] || "")}">✓ ${esc(f)}</span>`).join(""));
  const diag = [...p.log].reverse().find((e) => e.who === "diagnoser" && e.round === s.round);
  $("#blueFoot").textContent = !diag ? "Monitor → Diagnoser → Fixer · whitelisted fixes only"
    : plain(diag.text).includes("playbook:") ? "⚡ Answered instantly from the playbook (learned earlier)"
    : plain(diag.text).includes("rule:") ? "🔎 New problem: investigated and tried the rule book"
    : plain(diag.text).replace(/^\S+\s/, "").slice(0, 90);
  if (fixes.length > prevFixCount) flash(blueCard);
  prevFixCount = fixes.length;

  // map, KPIs, incidents
  updateMap(s);
  const kp = s.kpis || [];
  setHTML($("#mapKpis"), kp.map(([label], i) => `<div class="kpi"><span>${esc(label)}</span><b id="kpi${i}">–</b></div>`).join(""));
  kp.forEach(([, v], i) => {
    const el = $(`#kpi${i}`);
    if (el.dataset.last !== String(v)) { el.dataset.last = String(v); countTo(el, v, typeof v === "number" ? decimalsOf(v) : 0); }
  });
  setHTML($("#mapIncidents"), incidents.map((i) => `<div class="incident">⚠ ${esc(i.key)}</div>`).join(""));

  updateFeed(p.log || []);
  if (launcherDomain !== (st.domain_mode && st.domain_mode !== "all" ? st.domain_mode : s.domain)) buildLauncher();
}

/* ------------------------------------------------------------------ launcher */
function buildLauncher() {
  const st = LIVE?.status || {};
  launcherDomain = st.domain_mode && st.domain_mode !== "all" ? st.domain_mode : (LIVE?.state?.domain || META.order[0]);
  const D = META.domains[launcherDomain];
  $("#launcherDomain").textContent = `${D.icon} ${D.title}`;
  const cards = [];
  cards.push(`<button class="launch ai" data-key="ai"><span class="badge">QUEUED</span><div class="lt">🎲 Let Red's AI decide</div><div class="ld">The bandit picks the attack it believes hurts most, and sometimes explores.</div></button>`);
  Object.entries(D.scenarios).forEach(([name, attacks]) => cards.push(
    `<button class="launch combo" data-key="sc:${esc(name)}"><span class="badge">QUEUED</span><div class="lt">🌪️ ${esc(name)}</div><div class="ld">Combo disaster</div><div class="chips">${attacks.map((a) => `<span class="chip red">${esc(a)}</span>`).join("")}</div></button>`));
  Object.entries(D.attacks).forEach(([a, info]) => cards.push(
    `<button class="launch single" data-key="at:${esc(a)}"><span class="badge">QUEUED</span><div class="lt">⚡ ${esc(a.replace(/_/g, " "))}</div><div class="ld">${esc(info)}</div></button>`));
  const grid = $("#launchGrid");
  grid.innerHTML = cards.join("");
  grid.querySelectorAll(".launch").forEach((btn) => btn.addEventListener("click", () => launch(btn.dataset.key, D)));
  if (queued && queued.domain === launcherDomain) grid.querySelector(`[data-key="${CSS.escape(queued.key)}"]`)?.classList.add("queued");
}
async function launch(key, D) {
  let name = null, attacks = [];
  if (key.startsWith("sc:")) { name = key.slice(3); attacks = D.scenarios[name]; }
  else if (key.startsWith("at:")) { name = key.slice(3); attacks = [name]; }
  const ok = await post({ cmd: "scenario", name, attacks },
    key === "ai" ? "🎲 Red's AI will choose the next attack" : `🎯 Queued <b>${esc(name)}</b> for the next ${D.icon} round`, key === "ai" ? "--cyan" : "--red");
  if (!ok) return;
  document.querySelectorAll(".launch.queued").forEach((b) => b.classList.remove("queued"));
  queued = key === "ai" ? null : { key, name, domain: D.id };
  if (queued) $(`#launchGrid [data-key="${CSS.escape(key)}"]`)?.classList.add("queued");
}
function checkLaunched(e) {
  if (!queued || e.who !== "red") return;
  if (plain(e.text).includes(`scenario ${queued.name}`)) {
    toast(`🚀 Red launched <b>${esc(queued.name)}</b>`, "--red");
    document.querySelectorAll(".launch.queued").forEach((b) => b.classList.remove("queued"));
    queued = null;
  }
}

/* ------------------------------------------------------------------ learning */
let charts = {};
function buildLearnTabs() {
  const tabs = $("#learnTabs");
  META.order.forEach((d) => {
    const b = document.createElement("button");
    b.dataset.domain = d; b.textContent = `${META.domains[d].icon} ${SHORT[d]}`;
    b.onclick = () => { userPickedLearn = true; learnDomain = d; renderLearning(); };
    tabs.appendChild(b);
  });
  const reset = document.createElement("button");
  reset.className = "btn ghost"; reset.textContent = "↺ Reset learning";
  reset.onclick = () => $("#modal").classList.add("open");
  tabs.parentElement.appendChild(reset);
}
function chartBase() {
  const grid = cssVar("--grid"), muted = cssVar("--muted");
  return {
    responsive: true, maintainAspectRatio: false, animation: { duration: 700, easing: "easeOutQuart" },
    interaction: { mode: "nearest", intersect: false },
    plugins: { legend: { display: false }, tooltip: { backgroundColor: cssVar("--panel-solid"), titleColor: cssVar("--text"), bodyColor: cssVar("--text2"), borderColor: cssVar("--border-hi"), borderWidth: 1, padding: 10, cornerRadius: 10 } },
    scales: {
      x: { grid: { display: false }, ticks: { color: muted, maxTicksLimit: 12 }, border: { color: grid } },
      y: { grid: { color: grid }, ticks: { color: muted }, border: { display: false }, beginAtZero: true },
    },
  };
}
function initCharts() {
  Chart.defaults.font.family = "Inter, system-ui, sans-serif";
  Chart.defaults.font.size = 11.5;
  Object.values(charts).forEach((c) => c.destroy());
  charts = {};
  charts.c1 = new Chart($("#c1"), { type: "line", data: { labels: [], datasets: [] }, options: chartBase() });
  charts.c2 = new Chart($("#c2"), { type: "bar", data: { labels: [], datasets: [] }, options: chartBase() });
  const o3 = chartBase();
  o3.scales.y = { ...o3.scales.y, beginAtZero: false, ticks: { color: cssVar("--muted"), stepSize: 1, autoSkip: false } };
  o3.scales.x = { ...o3.scales.x, type: "linear", ticks: { color: cssVar("--muted"), precision: 0 } };
  charts.c3 = new Chart($("#c3"), { type: "bubble", data: { datasets: [] }, options: o3 });
  const o4 = chartBase(); o4.indexAxis = "y";
  o4.scales.x = { ...o4.scales.y, max: 1 }; o4.scales.y = { grid: { display: false }, ticks: { color: cssVar("--text2") }, border: { display: false } };
  charts.c4 = new Chart($("#c4"), { type: "bar", data: { labels: [], datasets: [] }, options: o4 });
}
function renderScore() {
  if (!LEARN || !curDomain) return;
  const D = META.domains[curDomain], head = D.metrics[0];
  const rs = LEARN.results.filter((r) => r.domain === curDomain);
  const r = rs[rs.length - 1];
  if (!r) { $("#scoreValue").textContent = "–"; $("#scoreLabel").textContent = "No round finished yet"; return; }
  countTo($("#scoreValue"), r[head.key], decimalsOf(r[head.key]));
  $("#scoreUnit").textContent = head.unit;
  $("#scoreLabel").textContent = `${head.label} · round ${r.round}`;
  const cmp = $("#scoreCompare");
  if (D.baseline !== null && D.baseline !== undefined) {
    const diff = r[head.key] - D.baseline;
    cmp.className = `score-compare ${diff > 0.5 ? "bad" : "good"}`;
    cmp.textContent = diff > 0.5 ? `▲ ${diff.toFixed(1)}${head.unit} worse than a normal day (${D.baseline}${head.unit})` : `● About a normal day (${D.baseline}${head.unit})`;
  }
  const unit = D.tick_unit;
  $("#scoreRow").innerHTML = D.metrics.slice(1).map((m) => `<span>${esc(m.label)}<br><b>${r[m.key]}${m.unit === "₹" ? "" : m.unit}</b></span>`).join("")
    + `<span>Red damage<br><b style="color:var(--red)">${Math.round(r.red_reward * 100)}%</b></span>`
    + `<span>Blue recovery<br><b style="color:var(--cyan)">${r.recovery_ticks} ${unit}</b></span>`;
}
function onLearn(p) {
  LEARN = p;
  if (!learnDomain) learnDomain = curDomain || META.order[0];
  renderLearning();
  renderScore();
}
function renderLearning() {
  if (!LEARN || !learnDomain) return;
  document.querySelectorAll("#learnTabs button").forEach((b) => b.classList.toggle("active", b.dataset.domain === learnDomain));
  const D = META.domains[learnDomain], head = D.metrics[0], unit = D.tick_unit;
  const rs = LEARN.results.filter((r) => r.domain === learnDomain);
  const on = rs.filter((r) => r.blue_enabled !== false);
  const avg = (a) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : null);
  const scratch = avg(on.filter((r) => r.detected && !r.playbook_hits).map((r) => r.recovery_ticks));
  const learned = avg(on.filter((r) => r.detected && r.playbook_hits).map((r) => r.recovery_ticks));
  const detected = on.filter((r) => r.detected);
  const resolvedPct = detected.length ? (100 * detected.filter((r) => r.resolved).length) / detected.length : null;
  const brain = (LEARN.brain || {})[learnDomain] || { q: {}, n: {} };
  const qs = Object.entries(brain.q || {}).sort((a, b) => b[1] - a[1]);
  const book = Object.values(LEARN.playbook || {}).filter((e) => e.domain === learnDomain);

  const delta = scratch && learned ? Math.round((learned / scratch - 1) * 100) : null;
  $("#tiles").innerHTML = `
    <div class="card tile" style="--c:var(--teal)"><div class="eyebrow">Blue recovery with playbook</div>
      <div class="big"><span id="t1">${learned === null ? "–" : learned.toFixed(1)}</span><small>${unit}</small></div>
      <div class="sub">vs ${scratch === null ? "–" : scratch.toFixed(1)} ${unit} when investigating from scratch</div>
      ${delta === null ? "" : `<div class="delta ${delta <= 0 ? "good" : "bad"}">${delta <= 0 ? "▼" : "▲"} ${Math.abs(delta)}% ${delta <= 0 ? "faster" : "slower"}</div>`}</div>
    <div class="card tile" style="--c:var(--blue)"><div class="eyebrow">Incidents auto-resolved</div>
      <div class="big">${resolvedPct === null ? "–" : Math.round(resolvedPct)}<small>%</small></div>
      <div class="sub">${detected.length} attacks detected across ${rs.length} rounds, no human needed</div></div>
    <div class="card tile" style="--c:var(--red)"><div class="eyebrow">Red's favourite weak spot</div>
      <div class="big" style="font-size:22px">${qs.length ? esc(qs[0][0].replace(/_/g, " ")) : "–"}</div>
      <div class="sub">${qs.length ? `expected damage ${Math.round(qs[0][1] * 100)}% · tried ${brain.n[qs[0][0]] || 0}×` : "still exploring"}</div></div>
    <div class="card tile" style="--c:var(--violet)"><div class="eyebrow">Lessons in the playbook</div>
      <div class="big">${book.length}</div>
      <div class="sub">${book.reduce((x, e) => x + e.successes, 0)} successful re-uses so far</div></div>`;

  // chart 1: headline metric
  const labels = rs.map((r) => r.domain_round);
  $("#c1Title").innerHTML = `${esc(head.label)} per round <span class="hint">${head.unit || "count"} · lower is better</span>`;
  const blue = cssVar("--blue"), red = cssVar("--red"), teal = cssVar("--teal"), muted = cssVar("--muted");
  const ctx = $("#c1").getContext("2d");
  const grad = ctx.createLinearGradient(0, 0, 0, 260);
  grad.addColorStop(0, blue + "55"); grad.addColorStop(1, blue + "00");
  charts.c1.data.labels = labels;
  const vals = rs.map((r) => r[head.key]);
  const win = Math.max(3, Math.round(rs.length / 12));          // rolling average shows the trend through the noise
  const trend = vals.map((_, i) => { const w = vals.slice(Math.max(0, i - win + 1), i + 1); return +(w.reduce((a, b) => a + b, 0) / w.length).toFixed(2); });
  charts.c1.data.datasets = [
    { label: head.label, data: vals, borderColor: blue + "66", backgroundColor: grad, fill: true, tension: 0.3, borderWidth: 1.2,
      pointRadius: rs.map((r) => (r.blue_enabled === false ? 5 : 1.8)), pointBackgroundColor: rs.map((r) => (r.blue_enabled === false ? red : blue)), pointBorderWidth: 0 },
    { label: `${win}-round average`, data: trend, borderColor: cssVar("--cyan"), borderWidth: 2.5, pointRadius: 0, tension: 0.4, fill: false },
  ];
  if (D.baseline !== null && D.baseline !== undefined) {
    charts.c1.data.datasets.push({ label: "Normal day", data: rs.map(() => D.baseline), borderColor: muted, borderDash: [6, 6], borderWidth: 1.5, pointRadius: 0, fill: false });
  }
  charts.c1.options.plugins.tooltip.callbacks = { title: (it) => `Round ${it[0].label} · ${rs[it[0].dataIndex]?.attacks.join(" + ")}` };
  charts.c1.update();

  // chart 2: recovery bars
  charts.c2.data.labels = labels;
  charts.c2.data.datasets = [{ label: `Recovery (${unit})`, data: rs.map((r) => r.recovery_ticks), borderRadius: 6, borderSkipped: false,
    backgroundColor: rs.map((r) => (r.blue_enabled === false ? red : r.playbook_hits ? teal : muted)) }];
  charts.c2.options.plugins.tooltip.callbacks = {
    title: (it) => `Round ${it[0].label}`,
    label: (it) => { const r = rs[it.dataIndex]; return [`${r.recovery_ticks} ${unit} · ${r.blue_enabled === false ? "Blue OFF" : r.playbook_hits ? "from playbook" : "from scratch"}`, `fixes: ${r.fixes.join(", ") || "none"}`]; },
  };
  $("#c2Hint").textContent = `${unit} · lower is better`;
  charts.c2.update();

  // chart 3: red choices (bubble)
  const cats = [...Object.keys(D.attacks)];
  rs.forEach((r) => { const k = r.attacks.join(" + "); if (!cats.includes(k)) cats.push(k); });
  charts.c3.options.scales.y.min = -0.6; charts.c3.options.scales.y.max = cats.length - 0.4;
  charts.c3.options.scales.y.ticks.callback = (v) => (Number.isInteger(v) && cats[v] ? cats[v].replace(/_/g, " ") : "");
  charts.c3.data.datasets = [{ data: rs.map((r) => ({ x: r.domain_round, y: cats.indexOf(r.attacks.join(" + ")), r: 4 + r.red_reward * 11, rw: r.red_reward, mode: r.red_mode })),
    backgroundColor: rs.map((r) => `rgba(255, 77, 97, ${0.18 + 0.75 * r.red_reward})`), borderColor: red, borderWidth: 1 }];
  charts.c3.options.plugins.tooltip.callbacks = { label: (it) => `Round ${it.raw.x}: ${cats[it.raw.y]} · damage ${Math.round(it.raw.rw * 100)}% (${it.raw.mode})` };
  charts.c3.update();

  // chart 4: Q values
  charts.c4.data.labels = qs.map(([a]) => a.replace(/_/g, " "));
  charts.c4.data.datasets = [{ data: qs.map(([, q]) => q), borderRadius: 6, borderSkipped: false,
    backgroundColor: qs.map(([, q]) => `rgba(251, 146, 60, ${0.35 + 0.65 * Math.min(1, q * 1.4)})`) }];
  charts.c4.options.plugins.tooltip.callbacks = { label: (it) => `expected damage ${Math.round(it.raw * 100)}% · tried ${brain.n[qs[it.dataIndex][0]] || 0}×` };
  charts.c4.update();

  // playbook
  $("#playbook").innerHTML = book.length
    ? `<tr><th>Symptom</th><th>Fix recipe</th><th>Wins</th><th>Avg recovery</th><th>Didn't work</th></tr>` +
      book.sort((a, b) => b.successes - a.successes).map((e, i) => `<tr style="animation-delay:${i * 60}ms">
        <td><span class="chip amber">${esc(e.symptom)}</span></td>
        <td>${e.fixes.map((f) => `<span class="chip teal" title="${esc(D.fixes[f] || "")}">${esc(f)}</span>`).join(" ")}</td>
        <td class="wins">${e.successes}</td>
        <td>${e.avg_recovery_ticks ?? "–"} ${unit}</td>
        <td>${Object.entries(e.failed_fixes).map(([f, n]) => `<span class="chip muted strike">${esc(f)} ×${n}</span>`).join(" ") || "<span class='muted'>–</span>"}</td></tr>`).join("")
    : `<tr><td class="empty">Empty: Blue hasn't solved anything here yet.</td></tr>`;

  // reports
  const reps = (LEARN.reports || []).filter((r) => r.domain === learnDomain).slice(-4).reverse();
  $("#reports").innerHTML = reps.length
    ? reps.map((r, i) => `<div class="report" style="animation-delay:${i * 80}ms"><h4>${esc(r.title)}</h4><ul>${r.text.split("\n").map((l) => `<li>${md(l.replace(/^- /, ""))}</li>`).join("")}</ul></div>`).join("")
    : `<div class="empty">Reports appear after each round.</div>`;
}

/* ------------------------------------------------------------------ controls + boot */
function wireControls() {
  $("#pauseBtn").onclick = () => {
    const paused = LIVE?.status?.paused;
    post({ cmd: paused ? "resume" : "pause" }, paused ? "▶ Simulation resumed" : "⏸ Simulation paused", "--amber");
  };
  $("#blueToggle").onchange = (e) => {
    const on = e.target.checked;
    post({ cmd: "blue", enabled: on }, on ? "🛡️ Blue defenders back online" : "⚠️ Blue defenders switched OFF", on ? "--blue" : "--red");
  };
  $("#themeBtn").onclick = () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(next); store.set("cba-theme", next);
  };
  $("#modalCancel").onclick = () => $("#modal").classList.remove("open");
  $("#modalOk").onclick = async () => {
    $("#modal").classList.remove("open");
    if (await post({ cmd: "reset_learning" }, "↺ Learning reset: Blue and Red start from zero", "--violet")) {
      LEARN = { results: [], reports: [], playbook: {}, brain: {} }; renderLearning(); renderScore();
    }
  };
  $("#modal").onclick = (e) => { if (e.target.id === "modal") $("#modal").classList.remove("open"); };
}
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  $("#themeBtn").textContent = theme === "dark" ? "☾" : "☀";
  if (map) setTiles();
  if (META) { initCharts(); renderLearning(); }
}
function reveal() {
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("shown"); io.unobserve(e.target); } }), { threshold: 0.08 });
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
}
function connect() {
  const es = new EventSource("/api/stream");
  es.addEventListener("live", (e) => onLive(JSON.parse(e.data)));
  es.addEventListener("learn", (e) => onLearn(JSON.parse(e.data)));
  es.onopen = () => setConn("live", "Live");
  es.onerror = () => setConn("down", "Reconnecting…");
  setInterval(() => {
    if (lastLiveAt && Date.now() - lastLiveAt > 4000 && !LIVE?.status?.paused) setConn("down", "Arena idle");
  }, 1000);
}
async function init() {
  const theme = store.get("cba-theme") || "dark";
  document.documentElement.dataset.theme = theme;
  $("#themeBtn").textContent = theme === "dark" ? "☾" : "☀";
  META = await (await fetch("/api/meta")).json();
  buildDomainSwitch(); buildPipeline(); initMap(); initCharts(); buildLearnTabs(); wireControls(); reveal();
  connect();
}
init();
