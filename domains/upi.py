"""💳 UPI payments switch for India.

Twin: a payment gateway, 5 partner banks, users in 10 cities paying each other.
Services: payment API, fraud check, bank switch (routing), ledger, notifications.
1 tick = 1 simulated second.
"""
import random
from collections import deque

from domains.common import build_topology, clip01, neutralised, poisson
from shared import names

ID = "upi"
TITLE = "UPI payments"
ICON = "💳"
STAKE = "Money and trust"
TICK_UNIT = "s"
SIM_SEC_PER_TICK = 1
ROUND_TICKS = 60
ATTACK_AT = 8
ARRIVALS_UNTIL = 55
ATTACKS = names.DOMAINS[ID]["attacks"]
FIXES = names.DOMAINS[ID]["fixes"]

ATTACK_INFO = {
    "bank_slow": "One partner bank's server slows down (7 s replies, 5 s timeout)",
    "diwali_spike": "10x Diwali sale traffic spike",
    "duplicate_storm": "Buggy app retries every payment + dedupe cache flushed",
    "fraud_bot_burst": "Bot farm fires 250 small payments/s from 3 devices",
}
FIX_INFO = {
    "route_to_healthy_bank": "Take the worst-failing bank out of the routing table",
    "queue_rate_limit": "Queue at the gateway and only send what banks can handle",
    "idempotency_check": "Ledger refuses a second debit for the same request id",
    "throttle_bot": "Block the bot devices at the API",
}
SCENARIOS = {
    "Diwali sale night": ["diwali_spike", "fraud_bot_burst"],
    "Bad app release": ["duplicate_storm", "bank_slow"],
}
METRICS = [
    {"key": "failed_pct", "label": "Failed payments", "unit": "%"},
    {"key": "double_debits", "label": "Double debits", "unit": ""},
    {"key": "stuck_money_inr", "label": "Money stuck (debited, not confirmed)", "unit": "₹"},
]
MAP_LEGEND = {"site": "Partner bank (healthy)", "site_bad": "Partner bank (failing)",
              "unit_reserve": "Bank removed from routing", "hub": "Payment gateway",
              "demand": "Users paying", "demand_urgent": "Users seeing failures", "unit_problem": "Bot farm"}

# ---------------------------------------------------------------- RYVO layer
GEOGRAPHY = {"country": "India", "home_level": "national", "home_region": None}
INDIA_BOUNDS = [[6.5, 68.0], [35.7, 97.5]]
SERVICES = [
    {"id": "api", "name": "Payment API", "criticality": "critical"},
    {"id": "fraud", "name": "Fraud check", "criticality": "high"},
    {"id": "switch", "name": "Bank switch", "criticality": "critical"},
    {"id": "ledger", "name": "Ledger", "criticality": "critical"},
    {"id": "notify", "name": "Notifications", "criticality": "medium"},
]
EDGES = [["api", "fraud"], ["fraud", "switch"], ["switch", "ledger"], ["ledger", "notify"]]
EXPERIMENTS = {
    "bank_slow": {"label": "Partner-bank latency injection", "category": "Latency injection",
                  "services": ["switch"], "severity": "medium", "baseline": "Bank replies in ~1 s",
                  "failure_state": "One bank replies in 7 s (timeout is 5 s)"},
    "diwali_spike": {"label": "10x Diwali traffic spike", "category": "Load spike", "services": ["api", "switch"],
                     "severity": "high", "baseline": "~15 payments/s", "failure_state": "~150 payments/s"},
    "duplicate_storm": {"label": "Duplicate-request storm", "category": "Configuration drift",
                        "services": ["ledger"], "severity": "medium", "baseline": "Dedupe cache drops app retries",
                        "failure_state": "Buggy app retries every payment and the dedupe cache is flushed"},
    "fraud_bot_burst": {"label": "Fraud-bot burst", "category": "Abuse traffic", "services": ["fraud", "api"],
                        "severity": "high", "baseline": "Fraud check has 4x headroom",
                        "failure_state": "250 small payments/s from 3 devices"},
}
FORBIDDEN = {
    "corrupt_ledger": {"label": "Corrupt the ledger", "category": "Destructive data change",
                       "services": ["api", "fraud", "switch", "ledger", "notify"], "severity": "critical",
                       "destructive": True, "alternative": "duplicate_storm"},
}
CORRECT_FIX = {"bank_slow": ["route_to_healthy_bank"], "diwali_spike": ["queue_rate_limit"],
               "duplicate_storm": ["idempotency_check"], "fraud_bot_burst": ["throttle_bot"]}
ROOT_CAUSE = {"route_to_healthy_bank": "Slow partner bank (injected latency)",
              "queue_rate_limit": "Traffic beyond bank capacity",
              "idempotency_check": "Duplicate requests reaching the ledger",
              "throttle_bot": "Bot traffic flooding the fraud check"}
SYMPTOM_TEXT = {"high_failure_rate": "payments are failing or timing out",
                "double_debits": "the ledger is debiting the same request twice",
                "fraud_check_backlog": "the fraud-check queue is backing up"}

BASE_RATE = 15          # legit payments per second
BANK_CAPACITY = 25      # payments per second each bank can process
FRAUD_CAPACITY = 200    # payments per second the fraud engine can check
TIMEOUT = 5             # seconds before the switch gives up on a bank
GATEWAY_WAIT = 3        # with rate limiting: users wait up to 3 s, then get "busy, retry"

BANKS = [{"id": "bank_a", "name": "Bank A (Mumbai)", "lat": 19.0760, "lon": 72.8777, "state": "Maharashtra"},
         {"id": "bank_b", "name": "Bank B (Delhi)", "lat": 28.6139, "lon": 77.2090, "state": "Delhi"},
         {"id": "bank_c", "name": "Bank C (Bengaluru)", "lat": 12.9716, "lon": 77.5946, "state": "Karnataka"},
         {"id": "bank_d", "name": "Bank D (Chennai)", "lat": 13.0827, "lon": 80.2707, "state": "Tamil Nadu"},
         {"id": "bank_e", "name": "Bank E (Hyderabad)", "lat": 17.3850, "lon": 78.4867, "state": "Telangana"}]
BOT_FARM = {"lat": 21.5, "lon": 70.5, "state": "Gujarat"}
GATEWAY = {"lat": 19.30, "lon": 74.20}
CITIES = [("Mumbai", 19.08, 72.88, 1.4), ("Delhi", 28.61, 77.21, 1.4), ("Bengaluru", 12.97, 77.59, 1.3),
          ("Chennai", 13.08, 80.27, 1.0), ("Hyderabad", 17.39, 78.49, 1.0), ("Kolkata", 22.57, 88.36, 1.0),
          ("Pune", 18.52, 73.86, 0.8), ("Ahmedabad", 23.02, 72.57, 0.8), ("Jaipur", 26.91, 75.79, 0.6),
          ("Lucknow", 26.85, 80.95, 0.6)]
BOT_DEVICES = ["bot_1", "bot_2", "bot_3"]


class Chaos:
    def __init__(self):
        self.reset()

    def reset(self):
        self.slow_bank = None
        self.spike = False
        self.dup_storm = False
        self.bots = False
        self.disabled_banks = set()
        self.rate_limit = self.strict_ledger = self.bots_blocked = False
        self.attacks, self.fixes = [], []


# ---------------------------------------------------------------- A+B · the twin
class Twin:
    def __init__(self, seed):
        self.seed = seed
        self.round = self.t = 0
        self.chaos = Chaos()
        self.events = []

    def emit(self, kind, **fields):
        self.events.append({"type": kind, "t": self.t, **fields})

    def start_round(self, round_no):
        self.round, self.t = round_no, 0
        self.rng = random.Random(self.seed * 1000 + round_no + 29)
        self.chaos.reset()
        self.next_id = 1
        self.fraud_q, self.gw_q = deque(), deque()
        self.bank_q = {b["id"]: deque() for b in BANKS}
        self.in_flight = []
        self.debited = set()       # request ids already debited (the ledger)
        self.rr = 0                # round-robin pointer for routing
        self.history = deque(maxlen=5)   # per-tick stats for the sensors
        self.city_load = {c[0]: 0 for c in CITIES}

    # ----- chaos hooks -----
    def apply_attack(self, msg):
        attack, c = msg.get("attack"), self.chaos
        if attack == "bank_slow":
            c.slow_bank = (msg.get("target") or ["bank_c"])[0]
        elif attack == "diwali_spike":
            c.spike = True
        elif attack == "duplicate_storm":
            c.dup_storm = True
        elif attack == "fraud_bot_burst":
            c.bots = True
        c.attacks.append(attack)

    def apply_fix(self, msg):
        action, c = msg.get("action"), self.chaos
        if action == "route_to_healthy_bank":
            # health score = recent failures + queue + payments still waiting for a reply
            badness = {b: len(q) for b, q in self.bank_q.items()}
            for h in self.history:
                for b, n in h["bank_fail"].items():
                    badness[b] += n
            for tx in self.in_flight:
                badness[tx["bank"]] += 1
            enabled = [b for b in badness if b not in c.disabled_banks]
            if len(enabled) > 1:
                worst = max(enabled, key=lambda b: badness[b])
                c.disabled_banks.add(worst)
                self.emit("bank_removed", bank=worst)
        elif action == "queue_rate_limit":
            c.rate_limit = True
        elif action == "idempotency_check":
            c.strict_ledger = True
        elif action == "throttle_bot":
            c.bots_blocked = True
        c.fixes.append(action)

    # ----- B · services, one tick (= 1 second) -----
    def new_txn(self, city, amount, device, bot=False, req=None):
        tx = {"id": self.next_id, "req": req or self.next_id, "city": city, "amt": amount, "dev": device,
              "bot": bot, "dup": req is not None, "t0": self.t}
        self.next_id += 1
        return tx

    def step(self):
        rng, c, t = self.rng, self.chaos, self.t
        st = {"success": 0, "failed": 0, "throttled": 0, "double_debits": 0, "double_amt": 0, "stuck_amt": 0,
              "fraud_loss": 0, "bot_blocked": 0, "api_in": 0, "legit_in": 0,
              "bank_fail": {b["id"]: 0 for b in BANKS}, "dev_counts": {}}

        # 1. Payment API (intake)
        incoming = []
        if t < ARRIVALS_UNTIL:
            n = poisson(rng, BASE_RATE * (10 if c.spike else 1))
            for city in rng.choices([x[0] for x in CITIES], [x[3] for x in CITIES], k=n):
                tx = self.new_txn(city, round(rng.lognormvariate(6.0, 0.9)), f"dev_{rng.randrange(5000)}")
                incoming.append(tx)
                self.city_load[city] += 1
                if rng.random() < (0.5 if c.dup_storm else 0.01):   # app retries the same request
                    incoming.append(self.new_txn(city, tx["amt"], tx["dev"], req=tx["req"]))
            if c.bots:
                for _ in range(poisson(rng, 250)):
                    incoming.append(self.new_txn("Mumbai", rng.randrange(99, 500), rng.choice(BOT_DEVICES), bot=True))
        rng.shuffle(incoming)
        for tx in incoming:
            st["api_in"] += 1
            st["dev_counts"][tx["dev"]] = st["dev_counts"].get(tx["dev"], 0) + 1
            if not tx["bot"] and not tx["dup"]:
                st["legit_in"] += 1
            if tx["bot"] and c.bots_blocked:
                st["bot_blocked"] += 1
                continue
            if tx["dup"] and not c.dup_storm:
                continue          # normal day: gateway dedupe cache drops the retry
            self.fraud_q.append(tx)

        # 2. Fraud check
        checked = 0
        while self.fraud_q and checked < FRAUD_CAPACITY:
            tx = self.fraud_q.popleft()
            if t - tx["t0"] > TIMEOUT:
                self.fail(tx, st, None)
                continue
            checked += 1
            if tx["bot"] and rng.random() < 0.7:
                continue                      # caught and blocked
            self.gw_q.append(tx)
        while self.fraud_q and t - self.fraud_q[0]["t0"] > TIMEOUT:
            self.fail(self.fraud_q.popleft(), st, None)

        # 3. Bank switch (routing), optionally rate-limited
        enabled = [b["id"] for b in BANKS if b["id"] not in c.disabled_banks]
        if c.rate_limit:
            room = {b: max(0, self.capacity(b) - len(self.bank_q[b])) for b in enabled}
            while self.gw_q and sum(room.values()) > 0:
                tx = self.gw_q.popleft()
                b = max(room, key=room.get)
                room[b] -= 1
                self.send(tx, b)
            while self.gw_q and t - self.gw_q[0]["t0"] > GATEWAY_WAIT:
                tx = self.gw_q.popleft()
                if not tx["bot"] and not tx["dup"]:
                    st["throttled"] += 1      # user sees "high demand, retry" - no money moved
        else:
            while self.gw_q:
                b = enabled[self.rr % len(enabled)]
                self.rr += 1
                self.send(self.gw_q.popleft(), b)

        # 4. Banks process their queues
        for b, q in self.bank_q.items():
            cap = self.capacity(b)
            overloaded = len(q) > 3 * cap
            done = 0
            while q and done < cap:
                tx = q.popleft()
                if t - tx["sent"] > TIMEOUT:
                    self.fail(tx, st, b)
                    continue
                done += 1
                if overloaded and rng.random() < 0.3:
                    self.fail(tx, st, b)        # overloaded bank starts throwing errors
                    continue
                tx["done_at"] = t + (7 if c.slow_bank == b else 1)
                self.in_flight.append(tx)
            while q and t - q[0]["sent"] > TIMEOUT:
                self.fail(q.popleft(), st, b)

        # 5. Ledger + notifications: replies come back (or time out)
        still = []
        for tx in self.in_flight:
            if tx["done_at"] <= t:
                self.settle(tx, st)
            elif t - tx["sent"] >= TIMEOUT:
                self.fail(tx, st, tx["bank"])
                if rng.random() < 0.6:          # bank did debit, but the reply never arrived
                    st["stuck_amt"] += tx["amt"]
            else:
                still.append(tx)
        self.in_flight = still

        self.history.append(st)
        self.emit("tick_stats", **{k: v for k, v in st.items() if k != "dev_counts"})
        self.t += 1

    def capacity(self, bank):
        return 6 if self.chaos.slow_bank == bank else BANK_CAPACITY

    def send(self, tx, bank):
        tx["bank"], tx["sent"] = bank, self.t
        self.bank_q[bank].append(tx)

    def fail(self, tx, st, bank):
        if not tx["bot"] and not tx["dup"]:
            st["failed"] += 1
        if bank:
            st["bank_fail"][bank] += 1

    def settle(self, tx, st):
        if tx["req"] in self.debited:
            if self.chaos.strict_ledger:
                return                      # idempotency check: second debit refused
            st["double_debits"] += 1
            st["double_amt"] += tx["amt"]
            return
        self.debited.add(tx["req"])
        if tx["bot"]:
            st["fraud_loss"] += tx["amt"]
        elif not tx["dup"]:
            st["success"] += 1

    # ----- what the twin publishes -----
    def snapshot(self):
        c, h = self.chaos, list(self.history)
        tot = lambda k: sum(x[k] for x in h)
        bank_fail = {b["id"]: sum(x["bank_fail"][b["id"]] for x in h) for b in BANKS}
        dev = {}
        for x in h:
            for d, n in x["dev_counts"].items():
                dev[d] = dev.get(d, 0) + n
        api_in = max(1, tot("api_in"))
        top3 = sum(sorted(dev.values(), reverse=True)[:3]) / api_in if dev else 0
        done = tot("success") + tot("failed")
        fail_rate = tot("failed") / done if done else 0
        points, lines = [], []
        for b in BANKS:
            off = b["id"] in c.disabled_banks
            bad = bank_fail[b["id"]] >= 5
            group = "unit_reserve" if off else "site_bad" if bad else "site"
            points.append({"id": b["id"], "lat": b["lat"], "lon": b["lon"], "group": group, "size": 18,
                           "label": f"{b['name']}: queue {len(self.bank_q[b['id']])}, "
                                    f"{bank_fail[b['id']]} failures in 5 s" + (" (removed)" if off else "")})
            if not off:
                lines.append({"id": "gw-" + b["id"], "from": [GATEWAY["lat"], GATEWAY["lon"]], "to": [b["lat"], b["lon"]], "group": group})
        points.append({"id": "gateway", "lat": GATEWAY["lat"], "lon": GATEWAY["lon"], "group": "hub", "size": 20,
                       "label": f"Payment gateway: fraud queue {len(self.fraud_q)}, gateway queue {len(self.gw_q)}"})
        for name, lat, lon, _w in CITIES:
            points.append({"id": "city-" + name, "lat": lat + 0.6, "lon": lon - 0.6, "size": 8 + min(14, self.city_load[name] // 40),
                           "group": "demand_urgent" if fail_rate > 0.08 else "demand",
                           "label": f"Users in {name}: {self.city_load[name]} payments this round"})
        if c.bots and not c.bots_blocked:
            points.append({"id": "botfarm", "lat": BOT_FARM["lat"], "lon": BOT_FARM["lon"], "group": "unit_problem",
                           "size": 16, "label": "Bot farm: 3 devices, ~250 payments/s"})
        bank_lat = {}
        for b in BANKS:
            bank_lat[b["id"]] = 7000 if c.slow_bank == b["id"] else 900 + 40 * len(self.bank_q[b["id"]])
        tel = {
            "api": {"base_ms": 40, "latency_ms": 40 + (300 if len(self.gw_q) > 50 else 0),
                    "error_pct": 0, "metric": f"{round(tot('legit_in') / max(1, len(h)))} payments/s"},
            "fraud": {"base_ms": 30, "latency_ms": 30 + 5 * len(self.fraud_q) // 10, "error_pct": 0,
                      "metric": f"queue {len(self.fraud_q)}"},
            "switch": {"base_ms": 900, "latency_ms": max(bank_lat.values()), "error_pct": round(100 * fail_rate),
                       "metric": f"{100 * (1 - fail_rate):.0f}% success"},
            "ledger": {"base_ms": 20, "latency_ms": 20, "error_pct": min(100, tot("double_debits")),
                       "metric": f"{tot('double_debits')} double debits / 5 s"},
            "notify": {"base_ms": 200, "latency_ms": 200, "error_pct": 0, "metric": "SMS + push"},
        }
        return {
            "services": {
                "api": {"rate_per_s": round(tot("legit_in") / max(1, len(h)), 1), "base_rate": BASE_RATE,
                        "top3_device_share": round(top3, 2)},
                "fraud": {"queue": len(self.fraud_q)},
                "switch": {"fail_rate_5s": round(fail_rate, 3), "done_5s": done, "bank_failures_5s": bank_fail,
                           "rate_limit": c.rate_limit, "disabled": sorted(c.disabled_banks)},
                "ledger": {"double_debits_5s": tot("double_debits"), "mode": "strict" if c.strict_ledger else "normal"},
            },
            "kpis": [["Payments/s", round(tot("legit_in") / max(1, len(h)))],
                     ["Success rate", f"{100 * (1 - fail_rate):.0f}%"],
                     ["Queues (fraud/gw)", f"{len(self.fraud_q)}/{len(self.gw_q)}"]],
            "map": {"points": points, "lines": lines,
                    "labels": [{"lat": lat - 0.25, "lon": lon - 0.6, "text": name} for name, lat, lon, _ in CITIES]},
            "truth": {"attacks": list(c.attacks), "fixes": list(c.fixes)},
            "topology": build_topology(SERVICES, EDGES, EXPERIMENTS, CORRECT_FIX, c.attacks, c.fixes, tel),
            "focus": self.focus(),
            "geo": self.geo(bank_fail, fail_rate),
        }

    # ----- RYVO views -----
    def focus(self):
        c = self.chaos
        active = [a for a in c.attacks if not neutralised(a, c.fixes, CORRECT_FIX)]
        if "bank_slow" in active and c.slow_bank:
            b = next(x for x in BANKS if x["id"] == c.slow_bank)
            return {"level": "state", "region": b["state"], "label": f"{b['state']} · {b['name']} region",
                    "reason": f"{b['name']} is slow, so payments routed through it are timing out"}
        if "fraud_bot_burst" in active:
            return {"level": "state", "region": BOT_FARM["state"], "label": f"{BOT_FARM['state']} · bot traffic origin",
                    "reason": "Most of the abusive traffic comes from 3 devices in this region (simulated)"}
        return {"level": "national", "bounds": INDIA_BOUNDS, "label": "India · national payment network",
                "reason": "UPI is a national network: no single delivery-style radius applies" if not active
                else f"{EXPERIMENTS[active[0]]['label']} affects users across India"}

    def geo(self, bank_fail, fail_rate):
        """Transaction flows city -> gateway -> bank, and the region a simulated disruption affects."""
        c = self.chaos
        enabled = [b for b in BANKS if b["id"] not in c.disabled_banks]
        flows = []
        for i, (name, lat, lon, _w) in enumerate(CITIES):
            b = enabled[i % len(enabled)]
            flows.append({"from": [lat + 0.6, lon - 0.6], "via": [GATEWAY["lat"], GATEWAY["lon"]],
                          "to": [b["lat"], b["lon"]], "city": name, "bank": b["name"],
                          "failing": bank_fail[b["id"]] >= 5 or fail_rate > 0.08})
        affected = []
        if c.slow_bank:
            b = next(x for x in BANKS if x["id"] == c.slow_bank)
            affected.append({"type": "region", "name": b["state"], "label": f"Simulated disruption: {b['name']}"})
        if c.bots and not c.bots_blocked:
            affected.append({"type": "region", "name": BOT_FARM["state"], "label": "Simulated bot-traffic origin"})
        return {"flows": flows, "affected": affected, "scope": "national" if c.spike or c.dup_storm else "regional"}


# ---------------------------------------------------------------- E · Red's targeting
def pick_target(attack, state, rng):
    if attack == "bank_slow":
        return [rng.choice([b["id"] for b in BANKS])]
    return {"diwali_spike": ["all_users"], "duplicate_storm": ["payment_app_v5"],
            "fraud_bot_burst": BOT_DEVICES}[attack]


# ---------------------------------------------------------------- F · Blue's sensors and rules
def sense(state, memory):
    s, out = state["services"], {}
    sw = s["switch"]
    if sw["done_5s"] >= 20 and sw["fail_rate_5s"] > 0.08:
        fails = sw["bank_failures_5s"]
        total = sum(fails.values()) or 1
        out["high_failure_rate"] = {"fail_rate": sw["fail_rate_5s"], "rate_per_s": s["api"]["rate_per_s"],
                                    "base_rate": s["api"]["base_rate"],
                                    "top_bank_share": round(max(fails.values()) / total, 2),
                                    "_strength": min(1.0, sw["fail_rate_5s"] * 3)}
    if s["ledger"]["double_debits_5s"] >= 1 and s["ledger"]["mode"] == "normal":
        out["double_debits"] = {"count_5s": s["ledger"]["double_debits_5s"],
                                "_strength": min(1.0, s["ledger"]["double_debits_5s"] / 10)}
    if s["fraud"]["queue"] >= 100:
        out["fraud_check_backlog"] = {"queue": s["fraud"]["queue"], "top3_device_share": s["api"]["top3_device_share"],
                                      "_strength": min(1.0, s["fraud"]["queue"] / 400)}
    return out


def symptom_key(symptom, ev):
    if symptom == "high_failure_rate":
        if ev["rate_per_s"] >= 3 * ev["base_rate"]:
            return "high_failure_rate+traffic_spike"
        if ev["top_bank_share"] >= 0.6:
            return "high_failure_rate+one_bank"
    if symptom == "fraud_check_backlog" and ev.get("top3_device_share", 0) >= 0.5:
        return "fraud_check_backlog+few_devices"
    return symptom


RULES = {
    "high_failure_rate": ["route_to_healthy_bank", "queue_rate_limit"],
    "double_debits": ["idempotency_check"],
    "fraud_check_backlog": ["queue_rate_limit", "throttle_bot"],
}
SIGNATURE_HINT = {"high_failure_rate+traffic_spike": "queue_rate_limit",
                  "high_failure_rate+one_bank": "route_to_healthy_bank",
                  "fraud_check_backlog+few_devices": "throttle_bot"}
EFFECT_SYMPTOMS = {"high_failure_rate"}
VERIFY_TICKS = 11  # payments already in flight keep failing for ~7 s after a fix


# ---------------------------------------------------------------- G · Referee scoring
BASELINE_FAILED_PCT = 0.5

def score(events, end_t):
    stats = [e for e in events if e["type"] == "tick_stats"]
    tot = lambda k: sum(e[k] for e in stats)
    done = tot("success") + tot("failed")
    return {
        "failed_pct": round(100 * tot("failed") / max(1, done), 1),
        "double_debits": tot("double_debits"),
        "stuck_money_inr": tot("stuck_amt") + tot("double_amt"),
        "fraud_loss_inr": tot("fraud_loss"),
        "throttled": tot("throttled"),
        "payments": tot("legit_in"),
    }


def red_reward(m):
    return round(clip01((m["failed_pct"] - BASELINE_FAILED_PCT) / 25 + m["double_debits"] / 400
                        + m["stuck_money_inr"] / 400000 + m["fraud_loss_inr"] / 400000), 2)
