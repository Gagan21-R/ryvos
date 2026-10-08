"""Sends one test message. Run: python -m tests.send"""
from shared import bus, names

bus.publish(names.RED_ATTACK, {"round": 1, "attack": "freeze_gps", "target": ["amb_3", "amb_7"]})
print("Sent a test attack!")
