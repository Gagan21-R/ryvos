"""A tiny Redis-compatible pub/sub server in pure Python.

Use this when you can't run real Redis (no Docker, no admin rights).
It speaks the real Redis protocol (RESP2 and RESP3), so the normal `redis` Python client
works unchanged. Supports: HELLO, PING, PUBLISH, SUBSCRIBE, UNSUBSCRIBE, GET, SET,
and answers OK to anything else (CLIENT SETINFO, SELECT, ...).

Run:  python -m tools.redis_server        (listens on localhost:6379)
"""
import asyncio
import itertools
import os

subscribers = {}   # channel -> {writer: uses_resp3}
store = {}         # tiny key/value store for GET/SET
client_ids = itertools.count(1)


def bulk(b):
    return b"$%d\r\n%s\r\n" % (len(b), b)


def encode(value):
    if isinstance(value, int):
        return b":%d\r\n" % value
    if isinstance(value, list):
        return b"*%d\r\n" % len(value) + b"".join(encode(v) for v in value)
    return bulk(value)


def push(items, resp3):
    """Pub/sub replies are 'push' messages (>) in RESP3 and plain arrays (*) in RESP2."""
    return (b">" if resp3 else b"*") + b"%d\r\n" % len(items) + b"".join(encode(i) for i in items)


def hello_reply(proto, client_id):
    info = [b"server", b"redis", b"version", b"7.2.0", b"proto", proto, b"id", client_id,
            b"mode", b"standalone", b"role", b"master", b"modules", []]
    if proto == 3:
        return b"%%%d\r\n" % (len(info) // 2) + b"".join(encode(v) for v in info)
    return encode(info)


async def read_command(reader):
    line = await reader.readline()
    if not line:
        return None
    if line.startswith(b"*"):
        args = []
        for _ in range(int(line[1:])):
            size = int((await reader.readline())[1:])
            args.append((await reader.readexactly(size + 2))[:-2])
        return args
    return line.split()   # "inline" command, e.g. typed in telnet


async def handle(reader, writer):
    my_channels = set()
    resp3 = False
    client_id = next(client_ids)
    try:
        while True:
            cmd = await read_command(reader)
            if cmd is None:
                break
            if not cmd:
                continue
            name, args = cmd[0].upper(), cmd[1:]
            if name == b"HELLO":
                proto = int(args[0]) if args else 2
                resp3 = proto == 3
                writer.write(hello_reply(proto, client_id))
            elif name == b"PING":
                if my_channels and not resp3:
                    writer.write(encode([b"pong", b""]))
                else:
                    writer.write(b"+PONG\r\n")
            elif name == b"PUBLISH":
                channel, msg = args[0], args[1]
                receivers = list(subscribers.get(channel, {}).items())
                for w, w_resp3 in receivers:
                    w.write(push([b"message", channel, msg], w_resp3))
                writer.write(b":%d\r\n" % len(receivers))
            elif name == b"SUBSCRIBE":
                for ch in args:
                    subscribers.setdefault(ch, {})[writer] = resp3
                    my_channels.add(ch)
                    writer.write(push([b"subscribe", ch, len(my_channels)], resp3))
            elif name == b"UNSUBSCRIBE":
                for ch in (args or list(my_channels)):
                    subscribers.get(ch, {}).pop(writer, None)
                    my_channels.discard(ch)
                    writer.write(push([b"unsubscribe", ch, len(my_channels)], resp3))
            elif name == b"GET":
                value = store.get(args[0])
                writer.write(bulk(value) if value is not None else (b"_\r\n" if resp3 else b"$-1\r\n"))
            elif name == b"SET":
                store[args[0]] = args[1]
                writer.write(b"+OK\r\n")
            elif name == b"QUIT":
                writer.write(b"+OK\r\n")
                break
            else:   # CLIENT SETINFO, SELECT, ... -> just say OK
                writer.write(b"+OK\r\n")
            await writer.drain()
    except (ConnectionError, asyncio.IncompleteReadError):
        pass
    finally:
        for ch in my_channels:
            subscribers.get(ch, {}).pop(writer, None)
        writer.close()


async def main(port):
    server = await asyncio.start_server(handle, "127.0.0.1", port)
    print(f"[redis] mini Redis pub/sub server listening on localhost:{port}", flush=True)
    async with server:
        await server.serve_forever()


if __name__ == "__main__":
    try:
        asyncio.run(main(int(os.getenv("CBA_REDIS_PORT", "6379"))))
    except KeyboardInterrupt:
        pass
