import { Play, ShieldAlert } from "lucide-react";
import { motion } from "motion/react";
import AgentSpeech from "../components/agents/AgentSpeech.jsx";
import Bot from "../components/agents/Bot.jsx";
import OracleOrb from "../components/agents/OracleOrb.jsx";
import { DecisionPanel, DiagnosisPanel, FinalVerdict, SafetyPanel } from "../components/arena/Panels.jsx";
import SystemTopology from "../components/arena/SystemTopology.jsx";
import ArenaMap from "../components/map/ArenaMap.jsx";
import { api } from "../services/api.js";
import { act, useArena } from "../state/arenaStore.js";
import { PHASES, useDisplayState, useStory } from "../story/director.js";

export function PhaseTrack({ phase }) {
  const idx = PHASES.indexOf(phase);
  return (
    <div className="phase-track" aria-label={`Current phase: ${phase}`}>
      {PHASES.map((p, i) => <span key={p} className={`ph ${i < idx ? "done" : ""} ${i === idx ? "now" : ""}`}>{p}</span>)}
    </div>
  );
}

function Dock({ agent, name, role, mood, speech, speechKey, lean, look }) {
  return (
    <motion.div className={`agent-dock ${agent}`} animate={{ x: lean }} transition={{ type: "spring", stiffness: 120, damping: 16 }}>
      <div className="dock-head">
        <div><div className="dock-name">{name}</div><div className="dock-role">{role}</div></div>
        <span className="mood-tag">{mood}</span>
      </div>
      <div style={{ width: "100%", margin: "12px 0 4px" }}><AgentSpeech agent={agent} text={speech} speechKey={speechKey} /></div>
      <Bot kind={agent} mood={mood} size={150} lookAt={look} />
    </motion.div>
  );
}

export async function startRound(domain, extra = {}) {
  return act("start", () => api.startRound({ domain, ...extra }), "▶ Autonomous round started", "ink");
}

export default function Arena() {
  const live = useArena((s) => s.live);
  const meta = useArena((s) => s.meta);
  const story = useStory();
  const shown = useDisplayState();
  const s = shown || live?.state;
  const behind = live?.state && s && live.state.round === s.round ? live.state.t - s.t : 0;
  const st = live?.status || {};
  const D = meta?.domains?.[s?.domain];
  const { rogue, aegis, oracle } = story.agents;
  const rogueActive = ["acting", "excited"].includes(rogue.mood);
  const aegisActive = ["focus", "acting", "scan"].includes(aegis.mood);
  const attacked = (s?.topology?.nodes || []).filter((n) => n.attacked_by?.length).map((n) => n.id);
  const curResult = story.result && story.result.round === story.round ? story.result : null;
  const prevResult = story.result || story.lastResult;
  const mode = st.domain_mode && st.domain_mode !== "all" ? st.domain_mode : s?.domain;

  return (
    <div className="page">
      <div className="arena-head">
        <div>
          <div className="eyebrow">Live arena · round {s?.round ?? "—"} · {D ? `${D.icon} ${D.title}` : "connecting…"} · t = {s?.t ?? 0}/{s?.round_ticks ?? "—"} {D?.tick_unit} (simulated){behind > 2 ? ` · narrated replay, live is ${behind} ${D?.tick_unit} ahead` : ""}</div>
          <h1 className="h-page">The Arena</h1>
          <PhaseTrack phase={story.phase} />
        </div>
        <div className="row">
          <button className="btn primary" onClick={() => startRound(mode)}><Play size={16} /> Run autonomous scenario</button>
          <button className="btn oracle" onClick={() => act("safety", () => api.safetyTest(), "🛡 ROGUE will request something destructive…", "oracle")}>
            <ShieldAlert size={16} /> Test safety controller
          </button>
        </div>
      </div>

      {st.blue_enabled === false && <div className="banner">⚠ AEGIS is switched off: ROGUE's failures will go unanswered this round.</div>}
      {story.idle && <div className="banner info">Autoplay is paused between rounds. Press “Run autonomous scenario”.</div>}

      <div className="oracle-bar">
        <OracleOrb mood={oracle.mood} size={74} />
        <AgentSpeech agent="oracle" text={oracle.speech} speechKey={oracle.key} />
        <div style={{ textAlign: "right" }}>
          <div className="dock-name" style={{ fontFamily: "var(--display)", fontWeight: 700, fontSize: 20 }}>ORACLE</div>
          <div className="dock-role muted" style={{ fontSize: 11.5, fontWeight: 600 }}>referee · safety · narrator</div>
        </div>
      </div>

      <div className="stage">
        <div className="stage-col">
          <Dock agent="rogue" name="ROGUE" role="the challenger" mood={rogue.mood} speech={rogue.speech} speechKey={rogue.key}
            lean={rogueActive ? 22 : 0} look={rogueActive ? { x: 1, y: 0.2 } : null} />
          <DecisionPanel proposal={story.proposal} meta={meta} />
          <SafetyPanel verdict={story.verdict} pending={story.verdictPending} />
        </div>

        <div className="stage-center">
          <ArenaMap height={430} compact={false} state={s} />
          <div className="card soft">
            <div className="card-title">
              <h3>Live system</h3>
              <span className="chip sim">prototype telemetry</span>
            </div>
            <SystemTopology topology={s?.topology} highlight={attacked} />
          </div>
          {prevResult && <FinalVerdict result={curResult || prevResult} meta={meta} />}
        </div>

        <div className="stage-col">
          <Dock agent="aegis" name="AEGIS" role="the guardian" mood={aegis.mood} speech={aegis.speech} speechKey={aegis.key}
            lean={aegisActive ? -22 : 0} look={aegisActive ? { x: -1, y: 0.2 } : null} />
          <DiagnosisPanel diagnosis={story.diagnosis} incidents={story.incidents} oracleAccuracy={curResult?.oracle?.accuracy} />
          <div className="panel">
            <h4>AEGIS · recovery</h4>
            {story.fixes.length ? (
              <ul className="checks">
                {story.fixes.map((f, i) => <li key={i}><span className="mark" style={{ color: "var(--ok)" }}>✓</span><span><b>{f.action}</b> · whitelisted fix</span></li>)}
                {story.resolved.map((r, i) => <li key={`r${i}`}><span className="mark" style={{ color: "var(--fix)" }}>●</span><span>{r.symptom.replace(/_/g, " ")} cleared</span></li>)}
              </ul>
            ) : <div className="muted">Nothing to recover yet.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
