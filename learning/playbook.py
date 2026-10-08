"""G · Playbook memory: symptom -> the fix recipe that worked. A JSON file is enough for the prototype.

Keys look like "emergency:dispatch_backlog+high_call_rate".
"""
import json
import os
import time

from shared import config

PATH = config.DATA_DIR / "playbook.json"


def load():
    try:
        return json.loads(PATH.read_text(encoding="utf-8"))
    except (FileNotFoundError, json.JSONDecodeError):
        return {}


def save(book):
    tmp = PATH.with_suffix(".tmp")
    tmp.write_text(json.dumps(book, indent=2), encoding="utf-8")
    for _ in range(20):          # Windows: retry if the dashboard is reading the file right now
        try:
            os.replace(tmp, PATH)
            return
        except PermissionError:
            time.sleep(0.05)


def lookup(domain, key):
    """Returns the list of fixes that solved this symptom before, or None."""
    entry = load().get(f"{domain}:{key}")
    if entry and entry["successes"] > 0:
        return entry["fixes"]
    return None


def record_success(domain, key, fixes, recovery_ticks, round_no):
    book = load()
    e = book.setdefault(f"{domain}:{key}", {"domain": domain, "symptom": key, "fixes": fixes, "successes": 0,
                                            "failed_fixes": {}, "avg_recovery_ticks": None, "last_round": None})
    e["fixes"] = fixes
    e["successes"] += 1
    prev = e["avg_recovery_ticks"]
    e["avg_recovery_ticks"] = recovery_ticks if prev is None else round(0.7 * prev + 0.3 * recovery_ticks, 1)
    e["last_round"] = round_no
    save(book)


def record_failure(domain, key, fix):
    book = load()
    e = book.setdefault(f"{domain}:{key}", {"domain": domain, "symptom": key, "fixes": [], "successes": 0,
                                            "failed_fixes": {}, "avg_recovery_ticks": None, "last_round": None})
    e["failed_fixes"][fix] = e["failed_fixes"].get(fix, 0) + 1
    save(book)


def prune(domain, fixes_to_drop):
    """ORACLE said these fixes were unnecessary: drop them from recipes that still work without them."""
    book, changed = load(), []
    for key, e in book.items():
        if e["domain"] != domain:
            continue
        keep = [f for f in e["fixes"] if f not in fixes_to_drop]
        if keep and keep != e["fixes"]:
            changed.append((e["symptom"], [f for f in e["fixes"] if f in fixes_to_drop]))
            e["fixes"] = keep
    if changed:
        save(book)
    return changed


def clear():
    save({})
