// Minimal Three.js host: one renderer per scene, sized to its container, paused when off-screen or hidden,
// mouse-parallax input, theme-aware (scenes get recolor(pal) when the theme changes) and fully disposed on unmount.
import * as THREE from "three";
import { useEffect, useRef } from "react";
import { palette } from "../../state/theme.js";

export function webglOK() {
  try {
    const c = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl")));
  } catch {
    return false;
  }
}

export default function Scene3D({ build, className = "", fov = 40, z = 10, label = "3D animation" }) {
  const host = useRef(null);
  const buildRef = useRef(build);
  buildRef.current = build;

  useEffect(() => {
    const el = host.current;
    if (!el || !webglOK()) return undefined;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    renderer.domElement.style.cssText = "width:100%;height:100%;display:block";
    el.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(fov, 1, 0.1, 200);
    camera.position.set(0, 0, z);
    const ctx = { THREE, scene, camera, renderer, pal: palette(), mouse: { x: 0, y: 0 }, size: { w: 1, h: 1 } };
    const api = buildRef.current(ctx) || {};

    const resize = () => {
      const w = Math.max(1, el.clientWidth), h = Math.max(1, el.clientHeight);
      ctx.size = { w, h };
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      api.resize?.(w, h);
      if (reduce) renderer.render(scene, camera);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    resize();

    let visible = true;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0 });
    io.observe(el);
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      ctx.mouse.x = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1));
      ctx.mouse.y = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1));
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let raf = 0, last = performance.now(), t = 0;
    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const pal = palette();
      if (pal !== ctx.pal) { ctx.pal = pal; api.recolor?.(pal); }
      if (!visible || document.hidden) return;
      t += dt;
      api.update?.(t, dt);
      renderer.render(scene, camera);
    };
    if (reduce) { api.update?.(1.5, 0); renderer.render(scene, camera); } else raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      api.dispose?.();
      scene.traverse((o) => {
        o.geometry?.dispose?.();
        const m = o.material;
        (Array.isArray(m) ? m : m ? [m] : []).forEach((x) => x.dispose?.());
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [fov, z]);

  return <div ref={host} className={className} role="img" aria-label={label} />;
}
