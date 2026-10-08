"""F · AEGIS Diagnoser: turns alerts into a root cause (with an evidence-based confidence) and a fix to try.

How it thinks (for every alert = "incident"):
  1. Playbook first: if this exact symptom was solved before, re-use that fix recipe immediately.
  2. Otherwise investigate for a few ticks, then try the rule book's fixes one by one.
  3. After each fix, wait VERIFY_TICKS. Still broken -> remember that fix failed, try the next one.
  4. Side-effect symptoms (e.g. a backlog) wait while a root-cause symptom is being fixed.
  5. When the Monitor says "resolved", save the recipe that worked into the Playbook.

Run: python -m blue.diagnoser
"""
import domains
from blue import confidence
from learning import playbook
from shared import bus, config, names


class Diagnoser:
    def __init__(self):
        self.enabled = True
        self.current = None

    def strength(self, D, symptom):
        """How bad the symptom looks right now (0..1), read from the latest state with the domain's sensors."""
        if not self.state or self.state.get("domain") != D.ID:
            return None
        return D.sense(self.state, {}).get(symptom, {}).get("_strength", 0.0)

    def new_round(self, key):
        self.current = key
        self.incidents = {}       # symptom -> incident dict
        self.applied = set()      # fixes already requested this round
        self.last_root_fix_t = -99

    SPEECH = {
        "investigating": "I'm investigating the anomaly. Checking the dependency chain.",
        "waiting": "This looks like a side-effect. Fixing the root cause first.",
        "escalate": "I'm out of safe options. Paging a human engineer.",
        "learned": "System health is restored. Saving this to the playbook.",
    }

    def publish(self, D, inc, status, text, fixes=(), speech=None, **extra):
        round_no, domain = self.current
        bus.publish(names.BLUE_DIAGNOSIS, {
            "round": round_no, "domain": domain, "t": self.t, "status": status, "symptom": inc["symptom"],
            "key": inc["key"], "fixes": list(fixes), "source": inc["source"], "cause": text,
            "target": inc["target"], "attempt": len(inc["tried"]),
            "speech": speech or self.SPEECH.get(status, text), **extra})
        print(f"[diagnoser] r{round_no} t={self.t} {inc['key']}: {status} {list(fixes)} ({inc['source']}) {text}",
              flush=True)

    def roots_busy(self, D, inc):
        """Is a root-cause symptom still open, or was one just fixed and still settling?"""
        open_roots = [i["symptom"] for i in self.incidents.values()
                      if i is not inc and i["symptom"] not in D.EFFECT_SYMPTOMS]
        return open_roots or self.t < self.last_root_fix_t + getattr(D, "VERIFY_TICKS", config.VERIFY_TICKS)

    def apply(self, D, inc, fixes, why):
        fixes = [f for f in fixes if f not in self.applied] or fixes
        others = sum(1 for i in self.incidents.values() if i is not inc and i["state"] != "ignored")
        entry = playbook.load().get(f"{D.ID}:{inc['key']}")
        hint = getattr(D, "SIGNATURE_HINT", {}).get(inc["key"])
        main = hint if hint in fixes else fixes[-1]      # the fix that matches the signature (else the last in the recipe)
        a = confidence.assess(D, inc, main, others, entry)
        if inc["source"] == "playbook":
            speech = f"I've seen this before: {a['root_cause'].lower()}. Applying {' + '.join(fixes)}."
        else:
            speech = f"Root cause identified: {a['root_cause'].lower()}. Applying {main}."
        inc["tried"] += [f for f in fixes if f not in inc["tried"]]
        self.applied.update(fixes)
        inc["state"], inc["next_at"] = "verifying", self.t + getattr(D, "VERIFY_TICKS", config.VERIFY_TICKS)
        inc["strength_at_fix"], inc["extensions"] = self.strength(D, inc["symptom"]), 0
        if inc["symptom"] not in D.EFFECT_SYMPTOMS:
            self.last_root_fix_t = self.t
        self.publish(D, inc, "fix", why, fixes, speech=speech, confidence=a, root_cause=a["root_cause"])

    def try_next_rule(self, D, inc):
        candidates = [f for f in D.RULES.get(inc["symptom"], []) if f not in inc["tried"] and f not in self.applied]
        if not candidates:
            inc["state"] = "escalated"
            self.publish(D, inc, "escalate", "rule book exhausted - paging a human engineer")
            return
        inc["source"] = "rules"
        fix = candidates[0]
        self.apply(D, inc, [fix], f"rule: {inc['symptom']} is usually fixed by '{fix}' - {D.FIX_INFO[fix]}")

    def decide(self, D, inc):
        if inc["symptom"] in D.EFFECT_SYMPTOMS and self.roots_busy(D, inc):
            inc["state"], inc["next_at"] = "waiting_root", self.t + 2
            return
        recipe = playbook.lookup(D.ID, inc["key"])
        if recipe and not inc["tried"]:
            inc["source"] = "playbook"
            self.apply(D, inc, recipe, f"playbook: '{inc['key']}' was solved before by {' + '.join(recipe)}")
        else:
            self.try_next_rule(D, inc)

    def on_alert(self, D, alert):
        symptom = alert["symptom"]
        if alert["status"] == "new":
            evidence = alert.get("evidence", {})
            target = next((v for v in evidence.values() if isinstance(v, list)), [])
            inc = {"symptom": symptom, "key": alert["key"], "opened": self.t, "tried": [], "source": "rules",
                   "target": target, "state": "new", "next_at": self.t, "evidence": evidence}
            self.incidents[symptom] = inc
            if not self.enabled:
                inc["state"] = "ignored"
                return
            if playbook.lookup(D.ID, inc["key"]) and not (symptom in D.EFFECT_SYMPTOMS and self.roots_busy(D, inc)):
                self.decide(D, inc)                       # known problem: act at once
            elif symptom in D.EFFECT_SYMPTOMS and self.roots_busy(D, inc):
                inc["state"], inc["next_at"] = "waiting_root", self.t + 2
                self.publish(D, inc, "waiting", "looks like a side-effect of another problem - fixing that first")
            else:
                inc["state"], inc["next_at"] = "investigating", self.t + config.INVESTIGATE_TICKS
                self.publish(D, inc, "investigating", "no playbook entry - checking logs and service health")
        else:
            inc = self.incidents.pop(symptom, None)
            if inc and inc["tried"] and self.enabled:
                playbook.record_success(D.ID, inc["key"], inc["tried"], self.t - inc["opened"], self.current[0])
                self.publish(D, inc, "learned", f"saved to playbook: {inc['key']} -> {' + '.join(inc['tried'])}",
                             inc["tried"])

    def on_tick(self, D):
        for inc in list(self.incidents.values()):
            if inc["state"] in ("ignored", "escalated") or self.t < inc["next_at"]:
                continue
            if inc["state"] in ("investigating", "waiting_root"):
                self.decide(D, inc)
            elif inc["state"] == "verifying":        # fix window over and the symptom is still there
                now, before = self.strength(D, inc["symptom"]), inc.get("strength_at_fix")
                if now is not None and before and now <= 0.8 * before and inc["extensions"] < 2:
                    inc["extensions"] += 1           # clearly improving: give the fix more time instead of piling on
                    inc["next_at"] = self.t + getattr(D, "VERIFY_TICKS", config.VERIFY_TICKS)
                    self.publish(D, inc, "verifying", f"improving ({before:.0%} -> {now:.0%}), giving the fix more time",
                                 speech="It's improving. Giving the fix more time before trying anything else.")
                    continue
                if inc["source"] == "rules":
                    playbook.record_failure(D.ID, inc["key"], inc["tried"][-1])
                self.publish(D, inc, "no_effect", f"'{inc['tried'][-1]}' did not clear it",
                             speech=f"{inc['tried'][-1]} didn't clear it. Trying the next hypothesis.")
                self.try_next_rule(D, inc)

    def learn_from_oracle(self, res):
        """AEGIS learns from ORACLE's validation: drop fixes the referee found unnecessary (when recovery worked)."""
        oracle = res.get("oracle") or {}
        if not (res.get("resolved") and oracle.get("validated") and oracle.get("unnecessary")):
            return
        for symptom, dropped in playbook.prune(res["domain"], oracle["unnecessary"]):
            bus.publish(names.AGENT_SAY, {
                "agent": "aegis", "round": res["round"], "domain": res["domain"], "mood": "thoughtful",
                "speech": f"ORACLE says {', '.join(dropped)} wasn't needed for {symptom}. Removing it from my playbook."})

    def run(self):
        print("[diagnoser] ready", flush=True)
        self.t = 0
        self.state = None
        for channel, msg in bus.subscribe(names.CITY_STATE, names.BLUE_ALERT, names.CONTROL, names.ROUND_RESULT):
            if channel == names.ROUND_RESULT:
                self.learn_from_oracle(msg)
                continue
            if channel == names.CONTROL:
                if msg.get("cmd") == "blue":
                    self.enabled = bool(msg.get("enabled"))
                elif msg.get("cmd") == "reset_learning":
                    playbook.clear()
                continue
            key = (msg["round"], msg["domain"])
            if key != self.current:
                self.new_round(key)
                self.t = msg["t"]
            self.t = max(self.t, msg["t"])
            D = domains.get(msg["domain"])
            if channel == names.BLUE_ALERT:
                self.on_alert(D, msg)
            else:
                self.state = msg
                self.on_tick(D)


if __name__ == "__main__":
    try:
        Diagnoser().run()
    except KeyboardInterrupt:
        pass
