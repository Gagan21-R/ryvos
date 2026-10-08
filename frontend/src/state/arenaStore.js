// One small external store for the whole app: meta, live arena state (SSE), learning data, UI state.
import { useSyncExternalStore } from "react";
import { api } from "../services/api.js";

let state = {
  meta: null,
  live: null,           // { state, status, incidents, events }
  learn: { results: [], reports: [], verdicts: [], playbook: {}, brain: {} },
  connection: "connecting",   // connecting | live | down
  lastLiveAt: 0,
  assist: { open: false, question: null, chart: null, nonce: 0 },
  toasts: [],
};
const listeners = new Set();

function set(patch) {
  state = { ...state, ...(typeof patch === "function" ? patch(state) : patch) };
  listeners.forEach((l) => l());
}

export const store = {
  get: () => state,
  set,
  subscribe(l) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
};

export function useArena(selector = (s) => s) {
  return useSyncExternalStore(store.subscribe, () => selector(state));
}

let source = null;
export function connect() {
  if (source) return;
  api.meta().then((meta) => set({ meta })).catch(() => set({ connection: "down" }));
  const open = () => {
    source = new EventSource("/api/stream");
    source.addEventListener("live", (e) => set({ live: JSON.parse(e.data), connection: "live", lastLiveAt: Date.now() }));
    source.addEventListener("learn", (e) => set({ learn: JSON.parse(e.data) }));
    source.onerror = () => set({ connection: "down" });
  };
  open();
  setInterval(() => {
    if (!state.meta) api.meta().then((meta) => set({ meta })).catch(() => {});
    if (state.connection === "live" && Date.now() - state.lastLiveAt > 6000 && !state.live?.status?.paused) {
      set({ connection: "idle" });
    }
  }, 2000);
}

export function toast(text, tone = "ink") {
  const id = Math.random().toString(36).slice(2);
  set((s) => ({ toasts: [...s.toasts, { id, text, tone }] }));
  setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), 3600);
}

export function openAssist(question = null, chart = null) {
  set((s) => ({ assist: { open: true, question, chart, nonce: s.assist.nonce + 1 } }));
}
export function closeAssist() {
  set((s) => ({ assist: { ...s.assist, open: false } }));
}

// Busy guard so double clicks never fire the same command twice.
const busy = new Set();
export async function act(key, fn, okText, tone) {
  if (busy.has(key)) return null;
  busy.add(key);
  try {
    const r = await fn();
    if (okText) toast(okText, tone);
    return r;
  } catch (e) {
    toast(`⚠ ${e.message}`, "rogue");
    return null;
  } finally {
    setTimeout(() => busy.delete(key), 800);
  }
}
