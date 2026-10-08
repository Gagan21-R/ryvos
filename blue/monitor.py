"""F · AEGIS Monitor: watches city.state every tick and raises an alert when something looks wrong.

It only uses the domain's sensors (what a real control room can see) - never the twin's ground truth.
A symptom must show up CONFIRM_TICKS ticks in a row (no false alarms), and disappear that long to resolve.

Run: python -m blue.monitor
"""
import domains
from shared import bus, config, names


def main():
    print("[monitor] watching city.state", flush=True)
    current = None
    for _, state in bus.subscribe(names.CITY_STATE):
        key = (state["round"], state["domain"])
        if key != current:                  # new round: forget everything
            current, memory, seen, missing, active = key, {}, {}, {}, {}
        D = domains.get(state["domain"])
        found = D.sense(state, memory)
        base = {"round": state["round"], "domain": state["domain"], "t": state["t"]}

        for symptom, evidence in found.items():
            seen[symptom] = seen.get(symptom, 0) + 1
            missing[symptom] = 0
            if symptom not in active and seen[symptom] >= config.CONFIRM_TICKS:
                active[symptom] = evidence
                skey = D.symptom_key(symptom, evidence)
                text = getattr(D, "SYMPTOM_TEXT", {}).get(symptom, symptom.replace("_", " "))
                bus.publish(names.BLUE_ALERT, {**base, "status": "new", "symptom": symptom, "key": skey,
                                               "evidence": evidence, "speech": f"Something changed: {text}."})
                print(f"[monitor] r{state['round']} t={state['t']} ALERT {skey} {evidence}", flush=True)

        for symptom in list(seen):
            if symptom in found:
                continue
            seen[symptom] = 0
            missing[symptom] = missing.get(symptom, 0) + 1
            if symptom in active and missing[symptom] >= config.CONFIRM_TICKS:
                del active[symptom]
                bus.publish(names.BLUE_ALERT, {**base, "status": "resolved", "symptom": symptom,
                                               "speech": f"Signal back to normal: {symptom.replace('_', ' ')} cleared."})
                print(f"[monitor] r{state['round']} t={state['t']} resolved {symptom}", flush=True)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        pass
