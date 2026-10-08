"""D · Event bus. Every system talks through Redis pub/sub - nobody calls anybody directly."""
import json
import os

import redis

# 127.0.0.1 instead of "localhost": on Windows "localhost" tries IPv6 first and stalls ~4 s per connection
_r = redis.Redis(host=os.getenv("CBA_REDIS_HOST", "127.0.0.1"),
                 port=int(os.getenv("CBA_REDIS_PORT", "6379")),
                 decode_responses=True)


def publish(channel, message):
    _r.publish(channel, json.dumps(message))


def subscribe(*channels):
    p = _r.pubsub()
    p.subscribe(*channels)
    for m in p.listen():
        if m["type"] == "message":
            yield m["channel"], json.loads(m["data"])


def ping():
    return _r.ping()
