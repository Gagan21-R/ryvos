// A small, friendly robot. ROGUE and AEGIS are the same rig with a different palette and personality.
// Moods: idle, thinking, excited, acting, surprised, focus, scan, happy, thoughtful
import { motion } from "motion/react";
import { useEffect, useState } from "react";

const BODY_MOTION = {
  idle: { y: [0, -7, 0], rotate: 0, transition: { duration: 3.2, repeat: Infinity, ease: "easeInOut" } },
  thinking: { y: [0, -4, 0], rotate: [0, -4, 0], transition: { duration: 2.2, repeat: Infinity, ease: "easeInOut" } },
  excited: { y: [0, -18, 0, -10, 0], rotate: [0, -6, 6, 0], transition: { duration: 0.9, repeat: Infinity, repeatDelay: 0.4 } },
  acting: { y: [0, -10, 0], x: [0, 10, 0], rotate: [0, 8, 0], transition: { duration: 0.7, repeat: Infinity, repeatDelay: 0.6 } },
  surprised: { y: [0, -16, 0], scale: [1, 1.06, 1], transition: { duration: 0.5 } },
  focus: { y: [0, -3, 0], scale: 1.03, transition: { duration: 1.4, repeat: Infinity } },
  scan: { y: [0, -5, 0], transition: { duration: 1.6, repeat: Infinity, ease: "easeInOut" } },
  happy: { y: [0, -10, 0], rotate: [0, 3, -3, 0], transition: { duration: 1.2, repeat: Infinity, repeatDelay: 0.8 } },
  thoughtful: { y: [0, -4, 0], rotate: [0, 2, 0], transition: { duration: 3, repeat: Infinity } },
};

export default function Bot({ kind = "rogue", mood = "idle", size = 170, lookAt = null }) {
  const rogue = kind === "rogue";
  const c1 = rogue ? "#ff7a98" : "#4f8dff";
  const c2 = rogue ? "#ff2d5b" : "#1f5bff";
  const eye = rogue ? "#ffffff" : "#7df9ff";
  const [blink, setBlink] = useState(false);
  const [look, setLook] = useState({ x: 0, y: 0 });

  useEffect(() => {          // blinking
    let t;
    const loop = () => {
      t = setTimeout(() => { setBlink(true); setTimeout(() => setBlink(false), 140); loop(); }, 2200 + Math.random() * 2600);
    };
    loop();
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {          // eyes wander when idle, track a target when told, dart when thinking
    if (lookAt) { setLook(lookAt); return undefined; }
    const speed = mood === "thinking" || mood === "scan" ? 520 : 1700;
    const id = setInterval(() => {
      if (mood === "thinking") setLook((l) => ({ x: l.x > 0 ? -0.8 : 0.8, y: -0.5 }));
      else if (mood === "scan") setLook((l) => ({ x: l.x > 0 ? -1 : 1, y: 0 }));
      else setLook({ x: (Math.random() - 0.5) * 1.6, y: (Math.random() - 0.5) * 0.9 });
    }, speed);
    return () => clearInterval(id);
  }, [mood, lookAt]);

  const happy = mood === "happy";
  const wide = mood === "surprised" || mood === "excited";
  const narrow = mood === "focus" || mood === "thoughtful";
  const eyeRy = blink ? 1 : wide ? 11 : narrow ? 5 : 8.5;
  const px = look.x * 3.2;
  const py = look.y * 2.6;
  const mouth = {
    happy: "M50 72 Q60 80 70 72", excited: "M52 70 Q60 80 68 70 Z", surprised: "M57 72 a3 4 0 1 0 6 0 a3 4 0 1 0 -6 0",
    thinking: rogue ? "M52 74 Q60 72 68 75" : "M53 74 L67 74", acting: rogue ? "M50 71 Q62 81 70 70" : "M52 72 Q60 76 68 72",
  }[mood] || (rogue ? "M51 72 Q61 79 70 71" : "M52 73 Q60 77 68 73");

  const armL = { acting: rogue ? -10 : -130, thinking: rogue ? -120 : -20, excited: -140, happy: -150, surprised: -60, focus: -25 }[mood] ?? -12;
  const armR = { acting: rogue ? -75 : 130, thinking: 12, excited: 140, happy: 150, surprised: 60, scan: 30 }[mood] ?? 12;

  return (
    <div style={{ width: size, height: size * 1.15, position: "relative" }} aria-hidden="true">
      <motion.svg viewBox="0 0 120 138" width={size} height={size * 1.15} animate={BODY_MOTION[mood] || BODY_MOTION.idle}
        style={{ overflow: "visible", originY: 1 }}>
        <defs>
          <linearGradient id={`g-${kind}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={c1} />
            <stop offset="1" stopColor={c2} />
          </linearGradient>
          <radialGradient id={`glow-${kind}`}>
            <stop offset="0" stopColor={eye} stopOpacity="0.9" />
            <stop offset="1" stopColor={eye} stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* antenna */}
        <motion.g animate={{ rotate: mood === "excited" || mood === "acting" ? [-12, 12, -12] : rogue ? -10 : 0 }}
          transition={{ duration: 0.6, repeat: mood === "excited" || mood === "acting" ? Infinity : 0 }} style={{ originX: "60px", originY: "22px" }}>
          <line x1="60" y1="22" x2={rogue ? 54 : 60} y2="7" stroke="#0e0e10" strokeWidth="3" strokeLinecap="round" />
          <circle cx={rogue ? 54 : 60} cy="6" r="5" fill={rogue ? "#ffd166" : "#7df9ff"} stroke="#0e0e10" strokeWidth="2" />
        </motion.g>
        {/* arms */}
        <motion.rect x="14" y="88" width="9" height="26" rx="4.5" fill={`url(#g-${kind})`} stroke="#0e0e10" strokeWidth="2.2"
          animate={{ rotate: armL }} transition={{ type: "spring", stiffness: 160, damping: 12 }} style={{ originX: "18px", originY: "90px" }} />
        <motion.rect x="97" y="88" width="9" height="26" rx="4.5" fill={`url(#g-${kind})`} stroke="#0e0e10" strokeWidth="2.2"
          animate={{ rotate: armR }} transition={{ type: "spring", stiffness: 160, damping: 12 }} style={{ originX: "101px", originY: "90px" }} />
        {/* legs */}
        <rect x="42" y="116" width="11" height="15" rx="5" fill="#0e0e10" />
        <rect x="67" y="116" width="11" height="15" rx="5" fill="#0e0e10" />
        {/* body */}
        <rect x="24" y="82" width="72" height="40" rx="16" fill={`url(#g-${kind})`} stroke="#0e0e10" strokeWidth="2.5" />
        {rogue ? (
          <path d="M55 96 l5 -6 l5 6 l-5 8 z" fill="#ffd166" stroke="#0e0e10" strokeWidth="1.8" />
        ) : (
          <path d="M60 90 l10 4 v6 c0 6 -5 9 -10 11 c-5 -2 -10 -5 -10 -11 v-6 z" fill="#7df9ff" stroke="#0e0e10" strokeWidth="1.8" />
        )}
        {/* head */}
        <motion.g animate={{ rotate: rogue ? (mood === "thinking" ? -10 : -5) : mood === "thoughtful" ? 6 : 0 }}
          transition={{ type: "spring", stiffness: 90, damping: 10 }} style={{ originX: "60px", originY: "84px" }}>
          <rect x="16" y="20" width="88" height="66" rx="30" fill={`url(#g-${kind})`} stroke="#0e0e10" strokeWidth="2.5" />
          <rect x="27" y="32" width="66" height="44" rx="20" fill="#16161c" />
          {(mood === "focus" || mood === "scan") && <rect x="27" y="32" width="66" height="44" rx="20" fill={`url(#glow-${kind})`} opacity="0.25" />}
          {happy ? (
            <g stroke={eye} strokeWidth="3.4" fill="none" strokeLinecap="round">
              <path d="M40 56 Q47 47 54 56" />
              <path d="M66 56 Q73 47 80 56" />
            </g>
          ) : (
            <g>
              <motion.ellipse cx="47" cy="54" rx={wide ? 9.5 : 8} ry={eyeRy} initial={false} animate={{ ry: eyeRy }} transition={{ duration: 0.09 }} fill={eye} />
              <motion.ellipse cx="73" cy="54" rx={wide ? 9.5 : 8} ry={eyeRy} initial={false}
                animate={{ ry: rogue && mood === "acting" ? Math.max(1, eyeRy - 3) : eyeRy }} transition={{ duration: 0.09 }} fill={eye} />
              {!blink && (
                <g>
                  <motion.circle r="3.4" fill="#0e0e10" cx={47} cy={54} initial={false} animate={{ cx: 47 + px, cy: 54 + py }} transition={{ type: "spring", stiffness: 120, damping: 14 }} />
                  <motion.circle r="3.4" fill="#0e0e10" cx={73} cy={54} initial={false} animate={{ cx: 73 + px, cy: 54 + py }} transition={{ type: "spring", stiffness: 120, damping: 14 }} />
                  <circle cx="44.5" cy="50.5" r="1.4" fill="#fff" />
                  <circle cx="70.5" cy="50.5" r="1.4" fill="#fff" />
                </g>
              )}
            </g>
          )}
          <path d={mouth} stroke={eye} strokeWidth="2.6" fill={mood === "excited" ? eye : "none"} strokeLinecap="round" />
          {rogue && <circle cx="31" cy="66" r="4" fill="#ff8fab" opacity="0.7" />}
          {rogue && <circle cx="89" cy="66" r="4" fill="#ff8fab" opacity="0.7" />}
          {mood === "scan" && (
            <motion.rect x="29" y="34" width="62" height="2.5" rx="1" fill={eye} opacity="0.8" animate={{ y: [34, 72, 34] }} transition={{ duration: 1.4, repeat: Infinity }} />
          )}
        </motion.g>
        {mood === "thinking" && (
          <g fill="#0e0e10">
            <motion.circle cx="104" cy="22" r="3" animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.2, repeat: Infinity }} />
            <motion.circle cx="112" cy="12" r="4.5" animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0.3 }} />
          </g>
        )}
        {mood === "acting" && rogue && (
          <motion.path d="M112 70 l6 -8 l-2 8 l6 -2 l-8 10 l2 -7 z" fill="#ffd166" stroke="#0e0e10" strokeWidth="1.5"
            animate={{ scale: [0.6, 1.2, 0.6], opacity: [0.4, 1, 0.4] }} transition={{ duration: 0.6, repeat: Infinity }} />
        )}
        {(mood === "acting" || mood === "focus") && !rogue && (
          <motion.circle cx="60" cy="62" r="56" fill="none" stroke="#7df9ff" strokeWidth="2.5"
            animate={{ scale: [0.8, 1.15], opacity: [0.8, 0] }} transition={{ duration: 1.2, repeat: Infinity }} />
        )}
      </motion.svg>
      <motion.div style={{ position: "absolute", left: "22%", right: "22%", bottom: -4, height: 10, borderRadius: "50%", background: "rgba(14,14,16,.18)" }}
        animate={{ scaleX: mood === "excited" ? [1, 0.7, 1] : [1, 0.85, 1] }} transition={{ duration: mood === "excited" ? 0.9 : 3.2, repeat: Infinity }} />
    </div>
  );
}
