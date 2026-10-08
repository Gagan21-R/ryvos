import { motion } from "motion/react";
import Bot from "../components/agents/Bot.jsx";
import OracleOrb from "../components/agents/OracleOrb.jsx";
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
    { id: "rogue", name: "ROGUE", tag: "The Challenger", color: "var(--rogue)", char: <Bot kind="rogue" mood={story.agents.rogue.mood} size={170} />,
      text: "Playful, curious, a little unpredictable, never evil. ROGUE observes the system, picks a weakness with a multi-armed bandit, estimates severity, asks ORACLE for permission and only then runs a controlled, reversible failure.",
      stats: [["Experiments run", results.reduce((a, r) => a + r.attacks.length, 0)], ["Blocked by ORACLE", verdicts.filter((v) => !v.approved).length], ["Avg damage", `${avg(results.map((r) => r.red_reward * 100))}%`]] },
    { id: "aegis", name: "AEGIS", tag: "The Guardian", color: "var(--aegis)", char: <Bot kind="aegis" mood={story.agents.aegis.mood} size={170} />,
      text: "Calm, protective and focused. AEGIS monitors every service, detects anomalies, diagnoses the root cause with an evidence-based confidence, applies only whitelisted fixes, verifies recovery and saves what worked to its playbook.",
      stats: [["Playbook lessons", book.length], ["Avg root-cause confidence", `${avg(results.map((r) => r.aegis_confidence).filter((x) => x != null))}%`], ["Recovered rounds", results.filter((r) => r.resolved).length]] },
    { id: "oracle", name: "ORACLE", tag: "The Referee", color: "var(--oracle)", char: <OracleOrb mood={story.agents.oracle.mood} size={150} />,
      text: "Neutral, analytical, never a competitor. ORACLE validates every experiment against the safety policy, independently checks AEGIS's diagnosis against the experiment record, measures MTTD/MTTR, scores resilience and narrates.",
      stats: [["Verdicts given", verdicts.length], ["Validated accuracy", `${avg(results.map((r) => r.oracle?.accuracy).filter((x) => x != null))}%`], ["Rounds scored", results.length]] },
  ];
  return (
    <div className="page">
      <div className="eyebrow">The cast</div>
      <h1 className="h-page">Agents</h1>
      <div className="learn-cards" style={{ marginTop: 18 }}>
        {cards.map((c, i) => (
          <motion.div key={c.id} className={`learn-card ${c.id}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <div style={{ display: "grid", placeItems: "center", minHeight: 210 }}>{c.char}</div>
            <div><div className="big-num" style={{ fontSize: 40, color: c.color }}>{c.name}</div><div className="eyebrow">{c.tag}</div></div>
            <p style={{ margin: 0, color: "var(--ink-2)" }}>{c.text}</p>
            <dl className="kv">{c.stats.map(([k, v]) => [<dt key={k}>{k}</dt>, <dd key={`${k}v`}>{v}</dd>])}</dl>
            <div className="bubble" style={{ background: c.color }}>{story.agents[c.id].speech || "…"}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
