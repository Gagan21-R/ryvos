"""The contract: channel names and the allowed attacks/fixes. Every system imports these."""

CITY_STATE = "city.state"          # snapshot of the twin every tick
CITY_EVENTS = "city.events"        # call created, dispatched, arrived...
RED_ATTACK = "red.attack"          # red team launches an attack
BLUE_ALERT = "blue.alert"          # monitor saw a problem
BLUE_DIAGNOSIS = "blue.diagnosis"  # diagnoser's root cause
BLUE_FIX = "blue.fix"              # fixer applies a fix
ROUND_RESULT = "round.result"      # referee's scores
ROUND_REPORT = "round.report"      # postmortem text

# Extra channels (not in the original contract)
CONTROL = "arena.control"          # dashboard -> agents: pause/resume, domain, scenario, start_round, safety_test...
ROGUE_PROPOSAL = "rogue.proposal"  # ROGUE proposes an experiment (target, severity, blast radius, rationale)
ORACLE_VERDICT = "oracle.verdict"  # ORACLE's safety decision on a proposal (approved / blocked + why)
AGENT_SAY = "agent.say"            # short lines the characters say (reflections, reactions)

# Original contract = the 108 emergency domain
ATTACKS = ["freeze_gps", "stale_beds", "kill_sms", "call_surge", "slow_dispatch"]
FIXES = ["distrust_gps", "skip_stale_hospitals", "backup_sms", "surge_mode", "restart_dispatch"]

# The arena can attack 3 different systems ("domains"). Each has its own whitelist.
DOMAINS = {
    "emergency": {"attacks": ATTACKS, "fixes": FIXES},
    "food": {"attacks": ["heavy_rain", "tablet_offline", "maps_slow", "festival_surge", "coverage_drift"],
             "fixes": ["reassign_riders", "batch_orders", "phone_restaurants", "cached_routes",
                       "extend_eta_notify", "restore_zone_config"]},
    "upi": {"attacks": ["bank_slow", "diwali_spike", "duplicate_storm", "fraud_bot_burst"],
            "fixes": ["route_to_healthy_bank", "queue_rate_limit", "idempotency_check", "throttle_bot"]},
}

ALL_CHANNELS = [CITY_STATE, CITY_EVENTS, RED_ATTACK, BLUE_ALERT, BLUE_DIAGNOSIS,
                BLUE_FIX, ROUND_RESULT, ROUND_REPORT, CONTROL, ROGUE_PROPOSAL, ORACLE_VERDICT, AGENT_SAY]
