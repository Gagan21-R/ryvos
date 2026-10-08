"""Prints every message on the bus (except the noisy city.state). Run: python -m tests.listen"""
from shared import bus, names

print("Redis ping:", bus.ping())
print("Listening on all channels... (Ctrl+C to stop)")
for channel, msg in bus.subscribe(*names.ALL_CHANNELS):
    if channel == names.CITY_STATE:
        continue
    print(f"[{channel}] {msg}")
