// Shared building blocks: agent badges and system icons (no emoji, no illustration).
import { Ambulance, Bike, Check, CreditCard, FlaskConical, Repeat, Scale, ShieldCheck, Triangle, X } from "lucide-react";

export const SYSTEMS = [
  { id: "emergency", name: "108 Emergency", short: "108", sub: "Ambulance dispatch, Bengaluru", icon: Ambulance },
  { id: "food", name: "Free Delivery", short: "Delivery", sub: "Orders and free-delivery zones", icon: Bike },
  { id: "upi", name: "UPI Payments", short: "UPI", sub: "Payment switch and partner banks", icon: CreditCard },
];
export const ROTATE = { id: "all", name: "Rotate all", short: "Rotate", icon: Repeat };
export const systemById = (id) => SYSTEMS.find((s) => s.id === id);

export const AGENTS = {
  rogue: { name: "ROGUE", role: "Challenger", icon: FlaskConical },
  aegis: { name: "AEGIS", role: "Guardian", icon: ShieldCheck },
  oracle: { name: "ORACLE", role: "Referee", icon: Scale },
};

export function AgentBadge({ agent, size = "md" }) {
  const Icon = AGENTS[agent]?.icon || Scale;
  return (
    <span className={`agent-badge ${agent} ${size === "lg" ? "lg" : ""}`} aria-hidden="true">
      <Icon size={size === "lg" ? 22 : 17} strokeWidth={1.9} />
    </span>
  );
}

export function SystemTabs({ value, onChange, withAll = false }) {
  const list = withAll ? [{ id: "all", short: "All" }, ...SYSTEMS] : SYSTEMS;
  return (
    <div className="tabs" role="tablist">
      {list.map((s) => {
        const Icon = s.icon;
        return (
          <button key={s.id} className={value === s.id ? "on" : ""} onClick={() => onChange(s.id)} role="tab" aria-selected={value === s.id}>
            {Icon && <Icon size={15} aria-hidden="true" />}{s.short}
          </button>
        );
      })}
    </div>
  );
}

// A status mark for checklists: ok / bad / partial.
export function Mark({ ok }) {
  if (ok === true) return <span className="m ok"><Check size={14} strokeWidth={2.4} /></span>;
  if (ok === null) return <span className="m alt"><Triangle size={11} strokeWidth={2.4} /></span>;
  return <span className="m no"><X size={14} strokeWidth={2.4} /></span>;
}
