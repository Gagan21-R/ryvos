import { agentState } from "../components/agents/AgentSpeech.jsx";
import { AgentBadge } from "../components/common/ui.jsx";
import { useArena } from "../state/arenaStore.js";
import { useStory } from "../story/director.js";

export default function Agents() {
  const story = useStory();
  const learn = useArena((s) => s.learn);
  const results = (learn.results || []).filter((r) => r.resilience != null);
  const verdicts = learn.verdicts || [];
  const book = Object.values(learn.playbook || {});
  const avg = (xs) => (xs.length ? Math.round(xs.reduce((a, b) => a + b, 0) / xs.length) : "—");
  const cards = [
    { id: "rogue", name: "ROGUE", tag: "Challenger",
      method: "Multi-armed bandit (ε-greedy, reinforcement learning)",
      text: "Observes the system, picks the weakness that has caused the most damage so far, estimates severity, asks ORACLE for permission and only then runs a controlled, reversible failure.",
      stats: [["Experiments run", results.reduce((a, r) => a + r.attacks.length, 0)], ["Blocked by ORACLE", verdicts.filter((v) => !v.approved).length], ["Average damage", `${avg(results.map((r) => r.red_reward * 100))}%`]] },
    { id: "aegis", name: "AEGIS", tag: "Guardian",
      method: "Rule base + learned playbook; anomaly detector trained on real telemetry",
      text: "Monitors every service, detects anomalies, diagnoses the root cause with an evidence-based confidence score, applies only whitelisted fixes, verifies recovery and saves what worked to its playbook.",
      stats: [["Playbook lessons", book.length], ["Average root-cause confidence", `${avg(results.map((r) => r.aegis_confidence).filter((x) => x != null))}%`], ["Recovered rounds", results.filter((r) => r.resolved).length]] },
    { id: "oracle", name: "ORACLE", tag: "Referee",
      method: "Safety policy + scoring against the experiment record",
      text: "Validates every experiment against the safety policy, checks AEGIS's diagnosis against what was actually injected, measures MTTD and MTTR, scores resilience and writes the incident report.",
      stats: [["Verdicts given", verdicts.length], ["Validated accuracy", `${avg(results.map((r) => r.oracle?.accuracy).filter((x) => x != null))}%`], ["Rounds scored", results.length]] },
  ];
  return (
    <div className="page">
      <div className="page-head">
        <div>
          <div className="eyebrow">Agents</div>
          <h1 className="h-page">Three agents, one closed loop</h1>
          <p className="lede">Each agent is a separate process. They never call each other directly: every message goes through the event bus.</p>
        </div>
      </div>
      <div className="learn-cards">
        {cards.map((c) => (
          <div key={c.id} className="learn-card">
            <div className="who">
              <AgentBadge agent={c.id} size="lg" />
              <div><b>{c.name}</b><div className="muted" style={{ fontSize: 13 }}>{c.tag}</div></div>
              <span className="chip" style={{ marginLeft: "auto" }}>{agentState(story.agents[c.id].mood)}</span>
            </div>
            <p style={{ margin: 0, color: "var(--ink-2)" }}>{c.text}</p>
            <div className="chip" style={{ whiteSpace: "normal", alignSelf: "flex-start" }}>{c.method}</div>
            <dl className="kv" style={{ borderTop: "1px solid var(--line)", paddingTop: 12 }}>{c.stats.map(([k, v]) => [<dt key={k}>{k}</dt>, <dd key={`${k}v`} className="num">{v}</dd>])}</dl>
            <div style={{ borderTop: "1px solid var(--line)", paddingTop: 12 }}>
              <div className="eyebrow" style={{ marginBottom: 4 }}>Latest message</div>
              <div style={{ fontSize: 14 }}>{story.agents[c.id].speech || "Waiting for the next round."}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
