import { Play, ShieldAlert } from "lucide-react";
import AgentCard, { agentState } from "../components/agents/AgentSpeech.jsx";
import { DecisionPanel, DiagnosisPanel, FinalVerdict, RecoveryPanel, SafetyPanel } from "../components/arena/Panels.jsx";
import SystemTopology from "../components/arena/SystemTopology.jsx";
import { AgentBadge, systemById } from "../components/common/ui.jsx";
import ArenaMap from "../components/map/ArenaMap.jsx";
import { api } from "../services/api.js";
import { act, useArena } from "../state/arenaStore.js";
import { PHASES, useDisplayState, useStory } from "../story/director.js";

const PHASE_LABEL = { DISCOVER: "Discover", PLAN: "Plan", SAFETY: "Safety check", DISRUPT: "Disrupt", DETECT: "Detect",
  DIAGNOSE: "Diagnose", RECOVER: "Recover", VERIFY: "Verify", LEARN: "Learn", ADAPT: "Adapt" };

export function PhaseTrack({ phase }) {
  const idx = PHASES.indexOf(phase);
  return (
    <div className="phase-track" aria-label={`Current phase: ${PHASE_LABEL[phase] || phase}`}>
      {PHASES.map((p, i) => <span key={p} className={`ph ${i < idx ? "done" : ""} ${i === idx ? "now" : ""}`}>{PHASE_LABEL[p]}</span>)}
    </div>
  );
}

export async function startRound(domain, extra = {}) {
  return act("start", () => api.startRound({ domain, ...extra }), "Autonomous round started");
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
  const sys = systemById(s?.domain);
  const { rogue, aegis, oracle } = story.agents;
  const attacked = (s?.topology?.nodes || []).filter((n) => n.attacked_by?.length).map((n) => n.id);
  const curResult = story.result && story.result.round === story.round ? story.result : null;
  const prevResult = story.result || story.lastResult;
  const mode = st.domain_mode && st.domain_mode !== "all" ? st.domain_mode : s?.domain;

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <div className="eyebrow">
            Round {s?.round ?? "—"} · {sys ? sys.name : "Connecting"} · t = {s?.t ?? 0} of {s?.round_ticks ?? "—"} {D?.tick_unit} (simulated)
            {behind > 2 ? ` · replaying, live is ${behind} ${D?.tick_unit} ahead` : ""}
          </div>
          <h1 className="h-page">Live arena</h1>
          <PhaseTrack phase={story.phase} />
        </div>
        <div className="row">
          <button className="btn primary" onClick={() => startRound(mode)}><Play size={16} /> Run autonomous scenario</button>
          <button className="btn" onClick={() => act("safety", () => api.safetyTest(), "Safety test requested: ROGUE will ask for a destructive experiment")}>
            <ShieldAlert size={16} /> Test safety controller
          </button>
        </div>
      </div>

      {st.blue_enabled === false && <div className="banner">AEGIS is switched off: ROGUE's failures will go unanswered this round.</div>}
      {story.idle && <div className="banner info">Autoplay is paused between rounds. Press "Run autonomous scenario".</div>}

      <div className="referee">
        <AgentBadge agent="oracle" />
        <p key={oracle.speech} className="say fade-in" role="status" aria-live="polite" style={{ margin: 0 }}><span className="name">ORACLE</span><span className="muted"> · referee · </span>{oracle.speech}</p>
        <span className="chip oracle">{agentState(oracle.mood)}</span>
      </div>

      <div className="stage">
        <div className="stage-col">
          <AgentCard agent="rogue" mood={rogue.mood} text={rogue.speech} detail="Challenger · plans controlled failures" />
          <DecisionPanel proposal={story.proposal} />
          <SafetyPanel verdict={story.verdict} pending={story.verdictPending} />
        </div>

        <div className="stage-center">
          <ArenaMap height={430} compact={false} state={s} />
          <div className="card">
            <div className="card-title">
              <div><h3>Service topology</h3><div className="sub">Status of each service in the digital twin</div></div>
              <span className="chip sim">prototype telemetry</span>
            </div>
            <SystemTopology topology={s?.topology} highlight={attacked} />
          </div>
          {prevResult && <FinalVerdict result={curResult || prevResult} meta={meta} />}
        </div>

        <div className="stage-col">
          <AgentCard agent="aegis" mood={aegis.mood} text={aegis.speech} detail="Guardian · detects and recovers" />
          <DiagnosisPanel diagnosis={story.diagnosis} incidents={story.incidents} oracleAccuracy={curResult?.oracle?.accuracy} />
          <RecoveryPanel fixes={story.fixes} resolved={story.resolved} />
        </div>
      </div>
    </div>
  );
}
