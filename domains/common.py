"""Small helpers shared by all domain twins."""
import math

BENGALURU_ZONES = [
    {"id": "hebbal",          "name": "Hebbal",          "lat": 13.0358, "lon": 77.5970, "weight": 1.0},
    {"id": "yelahanka",       "name": "Yelahanka",       "lat": 13.1005, "lon": 77.5963, "weight": 0.7},
    {"id": "malleshwaram",    "name": "Malleshwaram",    "lat": 13.0035, "lon": 77.5710, "weight": 1.0},
    {"id": "rajajinagar",     "name": "Rajajinagar",     "lat": 12.9910, "lon": 77.5520, "weight": 0.9},
    {"id": "indiranagar",     "name": "Indiranagar",     "lat": 12.9784, "lon": 77.6408, "weight": 1.2},
    {"id": "whitefield",      "name": "Whitefield",      "lat": 12.9698, "lon": 77.7500, "weight": 1.1},
    {"id": "koramangala",     "name": "Koramangala",     "lat": 12.9352, "lon": 77.6245, "weight": 1.3},
    {"id": "jayanagar",       "name": "Jayanagar",       "lat": 12.9250, "lon": 77.5938, "weight": 1.0},
    {"id": "banashankari",    "name": "Banashankari",    "lat": 12.9255, "lon": 77.5468, "weight": 0.9},
    {"id": "electronic_city", "name": "Electronic City", "lat": 12.8452, "lon": 77.6602, "weight": 0.8},
]


def km(lat1, lon1, lat2, lon2):
    """Straight-line distance in km (haversine)."""
    p = math.pi / 180
    a = (math.sin((lat2 - lat1) * p / 2) ** 2
         + math.cos(lat1 * p) * math.cos(lat2 * p) * math.sin((lon2 - lon1) * p / 2) ** 2)
    return 12742 * math.asin(math.sqrt(a))


def poisson(rng, lam):
    """Random number of events in one tick when they happen `lam` times per tick on average."""
    if lam > 30:   # normal approximation for big numbers (fast)
        return max(0, round(rng.gauss(lam, math.sqrt(lam))))
    limit, k, p = math.exp(-lam), 0, 1.0
    while True:
        p *= rng.random()
        if p <= limit:
            return k
        k += 1


def clip01(x):
    return max(0.0, min(1.0, x))


SEVERITY_ORDER = ["low", "medium", "high", "critical"]


def neutralised(attack, fixes, correct_fix):
    """An attack is neutralised once one of its correct fixes is active."""
    return any(f in fixes for f in correct_fix.get(attack, []))


def build_topology(services, edges, experiments, correct_fix, attacks, fixes, telemetry):
    """Service graph for the arena: each node gets a status from the live chaos state + prototype telemetry.

    status: healthy | strained (side-effect, no attack on it) | degraded (attacked) | mitigated (fix active)
    """
    nodes = []
    for s in services:
        tel = telemetry.get(s["id"], {})
        hit = [a for a in attacks if s["id"] in experiments.get(a, {}).get("services", [])]
        if hit:
            status = "mitigated" if all(neutralised(a, fixes, correct_fix) for a in hit) else "degraded"
        elif tel.get("latency_ms", 0) > 2.5 * tel.get("base_ms", 1e9) or tel.get("error_pct", 0) >= 25:
            status = "strained"
        else:
            status = "healthy"
        nodes.append({**s, **tel, "status": status, "attacked_by": hit})
    return {"nodes": nodes, "edges": edges}


def bounds_of(points, min_span=0.02):
    """[[south, west], [north, east]] around (lat, lon) points, never smaller than min_span degrees."""
    lats = [p[0] for p in points]
    lons = [p[1] for p in points]
    s, n, w, e = min(lats), max(lats), min(lons), max(lons)
    if n - s < min_span:
        mid = (n + s) / 2
        s, n = mid - min_span / 2, mid + min_span / 2
    if e - w < min_span:
        mid = (e + w) / 2
        w, e = mid - min_span / 2, mid + min_span / 2
    return [[round(s, 4), round(w, 4)], [round(n, 4), round(e, 4)]]


def point_in_polygon(lat, lon, ring):
    """Ray casting. ring = [[lat, lon], ...]"""
    inside = False
    j = len(ring) - 1
    for i in range(len(ring)):
        yi, xi = ring[i]
        yj, xj = ring[j]
        if (yi > lat) != (yj > lat) and lon < (xj - xi) * (lat - yi) / (yj - yi + 1e-12) + xi:
            inside = not inside
        j = i
    return inside


class Mover:
    """Anything that drives around the map (ambulance, rider)."""

    def move_towards(self, lat, lon, speed_km):
        d = km(self.lat, self.lon, lat, lon)
        if d <= speed_km:
            self.lat, self.lon = lat, lon
            return True
        f = speed_km / d
        self.lat += (lat - self.lat) * f
        self.lon += (lon - self.lon) * f
        return False
