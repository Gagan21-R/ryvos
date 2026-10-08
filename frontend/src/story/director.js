// The story director: turns the arena's event stream into paced "beats" so a round reads like a mini story.
// Agents act in real time; beats only control what the characters say/do and when panels appear on screen.
import { useSyncExternalStore } from "react";
import { store } from "../state/arenaStore.js";

export const PHASES = ["DISCOVER", "PLAN", "SAFETY", "DISRUPT", "DETECT", "DIAGNOSE", "RECOVER", "VERIFY", "LEARN", "ADAPT"];

const blank = (round = null, domain = null) => ({
  round, domain, phase: "DISCOVER", beatNo: 0,
  agents: {
    rogue: { mood: "idle", speech: "Everything looks a little too stable…", key: 0 },
    aegis: { mood: "idle", speech: "Monitoring every service.", key: 0 },
    oracle: { mood: "idle", speech: "Sandbox armed. I'm watching the arena.", key: 0 },
  },
  proposal: null, verdict: null, verdictPending: false, attacks: [], incidents: [], diagnosis: null,
  fixes: [], resolved: [], result: null, reflection: null, blocked: [], notes: [], idle: false,
});

let scene = blank();
let queue = [];
let lastId = 0;
let playing = false;
const listeners = new Set();
const emit = () => listeners.forEach((l) => l());

// ---- narrated replay: the map/topology show the twin as it was at the moment being narrated
const states = new Map();          // "round:t" -> state (last ~200 ticks)
let cursor = null;                 // { round, t } of the beat on screen
let display = null;
const displayListeners = new Set();
const emitDisplay = () => displayListeners.forEach((l) => l());
function remember(st) {
  states.set(`${st.round}:${st.t}`, st);
  if (states.size > 200) states.delete(states.keys().next().value);
}
function stateAt(round, t) {
  for (let k = t; k >= Math.max(0, t - 6); k--) {
    const st = states.get(`${round}:${k}`);
    if (st) return st;
  }
  return null;
}
function nextLimit() {             // don't let the replay run past the next event still waiting to be narrated
  const pending = queue.find((b) => b.at && b.at.t != null);
  return pending && cursor && pending.at.round === cursor.round ? pending.at.t : Infinity;
}
function tickDisplay() {
  const live = store.get().live?.state;
  let next = live;
  if (cursor && (playing || queue.length)) {
    if (live && cursor.round === live.round && cursor.t < Math.min(nextLimit(), live.t)) cursor = { ...cursor, t: cursor.t + 1 };
    next = stateAt(cursor.round, cursor.t) || live;
  } else if (cursor && live && cursor.round === live.round && cursor.t + 3 < live.t) {
    cursor = { ...cursor, t: cursor.t + 3 };          // story finished: fast-forward smoothly to live
    next = stateAt(cursor.round, cursor.t) || live;
  } else {
    cursor = null;
  }
  if (next !== display) { display = next; emitDisplay(); }
}

function say(agent, mood, speech) {
  const a = scene.agents[agent];
  return { [agent]: { mood: mood || a.mood, speech: speech ?? a.speech, key: speech ? a.key + 1 : a.key } };
}

// event -> list of beats. A beat: { dur, phase?, agents?: {...}, patch?: scene changes }
function beatsFor(ev) {
  const d = ev.data || {};
  switch (ev.kind) {
    case "round_start":
      return [{ reset: { round: ev.round, domain: ev.domain }, phase: "DISCOVER", dur: 1200,
        rogue: ["idle", "Let's find something interesting…"], aegis: ["idle", "Monitoring every service."],
        oracle: ["idle", `Round ${ev.round} begins. Sandbox simulation.`] }];
    case "proposal":
      return [{ phase: "PLAN", dur: 2600, rogue: ["thinking", ev.speech],
        patch: { proposal: d, verdict: null, verdictPending: true } }];
    case "verdict":
      return [
        { phase: "SAFETY", dur: 900, oracle: ["scan", "Safety evaluation in progress…"] },
        { phase: "SAFETY", dur: 2200, oracle: [d.approved ? "approve" : "block", ev.speech],
          rogue: d.approved ? null : ["surprised", null],
          patch: { verdict: d, verdictPending: false, ...(d.approved ? {} : { blocked: [...scene.blocked, d] }) } },
      ];
    case "say":
      if (ev.agent === "rogue" && d.reward !== undefined) {
        const nxt = d.next_intent ? `Next, ROGUE leans towards ${d.next_intent.label.toLowerCase()}.` : null;
        return [
          { phase: "LEARN", dur: 2400, rogue: [d.mood || "thoughtful", ev.speech], patch: { reflection: d } },
          { phase: "ADAPT", dur: 2200, aegis: ["happy", d.reward < 0.25 ? "Next time, choose a harder test." : "Noted. I'll be faster next time."],
            oracle: ["idle", nxt] },
        ];
      }
      return [{ dur: 1700, [ev.agent]: [d.mood || (ev.agent === "rogue" ? "excited" : "thoughtful"), ev.speech] }];
    case "attack":
      return [{ phase: "DISRUPT", dur: 1800, rogue: ["acting", ev.speech || "Let's see what happens."],
        patch: { attacks: [...scene.attacks, d] }, merge: "attack" }];
    case "detect":
      return [{ phase: "DETECT", dur: 1800, aegis: ["focus", ev.speech], patch: { incidents: [...scene.incidents, d] } }];
    case "diagnosis_investigating":
      return [{ phase: "DIAGNOSE", dur: 1500, aegis: ["scan", ev.speech] }];
    case "diagnosis_waiting":
      return [{ phase: "DIAGNOSE", dur: 1200, aegis: ["thinking", ev.speech] }];
    case "diagnosis_fix":
      return [
        { phase: "DIAGNOSE", dur: 800, aegis: ["scan", "Root-cause analysis…"] },
        { phase: "DIAGNOSE", dur: 2600, aegis: ["thinking", ev.speech], patch: { diagnosis: d } },
      ];
    case "diagnosis_verifying":
      return [{ phase: "VERIFY", dur: 1800, aegis: ["thoughtful", ev.speech] }];
    case "diagnosis_no_effect":
    case "diagnosis_escalate":
      return [{ dur: 1800, aegis: ["surprised", ev.speech] }];
    case "fix":
      return [{ phase: "RECOVER", dur: 1400, aegis: ["acting", ev.speech], patch: { fixes: [...scene.fixes, d] }, merge: "fix" }];
    case "resolved":
      return [{ phase: "VERIFY", dur: 1400, aegis: ["happy", "System health restored."], patch: { resolved: [...scene.resolved, d] } }];
    case "diagnosis_learned":
      return [{ phase: "LEARN", dur: 1200, aegis: ["thoughtful", ev.speech] }];
    case "result":
      return [
        { phase: "VERIFY", dur: 800, oracle: ["scan", "Evaluating the round…"] },
        { phase: "VERIFY", dur: 3200, oracle: [d.verdict === "RECOVERED" ? "approve" : d.verdict === "NO EXPERIMENT" ? "idle" : "block", ev.speech],
          patch: { result: d } },
      ];
    case "round_aborted":
      return [{ dur: 600, oracle: ["think", "New round requested. Rolling everything back."] }];
    case "idle":
      return [{ dur: 800, oracle: ["idle", "Waiting for the next autonomous round."], patch: { idle: true } }];
    default:
      return [];
  }
}

function applyBeat(b) {
  if (b.at && b.at.t != null) cursor = { ...b.at };
  if (b.reset) {
    const lastResult = scene.result || scene.lastResult;     // keep the previous round's verdict on screen
    scene = { ...blank(b.reset.round, b.reset.domain), lastResult };
  }
  const agents = { ...scene.agents };
  for (const k of ["rogue", "aegis", "oracle"]) {
    if (b[k]) Object.assign(agents, say(k, b[k][0], b[k][1]));
  }
  const phase = b.phase || scene.phase;
  scene = { ...scene, ...(b.patch || {}), agents, phase, beatNo: scene.beatNo + 1 };
}

function play() {
  if (playing) return;
  const b = queue.shift();
  if (!b) return;
  playing = true;
  // recompute patches against the CURRENT scene (they reference scene arrays)
  const fresh = b.recompute ? b.recompute() : b;
  applyBeat(fresh);
  emit();
  const speed = queue.length > 6 ? 0.3 : queue.length > 3 ? 0.6 : 1;   // catch up when events pile up
  setTimeout(() => { playing = false; play(); }, fresh.dur * speed);
}

function ingest(events) {
  if (!events?.length) return;
  const maxId = events[events.length - 1].id;
  if (maxId < lastId) lastId = 0;                 // recorder restarted: ids start again
  const fresh = events.filter((e) => e.id > lastId);
  if (!fresh.length) return;
  if (lastId === 0) {
    // first load: rebuild the current round instantly (no replay), then animate from here on
    const start = events.map((e) => e.kind).lastIndexOf("round_start");
    const current = start >= 0 ? events.slice(start) : events.slice(-12);
    for (const ev of current) for (const b of beatsFor(ev)) applyBeat(b);
    lastId = maxId;
    emit();
    return;
  }
  lastId = maxId;
  for (const ev of fresh) {
    if (ev.kind === "round_start" && queue.length) {
      // the story is behind the live arena: finish the old round instantly so map and characters stay in sync
      for (const b of queue.splice(0)) applyBeat(b.recompute ? b.recompute() : b);
      emit();
    }
    const bs = beatsFor(ev);
    // patches must see the scene as it will be when the beat plays, so build them lazily
    const at = ev.t != null ? { round: ev.round, t: ev.t } : null;
    bs.forEach((b, i) => queue.push({ ...b, at, recompute: () => ({ ...beatsFor(ev)[i], at }) }));
  }
  play();
}

let started = false;
export function startStory() {
  if (started) return;
  started = true;
  let prev = null;
  setInterval(tickDisplay, 450);
  let prevState = null;
  store.subscribe(() => {
    const st = store.get().live?.state;
    if (st && st !== prevState) { prevState = st; remember(st); if (!cursor) tickDisplay(); }
    const ev = store.get().live?.events;
    if (ev && ev !== prev) {
      prev = ev;
      ingest(ev);
    }
  });
}

export function useDisplayState() {
  return useSyncExternalStore((l) => { displayListeners.add(l); return () => displayListeners.delete(l); }, () => display);
}

export function useStory() {
  return useSyncExternalStore((l) => { listeners.add(l); return () => listeners.delete(l); }, () => scene);
}

// debugging aid: inspect the director from the browser console
if (typeof window !== "undefined") {
  window.__story = { get cursor() { return cursor; }, get queue() { return queue.map((b) => ({ phase: b.phase, at: b.at, dur: b.dur })); },
    get playing() { return playing; }, get states() { return [...states.keys()].slice(-12); }, get display() { return display && `${display.round}:${display.t}`; } };
}
