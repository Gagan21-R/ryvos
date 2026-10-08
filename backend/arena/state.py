"""Read-only access to what the arena agents publish (the recorder keeps these files current)."""
import json
from pathlib import Path

from shared import config

DATA = config.DATA_DIR


class FileCache:
    """Re-reads a JSON file only when it changed on disk."""

    def __init__(self, path: Path, default):
        self.path, self.default, self.mtime, self.value = path, default, None, default

    def get(self):
        try:
            m = self.path.stat().st_mtime
            if m != self.mtime:
                self.value, self.mtime = json.loads(self.path.read_text(encoding="utf-8")), m
        except FileNotFoundError:
            self.value, self.mtime = self.default, None
        except (OSError, json.JSONDecodeError):
            pass                                  # mid-write: keep the previous value
        return self.value


live = FileCache(DATA / "live.json", {})
learn = FileCache(DATA / "learn.json", {"results": [], "reports": [], "verdicts": []})
playbook = FileCache(DATA / "playbook.json", {})
brain = FileCache(DATA / "red_brain.json", {})


def snapshot():
    """Everything the chat assistant and the API need, in one dict."""
    return {"live": live.get(), "learn": learn.get(), "playbook": playbook.get(), "brain": brain.get()}
