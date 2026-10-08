"""ORACLE · safety controller agent. Validates every ROGUE proposal before any chaos is allowed to run.

  rogue.proposal  ->  policy check  ->  oracle.verdict (approved / blocked, checks, safer alternative)

Run: python -m oracle.safety
"""
import domains
from oracle import policy
from shared import bus, names


def main():
    print(f"[oracle] safety controller online · policy {policy.POLICY}", flush=True)
    for _, p in bus.subscribe(names.ROGUE_PROPOSAL):
        D = domains.get(p["domain"])
        verdict = policy.evaluate(D, p["attacks"])
        bus.publish(names.ORACLE_VERDICT, {"round": p["round"], "domain": p["domain"], "t": p.get("t"),
                                           "proposal_id": p["id"], "attacks": p["attacks"], "test": p.get("test", False),
                                           **verdict})
        print(f"[oracle] r{p['round']} {p['attacks']} -> {'APPROVED' if verdict['approved'] else 'BLOCKED'}",
              flush=True)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        pass
