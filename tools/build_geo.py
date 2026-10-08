"""Builds the small boundary files the map uses, from geoBoundaries (real administrative boundaries).

  States    (ADM1, 2011): DataMeet India / Election Commission of India - CC BY 2.5 IN
  Districts (ADM2, 2021): Pathways Data Pvt. Ltd., lgdirectory.gov.in - ODbL 1.0
  via geoBoundaries (www.geoboundaries.org), Runfola et al. 2020.

Only the regions our scenarios use are kept, so the browser never loads all of India.
Run once:  python -m tools.build_geo        -> backend/geography/data/*.geojson
"""
import json
import tempfile
import unicodedata
import urllib.request
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "backend" / "geography" / "data"
SOURCES = {
    "ADM1": "https://github.com/wmgeolab/geoBoundaries/raw/9469f09/releaseData/gbOpen/IND/ADM1/geoBoundaries-IND-ADM1_simplified.geojson",
    "ADM2": "https://github.com/wmgeolab/geoBoundaries/raw/9469f09/releaseData/gbOpen/IND/ADM2/geoBoundaries-IND-ADM2_simplified.geojson",
}
KEEP = {   # matched without accents (the source writes e.g. "Karnātaka")
    "ADM1": ["Karnataka", "Maharashtra", "Tamil Nadu", "Telangana", "Gujarat", "Delhi"],
    "ADM2": ["Bangalore", "Mumbai", "Mumbai Suburban", "Hyderabad", "Chennai", "New Delhi", "Ahmedabad"],
}
DISPLAY = {"Bangalore": "Bengaluru Urban"}


def plain(name):
    return "".join(c for c in unicodedata.normalize("NFKD", name) if not unicodedata.combining(c))


ATTRIBUTION = {
    "ADM1": "geoBoundaries IND ADM1 (DataMeet India / ECI, CC BY 2.5 IN)",
    "ADM2": "geoBoundaries IND ADM2 (Pathways Data / lgdirectory.gov.in, ODbL 1.0)",
}


def rounded(coords):
    if isinstance(coords[0], (int, float)):
        return [round(coords[0], 4), round(coords[1], 4)]
    return [rounded(c) for c in coords]


def bbox(geom):
    xs, ys = [], []

    def walk(c):
        if isinstance(c[0], (int, float)):
            xs.append(c[0]); ys.append(c[1])
        else:
            for x in c:
                walk(x)
    walk(geom["coordinates"])
    return [[min(ys), min(xs)], [max(ys), max(xs)]]      # [[south, west], [north, east]] like Leaflet


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    tmp = Path(tempfile.mkdtemp(prefix="geo-"))
    for level, url in SOURCES.items():
        raw = tmp / f"{level}.geojson"
        print(f"downloading {level} ...", flush=True)
        urllib.request.urlretrieve(url, raw)
        data = json.loads(raw.read_text(encoding="utf-8"))
        feats = []
        for f in data["features"]:
            name = plain(f["properties"].get("shapeName", ""))
            if name in KEEP[level]:
                name = DISPLAY.get(name, name)
                geom = {"type": f["geometry"]["type"], "coordinates": rounded(f["geometry"]["coordinates"])}
                feats.append({"type": "Feature", "geometry": geom,
                              "properties": {"name": name, "level": "state" if level == "ADM1" else "district",
                                             "bounds": bbox(geom), "source": ATTRIBUTION[level]}})
        out = OUT / ("states.geojson" if level == "ADM1" else "districts.geojson")
        out.write_text(json.dumps({"type": "FeatureCollection", "features": feats}), encoding="utf-8")
        print(f"  kept {[f['properties']['name'] for f in feats]} -> {out.name} ({out.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()
