import { ArrowRight, MapPinned, Play, ShieldAlert } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import Bot from "../components/agents/Bot.jsx";
import OracleOrb from "../components/agents/OracleOrb.jsx";
import ProofPanel from "../components/common/ProofPanel.jsx";
import ScenarioScene from "../components/common/ScenarioScene.jsx";
import { api } from "../services/api.js";
import { act, useArena } from "../state/arenaStore.js";
import { useStory } from "../story/director.js";
import { startRound } from "./Arena.jsx";

const LOOP = ["DISCOVER", "DISRUPT", "DETECT", "DIAGNOSE", "RECOVER", "VERIFY", "LEARN", "ADAPT"];
const PHASE_TO_LOOP = { DISCOVER: "DISCOVER", PLAN: "DISCOVER", SAFETY: "DISCOVER", DISRUPT: "DISRUPT", DETECT: "DETECT",
  DIAGNOSE: "DIAGNOSE", RECOVER: "RECOVER", VERIFY: "VERIFY", LEARN: "LEARN", ADAPT: "ADAPT" };
const SYSTEMS = [
  ["emergency", "🚑", "108 Emergency", "Lives at stake"],
  ["food", "🛵", "Free Delivery", "Orders & free-delivery zones"],
  ["upi", "💳", "UPI Payments", "Money & trust"],
];
const ACCENT = { emergency: "#e5194f", food: "#0a8fc9", upi: "#7a4dff" };

function ScenarioCard({ id, ic, name, sub, selected, onSelect }) {
  const [hover, setHover] = useState(false);
  const active = hover || selected;
  return (
    <button className={`${selected ? "sel" : ""} ${active ? "live" : ""}`} style={{ "--acc": ACCENT[id] }} onClick={onSelect}
      aria-pressed={selected} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)} onBlur={() => setHover(false)}>
      <ScenarioScene kind={id} active={active} />
      <b><span aria-hidden="true">{ic}</span> {name}</b><small>{sub}</small>
    </button>
  );
}

const rise = (i) => ({ initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.08 * i, type: "spring", stiffness: 120, damping: 18 } });

export default function Overview() {
  const live = useArena((s) => s.live);
  const learn = useArena((s) => s.learn);
  const story = useStory();
  const [sys, setSys] = useState(live?.state?.domain || "emergency");
  const go = (hash) => { window.location.hash = hash; };
  const latest = (d) => [...(learn.results || [])].reverse().find((r) => r.domain === d && r.resilience != null);
  const now = PHASE_TO_LOOP[story.phase];

  return (
    <div className="page">
      <section className="hero">
        <div>
          <motion.div className="eyebrow" {...rise(0)}>Autonomous AI resilience testing · sandbox simulation</motion.div>
          <motion.h1 className="h-display hero-title" {...rise(1)} aria-label="RYVO">RY<span className="stroke">VO</span></motion.h1>
          <motion.p className="hero-tag" {...rise(2)}>Where AI challenges systems, protects them, and learns from every failure.</motion.p>
          <motion.div {...rise(3)}>
            <div className="eyebrow">Choose a system</div>
            <div className="domain-pick">
              {SYSTEMS.map(([id, ic, name, sub]) => (
                <ScenarioCard key={id} id={id} ic={ic} name={name} sub={sub} selected={sys === id} onSelect={() => setSys(id)} />
              ))}
            </div>
            <div className="cta-row">
              <button className="btn primary" style={{ fontSize: 16, padding: "15px 22px" }} onClick={async () => { await startRound(sys); go("#/arena"); }}>
                <Play size={18} /> START AUTONOMOUS ROUND
              </button>
              <button className="btn oracle" onClick={async () => { await act("safety", () => api.safetyTest(sys), "🛡 Safety test requested", "oracle"); go("#/arena"); }}>
                <ShieldAlert size={17} /> Test safety controller
              </button>
              <button className="btn" onClick={async () => { await startRound("food", { scenario: "Zone config drift" }); go("#/arena"); }}>
                <MapPinned size={17} /> Geographic demo
              </button>
            </div>
          </motion.div>
          <motion.div className="loop-strip" {...rise(4)} aria-label="The autonomous loop">
            {LOOP.map((p, i) => (
              <span key={p} style={{ display: "contents" }}>
                <span className={`step ${now === p ? "on" : ""}`}>{p}</span>{i < LOOP.length - 1 && <span className="arrow">→</span>}
              </span>
            ))}
          </motion.div>
        </div>

        <motion.div className="hero-stage" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 90 }}>
          <div className="floor" />
          <div className="cast">
            <div className="cast-member">
              <Bot kind="rogue" mood={story.agents.rogue.mood} size={150} />
              <div className="name" style={{ color: "var(--rogue)" }}>ROGUE</div>
              <div className="role">“The challenger.” Plans controlled failures</div>
            </div>
            <div className="cast-member oracle">
              <OracleOrb mood={story.agents.oracle.mood} size={110} />
              <div className="name" style={{ color: "var(--oracle)" }}>ORACLE</div>
              <div className="role">“The referee.” Safety, scoring, narration</div>
            </div>
            <div className="cast-member">
              <Bot kind="aegis" mood={story.agents.aegis.mood} size={150} />
              <div className="name" style={{ color: "var(--aegis)" }}>AEGIS</div>
              <div className="role">“The guardian.” Detects, diagnoses, recovers</div>
            </div>
          </div>
        </motion.div>
      </section>

      <div className="section-head"><h2>Live resilience</h2><a className="btn small ghost" href="#/metrics">All metrics <ArrowRight size={14} /></a></div>
      <div className="stat-strip">
        {SYSTEMS.map(([id, ic, name]) => {
          const r = latest(id);
          return (
            <div className="card hard" key={id}>
              <div className="eyebrow">{ic} {name}</div>
              <div className="row" style={{ alignItems: "baseline", marginTop: 8 }}>
                <span className="big-num" style={{ fontSize: 56 }}>{r?.resilience ?? "—"}</span><span className="muted" style={{ fontWeight: 700 }}>/ 100 resilience</span>
              </div>
              <div className="muted" style={{ fontWeight: 600, fontSize: 12.5 }}>
                {r ? `Last: ${r.verdict.toLowerCase()} · diagnosis accuracy ${r.oracle?.accuracy ?? "—"}% · next test: ${r.next?.label}` : "No scored round yet"}
              </div>
            </div>
          );
        })}
      </div>

      <div className="section-head"><h2>Proof it learns</h2><a className="btn small ghost" href="#/learning">Learning <ArrowRight size={14} /></a></div>
      <ProofPanel />

      <div className="section-head"><h2>Why it's different</h2></div>
      <div className="compare">
        <div className="card soft">
          <div className="eyebrow">Traditional resilience testing</div>
          <ol style={{ marginTop: 10 }}>
            {["Human chooses an experiment", "Human runs the test", "Human reads the logs", "Human diagnoses", "Human recovers", "Human writes the report"].map((t) => (
              <li key={t}><span className="who" style={{ background: "var(--paper-2)" }}>HUMAN</span>{t}</li>
            ))}
          </ol>
        </div>
        <div className="card hard">
          <div className="eyebrow">RYVO</div>
          <ol style={{ marginTop: 10 }}>
            {[["ROGUE", "rogue", "discovers a weak spot & proposes an experiment"], ["ORACLE", "oracle", "validates it against the safety policy"],
              ["ROGUE", "rogue", "injects a controlled, reversible failure"], ["AEGIS", "aegis", "detects, diagnoses (with evidence), recovers"],
              ["ORACLE", "oracle", "verifies recovery, scores, writes the report"], ["BOTH", "ink", "learn: the next experiment adapts"]].map(([w, c, t]) => (
              <li key={t}><span className="who" style={{ background: c === "ink" ? "var(--ink)" : `var(--${c})`, color: "#fff" }}>{w}</span>{t}</li>
            ))}
          </ol>
        </div>
      </div>
      <p className="muted" style={{ marginTop: 18, fontSize: 12.5 }}>
        Honest by design: everything here is a sandbox simulation. There is no connection to real 108 dispatch, the UPI network,
        banks or delivery companies. Map tiles © OpenStreetMap contributors; boundaries from geoBoundaries; all stations, zones and routes are simulated.
      </p>
    </div>
  );
}
