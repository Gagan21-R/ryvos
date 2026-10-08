// ORACLE is not a robot: a floating holographic intelligence core. Moods: idle, scan, approve, block, think
import { motion } from "motion/react";

export default function OracleOrb({ mood = "idle", size = 120 }) {
  const ring = mood === "approve" ? "#0f9d58" : mood === "block" ? "#e5194f" : "#7a4dff";
  const fast = mood === "scan" || mood === "think";
  return (
    <motion.div style={{ width: size, height: size, position: "relative" }} aria-hidden="true"
      animate={{ y: [0, -6, 0] }} transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}>
      <svg viewBox="0 0 120 120" width={size} height={size} style={{ overflow: "visible" }}>
        <defs>
          <radialGradient id="orb-core" cx="40%" cy="35%">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="0.35" stopColor="#c9b6ff" />
            <stop offset="1" stopColor="#5b2ee6" />
          </radialGradient>
        </defs>
        <motion.circle cx="60" cy="60" r="54" fill="none" stroke={ring} strokeWidth="2" strokeDasharray="4 8"
          animate={{ rotate: 360 }} transition={{ duration: fast ? 3 : 14, repeat: Infinity, ease: "linear" }} style={{ originX: "60px", originY: "60px" }} />
        <motion.g animate={{ rotate: -360 }} transition={{ duration: fast ? 4 : 20, repeat: Infinity, ease: "linear" }} style={{ originX: "60px", originY: "60px" }}>
          <polygon points="60,16 98,38 98,82 60,104 22,82 22,38" fill="none" stroke="#0e0e10" strokeWidth="2" />
          <circle cx="60" cy="16" r="4" fill={ring} />
          <circle cx="22" cy="82" r="4" fill="#ff3b6b" />
          <circle cx="98" cy="82" r="4" fill="#1f6bff" />
        </motion.g>
        <motion.circle cx="60" cy="60" r="26" fill="url(#orb-core)" stroke="#0e0e10" strokeWidth="2.5"
          animate={{ scale: mood === "approve" || mood === "block" ? [1, 1.15, 1] : [1, 1.05, 1] }}
          transition={{ duration: mood === "idle" ? 2.8 : 0.9, repeat: Infinity }} style={{ originX: "60px", originY: "60px" }} />
        {mood === "scan" && (
          <motion.line x1="30" x2="90" y1="38" y2="38" stroke="#ffffff" strokeWidth="2.5" initial={{ y: 0 }} animate={{ y: [0, 44, 0] }}
            transition={{ duration: 1.1, repeat: Infinity }} />
        )}
        {mood === "approve" && <path d="M48 60 l8 8 l16 -18" fill="none" stroke="#0e0e10" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />}
        {mood === "block" && <path d="M50 50 l20 20 M70 50 l-20 20" stroke="#0e0e10" strokeWidth="5" strokeLinecap="round" />}
        {(mood === "idle" || mood === "think") && <circle cx="53" cy="53" r="5" fill="#fff" opacity="0.8" />}
      </svg>
    </motion.div>
  );
}
