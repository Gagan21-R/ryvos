"""🛵 Food delivery for Bengaluru.

Twin: 15 restaurants, 30 riders (+10 standby), customer orders.
Services: order intake, rider GPS, assignment, restaurant tablets, maps/ETA.
1 tick = 1 simulated minute.
"""
import math
import random

from domains.common import (BENGALURU_ZONES, Mover, bounds_of, build_topology, clip01, km, neutralised,
                            point_in_polygon, poisson)
from shared import names

ID = "food"
TITLE = "Food delivery"
ICON = "🛵"
STAKE = "Orders and revenue"
TICK_UNIT = "min"
SIM_SEC_PER_TICK = 60
ROUND_TICKS = 70
ATTACK_AT = 6
ARRIVALS_UNTIL = 40
ATTACKS = names.DOMAINS[ID]["attacks"]
FIXES = names.DOMAINS[ID]["fixes"]

ATTACK_INFO = {
    "heavy_rain": "Heavy rain: 40% of riders log off, the rest ride 40% slower, orders jump",
    "tablet_offline": "Restaurant tablets offline: 5 kitchens never see new orders",
    "maps_slow": "Maps/ETA API slow (4 s per call): only 1 rider assigned every 3 min",
    "festival_surge": "Festival order surge: 2.5x normal orders",
    "coverage_drift": "Config drift: one zone's free-delivery polygon shrinks, customers inside wrongly see a fee",
}
FIX_INFO = {
    "reassign_riders": "Pull in 10 standby riders with a rain/peak incentive",
    "batch_orders": "Batch up to 3 orders from the same restaurant per rider",
    "phone_restaurants": "Confirm orders by automated phone call (IVR) instead of the tablet",
    "cached_routes": "Use cached routes/ETAs instead of calling the slow maps API",
    "extend_eta_notify": "Extend promised ETA to 45 min and notify customers (fewer cancellations)",
    "restore_zone_config": "Roll the free-delivery zone back to its last verified polygon",
}
SCENARIOS = {
    "Monsoon Friday": ["heavy_rain", "maps_slow"],
    "Diwali dinner rush": ["festival_surge", "tablet_offline"],
    "Zone config drift": ["coverage_drift"],
}
METRICS = [
    {"key": "late_pct", "label": "Late orders", "unit": "%"},
    {"key": "cancelled", "label": "Cancelled orders", "unit": ""},
    {"key": "avg_delivery_min", "label": "Avg delivery time", "unit": "min"},
]
MAP_LEGEND = {"unit_free": "Rider (free)", "unit_busy": "Rider (on an order)",
              "unit_problem": "Rider (logged off)", "unit_reserve": "Standby rider",
              "site": "Restaurant (tablet online)", "site_bad": "Restaurant (tablet offline)",
              "demand": "Order waiting for a rider", "demand_urgent": "Order already late"}

# ---------------------------------------------------------------- RYVO layer
GEOGRAPHY = {"country": "India", "state": "Karnataka", "district": "Bengaluru Urban", "city": "Bengaluru",
             "home_level": "city", "home_region": None}
SERVICES = [
    {"id": "zones", "name": "Delivery zones", "criticality": "medium"},
    {"id": "intake", "name": "Order intake", "criticality": "high"},
    {"id": "tablets", "name": "Restaurant tablets", "criticality": "medium"},
    {"id": "maps", "name": "Maps / ETA", "criticality": "medium"},
    {"id": "gps", "name": "Rider GPS", "criticality": "high"},
    {"id": "assign", "name": "Assignment", "criticality": "critical"},
]
EDGES = [["zones", "intake"], ["intake", "tablets"], ["intake", "assign"], ["maps", "assign"], ["gps", "assign"]]
EXPERIMENTS = {
    "heavy_rain": {"label": "Heavy rain + rider shortage", "category": "Capacity loss", "services": ["gps", "assign"],
                   "severity": "high", "baseline": "30 riders online, 24 km/h",
                   "failure_state": "40% of riders log off, the rest ride 40% slower"},
    "tablet_offline": {"label": "Restaurant tablets offline", "category": "Dependency outage",
                       "services": ["tablets"], "severity": "medium", "baseline": "Kitchens see orders instantly",
                       "failure_state": "5 kitchens never see new orders"},
    "maps_slow": {"label": "Maps API latency injection", "category": "Latency injection", "services": ["maps"],
                  "severity": "medium", "baseline": "ETA call ~180 ms",
                  "failure_state": "ETA call ~4.2 s; 1 rider assigned every 3 min"},
    "festival_surge": {"label": "Festival order surge", "category": "Load spike", "services": ["intake", "assign"],
                       "severity": "high", "baseline": "~1 order per minute", "failure_state": "2.5x normal orders"},
    "coverage_drift": {"label": "Free-delivery zone config drift", "category": "Configuration drift",
                       "services": ["zones"], "severity": "medium",
                       "baseline": "Free delivery inside each zone polygon",
                       "failure_state": "One zone polygon shrinks to 45%; customers inside see a delivery fee"},
}
FORBIDDEN = {
    "wipe_order_database": {"label": "Wipe the order database", "category": "Destructive outage",
                            "services": ["zones", "intake", "tablets", "maps", "gps", "assign"],
                            "severity": "critical", "destructive": True, "alternative": "tablet_offline"},
}
CORRECT_FIX = {"heavy_rain": ["reassign_riders", "extend_eta_notify"], "tablet_offline": ["phone_restaurants"],
               "maps_slow": ["cached_routes"], "festival_surge": ["batch_orders", "reassign_riders"],
               "coverage_drift": ["restore_zone_config"]}
ROOT_CAUSE = {"reassign_riders": "Rider shortage (weather or demand)", "batch_orders": "Order surge beyond fleet capacity",
              "phone_restaurants": "Restaurant tablets offline", "cached_routes": "Slow maps / ETA dependency",
              "extend_eta_notify": "Promised ETAs no longer realistic",
              "restore_zone_config": "Free-delivery zone misconfigured (config drift)"}
SYMPTOM_TEXT = {"rider_shortage": "too few riders are online", "order_backlog": "orders are waiting for riders",
                "orders_unacknowledged": "kitchens are not acknowledging orders",
                "assignment_slow": "the maps / ETA service is responding slowly",
                "eta_breaches": "many orders are past their promised time",
                "coverage_mismatch": "customers inside a zone are suddenly being told they are outside free delivery"}


def _zone_polygon(z, i):
    """Simulated free-delivery service area: an irregular 9-sided polygon around the zone centre."""
    rng = random.Random(1000 + i)
    ring = []
    for k in range(9):
        ang = 2 * math.pi * k / 9 + rng.uniform(-0.2, 0.2)
        r_km = rng.uniform(2.0, 3.3)
        ring.append([round(z["lat"] + r_km / 111 * math.sin(ang), 5),
                     round(z["lon"] + r_km / (111 * math.cos(math.radians(z["lat"]))) * math.cos(ang), 5)])
    return ring


def _shrunk(ring, factor=0.45):
    clat = sum(p[0] for p in ring) / len(ring)
    clon = sum(p[1] for p in ring) / len(ring)
    return [[round(clat + (a - clat) * factor, 5), round(clon + (b - clon) * factor, 5)] for a, b in ring]


FREE_ZONES = {z["id"]: {"id": z["id"], "name": z["name"], "polygon": _zone_polygon(z, i)}
              for i, z in enumerate(BENGALURU_ZONES)}


def _baseline_outside(z, n=3000):
    """Normal share of address checks that fall outside a zone (ops teams know their normal rate)."""
    rng = random.Random(7)
    ring = FREE_ZONES[z["id"]]["polygon"]
    out = sum(not point_in_polygon(z["lat"] + rng.gauss(0, 0.015), z["lon"] + rng.gauss(0, 0.015), ring)
              for _ in range(n))
    return round(out / n, 3)


BASELINE_OUTSIDE = {z["id"]: _baseline_outside(z) for z in BENGALURU_ZONES}

SPEED_KM_PER_TICK = 0.4       # ~24 km/h on a bike
BASE_ORDER_RATE = 1.0         # orders per minute
PROMISE_MIN, EXTENDED_PROMISE_MIN = 30, 45
PATIENCE_MIN, NOTIFIED_PATIENCE_MIN = 40, 60
OFFLINE_NOTICE_MIN = 15       # an offline kitchen notices the order only when the customer calls
FLEET = 30
CHECKS_PER_MIN = 4            # free-delivery eligibility checks per zone per minute

# ---------------------------------------------------------------- A · city data
_CUISINES = ["Biryani House", "Dosa Corner", "Pizza Point", "Chaat Street", "Tandoor Grill",
             "Momo Hut", "Thali Kitchen", "Burger Barn", "Idli Express", "Kebab Co",
             "Noodle Bar", "Paratha Hub", "Juice Junction", "Sweet Mart", "Rolls & Wraps"]
RESTAURANTS = []
for _i, _name in enumerate(_CUISINES):
    _z = BENGALURU_ZONES[_i % len(BENGALURU_ZONES)]
    _off = 0.006 if _i >= len(BENGALURU_ZONES) else -0.004
    RESTAURANTS.append({"id": f"rest_{_i + 1}", "name": f"{_z['name']} {_name}",
                        "lat": round(_z["lat"] + _off, 4), "lon": round(_z["lon"] - _off, 4),
                        "weight": _z["weight"], "prep": 8 + (_i * 3) % 7, "zone": _z["id"]})
RIDERS = [{"id": f"rider_{i + 1}", "standby": i >= FLEET,
           "lat": BENGALURU_ZONES[i % 10]["lat"] + 0.01 * ((i * 7) % 5 - 2) / 2,
           "lon": BENGALURU_ZONES[i % 10]["lon"] + 0.01 * ((i * 3) % 5 - 2) / 2} for i in range(FLEET + 10)]


class Chaos:
    def __init__(self):
        self.reset()

    def reset(self):
        self.rain = False
        self.tablets_down = set()
        self.maps_slow = False
        self.festival = False
        self.batching = self.phone_confirm = self.cached_routes = self.eta_extended = False
        self.drift_zones = set()
        self.zone_restored = False
        self.attacks, self.fixes = [], []


class Rider(Mover):
    def __init__(self, d):
        self.id, self.home, self.is_standby = d["id"], (d["lat"], d["lon"]), d["standby"]
        self.reset()

    def reset(self):
        self.lat, self.lon = self.home
        self.status = "standby" if self.is_standby else "idle"
        self.orders = []            # order ids being carried / picked up
        self.log_off_after = False  # rain: log off after finishing the current job

    @property
    def online(self):
        return self.status not in ("standby", "offline")


# ---------------------------------------------------------------- A+B · the twin
class Twin:
    def __init__(self, seed):
        self.seed = seed
        self.round = self.t = 0
        self.chaos = Chaos()
        self.restaurants = {r["id"]: dict(r) for r in RESTAURANTS}
        self.riders = {r["id"]: Rider(r) for r in RIDERS}
        self.events = []

    def emit(self, kind, **fields):
        self.events.append({"type": kind, "t": self.t, **fields})

    def start_round(self, round_no):
        self.round, self.t = round_no, 0
        self.rng = random.Random(self.seed * 1000 + round_no + 17)
        self.chaos.reset()
        for r in self.riders.values():
            r.reset()
        self.orders, self.next_order, self.order_log = {}, 1, []
        self.coverage_log = []          # orders: (t, zone, shown_free, truly_free)
        self.check_log = []             # address checks: (t, zone, shown_free, truly_free)

    # ----- chaos hooks -----
    def apply_attack(self, msg):
        attack, c = msg.get("attack"), self.chaos
        if attack == "heavy_rain":
            c.rain = True
            online = [r for r in self.riders.values() if r.status not in ("standby", "offline")]
            for r in self.rng.sample(online, int(0.4 * len(online))):
                if r.status == "idle":
                    r.status = "offline"
                else:
                    r.log_off_after = True
        elif attack == "tablet_offline":
            c.tablets_down.update(t for t in msg.get("target", []) if t in self.restaurants)
        elif attack == "maps_slow":
            c.maps_slow = True
        elif attack == "festival_surge":
            c.festival = True
        elif attack == "coverage_drift":
            c.drift_zones.update(z for z in msg.get("target", []) if z in FREE_ZONES)
        c.attacks.append(attack)

    def apply_fix(self, msg):
        action, c = msg.get("action"), self.chaos
        if action == "reassign_riders":
            for r in self.riders.values():
                if r.status == "standby":
                    r.status = "idle"
        elif action == "batch_orders":
            c.batching = True
        elif action == "phone_restaurants":
            c.phone_confirm = True
        elif action == "cached_routes":
            c.cached_routes = True
        elif action == "restore_zone_config":
            c.zone_restored = True
        elif action == "extend_eta_notify":
            c.eta_extended = True
            for o in self.orders.values():
                if o["status"] not in ("delivered", "cancelled"):
                    o["promise"] = EXTENDED_PROMISE_MIN
                    o["patience"] = NOTIFIED_PATIENCE_MIN
        c.fixes.append(action)

    # ----- B · services, one tick -----
    def step(self):
        self.order_intake()
        self.restaurant_tablets()
        self.assignment()
        self.move_riders()
        self.cancellations()
        self.t += 1

    def speed(self):
        return SPEED_KM_PER_TICK * (0.6 if self.chaos.rain else 1.0)

    def address_checks(self):
        """Customers browsing the app check free-delivery eligibility far more often than they order."""
        rng = self.rng
        for zid, z in FREE_ZONES.items():
            zc = next(zz for zz in BENGALURU_ZONES if zz["id"] == zid)
            for _ in range(poisson(rng, CHECKS_PER_MIN)):
                lat, lon = zc["lat"] + rng.gauss(0, 0.015), zc["lon"] + rng.gauss(0, 0.015)
                truly = point_in_polygon(lat, lon, z["polygon"])
                shown = point_in_polygon(lat, lon, self.configured_ring(zid))
                self.check_log.append((self.t, zid, shown, truly))
                if truly and not shown and rng.random() < 0.3:    # saw a wrong delivery fee, left the app
                    self.emit("lost_sale", zone=zid)
        self.check_log = [e for e in self.check_log if self.t - e[0] <= 10]

    def order_intake(self):
        if self.t >= ARRIVALS_UNTIL:
            return
        self.address_checks()
        c, rng = self.chaos, self.rng
        rate = BASE_ORDER_RATE * (2.5 if c.festival else 1.0) * (1.3 if c.rain else 1.0)
        rests = list(self.restaurants.values())
        for _ in range(poisson(rng, rate)):
            r = rng.choices(rests, [x["weight"] for x in rests])[0]
            o = {"id": f"o{self.round}_{self.next_order}", "rest": r["id"], "created": self.t,
                 "lat": r["lat"] + rng.gauss(0, 0.014), "lon": r["lon"] + rng.gauss(0, 0.014),
                 "status": "placed", "acked": None, "ready_at": None, "rider": None,
                 "promise": EXTENDED_PROMISE_MIN if c.eta_extended else PROMISE_MIN,
                 "patience": NOTIFIED_PATIENCE_MIN if c.eta_extended else PATIENCE_MIN}
            self.next_order += 1
            self.orders[o["id"]] = o
            self.order_log.append(self.t)
            self.emit("order_created", order_id=o["id"], rest=r["id"])
            # free-delivery check against the configured zone polygon
            ring = FREE_ZONES[r["zone"]]["polygon"]
            truly = point_in_polygon(o["lat"], o["lon"], ring)
            shown = point_in_polygon(o["lat"], o["lon"], self.configured_ring(r["zone"]))
            o["zone"], o["free"], o["truly_free"] = r["zone"], shown, truly
            self.coverage_log.append((self.t, r["zone"], shown, truly))
            if truly and not shown and rng.random() < 0.6:     # wrongly charged: customer abandons the order
                o["status"] = "cancelled"
                self.emit("cancelled", order_id=o["id"], waited_min=0, reason="delivery fee shown wrongly")

    def zone_stats(self):
        """Per-zone share of recent orders that were shown 'outside free delivery' (what ops dashboards see)."""
        recent = [e for e in self.check_log if self.t - e[0] <= 6]
        per = {}
        for _, zone, shown, _truly in recent:
            n, out = per.get(zone, (0, 0))
            per[zone] = (n + 1, out + (0 if shown else 1))
        excess = lambda kv: (kv[1][1] / kv[1][0] - BASELINE_OUTSIDE[kv[0]]) if kv[1][0] >= 20 else -1
        worst = max(per.items(), key=excess, default=None)
        return {"worst_zone": worst[0] if worst else None,
                "worst_orders": worst[1][0] if worst else 0, "worst_outside": worst[1][1] if worst else 0,
                "worst_baseline": BASELINE_OUTSIDE[worst[0]] if worst else 0,
                "mode": "restored" if self.chaos.zone_restored else "config"}

    def configured_ring(self, zone):
        ring = FREE_ZONES[zone]["polygon"]
        drifted = zone in self.chaos.drift_zones and not self.chaos.zone_restored
        return _shrunk(ring) if drifted else ring

    def restaurant_tablets(self):
        c = self.chaos
        for o in self.orders.values():
            if o["status"] != "placed":
                continue
            tablet_ok = o["rest"] not in c.tablets_down or c.phone_confirm
            if tablet_ok or self.t - o["created"] >= OFFLINE_NOTICE_MIN:
                o["status"], o["acked"] = "cooking", self.t
                o["ready_at"] = self.t + self.restaurants[o["rest"]]["prep"]

    def waiting_for_rider(self):
        return [o for o in self.orders.values() if o["status"] == "cooking" and o["rider"] is None]

    def assignment(self):
        c = self.chaos
        if c.maps_slow and not c.cached_routes:
            capacity = 1 if self.t % 3 == 0 else 0   # every assignment needs a (slow) ETA call
        else:
            capacity = 99
        for o in sorted(self.waiting_for_rider(), key=lambda x: x["created"]):
            if capacity <= 0 or o["rider"] is not None:
                continue
            idle = [r for r in self.riders.values() if r.status == "idle"]
            if not idle:
                break
            rest = self.restaurants[o["rest"]]
            rider = min(idle, key=lambda r: km(r.lat, r.lon, rest["lat"], rest["lon"]))
            batch = [o]
            if c.batching:   # take up to 2 more orders from the same kitchen
                extra = [x for x in self.waiting_for_rider() if x["rest"] == o["rest"] and x is not o]
                batch += extra[:2]
            for x in batch:
                x["rider"] = rider.id
            rider.orders = [x["id"] for x in batch]
            rider.status = "to_restaurant"
            capacity -= 1
            self.emit("assigned", order_ids=rider.orders, rider=rider.id)

    def move_riders(self):
        speed = self.speed()
        for r in self.riders.values():
            r.orders = [oid for oid in r.orders if self.orders[oid]["status"] != "cancelled"]
            if r.status in ("to_restaurant", "at_restaurant") and not r.orders:
                self.finish_job(r)
                continue
            if r.status == "to_restaurant":
                rest = self.restaurants[self.orders[r.orders[0]]["rest"]]
                if r.move_towards(rest["lat"], rest["lon"], speed):
                    r.status = "at_restaurant"
            if r.status == "at_restaurant":
                if all(self.t >= self.orders[oid]["ready_at"] for oid in r.orders):
                    for oid in r.orders:
                        self.orders[oid]["status"] = "picked"
                    r.status = "to_customer"
            elif r.status == "to_customer":
                o = self.orders[r.orders[0]]
                if r.move_towards(o["lat"], o["lon"], speed):
                    minutes = self.t + 1 - o["created"]
                    o["status"] = "delivered"
                    self.emit("delivered", order_id=o["id"], delivery_min=minutes, late=minutes > o["promise"])
                    r.orders.pop(0)
                    if not r.orders:
                        self.finish_job(r)

    def finish_job(self, r):
        r.orders = []
        r.status = "offline" if r.log_off_after else "idle"
        r.log_off_after = False

    def cancellations(self):
        for o in self.orders.values():
            if o["status"] in ("placed", "cooking") and self.t - o["created"] > o["patience"]:
                o["status"] = "cancelled"
                self.emit("cancelled", order_id=o["id"], waited_min=self.t - o["created"])

    # ----- RYVO views -----
    def topology(self, online, waiting, maps_latency):
        c, t = self.chaos, self.t
        placed = [o for o in self.orders.values() if o["status"] == "placed"]
        unacked = sum(1 for o in placed if t - o["created"] > 3)
        orders5 = sum(1 for x in self.order_log if t - x <= 5)
        recent = [e for e in self.check_log if t - e[0] <= 6]
        outside = sum(1 for e in recent if not e[2])
        tel = {
            "zones": {"base_ms": 20, "latency_ms": 20, "error_pct": round(100 * outside / max(1, len(recent))),
                      "metric": f"{outside}/{len(recent)} shown outside"},
            "intake": {"base_ms": 80, "latency_ms": 80 + 15 * max(0, orders5 - 8), "error_pct": 0,
                       "metric": f"{orders5} orders / 5 min"},
            "tablets": {"base_ms": 150, "latency_ms": 150, "error_pct": round(100 * unacked / max(1, len(placed) or 1)),
                        "metric": f"{unacked} unacknowledged"},
            "maps": {"base_ms": 180, "latency_ms": maps_latency, "error_pct": 0, "metric": f"{maps_latency} ms / call"},
            "gps": {"base_ms": 100, "latency_ms": 100, "error_pct": round(100 * (1 - online / FLEET)),
                    "metric": f"{online}/{FLEET} riders online"},
            "assign": {"base_ms": 100, "latency_ms": 100 + 20 * len(waiting), "error_pct": 0,
                       "metric": f"{len(waiting)} waiting for a rider"},
        }
        return build_topology(SERVICES, EDGES, EXPERIMENTS, CORRECT_FIX, c.attacks, c.fixes, tel)

    def focus(self):
        c = self.chaos
        active = [a for a in c.attacks if not neutralised(a, c.fixes, CORRECT_FIX)]
        if "coverage_drift" in active and c.drift_zones:
            z = FREE_ZONES[sorted(c.drift_zones)[0]]
            return {"level": "local", "bounds": bounds_of(z["polygon"]), "label": f"{z['name']} free-delivery zone",
                    "reason": f"The {z['name']} zone's configured boundary no longer matches its service area"}
        if "tablet_offline" in active and c.tablets_down:
            pts = [(self.restaurants[r]["lat"], self.restaurants[r]["lon"]) for r in c.tablets_down]
            return {"level": "local", "bounds": bounds_of(pts, 0.05), "label": "Kitchens with offline tablets",
                    "reason": f"{len(pts)} kitchens stopped acknowledging orders"}
        allpts = [p for z in FREE_ZONES.values() for p in z["polygon"]]
        return {"level": "city", "bounds": bounds_of(allpts), "label": "Bengaluru · free-delivery coverage",
                "reason": "City-wide view of every simulated delivery zone" if not active
                else f"{EXPERIMENTS[active[0]]['label']} affects the whole city"}

    def geo(self):
        c, t = self.chaos, self.t
        zones = []
        for zid, z in FREE_ZONES.items():
            drifted = zid in c.drift_zones
            zones.append({"id": zid, "name": z["name"],
                          "status": ("restored" if c.zone_restored else "drifted") if drifted else "ok",
                          "configured": self.configured_ring(zid) if drifted else None})
        customers = [{"lat": round(o["lat"], 5), "lon": round(o["lon"], 5), "free": o["free"],
                      "truly_free": o["truly_free"], "zone": o["zone"]}
                     for o in self.orders.values() if t - o["created"] <= 15][-80:]
        return {"zones": zones, "customers": customers}

    # ----- what the twin publishes -----
    def snapshot(self):
        t, c = self.t, self.chaos
        active = [o for o in self.orders.values() if o["status"] not in ("delivered", "cancelled")]
        online = sum(1 for r in self.riders.values() if r.online and not r.log_off_after)
        waiting = self.waiting_for_rider()
        maps_live = not c.cached_routes
        points = []
        for r in self.riders.values():
            group = ("unit_reserve" if r.status == "standby" else "unit_problem" if r.status == "offline" else
                     "unit_free" if r.status == "idle" else "unit_busy")
            points.append({"id": r.id, "lat": r.lat, "lon": r.lon, "group": group, "size": 8,
                           "label": f"{r.id}: {r.status}" + (f" ({len(r.orders)} orders)" if r.orders else "")})
        for rest in self.restaurants.values():
            down = rest["id"] in c.tablets_down and not c.phone_confirm
            points.append({"id": rest["id"], "lat": rest["lat"], "lon": rest["lon"], "group": "site_bad" if down else "site",
                           "size": 14, "label": rest["name"] + (" - tablet OFFLINE" if down else "")})
        for o in active:
            if o["status"] in ("placed", "cooking") and o["rider"] is None:
                late = t - o["created"] > o["promise"]
                points.append({"id": o["id"], "lat": o["lat"], "lon": o["lon"], "group": "demand_urgent" if late else "demand",
                               "size": 7, "label": f"{o['id']} {o['status']}, {t - o['created']} min old"})
        return {
            "services": {
                "intake": {"orders_last_5": sum(1 for x in self.order_log if t - x <= 5)},
                "riders": {"online": online, "fleet": FLEET},
                "assignment": {"waiting_for_rider": len(waiting),
                               "maps_latency_ms": (4200 if c.maps_slow else 180) if maps_live else 25,
                               "maps_mode": "live" if maps_live else "cache"},
                "restaurants": {"unacked_over_3": sum(1 for o in self.orders.values()
                                                      if o["status"] == "placed" and t - o["created"] > 3),
                                "mode": "phone" if c.phone_confirm else "tablet"},
                "eta": {"active": len(active), "past_promise": sum(1 for o in active if t - o["created"] > o["promise"]),
                        "notified": c.eta_extended},
                "zones": self.zone_stats(),
            },
            "kpis": [["Orders in progress", len(active)], ["Riders online", online],
                     ["Waiting for a rider", len(waiting)]],
            "map": {"points": points, "lines": [], "labels": [{"lat": z["lat"] - 0.017, "lon": z["lon"], "text": z["name"]} for z in BENGALURU_ZONES]},
            "truth": {"attacks": list(c.attacks), "fixes": list(c.fixes)},
            "topology": self.topology(online, waiting, (4200 if c.maps_slow else 180) if maps_live else 25),
            "focus": self.focus(),
            "geo": self.geo(),
        }


# ---------------------------------------------------------------- E · Red's targeting
def pick_target(attack, state, rng):
    if attack == "tablet_offline":
        ids = [r["id"] for r in RESTAURANTS]
        return sorted(rng.sample(ids, 5), key=lambda x: int(x.split("_")[1]))
    if attack == "coverage_drift":
        return [rng.choice(["hebbal", "yelahanka", "malleshwaram", "rajajinagar", "indiranagar"])]
    return {"heavy_rain": ["citywide"], "maps_slow": ["maps_api"], "festival_surge": ["citywide"]}[attack]


# ---------------------------------------------------------------- F · Blue's sensors and rules
def sense(state, memory):
    s, out = state["services"], {}
    if s["riders"]["online"] < 0.7 * s["riders"]["fleet"]:
        out["rider_shortage"] = {"online": s["riders"]["online"], "fleet": s["riders"]["fleet"],
                                 "_strength": min(1.0, 2 * (1 - s["riders"]["online"] / s["riders"]["fleet"]))}
    if s["assignment"]["waiting_for_rider"] >= 8:
        out["order_backlog"] = {"waiting": s["assignment"]["waiting_for_rider"],
                                "orders_last_5": s["intake"]["orders_last_5"], "riders_online": s["riders"]["online"],
                                "_strength": min(1.0, s["assignment"]["waiting_for_rider"] / 16)}
    if s["restaurants"]["unacked_over_3"] >= 2 and s["restaurants"]["mode"] == "tablet":
        out["orders_unacknowledged"] = {"orders": s["restaurants"]["unacked_over_3"],
                                        "_strength": min(1.0, s["restaurants"]["unacked_over_3"] / 5)}
    if s["assignment"]["maps_latency_ms"] > 1500 and s["assignment"]["maps_mode"] == "live":
        out["assignment_slow"] = {"maps_latency_ms": s["assignment"]["maps_latency_ms"],
                                  "_strength": min(1.0, s["assignment"]["maps_latency_ms"] / 4000)}
    eta = s["eta"]
    if not eta["notified"] and eta["active"] >= 6 and eta["past_promise"] >= 0.25 * eta["active"]:
        out["eta_breaches"] = {"late": eta["past_promise"], "active": eta["active"],
                               "_strength": min(1.0, eta["past_promise"] / max(1, eta["active"]) * 2)}
    z = s["zones"]
    if z["mode"] == "config" and z["worst_orders"] >= 20:
        share = z["worst_outside"] / z["worst_orders"]
        if share >= z["worst_baseline"] + 0.32:
            out["coverage_mismatch"] = {"zone": z["worst_zone"], "outside_pct": round(100 * share),
                                        "normal_pct": round(100 * z["worst_baseline"]),
                                        "_strength": min(1.0, (share - z["worst_baseline"]) * 2)}
    return out


def symptom_key(symptom, evidence):
    if symptom == "order_backlog" and evidence.get("orders_last_5", 0) >= 10:
        return "order_backlog+high_order_rate"
    return symptom


RULES = {
    "rider_shortage": ["reassign_riders"],
    "order_backlog": ["reassign_riders", "batch_orders"],
    "orders_unacknowledged": ["phone_restaurants"],
    "assignment_slow": ["cached_routes"],
    "eta_breaches": ["extend_eta_notify"],
    "coverage_mismatch": ["restore_zone_config"],
}
SIGNATURE_HINT = {"order_backlog+high_order_rate": "batch_orders"}
EFFECT_SYMPTOMS = {"order_backlog"}
VERIFY_TICKS = 8   # riders need a few minutes to come online / reach kitchens


# ---------------------------------------------------------------- G · Referee scoring
BASELINE_LATE_PCT = 2.0

def score(events, end_t):
    created = {e["order_id"]: e for e in events if e["type"] == "order_created"}
    delivered = {e["order_id"]: e for e in events if e["type"] == "delivered"}
    cancelled = {e["order_id"] for e in events if e["type"] == "cancelled"}
    late = sum(1 for e in delivered.values() if e["late"])
    # still undelivered at round end and already past the promise -> definitely late
    late += sum(1 for oid, e in created.items()
                if oid not in delivered and oid not in cancelled and end_t - e["t"] > PROMISE_MIN)
    times = [e["delivery_min"] for e in delivered.values()]
    lost = sum(1 for e in events if e["type"] == "lost_sale")
    return {
        "late_pct": round(100 * (late + len(cancelled)) / max(1, len(created)), 1),
        "cancelled": len(cancelled),
        "avg_delivery_min": round(sum(times) / max(1, len(times)), 1),
        "orders": len(created),
        "lost_sales": lost,
    }


def red_reward(m):
    return round(clip01((m["late_pct"] - BASELINE_LATE_PCT) / 60 + 0.02 * m["cancelled"]
                        + 0.015 * m.get("lost_sales", 0)), 2)
