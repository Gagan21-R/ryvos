// 3D scenes. Every builder receives the Scene3D context and returns { update(t, dt), recolor(pal), dispose? }.
// Colours always come from the active theme palette: ink for structure, orange for failure, green for recovery.
import * as THREE from "three";

const V = (x, y, z) => new THREE.Vector3(x, y, z);
const PH = [{ id: "steady", s: 2.2 }, { id: "inject", s: 1.7 }, { id: "detect", s: 1.5 }, { id: "recover", s: 1.9 }];

function rng(seed) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) / 2147483647);
}

function lineMat(color, opacity = 1) {
  return new THREE.LineBasicMaterial({ color, transparent: opacity < 1, opacity });
}

function fibonacciSphere(n, r) {
  const pts = [];
  const g = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2, rad = Math.sqrt(1 - y * y), th = g * i;
    pts.push(V(Math.cos(th) * rad * r, y * r, Math.sin(th) * rad * r));
  }
  return pts;
}

function ring(color) {
  const m = new THREE.Mesh(new THREE.RingGeometry(0.98, 1, 48), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false }));
  return m;
}

// A small "failure → detect → recover" clock shared by the storytelling scenes.
function incidentClock(onPhase) {
  let i = 0, start = 0;
  return (t) => {
    let k = (t - start) / PH[i].s;
    if (k >= 1) {
      i = (i + 1) % PH.length;
      start = t;
      k = 0;
      onPhase?.(PH[i].id);
    }
    return { phase: PH[i].id, k };
  };
}

/* ============================================================ landing: resilience globe */
export function globe({ onEvent } = {}) {
  return (ctx) => {
    const { scene, camera } = ctx;
    camera.position.set(0, 0.3, 12.5);
    const R = 3;
    const r = rng(7);
    const root = new THREE.Group();
    root.rotation.set(0.35, 0, 0.08);
    scene.add(root);

    const dotsGeo = new THREE.BufferGeometry().setFromPoints(fibonacciSphere(1400, R));
    const dots = new THREE.Points(dotsGeo, new THREE.PointsMaterial({ size: 0.028, transparent: true, opacity: 0.45, sizeAttenuation: true }));
    root.add(dots);

    const rings = [];
    for (let k = 0; k < 3; k++) {
      const c = new THREE.EllipseCurve(0, 0, R * 1.001, R * 1.001).getPoints(128);
      const l = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(c), lineMat(0xffffff, 0.12));
      l.rotation.set(k === 0 ? Math.PI / 2 : 0, k * (Math.PI / 3), 0);
      root.add(l);
      rings.push(l);
    }

    const all = fibonacciSphere(60, R);
    const nodes = [];
    for (let i = 0; i < 16; i++) {
      const p = all[Math.floor(r() * all.length)];
      if (nodes.some((n) => n.p.distanceTo(p) < 0.9)) continue;
      const m = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 12), new THREE.MeshBasicMaterial());
      m.position.copy(p);
      root.add(m);
      nodes.push({ p, m });
    }
    const arcs = [];
    nodes.forEach((a, i) => {
      nodes.map((b, j) => ({ j, d: a.p.distanceTo(b.p) })).filter((o) => o.j !== i).sort((x, y) => x.d - y.d).slice(0, 2).forEach(({ j }) => {
        if (arcs.some((e) => (e.a === j && e.b === i))) return;
        const b = nodes[j];
        const mid = a.p.clone().add(b.p).multiplyScalar(0.5).normalize().multiplyScalar(R * (1.18 + a.p.distanceTo(b.p) * 0.08));
        const curve = new THREE.QuadraticBezierCurve3(a.p, mid, b.p);
        const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(48)), lineMat(0xffffff, 0.35));
        root.add(line);
        arcs.push({ a: i, b: j, curve, line });
      });
    });
    const NP = 40;
    const pkGeo = new THREE.BufferGeometry();
    pkGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(NP * 3), 3));
    const packets = new THREE.Points(pkGeo, new THREE.PointsMaterial({ size: 0.09, sizeAttenuation: true }));
    root.add(packets);
    const pk = Array.from({ length: NP }, () => ({ arc: Math.floor(r() * arcs.length), t: r(), v: 0.15 + r() * 0.25, dir: r() < 0.5 }));

    const shock = [ring(0xffffff), ring(0xffffff), ring(0xffffff)];
    shock.forEach((s) => root.add(s));
    const halo = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 16), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 }));
    root.add(halo);

    let target = 0, exp = 14;
    const clock = incidentClock((ph) => {
      if (ph === "inject") { target = Math.floor(r() * nodes.length); exp += 1; }
      onEvent?.(ph, exp);
    });
    let pal = ctx.pal;
    const C = {};
    const recolor = (p) => {
      pal = p;
      C.ink = new THREE.Color(p.ink); C.bad = new THREE.Color(p.bad); C.ok = new THREE.Color(p.ok); C.mute = new THREE.Color(p.muted);
      dots.material.color.copy(C.mute);
      rings.forEach((l) => l.material.color.copy(C.ink));
      packets.material.color.copy(C.ink);
    };
    recolor(pal);
    const orient = (mesh, p, s) => {
      mesh.position.copy(p).multiplyScalar(1.003);
      mesh.quaternion.setFromUnitVectors(V(0, 0, 1), p.clone().normalize());
      mesh.scale.setScalar(s);
    };

    return {
      recolor,
      update(t, dt) {
        root.rotation.y += dt * 0.11;
        root.rotation.x += ((0.35 + ctx.mouse.y * 0.18) - root.rotation.x) * 0.04;
        root.rotation.z += ((0.08 - ctx.mouse.x * 0.1) - root.rotation.z) * 0.04;
        const { phase, k } = clock(t);
        const failing = phase === "inject" || phase === "detect";
        nodes.forEach((n, i) => {
          const isT = i === target;
          n.m.material.color.copy(isT && failing ? C.bad : isT && phase === "recover" ? C.ok : C.ink);
          n.m.scale.setScalar(isT && failing ? 1.6 + Math.sin(t * 14) * 0.25 : isT && phase === "recover" ? 1.6 - k * 0.6 : 1);
        });
        arcs.forEach((e) => {
          const hit = e.a === target || e.b === target;
          e.line.material.color.copy(hit && failing ? C.bad : hit && phase === "recover" ? C.ok : C.ink);
          e.line.material.opacity = hit && (failing || phase === "recover") ? 0.9 : 0.28;
        });
        const pos = pkGeo.attributes.position.array;
        pk.forEach((p, i) => {
          p.t += p.v * dt;
          const e = arcs[p.arc];
          const toT = (p.dir ? e.b : e.a) === target;
          if (p.t >= 1 || (failing && toT && p.t > 0.85)) { p.arc = Math.floor(r() * arcs.length); p.t = 0; p.dir = r() < 0.5; }
          const q = arcs[p.arc].curve.getPoint(p.dir ? p.t : 1 - p.t);
          pos[i * 3] = q.x; pos[i * 3 + 1] = q.y; pos[i * 3 + 2] = q.z;
        });
        pkGeo.attributes.position.needsUpdate = true;
        const tp = nodes[target].p;
        shock.forEach((s, j) => {
          let o = 0, sc = 0.01;
          if (phase === "inject" && j === 0) { sc = 0.15 + k * 0.9; o = 0.9 * (1 - k); s.material.color.copy(C.bad); }
          if (phase === "detect") { const q = (k * 1.4 + j / 3) % 1; sc = 0.12 + q * 0.75; o = 0.7 * (1 - q); s.material.color.copy(C.ink); }
          if (phase === "recover" && j === 0) { sc = 0.15 + k * 1.4; o = 0.85 * (1 - k); s.material.color.copy(C.ok); }
          orient(s, tp, sc);
          s.material.opacity = o;
        });
        halo.position.copy(tp);
        halo.material.color.copy(phase === "recover" ? C.ok : C.bad);
        halo.material.opacity = failing ? 0.35 + Math.sin(t * 10) * 0.15 : phase === "recover" ? 0.4 * (1 - k) : 0;
        halo.scale.setScalar(failing ? 1.4 : 1 + k);
      },
    };
  };
}

/* ============================================================ arena: live service topology in 3D */
export function topology(getTopo) {
  return (ctx) => {
    const { scene, camera } = ctx;
    camera.position.set(0, 1.2, 8.2);
    camera.lookAt(0, 0, 0);
    const root = new THREE.Group();
    scene.add(root);
    let key = "", items = [], edges = [], C = {};
    const r = rng(3);
    const pkGeo = new THREE.BufferGeometry();
    pkGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(60 * 3), 3));
    const packets = new THREE.Points(pkGeo, new THREE.PointsMaterial({ size: 0.11 }));
    scene.add(packets);
    let pk = [];

    const recolor = (p) => {
      C = { ink: new THREE.Color(p.ink), bad: new THREE.Color(p.bad), ok: new THREE.Color(p.ok), mute: new THREE.Color(p.lineStrong), warn: new THREE.Color(p.warn) };
      packets.material.color.copy(C.ink);
    };
    recolor(ctx.pal);

    const free = (o) => o.traverse((x) => { x.geometry?.dispose?.(); x.material?.dispose?.(); });
    function rebuild(topo) {
      free(root);
      root.clear();
      items = []; edges = [];
      const { nodes, edges: E } = topo;
      const depth = Object.fromEntries(nodes.map((n) => [n.id, 0]));
      for (let i = 0; i < nodes.length; i++) for (const [a, b] of E) depth[b] = Math.max(depth[b], depth[a] + 1);
      const cols = {};
      nodes.forEach((n) => (cols[depth[n.id]] = [...(cols[depth[n.id]] || []), n]));
      const nc = Object.keys(cols).length;
      const pos = {};
      Object.entries(cols).forEach(([d, list]) => list.forEach((n, i) => {
        pos[n.id] = V((d - (nc - 1) / 2) * 3.2, ((list.length - 1) / 2 - i) * 1.5, (r() - 0.5) * 1.6);
      }));
      nodes.forEach((n) => {
        const g = new THREE.BoxGeometry(1.5, 0.8, 0.8);
        const box = new THREE.LineSegments(new THREE.EdgesGeometry(g), lineMat(0xffffff));
        const fill = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.08, depthWrite: false }));
        box.position.copy(pos[n.id]); fill.position.copy(pos[n.id]);
        root.add(box, fill);
        items.push({ id: n.id, box, fill, p: pos[n.id] });
      });
      E.forEach(([a, b]) => {
        const A = pos[a], B = pos[b];
        const mid = A.clone().add(B).multiplyScalar(0.5).add(V(0, 0, 1.2));
        const curve = new THREE.QuadraticBezierCurve3(A, mid, B);
        const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(32)), lineMat(0xffffff, 0.5));
        root.add(line);
        edges.push({ a, b, curve, line });
      });
      pk = Array.from({ length: 60 }, () => ({ e: Math.floor(r() * Math.max(1, edges.length)), t: r(), v: 0.3 + r() * 0.4 }));
    }

    return {
      recolor,
      update(t, dt) {
        const topo = getTopo();
        if (!topo?.nodes?.length) return;
        const k = topo.nodes.map((n) => n.id).join(",");
        if (k !== key) { key = k; rebuild(topo); }
        const st = Object.fromEntries(topo.nodes.map((n) => [n.id, n.status]));
        items.forEach((it) => {
          const s = st[it.id];
          const c = s === "degraded" ? C.bad : s === "mitigated" ? C.ok : s === "strained" ? C.warn : C.ink;
          it.box.material.color.copy(c);
          it.fill.material.color.copy(c);
          it.fill.material.opacity = s === "degraded" ? 0.18 + Math.sin(t * 8) * 0.08 : s === "mitigated" ? 0.14 : 0.05;
          const sc = s === "degraded" ? 1.06 + Math.sin(t * 8) * 0.04 : 1;
          it.box.scale.setScalar(sc); it.fill.scale.setScalar(sc);
        });
        edges.forEach((e) => {
          const hot = st[e.a] === "degraded" || st[e.b] === "degraded";
          e.line.material.color.copy(hot ? C.bad : C.mute);
          e.line.material.opacity = hot ? 0.95 : 0.6;
        });
        const pos = pkGeo.attributes.position.array;
        pk.forEach((p, i) => {
          if (!edges.length) return;
          const e = edges[p.e % edges.length];
          const hot = st[e.b] === "degraded";
          p.t += p.v * dt * (hot ? 0.25 : 1);
          if (p.t >= 1) { p.t = 0; p.e = Math.floor(r() * edges.length); }
          const q = e.curve.getPoint(p.t).applyMatrix4(root.matrixWorld);
          pos[i * 3] = q.x; pos[i * 3 + 1] = q.y; pos[i * 3 + 2] = q.z;
        });
        pkGeo.attributes.position.needsUpdate = true;
        root.rotation.y = Math.sin(t * 0.25) * 0.35 + ctx.mouse.x * 0.25;
        root.rotation.x = 0.18 + ctx.mouse.y * 0.12;
        root.updateMatrixWorld();
      },
    };
  };
}

/* ============================================================ real data: waterfall surface of a real NAB series */
export function terrain(getSeries) {
  return (ctx) => {
    const { scene, camera } = ctx;
    camera.position.set(0, 4.2, 9.5);
    camera.lookAt(0, -0.4, 0);
    const ROWS = 30, COLS = 140;
    const root = new THREE.Group();
    scene.add(root);
    const lines = [];
    for (let rI = 0; rI < ROWS; rI++) {
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(COLS * 3), 3));
      g.setAttribute("color", new THREE.BufferAttribute(new Float32Array(COLS * 3), 3));
      const l = new THREE.Line(g, new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.35 + 0.65 * (rI / ROWS) }));
      root.add(l);
      lines.push(l);
    }
    let vals = null, C = {};
    const recolor = (p) => { C = { lo: new THREE.Color(p.lineStrong), mid: new THREE.Color(p.ink2), hi: new THREE.Color(p.bad) }; };
    recolor(ctx.pal);
    const tmp = new THREE.Color();
    return {
      recolor,
      update(t) {
        const s = getSeries();
        if (!vals && s?.points?.length) {
          const v = s.points.map((p) => p.v);
          const lo = Math.min(...v), hi = Math.max(...v);
          vals = v.map((x) => (x - lo) / (hi - lo || 1));
        }
        if (!vals) return;
        const n = vals.length, off = Math.floor(t * 9);
        lines.forEach((l, rI) => {
          const pos = l.geometry.attributes.position.array, col = l.geometry.attributes.color.array;
          const start = (off + rI * 11) % n;
          for (let c = 0; c < COLS; c++) {
            const v = vals[(start + c * 3) % n];
            pos[c * 3] = (c / (COLS - 1) - 0.5) * 11;
            pos[c * 3 + 1] = v * 2.4 - 1.2;
            pos[c * 3 + 2] = (rI / (ROWS - 1) - 0.5) * 7;
            if (v > 0.7) tmp.copy(C.mid).lerp(C.hi, (v - 0.7) / 0.3); else tmp.copy(C.lo).lerp(C.mid, v / 0.7);
            col[c * 3] = tmp.r; col[c * 3 + 1] = tmp.g; col[c * 3 + 2] = tmp.b;
          }
          l.geometry.attributes.position.needsUpdate = true;
          l.geometry.attributes.color.needsUpdate = true;
        });
        root.rotation.y = -0.25 + ctx.mouse.x * 0.2;
        root.rotation.x = ctx.mouse.y * 0.06;
      },
    };
  };
}

/* ============================================================ metrics: resilience towers (3 systems × recent rounds) */
export function towers(getRows) {
  return (ctx) => {
    const { scene, camera } = ctx;
    camera.position.set(6.5, 5.5, 10);
    camera.lookAt(0, 0.6, 0);
    const root = new THREE.Group();
    scene.add(root);
    let key = "", bars = [], C = {}, born = 0;
    const recolor = (p) => { C = { ink: new THREE.Color(p.ink), ok: new THREE.Color(p.ok), bad: new THREE.Color(p.bad), warn: new THREE.Color(p.warn), line: new THREE.Color(p.lineStrong) }; };
    recolor(ctx.pal);
    const grid = new THREE.GridHelper(12, 24);
    grid.material.vertexColors = false; grid.material.transparent = true; grid.material.opacity = 0.35;
    root.add(grid);
    return {
      recolor,
      update(t) {
        const rows = getRows();
        const k = rows.map((r) => r.length + ":" + (r[r.length - 1] ?? "")).join("|");
        if (k !== key && rows.some((r) => r.length)) {
          key = k; born = t;
          bars.forEach((b) => { root.remove(b.edge, b.cap); [b.edge, b.cap].forEach((o) => { o.geometry.dispose(); o.material.dispose(); }); });
          bars = [];
          rows.forEach((row, ri) => row.slice(-20).forEach((v, ci, arr) => {
            const h = Math.max(0.05, (v / 100) * 3.2);
            const g = new THREE.BoxGeometry(0.34, h, 0.34);
            g.translate(0, h / 2, 0);
            const edge = new THREE.LineSegments(new THREE.EdgesGeometry(g), lineMat(0xffffff, 0.75));
            const cap = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.06, 0.34), new THREE.MeshBasicMaterial());
            const x = (ci - (arr.length - 1) / 2) * 0.48, z = (ri - 1) * 1.6;
            edge.position.set(x, 0, z); cap.position.set(x, h, z);
            root.add(edge, cap);
            bars.push({ edge, cap, h, v, delay: ci * 0.03 + ri * 0.12 });
          }));
        }
        grid.material.color.copy(C.line);
        bars.forEach((b) => {
          const q = Math.min(1, Math.max(0, (t - born - b.delay) / 1.2));
          const e = 1 - Math.pow(1 - q, 4);
          b.edge.scale.y = Math.max(0.001, e);
          b.cap.position.y = b.h * e;
          b.edge.material.color.copy(C.ink);
          b.cap.material.color.copy(b.v >= 80 ? C.ok : b.v >= 60 ? C.warn : C.bad);
        });
        root.rotation.y = t * 0.12 + ctx.mouse.x * 0.3;
      },
    };
  };
}

/* ============================================================ agents: ROGUE, AEGIS, ORACLE */
export function agents() {
  return (ctx) => {
    const { scene, camera } = ctx;
    camera.position.set(0, 0.6, 9);
    const root = new THREE.Group();
    scene.add(root);
    const shapes = [
      { key: "bad", geo: new THREE.IcosahedronGeometry(1.05, 1) },
      { key: "ok", geo: new THREE.TorusGeometry(0.85, 0.28, 10, 36) },
      { key: "ink", geo: new THREE.OctahedronGeometry(1.1, 0) },
    ].map((s, i) => {
      const m = new THREE.LineSegments(new THREE.WireframeGeometry(s.geo), lineMat(0xffffff, 0.9));
      root.add(m);
      return { ...s, m, a: (i / 3) * Math.PI * 2 };
    });
    const bus = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(new THREE.EllipseCurve(0, 0, 2.6, 2.6).getPoints(96).map((p) => V(p.x, 0, p.y))), lineMat(0xffffff, 0.25));
    root.add(bus);
    const pkGeo = new THREE.BufferGeometry();
    pkGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(12 * 3), 3));
    const packets = new THREE.Points(pkGeo, new THREE.PointsMaterial({ size: 0.12 }));
    root.add(packets);
    let C = {};
    const recolor = (p) => {
      C = { bad: new THREE.Color(p.bad), ok: new THREE.Color(p.ok), ink: new THREE.Color(p.ink), mute: new THREE.Color(p.muted) };
      shapes.forEach((s) => s.m.material.color.copy(C[s.key]));
      bus.material.color.copy(C.mute);
      packets.material.color.copy(C.ink);
    };
    recolor(ctx.pal);
    return {
      recolor,
      update(t) {
        shapes.forEach((s, i) => {
          const a = s.a + t * 0.35;
          s.m.position.set(Math.cos(a) * 2.6, Math.sin(t * 1.2 + i) * 0.25, Math.sin(a) * 2.6);
          s.m.rotation.set(t * (0.4 + i * 0.15), t * (0.6 - i * 0.1), 0);
        });
        const pos = pkGeo.attributes.position.array;
        for (let i = 0; i < 12; i++) {
          const a = t * 0.9 + (i / 12) * Math.PI * 2;
          pos[i * 3] = Math.cos(a) * 2.6; pos[i * 3 + 1] = 0; pos[i * 3 + 2] = Math.sin(a) * 2.6;
        }
        pkGeo.attributes.position.needsUpdate = true;
        root.rotation.x = 0.35 + ctx.mouse.y * 0.15;
        root.rotation.z = ctx.mouse.x * -0.1;
      },
    };
  };
}

/* ============================================================ safety: the ORACLE dome deflects destructive experiments */
export function shield(getBlockedRatio) {
  return (ctx) => {
    const { scene, camera } = ctx;
    camera.position.set(0, 2.2, 9);
    camera.lookAt(0, 0.4, 0);
    const root = new THREE.Group();
    scene.add(root);
    const R = 2.4;
    const dome = new THREE.LineSegments(new THREE.WireframeGeometry(new THREE.SphereGeometry(R, 28, 12, 0, Math.PI * 2, 0, Math.PI / 2)), lineMat(0xffffff, 0.3));
    root.add(dome);
    const base = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(new THREE.EllipseCurve(0, 0, R * 1.5, R * 1.5).getPoints(96).map((p) => V(p.x, 0, p.y))), lineMat(0xffffff, 0.2));
    root.add(base);
    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.42, 0), new THREE.MeshBasicMaterial({ wireframe: true }));
    core.position.y = 0.5;
    root.add(core);
    const N = 26, r = rng(5);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(N * 3), 3));
    geo.setAttribute("color", new THREE.BufferAttribute(new Float32Array(N * 3), 3));
    const pts = new THREE.Points(geo, new THREE.PointsMaterial({ size: 0.14, vertexColors: true }));
    root.add(pts);
    const flashes = [ring(0xffffff), ring(0xffffff), ring(0xffffff)];
    flashes.forEach((f) => root.add(f));
    let fi = 0;
    const spawn = (p) => {
      const th = r() * Math.PI * 2, ph = 0.15 + r() * 1.1;
      p.dir = V(Math.cos(th) * Math.cos(ph), Math.sin(ph), Math.sin(th) * Math.cos(ph));
      p.d = 6 + r() * 3; p.v = 2.2 + r() * 1.2; p.blocked = r() < Math.max(0.25, getBlockedRatio()); p.back = false;
    };
    const P = Array.from({ length: N }, () => { const p = {}; spawn(p); p.d = 3 + r() * 6; return p; });
    let C = {};
    const recolor = (p) => {
      C = { ink: new THREE.Color(p.ink), bad: new THREE.Color(p.bad), ok: new THREE.Color(p.ok), mute: new THREE.Color(p.muted) };
      dome.material.color.copy(C.ink); base.material.color.copy(C.mute); core.material.color.copy(C.ok);
    };
    recolor(ctx.pal);
    return {
      recolor,
      update(t, dt) {
        const pos = geo.attributes.position.array, col = geo.attributes.color.array;
        P.forEach((p, i) => {
          p.d += (p.back ? 1 : -1) * p.v * dt;
          if (p.blocked && !p.back && p.d <= R) {
            p.back = true;
            const f = flashes[fi++ % flashes.length];
            f.position.copy(p.dir).multiplyScalar(R);
            f.quaternion.setFromUnitVectors(V(0, 0, 1), p.dir);
            f.userData.t = t;
          }
          if ((!p.blocked && p.d <= 0.5) || p.d > 9.5) spawn(p);
          const q = p.dir.clone().multiplyScalar(Math.max(0.5, p.d));
          pos[i * 3] = q.x; pos[i * 3 + 1] = q.y + (p.blocked ? 0 : 0.5 * (1 - p.d / 9)); pos[i * 3 + 2] = q.z;
          const c = p.blocked ? C.bad : C.ok;
          col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
        });
        geo.attributes.position.needsUpdate = true;
        geo.attributes.color.needsUpdate = true;
        flashes.forEach((f) => {
          const k = Math.min(1, (t - (f.userData.t ?? -9)) / 0.6);
          f.scale.setScalar(0.1 + k * 0.8);
          f.material.opacity = 0.9 * (1 - k);
          f.material.color.copy(C.bad);
        });
        core.rotation.set(t * 0.6, t * 0.8, 0);
        root.rotation.y = t * 0.15 + ctx.mouse.x * 0.3;
        root.rotation.x = ctx.mouse.y * 0.1;
      },
    };
  };
}

/* ============================================================ default: a rotating core (shape per page) */
export function core(shape = "ico") {
  return (ctx) => {
    const { scene, camera } = ctx;
    camera.position.set(0, 0, 9);
    const root = new THREE.Group();
    scene.add(root);
    let main;
    if (shape === "knot") main = new THREE.LineSegments(new THREE.WireframeGeometry(new THREE.TorusKnotGeometry(1.4, 0.38, 90, 8)), lineMat(0xffffff, 0.55));
    else if (shape === "cubes") {
      main = new THREE.Group();
      for (let x = -1; x <= 1; x++) for (let y = -1; y <= 1; y++) for (let z = -1; z <= 1; z++) {
        const c = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(0.62, 0.62, 0.62)), lineMat(0xffffff, 0.7));
        c.position.set(x * 0.95, y * 0.95, z * 0.95);
        c.userData.base = c.position.clone();
        main.add(c);
      }
    } else if (shape === "cloud") {
      const r = rng(13), pts = Array.from({ length: 70 }, () => V((r() - 0.5) * 4.4, (r() - 0.5) * 3, (r() - 0.5) * 3));
      main = new THREE.Group();
      main.add(new THREE.Points(new THREE.BufferGeometry().setFromPoints(pts), new THREE.PointsMaterial({ size: 0.09 })));
      const seg = [];
      pts.forEach((a, i) => pts.forEach((b, j) => { if (j > i && a.distanceTo(b) < 0.95) seg.push(a, b); }));
      main.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(seg), lineMat(0xffffff, 0.3)));
    } else main = new THREE.LineSegments(new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(1.8, 1)), lineMat(0xffffff, 0.55));
    root.add(main);
    const orbits = [0, 1].map((i) => {
      const l = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(new THREE.EllipseCurve(0, 0, 2.7 + i * 0.5, 2.7 + i * 0.5).getPoints(96).map((p) => V(p.x, 0, p.y))), lineMat(0xffffff, 0.22));
      l.rotation.set(0.5 + i * 0.6, 0, i * 0.4);
      root.add(l);
      return l;
    });
    const sats = [0, 1].map(() => { const m = new THREE.Mesh(new THREE.SphereGeometry(0.08, 10, 10), new THREE.MeshBasicMaterial()); root.add(m); return m; });
    let C = {};
    const paint = (o, c) => o.traverse((x) => x.material?.color?.copy(c));
    const recolor = (p) => {
      C = { ink: new THREE.Color(p.ink), bad: new THREE.Color(p.bad), ok: new THREE.Color(p.ok), mute: new THREE.Color(p.muted) };
      paint(main, C.ink); orbits.forEach((o) => paint(o, C.mute)); sats[0].material.color.copy(C.bad); sats[1].material.color.copy(C.ok);
    };
    recolor(ctx.pal);
    return {
      recolor,
      update(t) {
        main.rotation.set(t * 0.18, t * 0.26, 0);
        if (shape === "cubes") main.children.forEach((c, i) => c.position.copy(c.userData.base).multiplyScalar(1 + Math.max(0, Math.sin(t * 1.2 + i * 0.4)) * 0.25));
        sats.forEach((s, i) => {
          const a = t * (0.8 + i * 0.3) + i * Math.PI, rr = 2.7 + i * 0.5;
          s.position.set(Math.cos(a) * rr, 0, Math.sin(a) * rr).applyEuler(orbits[i].rotation);
        });
        root.rotation.x = ctx.mouse.y * 0.2;
        root.rotation.y = ctx.mouse.x * 0.3;
      },
    };
  };
}
