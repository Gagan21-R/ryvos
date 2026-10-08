"""🚑 Emergency response (108-style) for a mini Bengaluru.

Twin: 10 zones, 10 hospitals, 20 ambulances (+4 reserve), emergency calls.
Services: call intake, GPS tracker, dispatcher, bed tracker, notifier (SMS).
1 tick = 1 simulated minute.
"""
import random

from domains.common import BENGALURU_ZONES, Mover, bounds_of, build_topology, clip01, km, neutralised, poisson
from shared import names

ID = "emergency"
TITLE = "Emergency response (108)"
ICON = "🚑"
STAKE = "Lives"
TICK_UNIT = "min"
SIM_SEC_PER_TICK = 60
ROUND_TICKS = 45
ATTACK_AT = 5
ARRIVALS_UNTIL = 37
ATTACKS = names.DOMAINS[ID]["attacks"]
FIXES = names.DOMAINS[ID]["fixes"]

ATTACK_INFO = {
    "freeze_gps": "GPS dead zone: ambulance GPS freezes, finished ambulances look busy forever",
    "stale_beds": "Bed feed freezes: dispatcher sends patients to full hospitals",
    "kill_sms": "SMS gateway down: drivers wait for a radio call-back to get the address",
    "call_surge": "Mass incident: call flood, mostly duplicate callers",
    "slow_dispatch": "Dispatcher software degraded: 1 call handled every 4 minutes",
}
FIX_INFO = {
    "distrust_gps": "Switch stuck GPS units to dead-reckoning + driver app status",
    "skip_stale_hospitals": "Phone hospitals to confirm beds instead of trusting the stale feed",
    "backup_sms": "Send addresses through the backup channel (voice/app push)",
    "surge_mode": "Merge duplicate calls, critical first, activate 4 reserve ambulances",
    "restart_dispatch": "Fail over to a fresh dispatcher instance",
}
SCENARIOS = {
    "Monsoon night": ["freeze_gps", "kill_sms"],
    "Stadium stampede": ["call_surge", "stale_beds"],
    "Server meltdown": ["slow_dispatch", "kill_sms"],
}
METRICS = [
    {"key": "avg_arrival_min", "label": "Avg ambulance arrival", "unit": "min"},
    {"key": "misrouted", "label": "Patients sent to full hospitals", "unit": ""},
    {"key": "critical_over_15", "label": "Critical patients waiting >15 min", "unit": ""},
]
MAP_LEGEND = {"unit_free": "Ambulance (free)", "unit_busy": "Ambulance (on a job)",
              "unit_problem": "Ambulance (GPS frozen)", "unit_reserve": "Reserve ambulance",
              "site": "Hospital (beds free)", "site_bad": "Hospital (full)",
              "demand": "Call waiting", "demand_urgent": "Critical call waiting"}

# ---------------------------------------------------------------- RYVO layer
# Service topology, experiment catalogue and safety metadata (used by ROGUE, AEGIS, ORACLE and the map).
GEOGRAPHY = {"country": "India", "state": "Karnataka", "district": "Bengaluru Urban", "city": "Bengaluru",
             "home_level": "district", "home_region": "Bengaluru Urban"}
SERVICES = [
    {"id": "intake", "name": "Call intake", "criticality": "high"},
    {"id": "gps", "name": "GPS tracker", "criticality": "medium"},
    {"id": "dispatch", "name": "Dispatcher", "criticality": "critical"},
    {"id": "beds", "name": "Bed tracker", "criticality": "medium"},
    {"id": "sms", "name": "Notifier (SMS)", "criticality": "high"},
]
EDGES = [["intake", "dispatch"], ["gps", "dispatch"], ["beds", "dispatch"], ["dispatch", "sms"]]
EXPERIMENTS = {
    "freeze_gps": {"label": "GPS dead zone", "category": "Telemetry loss", "services": ["gps"], "severity": "medium",
                   "baseline": "Every ambulance reports its position each minute",
                   "failure_state": "10 ambulances report a frozen position; finished crews look busy forever"},
    "stale_beds": {"label": "Stale bed data", "category": "Data freshness", "services": ["beds"], "severity": "low",
                   "baseline": "Bed counts refresh every minute",
                   "failure_state": "The bed feed freezes, so patients get routed to full hospitals"},
    "kill_sms": {"label": "SMS gateway outage", "category": "Dependency outage", "services": ["sms"],
                 "severity": "medium", "baseline": "Drivers get the address by SMS instantly",
                 "failure_state": "Drivers wait ~6 min for a radio call-back"},
    "call_surge": {"label": "Mass-casualty call surge", "category": "Load spike", "services": ["intake", "dispatch"],
                   "severity": "high", "baseline": "~0.6 calls per minute",
                   "failure_state": "Call flood, mostly duplicate callers, in one zone"},
    "slow_dispatch": {"label": "Dispatcher latency injection", "category": "Latency injection",
                      "services": ["dispatch"], "severity": "medium", "baseline": "Every call dispatched at once",
                      "failure_state": "Dispatcher handles 1 call every 4 minutes"},
}
FORBIDDEN = {   # ROGUE may ask, ORACLE always refuses these in the sandbox
    "crash_dispatch_database": {"label": "Crash the dispatch database", "category": "Destructive outage",
                                "services": ["intake", "gps", "dispatch", "beds", "sms"], "severity": "critical",
                                "destructive": True, "alternative": "slow_dispatch"},
}
CORRECT_FIX = {"freeze_gps": ["distrust_gps"], "stale_beds": ["skip_stale_hospitals"], "kill_sms": ["backup_sms"],
               "call_surge": ["surge_mode"], "slow_dispatch": ["restart_dispatch"]}
ROOT_CAUSE = {"distrust_gps": "Frozen GPS telemetry", "skip_stale_hospitals": "Stale bed-availability feed",
              "backup_sms": "SMS gateway outage", "surge_mode": "Call surge with duplicate callers",
              "restart_dispatch": "Degraded dispatcher (injected latency)"}
SYMPTOM_TEXT = {"gps_stuck": "ambulances are moving but their GPS position is not changing",
                "bed_feed_stale": "the bed-availability feed stopped updating",
                "sms_failing": "SMS deliveries to drivers are failing",
                "dispatch_backlog": "calls are piling up in the dispatch queue"}

SPEED_KM_PER_TICK = 0.35    # ~21 km/h in Bengaluru traffic
CALL_HANDLING_MIN = 1       # call-taker needs ~1 min to take the address
CHUTE_MIN = 2               # crew needs ~2 min to get rolling after the alert
SMS_FALLBACK_DELAY = 6      # without SMS the driver waits ~6 min for a radio call-back
SLOW_DISPATCH_EVERY = 4     # degraded dispatcher handles only 1 call every 4 minutes
BASE_CALL_RATE = 0.6        # emergency calls per minute in normal times
CRITICAL_SHARE = 0.35
BED_DISCHARGE_P = 0.005     # chance per minute that an occupied bed frees up
START_OCCUPANCY = 0.75

# ---------------------------------------------------------------- A · city data
ZONES = BENGALURU_ZONES
_BEDS = [6, 4, 8, 5, 7, 5, 8, 6, 4, 5]
HOSPITALS = [{"id": f"hosp_{i + 1}", "name": f"{z['name']} General", "zone": z["id"],
              "lat": round(z["lat"] + 0.006, 4), "lon": round(z["lon"] + 0.004, 4), "beds": _BEDS[i]}
             for i, z in enumerate(ZONES)]
AMBULANCES = []
for _i, _z in enumerate(ZONES):
    for _j, (_dlat, _dlon) in enumerate([(-0.008, -0.006), (0.007, 0.008)]):
        AMBULANCES.append({"id": f"amb_{2 * _i + _j + 1}", "reserve": False,
                           "lat": round(_z["lat"] + _dlat, 4), "lon": round(_z["lon"] + _dlon, 4)})
for _k, (_lat, _lon) in enumerate([(12.9767, 77.5713), (12.9767, 77.5713), (12.9177, 77.6238), (12.9177, 77.6238)]):
    AMBULANCES.append({"id": f"amb_{21 + _k}", "reserve": True, "lat": _lat, "lon": _lon})


# ---------------------------------------------------------------- C · chaos hooks
class Chaos:
    """Red's attacks and Blue's fixes only ever touch these flags. reset() undoes everything."""

    def __init__(self):
        self.reset()

    def reset(self):
        self.frozen = {}            # amb_id -> (lat, lon) the GPS is stuck at
        self.beds_stale = False
        self.sms_down = False
        self.surge_zone = None
        self.slow_dispatch = False
        self.distrust_gps = False
        self.skip_stale_hospitals = False
        self.backup_sms = False
        self.surge_mode = False
        self.attacks, self.fixes = [], []


class Ambulance(Mover):
    def __init__(self, d):
        self.id, self.home, self.is_reserve = d["id"], (d["lat"], d["lon"]), d["reserve"]
        self.reset()

    def reset(self):
        self.lat, self.lon = self.home
        self.status = "reserve" if self.is_reserve else "idle"
        self.call = self.hospital = None
        self.wait = 0

    @property
    def free(self):
        return self.status in ("idle", "returning")


# ---------------------------------------------------------------- A+B · the twin
class Twin:
    def __init__(self, seed):
        self.seed = seed
        self.round = self.t = 0
        self.chaos = Chaos()
        self.zones = {z["id"]: z for z in ZONES}
        self.ambulances = {a["id"]: Ambulance(a) for a in AMBULANCES}
        self.hospitals = {h["id"]: dict(h) for h in HOSPITALS}
        self.events = []

    def emit(self, kind, **fields):
        self.events.append({"type": kind, "t": self.t, **fields})

    def start_round(self, round_no):
        self.round, self.t = round_no, 0
        self.rng = random.Random(self.seed * 1000 + round_no)
        self.chaos.reset()
        for amb in self.ambulances.values():
            amb.reset()
        for h in self.hospitals.values():
            h["occupied"] = sum(self.rng.random() < START_OCCUPANCY for _ in range(h["beds"]))
            h["reported_free"] = h["beds"] - h["occupied"]
        self.calls, self.pending, self.next_call = {}, [], 1
        self.call_log, self.sms_log, self.dispatch_log = [], [], []
        self.bed_feed_age = 0

    # ----- chaos hooks: Red and Blue land here -----
    def apply_attack(self, msg):
        attack, c = msg.get("attack"), self.chaos
        if attack == "freeze_gps":
            for amb_id in msg.get("target", []):
                if amb_id in self.ambulances:
                    a = self.ambulances[amb_id]
                    c.frozen[amb_id] = (a.lat, a.lon)
        elif attack == "stale_beds":
            c.beds_stale = True
        elif attack == "kill_sms":
            c.sms_down = True
        elif attack == "call_surge":
            c.surge_zone = (msg.get("target") or ["koramangala"])[0]
        elif attack == "slow_dispatch":
            c.slow_dispatch = True
        c.attacks.append(attack)

    def apply_fix(self, msg):
        action, c = msg.get("action"), self.chaos
        if action == "distrust_gps":
            c.distrust_gps = True
            for a in self.ambulances.values():   # dead-reckoning shows the ghosts are actually done
                if a.status == "ghost":
                    a.status = "returning"
        elif action == "skip_stale_hospitals":
            c.skip_stale_hospitals = True
        elif action == "backup_sms":
            c.backup_sms = True
            for a in self.ambulances.values():   # drivers still waiting get the address now
                if a.status == "assigned" and a.wait > CHUTE_MIN:
                    a.wait = CHUTE_MIN
        elif action == "surge_mode":
            c.surge_mode = True
            for a in self.ambulances.values():
                if a.status == "reserve":
                    a.status = "idle"
        elif action == "restart_dispatch":
            c.slow_dispatch = False
        c.fixes.append(action)

    # ----- B · the 5 services, one tick -----
    def step(self):
        self.call_intake()
        self.bed_tracker()
        self.dispatcher()
        self.move_ambulances()
        self.t += 1

    def new_call(self, zone_id, priority, duplicate_of=None, near=None):
        z = self.zones[zone_id]
        if near:      # duplicate caller reporting the same incident
            lat, lon = near[0] + self.rng.gauss(0, 0.002), near[1] + self.rng.gauss(0, 0.002)
        else:
            lat, lon = z["lat"] + self.rng.gauss(0, 0.012), z["lon"] + self.rng.gauss(0, 0.012)
        call = {"id": f"c{self.round}_{self.next_call}", "zone": zone_id, "lat": lat, "lon": lon,
                "priority": priority, "created": self.t, "status": "waiting",
                "duplicate_of": duplicate_of, "misrouted": False}
        self.next_call += 1
        self.calls[call["id"]] = call
        self.pending.append(call)
        self.call_log.append(self.t)
        self.emit("call_created", call_id=call["id"], zone=zone_id, priority=priority,
                  duplicate=duplicate_of is not None)

    def call_intake(self):
        if self.t >= ARRIVALS_UNTIL:
            return
        rng = self.rng
        for _ in range(poisson(rng, BASE_CALL_RATE)):
            zone = rng.choices(list(self.zones), [z["weight"] for z in ZONES])[0]
            self.new_call(zone, "critical" if rng.random() < CRITICAL_SHARE else "normal")
        sz = self.chaos.surge_zone
        if sz:   # mass incident: some real extra patients, many duplicate callers
            for _ in range(poisson(rng, 0.15)):
                self.new_call(sz, "critical" if rng.random() < 0.5 else "normal")
            recent = [c for c in self.calls.values() if not c["duplicate_of"] and self.t - c["created"] <= 8]
            in_zone = [c for c in recent if c["zone"] == sz] or recent
            for _ in range(poisson(rng, 2.2)):
                if in_zone:
                    orig = rng.choice(in_zone)
                    self.new_call(orig["zone"], orig["priority"], duplicate_of=orig["id"],
                                  near=(orig["lat"], orig["lon"]))

    def bed_tracker(self):
        for h in self.hospitals.values():
            h["occupied"] -= sum(self.rng.random() < BED_DISCHARGE_P for _ in range(h["occupied"]))
        if self.chaos.beds_stale:
            self.bed_feed_age += 1          # feed frozen: reported_free stops changing
        else:
            self.bed_feed_age = 0
            for h in self.hospitals.values():
                h["reported_free"] = h["beds"] - h["occupied"]

    def believed_position(self, amb):
        if amb.id in self.chaos.frozen and not self.chaos.distrust_gps:
            return self.chaos.frozen[amb.id]
        return amb.lat, amb.lon

    def free_beds(self, h):
        return h["beds"] - h["occupied"]

    def believed_free_beds(self, h):
        if self.chaos.beds_stale and not self.chaos.skip_stale_hospitals:
            return h["reported_free"]
        return self.free_beds(h)

    def dispatcher(self):
        c = self.chaos
        capacity = (1 if self.t % SLOW_DISPATCH_EVERY == 0 else 0) if c.slow_dispatch else 99
        order = list(self.pending)
        if c.surge_mode:   # critical patients first
            order.sort(key=lambda x: (x["priority"] != "critical", x["created"]))
        for call in order:
            if c.surge_mode and call["duplicate_of"]:
                self.pending.remove(call)            # merge duplicate callers
                call["status"] = "merged"
                self.emit("call_merged", call_id=call["id"])
                continue
            if capacity <= 0:
                break
            if self.t - call["created"] < CALL_HANDLING_MIN:
                continue
            free = [a for a in self.ambulances.values() if a.free]
            if not free:
                break
            amb = min(free, key=lambda a: km(*self.believed_position(a), call["lat"], call["lon"]))
            capacity -= 1
            self.pending.remove(call)
            call["status"] = "dispatched"
            amb.status, amb.call, amb.hospital = "assigned", call["id"], None
            self.dispatch_log.append(self.t)
            ok = not c.sms_down or c.backup_sms     # Notifier: SMS the address to the driver
            amb.wait = CHUTE_MIN if ok else CHUTE_MIN + SMS_FALLBACK_DELAY
            self.sms_log.append((self.t, ok))
            self.emit("dispatched", call_id=call["id"], amb=amb.id, sms_ok=ok)

    def pick_hospital(self, lat, lon, exclude=None, trust_feed=True):
        options = [h for h in self.hospitals.values() if h["id"] != exclude and
                   (self.believed_free_beds(h) if trust_feed else self.free_beds(h)) > 0]
        options = options or [h for h in self.hospitals.values() if h["id"] != exclude]
        return min(options, key=lambda h: km(lat, lon, h["lat"], h["lon"]))["id"]

    def move_ambulances(self):
        for amb in self.ambulances.values():
            if amb.status == "assigned":
                if amb.wait > 0:
                    amb.wait -= 1
                    continue
                amb.status = "to_patient"
            if amb.status == "to_patient":
                call = self.calls[amb.call]
                if amb.move_towards(call["lat"], call["lon"], SPEED_KM_PER_TICK):
                    self.emit("arrived", call_id=call["id"], amb=amb.id, response_min=self.t + 1 - call["created"],
                              priority=call["priority"], duplicate=call["duplicate_of"] is not None)
                    if call["duplicate_of"]:          # wasted trip: patient already handled
                        call["status"] = "duplicate_cleared"
                        amb.status, amb.call = "returning", None
                    else:
                        call["status"] = "transporting"
                        amb.hospital = self.pick_hospital(amb.lat, amb.lon)
                        amb.status = "to_hospital"
            elif amb.status == "to_hospital":
                h = self.hospitals[amb.hospital]
                if amb.move_towards(h["lat"], h["lon"], SPEED_KM_PER_TICK):
                    call = self.calls[amb.call]
                    if self.free_beds(h) > 0:
                        h["occupied"] += 1
                        call["status"] = "admitted"
                        self.emit("admitted", call_id=call["id"], hospital=h["id"])
                        amb.call = amb.hospital = None
                        # The system marks an ambulance free when GPS shows it leaving the hospital.
                        # With frozen GPS that never happens: it becomes a "ghost" that looks busy forever.
                        frozen = amb.id in self.chaos.frozen and not self.chaos.distrust_gps
                        amb.status = "ghost" if frozen else "returning"
                    else:
                        if not call["misrouted"]:
                            call["misrouted"] = True
                            self.emit("misrouted", call_id=call["id"], hospital=h["name"], priority=call["priority"])
                        amb.hospital = self.pick_hospital(amb.lat, amb.lon, exclude=h["id"], trust_feed=False)
            elif amb.status in ("returning", "ghost"):
                if amb.move_towards(*amb.home, SPEED_KM_PER_TICK) and amb.status == "returning":
                    amb.status = "idle"

    # ----- RYVO views -----
    def topology(self):
        c, t = self.chaos, self.t
        recent = [ok for (x, ok) in self.sms_log if t - x <= 5]
        failed = recent.count(False)
        frozen_live = 0 if c.distrust_gps else len(c.frozen)
        q, calls5 = len(self.pending), sum(1 for x in self.call_log if t - x <= 5)
        tel = {   # prototype telemetry, derived from the twin's state
            "intake": {"base_ms": 60, "latency_ms": 60 + 25 * max(0, calls5 - 4), "error_pct": 0,
                       "metric": f"{calls5} calls / 5 min"},
            "gps": {"base_ms": 90, "latency_ms": 90, "error_pct": round(100 * frozen_live / 20),
                    "metric": f"{frozen_live} frozen units"},
            "dispatch": {"base_ms": 120, "latency_ms": (480 if c.slow_dispatch else 120) + 40 * q, "error_pct": 0,
                         "metric": f"queue {q}"},
            "beds": {"base_ms": 70, "latency_ms": 70,
                     "error_pct": 100 if (c.beds_stale and not c.skip_stale_hospitals) else 0,
                     "metric": f"feed age {self.bed_feed_age} min"},
            "sms": {"base_ms": 300, "latency_ms": 300, "error_pct": round(100 * failed / max(1, len(recent))),
                    "metric": f"{failed}/{len(recent)} failed"},
        }
        return build_topology(SERVICES, EDGES, EXPERIMENTS, CORRECT_FIX, c.attacks, c.fixes, tel)

    def featured_incident(self):
        """The critical call the map follows: caller, nearest free ambulance, assigned crew, hospital."""
        calls = [cl for cl in self.calls.values() if cl["status"] in ("waiting", "dispatched", "transporting")
                 and not cl["duplicate_of"]]
        if not calls:
            return None
        rank = {"waiting": 0, "dispatched": 1, "transporting": 2}     # follow the call that is still waiting first
        calls.sort(key=lambda cl: (cl["priority"] != "critical", rank[cl["status"]], cl["created"]))
        cl = calls[0]
        crew = next((a for a in self.ambulances.values() if a.call == cl["id"]), None)
        free = [a for a in self.ambulances.values() if a.free]
        nearest = min(free, key=lambda a: km(a.lat, a.lon, cl["lat"], cl["lon"])) if free else None
        h = self.hospitals[crew.hospital if crew and crew.hospital else self.pick_hospital(cl["lat"], cl["lon"])]
        start = crew or nearest
        route = ([[round(start.lat, 5), round(start.lon, 5)]] if start else []) + \
            [[round(cl["lat"], 5), round(cl["lon"], 5)], [h["lat"], h["lon"]]]
        eta = round(km(start.lat, start.lon, cl["lat"], cl["lon"]) / SPEED_KM_PER_TICK) if start else None
        return {
            "kind": "emergency_call", "zone": self.zones[cl["zone"]]["name"], "priority": cl["priority"],
            "waiting_min": self.t - cl["created"], "status": cl["status"], "eta_min": eta,
            "caller": {"lat": round(cl["lat"], 5), "lon": round(cl["lon"], 5),
                       "label": f"Caller {cl['id']} ({cl['priority']})"},
            "ambulance": ({"lat": round(crew.lat, 5), "lon": round(crew.lon, 5), "label": f"Assigned {crew.id}"}
                          if crew else None),
            "nearest": ({"lat": round(nearest.lat, 5), "lon": round(nearest.lon, 5),
                         "label": f"Nearest free ambulance: {nearest.id}",
                         "km": round(km(nearest.lat, nearest.lon, cl["lat"], cl["lon"]), 1)} if nearest else None),
            "hospital": {"lat": h["lat"], "lon": h["lon"], "label": h["name"], "free_beds": self.free_beds(h)},
            "route": route,
        }

    def focus(self, incident):
        c = self.chaos
        active = [a for a in c.attacks if not neutralised(a, c.fixes, CORRECT_FIX)]
        if active and c.surge_zone:
            z = self.zones[c.surge_zone]
            return {"level": "local", "bounds": bounds_of([(z["lat"], z["lon"])], 0.07),
                    "label": f"{z['name']} · local incident area",
                    "reason": f"The call surge is concentrated around {z['name']}"}
        if active and incident:
            pts = [(p["lat"], p["lon"]) for p in (incident["caller"], incident["ambulance"] or incident["nearest"],
                                                  incident["hospital"]) if p]
            return {"level": "local", "bounds": bounds_of(pts, 0.04), "label": f"{incident['zone']} · local incident",
                    "reason": f"{EXPERIMENTS[active[0]]['label']} is delaying a {incident['priority']} call "
                              f"in {incident['zone']}"}
        return {"level": "district", "region": "Bengaluru Urban", "label": "Bengaluru Urban district",
                "reason": "No active failure: showing the whole 108 response area"}

    # ----- what the twin publishes on city.state -----
    def snapshot(self):
        t, c = self.t, self.chaos
        sms_recent = [ok for (x, ok) in self.sms_log if t - x <= 5]
        ambs = []
        for a in self.ambulances.values():
            gps = c.frozen.get(a.id, (a.lat, a.lon))
            ambs.append({"id": a.id, "gps_lat": round(gps[0], 5), "gps_lon": round(gps[1], 5),
                         "status": "to_hospital" if a.status == "ghost" else a.status,  # what the system believes
                         "gps_mode": "dead_reckoning" if (a.id in c.frozen and c.distrust_gps) else "live"})
        open_calls = [cl for cl in self.calls.values() if cl["status"] in ("waiting", "dispatched")]
        points = []
        for a in self.ambulances.values():
            group = ("unit_reserve" if a.status == "reserve" else
                     "unit_problem" if a.id in c.frozen and not c.distrust_gps else
                     "unit_free" if a.free else "unit_busy")
            label = a.status + (" (ghost: looks busy)" if a.status == "ghost" else "")
            points.append({"id": a.id, "lat": a.lat, "lon": a.lon, "group": group, "label": f"{a.id}: {label}", "size": 10})
        for h in self.hospitals.values():
            free = self.free_beds(h)
            points.append({"id": h["id"], "lat": h["lat"], "lon": h["lon"], "group": "site" if free > 0 else "site_bad",
                           "label": f"{h['name']}: {free}/{h['beds']} beds free (feed says {h['reported_free']})",
                           "size": 16})
        for cl in open_calls:
            if cl["status"] == "waiting":
                points.append({"id": cl["id"], "lat": cl["lat"], "lon": cl["lon"],
                               "group": "demand_urgent" if cl["priority"] == "critical" else "demand",
                               "label": f"{cl['id']} {cl['priority']} waiting {t - cl['created']} min"
                                        + (" (duplicate)" if cl["duplicate_of"] else ""), "size": 9})
        busy = sum(1 for a in self.ambulances.values() if not a.free and a.status != "reserve")
        incident = self.featured_incident()
        return {
            "ambulances": ambs,
            "services": {
                "intake": {"calls_last_5": sum(1 for x in self.call_log if t - x <= 5)},
                "dispatch": {"queue": len(self.pending),
                             "free_ambulances": sum(1 for a in self.ambulances.values() if a.free)},
                "beds": {"feed_age": self.bed_feed_age,
                         "mode": "direct_confirm" if c.skip_stale_hospitals else "feed"},
                "sms": {"sent_last_5": len(sms_recent), "failed_last_5": sms_recent.count(False),
                        "channel": "backup" if c.backup_sms else "primary"},
            },
            "kpis": [["Calls waiting", len(self.pending)], ["Ambulances busy", busy],
                     ["Free ICU beds", sum(self.free_beds(h) for h in self.hospitals.values())]],
            "map": {"points": points, "lines": [], "labels": [{"lat": z["lat"] - 0.017, "lon": z["lon"], "text": z["name"]} for z in BENGALURU_ZONES]},
            "truth": {"attacks": list(c.attacks), "fixes": list(c.fixes)},
            "topology": self.topology(),
            "focus": self.focus(incident),
            "geo": {"incident": incident,
                    "affected": ([{"type": "circle", "lat": self.zones[c.surge_zone]["lat"],
                                   "lon": self.zones[c.surge_zone]["lon"], "radius_km": 2.5,
                                   "label": f"Call surge · {self.zones[c.surge_zone]['name']} (simulated)"}]
                                 if c.surge_zone else []),
                    "ghosts": [{"lat": round(p[0], 5), "lon": round(p[1], 5), "id": aid}
                               for aid, p in c.frozen.items() if not c.distrust_gps]},
        }


# ---------------------------------------------------------------- E · Red's targeting
def pick_target(attack, state, rng):
    if attack == "freeze_gps":
        ids = [a["id"] for a in state["ambulances"] if a["status"] != "reserve"]
        return sorted(rng.sample(ids, 10), key=lambda x: int(x.split("_")[1]))
    if attack == "call_surge":
        return [rng.choices([z["id"] for z in ZONES], [z["weight"] for z in ZONES])[0]]
    return {"stale_beds": ["bed_feed"], "kill_sms": ["sms_gateway"], "slow_dispatch": ["dispatcher"]}[attack]


# ---------------------------------------------------------------- F · Blue's sensors and rules
def sense(state, memory):
    """Monitor sensors. Looks ONLY at what a real control room could see (not state['truth'])."""
    s, out = state["services"], {}
    stuck = []
    for a in state["ambulances"]:
        pos = (a["gps_lat"], a["gps_lon"])
        moving = a["status"] in ("to_patient", "to_hospital", "returning")
        prev_pos, count = memory.get(a["id"], (None, 0))
        count = count + 1 if (moving and pos == prev_pos) else 0
        memory[a["id"]] = (pos, count)
        if count >= 2 and a["gps_mode"] == "live":
            stuck.append(a["id"])
    if stuck:
        out["gps_stuck"] = {"ambulances": stuck, "_strength": min(1.0, 0.4 + 0.2 * len(stuck))}
    if s["beds"]["feed_age"] >= 3 and s["beds"]["mode"] == "feed":
        out["bed_feed_stale"] = {"feed_age_min": s["beds"]["feed_age"],
                                 "_strength": min(1.0, s["beds"]["feed_age"] / 6)}
    sms = s["sms"]
    if sms["channel"] == "primary" and sms["failed_last_5"] >= 1 and sms["failed_last_5"] >= 0.3 * sms["sent_last_5"]:
        out["sms_failing"] = {"failed": sms["failed_last_5"], "sent": sms["sent_last_5"],
                              "_strength": sms["failed_last_5"] / max(1, sms["sent_last_5"])}
    if s["dispatch"]["queue"] >= 4:
        out["dispatch_backlog"] = {"queue": s["dispatch"]["queue"], "calls_last_5": s["intake"]["calls_last_5"],
                                   "free_ambulances": s["dispatch"]["free_ambulances"],
                                   "_strength": min(1.0, s["dispatch"]["queue"] / 10)}
    return out


def symptom_key(symptom, evidence):
    if symptom == "dispatch_backlog" and evidence.get("calls_last_5", 0) >= 9:
        return "dispatch_backlog+high_call_rate"
    return symptom


# The Diagnoser's rule book: symptom -> fixes to try, most likely first.
RULES = {
    "gps_stuck": ["distrust_gps"],
    "bed_feed_stale": ["skip_stale_hospitals"],
    "sms_failing": ["backup_sms"],
    "dispatch_backlog": ["restart_dispatch", "surge_mode"],
}
SIGNATURE_HINT = {"dispatch_backlog+high_call_rate": "surge_mode"}   # what a specific signature points to
EFFECT_SYMPTOMS = {"dispatch_backlog"}   # often a side-effect: wait if another root symptom is open
VERIFY_TICKS = 7   # a call queue needs a few minutes to drain after a fix


# ---------------------------------------------------------------- G · Referee scoring
BASELINE = 9.4   # avg arrival (min) with no attack, measured by running the twin

def score(events, end_t):
    created = {e["call_id"]: e for e in events if e["type"] == "call_created" and not e["duplicate"]}
    arrived = {e["call_id"]: e["response_min"] for e in events if e["type"] == "arrived"}
    resp = {cid: arrived.get(cid, end_t - e["t"]) for cid, e in created.items()}   # unserved = still waiting
    return {
        "avg_arrival_min": round(sum(resp.values()) / max(1, len(resp)), 1),
        "misrouted": sum(1 for e in events if e["type"] == "misrouted"),
        "critical_over_15": sum(1 for cid, e in created.items() if e["priority"] == "critical" and resp[cid] > 15),
        "patients": len(created),
    }


def red_reward(m):
    return round(clip01((m["avg_arrival_min"] - BASELINE) / 10 + 0.04 * max(0, m["misrouted"] - 1.6)
                        + 0.03 * max(0, m["critical_over_15"] - 0.9)), 2)
