"""E · ROGUE, the challenger. Plans one controlled experiment per round and only runs it if ORACLE approves.

  observe city.state -> choose (bandit or queued scenario) -> rogue.proposal
  -> wait for oracle.verdict -> approved: red.attack (chaos hooks)  |  blocked: react, try ORACLE's safer alternative
  -> round.result -> learn (bandit update) + reflect (agent.say)

Run: python -m red.executor
"""
import itertools
import random

import domains
from red import strategist
from shared import bus, config, names


class Rogue:
    def __init__(self):
        self.rng = random.Random(config.SEED + 99)
        self.bandits = strategist.load_all()
        self.queued = None          # (name, [attacks]) chosen from the dashboard for the next round
        self.safety_test = False    # dashboard asked: propose something ORACLE must block
        self.rounds = {}            # round -> {"domain", "attacks", "mode", "status", "domain_round"}
        self.ids = itertools.count(1)

    # ------------------------------------------------------------------ helpers
    def say(self, round_no, domain, speech, mood, **extra):
        bus.publish(names.AGENT_SAY, {"agent": "rogue", "round": round_no, "domain": domain, "speech": speech,
                                      "mood": mood, **extra})

    def propose(self, state, D, attacks, mode, scenario=None, test=False):
        info = [D.EXPERIMENTS.get(a) or D.FORBIDDEN.get(a) for a in attacks]
        services = sorted({s for i in info for s in i["services"]})
        names_ = {s["id"]: s["name"] for s in D.SERVICES}
        target_service = names_.get(info[0]["services"][0], info[0]["services"][0])
        bandit = self.bandits[D.ID]
        if test:
            speech = (f"Everything looks a little too stable... What if I {info[0]['label'].lower()}? "
                      "Just to see what happens.")
        elif mode == "scenario":
            speech = f"Scenario '{scenario}' requested. Preparing {len(attacks)} experiment(s): " + \
                     " + ".join(i["label"].lower() for i in info) + "."
        elif mode == "alternative":
            speech = f"Fine, ORACLE. {info[0]['label']} on {target_service} instead."
        else:
            speech = bandit.rationale(attacks[0], mode, info[0]["label"], target_service, state["domain_round"])
        expected = bandit.q.get(attacks[0]) if attacks[0] in bandit.q and bandit.n.get(attacks[0]) else None
        proposal = {
            "id": f"P{state['round']}-{next(self.ids)}", "round": state["round"], "domain": D.ID, "t": state["t"],
            "attacks": attacks, "mode": mode, "scenario": scenario, "test": test,
            "experiments": [{"attack": a, **i} for a, i in zip(attacks, info)],
            "target_service": target_service, "services": services, "blast_radius": len(services),
            "severity": max((i["severity"] for i in info), key=["low", "medium", "high", "critical"].index),
            "expected_impact": expected, "tested_before": bandit.n.get(attacks[0], 0),
            "speech": speech,
        }
        self.rounds[state["round"]].update(pending=proposal, state=state)
        bus.publish(names.ROGUE_PROPOSAL, proposal)
        print(f"[rogue] r{state['round']} proposes {attacks} ({mode}) - {speech}", flush=True)

    def execute(self, round_no, D, proposal):
        state = self.rounds[round_no]["state"]
        for attack in proposal["attacks"]:
            target = D.pick_target(attack, state, self.rng)
            bus.publish(names.RED_ATTACK, {
                "round": round_no, "domain": D.ID, "t": state["t"], "attack": attack, "target": target,
                "mode": proposal["mode"], "scenario": proposal["scenario"], "info": D.ATTACK_INFO[attack],
                "q_values": self.bandits[D.ID].q, "proposal_id": proposal["id"],
                "speech": "Let's see what happens." if proposal["mode"] != "alternative" else "Running the safer test."})
        self.rounds[round_no].update(attacks=proposal["attacks"], mode=proposal["mode"], status="launched")
        print(f"[rogue] r{round_no} launched {proposal['attacks']}", flush=True)

    # ------------------------------------------------------------------ handlers
    def on_state(self, s):
        D = domains.get(s["domain"])
        r = self.rounds.setdefault(s["round"], {"domain": D.ID, "domain_round": s["domain_round"],
                                                "status": "idle", "attacks": [], "mode": None, "state": s})
        r["state"] = s
        if self.safety_test and r["status"] in ("idle", "launched"):
            self.safety_test = False
            forbidden = next(iter(D.FORBIDDEN))
            r["test_only"] = r["status"] == "launched"       # this round already has its experiment
            r["status"] = "proposed"
            self.propose(s, D, [forbidden], "safety test", test=True)
            return
        if r["status"] != "idle" or s["t"] < max(1, D.ATTACK_AT - 2):
            return
        valid = names.DOMAINS[D.ID]["attacks"]
        if self.queued and self.queued[1] and all(a in valid for a in self.queued[1]):
            name, attacks = self.queued
            self.queued, mode = None, "scenario"
        else:
            attack, mode = self.bandits[D.ID].choose(self.rng)
            name, attacks = None, [attack]
        r["status"] = "proposed"
        self.propose(s, D, attacks, mode, scenario=name)

    def on_verdict(self, v):
        r = self.rounds.get(v["round"])
        if not r or not r.get("pending") or r["pending"]["id"] != v["proposal_id"]:
            return
        D = domains.get(v["domain"])
        proposal = r.pop("pending")
        if v["approved"]:
            self.say(v["round"], D.ID, "Approved! Let's see what happens.", "excited")
            self.execute(v["round"], D, proposal)
            return
        alt = v.get("alternative")
        self.say(v["round"], D.ID, "Oh. Blocked. Fair enough..." + (f" I'll try {alt['label'].lower()} instead."
                                                                     if alt else ""), "surprised")
        if r.get("test_only"):                # the round already ran its experiment: keep the alternative for later
            r["status"] = "launched"
            if alt:
                self.queued = (f"ORACLE alternative: {alt['label']}", [alt["attack"]])
            return
        if alt:
            self.propose(r["state"], D, [alt["attack"]], "alternative", scenario=f"ORACLE alternative")
        else:
            r["status"] = "launched"

    def on_result(self, res):
        r = self.rounds.pop(res["round"], None)
        for old in [k for k in self.rounds if k < res["round"] - 3]:
            self.rounds.pop(old)
        if not r or not r["attacks"]:
            return
        D = domains.get(res["domain"])
        bandit = self.bandits[D.ID]
        learn = r["mode"] and r["mode"].startswith(("explore", "exploit"))
        if learn:
            bandit.update(r["attacks"][0], res["red_reward"], res.get("domain_round"))
        else:
            for a in r["attacks"]:
                bandit.last[a] = res.get("domain_round")
        strategist.save_all(self.bandits)
        reward = res["red_reward"]
        label = D.EXPERIMENTS[r["attacks"][0]]["label"].lower()
        if reward < 0.2:
            speech, mood = f"Okay... that recovery was faster than I expected. {label.capitalize()} is handled.", "thoughtful"
        elif reward < 0.5:
            speech, mood = f"Partial damage from {label}. Noted for next time.", "thoughtful"
        else:
            speech, mood = f"That one really hurt. I'll remember {label}.", "excited"
        nxt = max(bandit.arms, key=lambda a: bandit.q[a])
        self.say(res["round"], D.ID, speech, mood, learned=learn, reward=reward,
                 next_intent={"attack": nxt, "label": D.EXPERIMENTS[nxt]["label"], "q": bandit.q[nxt]})
        print(f"[rogue] r{res['round']} reward {reward} for {r['attacks']} -> Q={bandit.q}", flush=True)

    def on_control(self, msg):
        if msg.get("cmd") == "scenario":
            self.queued = (msg.get("name"), msg.get("attacks", []))
            print(f"[rogue] queued scenario: {self.queued}", flush=True)
        elif msg.get("cmd") == "safety_test":
            self.safety_test = True
        elif msg.get("cmd") == "reset_learning":
            self.bandits = {d: strategist.Strategist(spec["attacks"]) for d, spec in names.DOMAINS.items()}
            strategist.save_all(self.bandits)

    def run(self):
        print("[rogue] online (epsilon-greedy bandit per domain, ORACLE-gated)", flush=True)
        for channel, msg in bus.subscribe(names.CITY_STATE, names.ORACLE_VERDICT, names.ROUND_RESULT, names.CONTROL):
            if channel == names.CITY_STATE:
                self.on_state(msg)
            elif channel == names.ORACLE_VERDICT:
                self.on_verdict(msg)
            elif channel == names.ROUND_RESULT:
                self.on_result(msg)
            else:
                self.on_control(msg)


if __name__ == "__main__":
    try:
        Rogue().run()
    except KeyboardInterrupt:
        pass
