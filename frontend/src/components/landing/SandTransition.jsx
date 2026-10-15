// Sand / particle dissolve between chapters (framework's SandTransitionImage, generalised to any content).
// An SVG filter chain (turbulence → displacement → offset → blur → fade) is driven by a 900 ms rAF loop.
import { usePresence } from "motion/react";
import { useEffect, useRef } from "react";

export default function SandTransition({ children, className = "" }) {
  const [isPresent, safeToRemove] = usePresence();
  const id = useRef(`sand-${Math.random().toString(36).slice(2, 9)}`).current;
  const disp = useRef(null), off = useRef(null), blur = useRef(null), mat = useRef(null);

  useEffect(() => {
    const entering = isPresent;
    const start = performance.now();
    let raf = 0;
    const apply = (p) => {                 // p: 0 = solid, 1 = fully dissolved
      disp.current?.setAttribute("scale", String(150 * p));
      off.current?.setAttribute("dy", String((entering ? -80 : 120) * p));
      off.current?.setAttribute("dx", String((entering ? -30 : 30) * p));
      blur.current?.setAttribute("stdDeviation", String(6 * p));
      mat.current?.setAttribute("values", `1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${Math.max(0, 1 - p * 1.2)} 0`);
    };
    const tick = (now) => {
      const t = Math.min(1, (now - start) / 900);
      const p = entering ? 1 - (1 - Math.pow(1 - t, 4)) : Math.pow(t, 3);
      apply(p);
      if (t < 1) raf = requestAnimationFrame(tick);
      else if (!entering) safeToRemove?.();
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isPresent]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <filter id={id} x="-50%" y="-50%" width="200%" height="200%">
          <feTurbulence type="fractalNoise" baseFrequency="1.8" numOctaves="4" result="noise" />
          <feDisplacementMap ref={disp} in="SourceGraphic" in2="noise" scale="0" xChannelSelector="R" yChannelSelector="G" result="d" />
          <feOffset ref={off} in="d" dx="0" dy="0" result="o" />
          <feGaussianBlur ref={blur} in="o" stdDeviation="0" result="b" />
          <feColorMatrix ref={mat} in="b" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0" />
        </filter>
      </svg>
      <div className={className} style={{ filter: `url(#${id})` }}>{children}</div>
    </>
  );
}
