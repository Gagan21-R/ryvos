"""Shared settings. Change speed with env vars, e.g. CBA_TICK_SEC=0.05 for fast runs."""
import os
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = ROOT / "data"
DATA_DIR.mkdir(exist_ok=True)

TICK_SEC = float(os.getenv("CBA_TICK_SEC", "0.3"))    # real seconds per simulation tick
MAX_ROUNDS = int(os.getenv("CBA_MAX_ROUNDS", "0"))     # 0 = run forever
SEED = int(os.getenv("CBA_SEED", "7"))
DOMAIN = os.getenv("CBA_DOMAIN", "emergency")          # emergency | food | upi | all (rotate)

# Blue team timing (in ticks)
CONFIRM_TICKS = 2       # Monitor: a symptom must be seen this many ticks in a row
INVESTIGATE_TICKS = 3   # Diagnoser: time spent investigating when the playbook has no answer
VERIFY_TICKS = 5        # Diagnoser: wait this long for a fix to work before trying the next one
