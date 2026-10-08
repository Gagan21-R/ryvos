// Speech bubble with a quick typewriter effect. Re-types whenever the line changes.
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

export default function AgentSpeech({ agent, text, speechKey }) {
  const [shown, setShown] = useState("");
  useEffect(() => {
    if (!text) { setShown(""); return undefined; }
    let i = 0;
    setShown("");
    const id = setInterval(() => {
      i += Math.max(1, Math.round(text.length / 45));
      setShown(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, 18);
    return () => clearInterval(id);
  }, [text, speechKey]);
  return (
    <AnimatePresence mode="wait">
      {text ? (
        <motion.div key={speechKey || text} className={`bubble ${agent}`} role="status" aria-live="polite"
          initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6, scale: 0.97 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}>
          <span className="sr-only">{text}</span>
          <span aria-hidden="true">{shown}{shown.length < text.length && <i className="caret" />}</span>
        </motion.div>
      ) : (
        <motion.div key="empty" className={`bubble ${agent}`} style={{ opacity: 0.35 }} initial={{ opacity: 0 }} animate={{ opacity: 0.35 }}>…</motion.div>
      )}
    </AnimatePresence>
  );
}
