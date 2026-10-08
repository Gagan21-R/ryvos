// ORACLE ASSIST: floating, context-aware explainer. Knows the page, system and chart the user is looking at.
import { Send, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { api } from "../../services/api.js";
import { closeAssist, openAssist, useArena } from "../../state/arenaStore.js";
import OracleOrb from "../agents/OracleOrb.jsx";

const START = ["Why was this experiment selected?", "Why is AEGIS's confidence this high?", "Explain this graph", "Why did the map zoom here?"];

function render(text) {
  // **bold** and *italic* only; everything else is plain text (no HTML injection)
  return text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).map((part, i) => {
    if (part.startsWith("**")) return <b key={i}>{part.slice(2, -2)}</b>;
    if (part.startsWith("*") && part.length > 2) return <i key={i}>{part.slice(1, -1)}</i>;
    return part;
  });
}

export default function OracleAssist({ page }) {
  const assist = useArena((s) => s.assist);
  const domain = useArena((s) => s.live?.state?.domain);
  const round = useArena((s) => s.live?.state?.round);
  const [msgs, setMsgs] = useState([{ who: "oracle", text: "I'm ORACLE. I can explain the current experiment, the agents, a graph, the map or an incident.", sugg: START }]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scroller = useRef(null);
  const lastNonce = useRef(0);

  async function ask(q, chart = null) {
    if (!q.trim() || busy) return;
    setMsgs((m) => [...m, { who: "user", text: q }]);
    setInput("");
    setBusy(true);
    try {
      const r = await api.chat(q, { page, domain, round, chart });
      setMsgs((m) => [...m, { who: "oracle", text: r.answer, related: r.relatedData, sugg: r.suggestedActions }]);
    } catch (e) {
      setMsgs((m) => [...m, { who: "oracle", text: `I couldn't reach the arena backend (${e.message}). Is run_all.py running?` }]);
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {      // opened with a question (e.g. from an "Explain" button)
    if (assist.open && assist.question && assist.nonce !== lastNonce.current) {
      lastNonce.current = assist.nonce;
      ask(assist.question, assist.chart);
    }
  }, [assist]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { scroller.current?.scrollTo({ top: 1e6, behavior: "smooth" }); }, [msgs, busy]);
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") closeAssist(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const last = [...msgs].reverse().find((m) => m.sugg);
  return (
    <>
      <AnimatePresence>
        {assist.open && (
          <motion.section className="assist-panel" role="dialog" aria-label="ORACLE ASSIST"
            initial={{ opacity: 0, y: 30, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}>
            <div className="assist-head">
              <OracleOrb size={42} mood={busy ? "think" : "idle"} />
              <div style={{ flex: 1 }}>
                <b>ORACLE ASSIST</b>
                <small>Context-aware resilience intelligence · {page}{domain ? ` · ${domain}` : ""}</small>
              </div>
              <button className="icon-btn" style={{ background: "transparent", color: "#fff", borderColor: "rgba(255,255,255,.5)" }} onClick={closeAssist} aria-label="Close assistant"><X size={16} /></button>
            </div>
            <div className="assist-msgs" ref={scroller}>
              {msgs.map((m, i) => (
                <motion.div key={i} className={`msg ${m.who}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                  {render(m.text)}
                  {m.related?.length > 0 && (
                    <div className="rel">{m.related.map((r) => <span key={r.label} className="chip oracle">{r.label}: {r.value}</span>)}</div>
                  )}
                </motion.div>
              ))}
              {busy && <div className="msg oracle"><span className="typing"><i /><i /><i /></span></div>}
            </div>
            {last?.sugg && (
              <div className="assist-sugg">
                {last.sugg.slice(0, 4).map((s) => <button key={s} onClick={() => ask(s)}>{s}</button>)}
              </div>
            )}
            <form className="assist-input" onSubmit={(e) => { e.preventDefault(); ask(input); }}>
              <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask why…" aria-label="Ask ORACLE" maxLength={500} />
              <button className="btn oracle small" type="submit" disabled={busy || !input.trim()} aria-label="Send"><Send size={15} /></button>
            </form>
          </motion.section>
        )}
      </AnimatePresence>
      <button className="assist-orb" onClick={() => (assist.open ? closeAssist() : openAssist())} aria-label="Open ORACLE ASSIST">
        <OracleOrb size={58} mood={busy ? "think" : "idle"} />
        {!assist.open && <span className="lbl">Ask ORACLE</span>}
      </button>
    </>
  );
}
