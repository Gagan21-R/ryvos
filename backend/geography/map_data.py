"""Geography for each scenario, served to the map. The frontend holds no geographic logic of its own.

Real boundaries: geoBoundaries (see tools/build_geo.py for sources and licences).
Everything operational (stations, zones, banks, routes) is SIMULATED and labelled as such.
"""
import json
from functools import lru_cache
from pathlib import Path

import domains

DATA = Path(__file__).resolve().parent / "data"
INDIA = {"level": "national", "name": "India", "bounds": [[6.5, 68.0], [35.7, 97.5]]}
HIERARCHY = {   # national > state > district > city > local
    "emergency": ["national", "state", "district", "city", "local"],
    "food": ["national", "state", "district", "city", "local"],
    "upi": ["national", "state", "city"],
}


@lru_cache
def boundaries():
    out = {}
    for fname in ("states.geojson", "districts.geojson"):
        path = DATA / fname
        if path.exists():
            for f in json.loads(path.read_text(encoding="utf-8"))["features"]:
                out[f["properties"]["name"]] = f
    return out


def region_bounds(name):
    f = boundaries().get(name)
    return f["properties"]["bounds"] if f else None


def resolve_focus(focus):
    """Twins may name a region ("Karnataka") instead of giving bounds: fill the bounds in."""
    if focus and not focus.get("bounds") and focus.get("region"):
        focus = {**focus, "bounds": region_bounds(focus["region"]) or INDIA["bounds"]}
    return focus


def feature(name, role, label):
    f = boundaries().get(name)
    if not f:
        return None
    return {**f, "properties": {**f["properties"], "role": role, "label": label}}


@lru_cache
def geography(domain):
    D = domains.get(domain)
    layers = {"boundaries": [], "zones": [], "coverage": [], "sites": []}
    levels = [INDIA]
    if domain in ("emergency", "food"):
        for name, role, label in (("Karnataka", "context", "Karnataka (state)"),
                                  ("Bengaluru Urban", "operational", "Bengaluru Urban district")):
            f = feature(name, role, label)
            if f:
                layers["boundaries"].append(f)
                levels.append({"level": "state" if role == "context" else "district", "name": name,
                               "bounds": f["properties"]["bounds"]})
    if domain == "emergency":
        radius = round(D.SPEED_KM_PER_TICK * 15, 2)          # how far a crew drives in 15 minutes
        for a in D.AMBULANCES:
            if not a["reserve"]:
                layers["coverage"].append({"lat": a["lat"], "lon": a["lon"], "radius_km": radius, "id": a["id"],
                                           "label": f"Station {a['id']}: simulated 15-min response coverage"})
        layers["sites"] = [{"lat": h["lat"], "lon": h["lon"], "kind": "hospital", "label": h["name"]}
                           for h in D.HOSPITALS]
        levels.append({"level": "city", "name": "Bengaluru",
                       "bounds": _bounds([(z["lat"], z["lon"]) for z in D.ZONES], 0.05)})
    if domain == "food":
        layers["zones"] = [{"id": z["id"], "name": z["name"], "polygon": z["polygon"],
                            "label": f"{z['name']} · simulated free-delivery zone"} for z in D.FREE_ZONES.values()]
        levels.append({"level": "city", "name": "Bengaluru",
                       "bounds": _bounds([p for z in D.FREE_ZONES.values() for p in z["polygon"]], 0)})
    if domain == "upi":
        for b in D.BANKS:
            f = feature(b["state"], "context", f"{b['state']} (state)")
            if f:
                layers["boundaries"].append(f)
        f = feature(D.BOT_FARM["state"], "context", f"{D.BOT_FARM['state']} (state)")
        if f:
            layers["boundaries"].append(f)
        layers["sites"] = [{"lat": b["lat"], "lon": b["lon"], "kind": "bank", "label": f"{b['name']} · simulated"}
                           for b in D.BANKS] + [{"lat": D.GATEWAY["lat"], "lon": D.GATEWAY["lon"], "kind": "gateway",
                                                 "label": "Payment gateway · simulated"}]
    return {
        "domain": domain, "home": D.GEOGRAPHY, "levels": levels, "hierarchy": HIERARCHY[domain], "layers": layers,
        "attribution": ["Map tiles © OpenStreetMap contributors",
                        "Boundaries: geoBoundaries (DataMeet India/ECI CC BY 2.5 IN; Pathways Data/lgdirectory ODbL)"],
        "simulated_note": "Stations, zones, banks, calls, orders and routes are simulated (sandbox).",
    }


def _bounds(points, pad):
    lats = [p[0] for p in points]
    lons = [p[1] for p in points]
    return [[round(min(lats) - pad, 4), round(min(lons) - pad, 4)], [round(max(lats) + pad, 4), round(max(lons) + pad, 4)]]
