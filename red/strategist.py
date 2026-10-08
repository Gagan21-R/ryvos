"""E · ROGUE's strategist: a multi-armed bandit (reinforcement learning) that learns which failure hurts most.

Each attack is an "arm". After every round ORACLE's referee says how much damage it did (reward 0..1).
  - Q[arm] = running estimate of the damage that attack causes.
  - Usually pick the arm with the highest Q (exploit); with probability epsilon pick a random one (explore).
  - Q uses a constant step size (alpha) so it keeps adapting: when AEGIS learns to fix an attack fast,
    that attack's reward drops and ROGUE moves on to something else. (A "non-stationary" bandit.)
ROGUE also remembers when each attack was last tested, so it can explain its choice.
"""
import json

from shared import config, names

BRAIN = config.DATA_DIR / "red_brain.json"


class Strategist:
    def __init__(self, arms, epsilon=0.15, alpha=0.35, q=None, n=None, last=None):
        self.arms = list(arms)
        self.epsilon, self.alpha = epsilon, alpha
        self.q = q or {a: 0.0 for a in self.arms}
        self.n = n or {a: 0 for a in self.arms}
        self.last = last or {}            # attack -> domain round it was last tested

    def choose(self, rng):
        untried = [a for a in self.arms if self.n[a] == 0]
        if untried:
            return rng.choice(untried), "explore (untried)"
        if rng.random() < self.epsilon:
            return rng.choice(self.arms), "explore"
        best = max(self.q.values())
        return rng.choice([a for a in self.arms if self.q[a] == best]), "exploit"

    def update(self, arm, reward, domain_round=None):
        self.n[arm] += 1
        self.q[arm] = round(self.q[arm] + self.alpha * (reward - self.q[arm]), 3)
        if domain_round is not None:
            self.last[arm] = domain_round

    def rationale(self, arm, mode, label, service, domain_round):
        """One honest sentence: why ROGUE picked this arm (from its own memory)."""
        if mode.startswith("explore (untried)"):
            return f"Nobody has tested {label.lower()} on {service} yet. Let's see how resilient it really is."
        if mode == "explore":
            gap = domain_round - self.last.get(arm, 0) if arm in self.last else None
            ago = f"in {gap} rounds" if gap else "for a while"
            return f"{service} hasn't been challenged {ago}. Time for something different: {label.lower()}."
        best_alt = max((a for a in self.arms if a != arm), key=lambda a: self.q[a], default=None)
        note = f" (next best: {best_alt.replace('_', ' ')} at {self.q[best_alt]:.0%})" if best_alt else ""
        return (f"{label} still does the most damage, about {self.q[arm]:.0%} expected impact{note}. "
                f"Let's push {service} again.")

    def to_dict(self):
        return {"q": self.q, "n": self.n, "last": self.last}


def load_all():
    """One bandit per domain, restored from data/red_brain.json if it exists."""
    try:
        saved = json.loads(BRAIN.read_text(encoding="utf-8"))
    except (FileNotFoundError, json.JSONDecodeError):
        saved = {}
    out = {}
    for d, spec in names.DOMAINS.items():
        s = saved.get(d, {})
        q = {a: s.get("q", {}).get(a, 0.0) for a in spec["attacks"]}
        n = {a: s.get("n", {}).get(a, 0) for a in spec["attacks"]}
        out[d] = Strategist(spec["attacks"], q=q, n=n, last=s.get("last", {}))
    return out


def save_all(bandits):
    BRAIN.write_text(json.dumps({d: b.to_dict() for d, b in bandits.items()}, indent=2), encoding="utf-8")
