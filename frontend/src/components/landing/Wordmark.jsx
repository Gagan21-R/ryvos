// "RYVO" drawn from straight polygons (same construction as the framework's NHM logo: 14-unit strokes on a
// 100-unit cap height). Every polygon slides up on its own, staggered.
import { motion } from "motion/react";

export const EASE = [0.16, 1, 0.3, 1];
export const letterBlock = {
  initial: { y: 120, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: { duration: 1.2, ease: EASE } },
};

const LETTERS = [
  { x: 0, polys: [       // R
    "0,0 14,0 14,100 0,100", "0,0 170,0 170,14 0,14", "156,0 170,0 170,57 156,57", "0,43 170,43 170,57 0,57", "88,57 120,57 214,100 182,100"] },
  { x: 280, polys: [     // Y
    "0,0 31,0 121,52 93,52", "183,0 214,0 121,52 93,52", "100,46 114,46 114,100 100,100"] },
  { x: 560, polys: [     // V
    "0,0 31,0 121,100 93,100", "183,0 214,0 121,100 93,100"] },
  { x: 840, polys: [     // O
    "0,0 14,0 14,100 0,100", "200,0 214,0 214,100 200,100", "0,0 214,0 214,14 0,14", "0,86 214,86 214,100 0,100"] },
];

export default function Wordmark() {
  return (
    <motion.h1
      className="m-0 w-full"
      aria-label="RYVO"
      variants={{ initial: { scale: 1.03 }, animate: { scale: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1, duration: 1.4, ease: EASE } } }}
    >
      <svg viewBox="0 0 1054 100" className="w-full fill-[#111] overflow-visible" aria-hidden="true">
        <defs><clipPath id="wm-clip"><rect x="-10" y="-2" width="1080" height="104" /></clipPath></defs>
        <g clipPath="url(#wm-clip)">
          {LETTERS.map((l) => (
            <g key={l.x} transform={`translate(${l.x},0)`}>
              {l.polys.map((p) => <motion.polygon key={p} points={p} variants={letterBlock} />)}
            </g>
          ))}
        </g>
      </svg>
    </motion.h1>
  );
}
