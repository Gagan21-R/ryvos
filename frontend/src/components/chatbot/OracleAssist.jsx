// ORACLE ASSIST: context-aware explainer. Knows the page, system and chart the user is looking at.
import { Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { api } from "../../services/api.js";
import { closeAssist, openAssist, useArena } from "../../state/arenaStore.js";
import { AgentBadge } from "../common/ui.jsx";

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
  const [msgs, setMsgs] = useState([{ who: "oracle", text: "Ask me about the current experiment, an agent's decision, a chart, the map or an incident.", sugg: START }]);
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
      setMsgs((m) => [...m, { who: "oracle", text: `I couldn't reach the backend (${e.message}). Is run_all.py running?` }]);
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

  useEffect(() => { scroller.current?.scrollTo({ top: 1e6 }); }, [msgs, busy]);
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") closeAssist(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const last = [...msgs].reverse().find((m) => m.sugg);
  return (
    <>
      {assist.open && (
        <section className="assist-panel" role="dialog" aria-label="ORACLE ASSIST">
          <div className="assist-head">
            <AgentBadge agent="oracle" />
            <div style={{ flex: 1 }}>
              <b>ORACLE ASSIST</b>
              <small>Explains decisions using live data · {page}{domain ? ` · ${domain}` : ""}</small>
            </div>
            <button className="icon-btn" onClick={closeAssist} aria-label="Close assistant"><X size={16} /></button>
          </div>
          <div className="assist-msgs" ref={scroller}>
            {msgs.map((m, i) => (
              <div key={i} className={`msg ${m.who}`}>
                {render(m.text)}
                {m.related?.length > 0 && (
                  <div className="rel">{m.related.map((r) => <span key={r.label} className="chip oracle">{r.label}: {r.value}</span>)}</div>
                )}
              </div>
            ))}
            {busy && <div className="msg oracle thinking">Looking at the data…</div>}
          </div>
          {last?.sugg && (
            <div className="assist-sugg">
              {last.sugg.slice(0, 4).map((s) => <button key={s} onClick={() => ask(s)}>{s}</button>)}
            </div>
          )}
          <form className="assist-input" onSubmit={(e) => { e.preventDefault(); ask(input); }}>
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask a question" aria-label="Ask ORACLE" maxLength={500} />
            <button className="btn primary small" type="submit" disabled={busy || !input.trim()} aria-label="Send"><Send size={15} /></button>
          </form>
        </section>
      )}
      <button className="assist-btn" onClick={() => (assist.open ? closeAssist() : openAssist())} aria-label={assist.open ? "Close ORACLE ASSIST" : "Open ORACLE ASSIST"}>
        {assist.open ? <X size={16} /> : <span className="status-dot live" />}{assist.open ? "Close" : "Ask ORACLE"}
      </button>
    </>
  );
}
