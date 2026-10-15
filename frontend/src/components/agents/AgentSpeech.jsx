// An agent's latest message, shown as plain text (no bubble, no typing effect).
import { AGENTS, AgentBadge } from "../common/ui.jsx";

const STATE = { idle: "Idle", thinking: "Planning", excited: "Active", acting: "Acting", focus: "Investigating", scan: "Scanning",
  thoughtful: "Reviewing", happy: "Done", surprised: "Re-assessing", approve: "Approved", block: "Blocked", think: "Evaluating" };

export function agentState(mood) {
  return STATE[mood] || (mood ? mood[0].toUpperCase() + mood.slice(1) : "Idle");
}

export default function AgentCard({ agent, mood, text, detail }) {
  const a = AGENTS[agent];
  const busy = mood && !["idle", "happy"].includes(mood);
  return (
    <section className={`agent-card ${agent} ${busy ? "busy" : ""}`} aria-label={`${a.name} status`}>
      <div className="head">
        <AgentBadge agent={agent} />
        <div><div className="name">{a.name}</div><div className="role">{detail || a.role}</div></div>
        <span className={`chip state ${busy ? agent : ""}`}>{agentState(mood)}</span>
      </div>
      <p key={text} className={`say fade-in ${text ? "" : "empty-say"}`} role="status" aria-live="polite" style={{ margin: 0 }}>{text || "Waiting for the next round."}</p>
    </section>
  );
}
