"""The three systems the arena can attack. Each domain module provides the same pieces:

    ID, TITLE, ICON, STAKE, TICK_UNIT, SIM_SEC_PER_TICK, ROUND_TICKS, ATTACK_AT
    ATTACKS, FIXES, ATTACK_INFO, FIX_INFO, SCENARIOS
    Twin                    -> A+B+C: the digital twin with its services and chaos hooks
    pick_target(...)        -> E: what Red aims each attack at
    sense(state, memory)    -> F: the Monitor's sensors (symptom -> evidence)
    symptom_key(...)        -> F: how the Playbook files a symptom
    RULES, EFFECT_SYMPTOMS  -> F: the Diagnoser's first-principles rules
    METRICS, score(...), red_reward(...) -> G: what the Referee measures
    MAP_LEGEND              -> H: names for the dashboard map layers
"""
from domains import emergency, food, upi

REGISTRY = {d.ID: d for d in (emergency, food, upi)}
ORDER = ["emergency", "food", "upi"]


def get(domain_id):
    return REGISTRY[domain_id]
