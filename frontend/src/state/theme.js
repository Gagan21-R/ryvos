// Light / dark theme. The choice is stored per browser and applied as <html data-theme>. Canvas, SVG and WebGL
// code reads its colours from palette(), which always matches the active theme.
import { useSyncExternalStore } from "react";

const KEY = "ryvo-theme";
const PALETTES = {
  dark: { bg: "#101010", ink: "#eeeeee", ink2: "#b8b3b0", muted: "#8a8380", line: "#262321", lineStrong: "#3d3a39",
    surface: "#141312", surface2: "#1d1a18", accent: "#fafafa", bad: "#ee6018", ok: "#a0ca92", warn: "#c9a27e", grid: "#1d1a18" },
  light: { bg: "#f6f5f2", ink: "#121110", ink2: "#3d3a39", muted: "#77716d", line: "#e2dfdb", lineStrong: "#c9c4bf",
    surface: "#ffffff", surface2: "#eeebe7", accent: "#121110", bad: "#e2550f", ok: "#4f8a3f", warn: "#a16a2c", grid: "#ebe8e4" },
};

function initial() {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === "light" || saved === "dark") return saved;
  } catch { /* storage blocked */ }
  return "dark";
}

let theme = initial();
const listeners = new Set();
const apply = () => {
  document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", PALETTES[theme].bg);
};
if (typeof document !== "undefined") apply();

export const palette = () => PALETTES[theme];
export const getTheme = () => theme;
export function setTheme(t) {
  theme = t === "light" ? "light" : "dark";
  try { localStorage.setItem(KEY, theme); } catch { /* storage blocked */ }
  apply();
  listeners.forEach((l) => l());
}
export const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");
export function useTheme() {
  return useSyncExternalStore((l) => { listeners.add(l); return () => listeners.delete(l); }, () => theme);
}
