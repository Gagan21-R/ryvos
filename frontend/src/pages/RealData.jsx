// Real-data validation: AEGIS's anomaly detector trained and tested on public, expert-labelled telemetry (NAB),
// plus a live feed of real HTTPS response times scored by the same detector.
import { Download, ExternalLink, Pause, Play, RefreshCw } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  CartesianGrid, ComposedChart, Line, LineChart, ReferenceArea, ReferenceDot, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { CountUp } from "../components/common/motion.jsx";
import { SYSTEMS } from "../components/common/ui.jsx";
import { ANIM, C, axis, tip } from "../components/metrics/Charts.jsx";
import { api } from "../services/api.js";
import { toast } from "../state/arenaStore.js";

const SCENARIO = Object.fromEntries(SYSTEMS.map((s) => [s.id, s.name]));
const fmtDate = (t) => (t ? t.slice(0, 10) : "");

function ResultsTable({ model }) {
  const rows = [
    ["Labelled incidents detected", (s) => `${s.detected} of ${s.incidents}`, (a, b) => b.detected - a.detected],
    ["Alerts raised", (s) => s.alerts.toLocaleString("en-IN"), null],
    ["False alarms", (s) => s.false_alarms.toLocaleString("en-IN"), (a, b) => a.false_alarms - b.false_alarms],
    ["False alarms per day", (s) => s.false_per_day, (a, b) => a.false_per_day - b.false_per_day],
    ["Precision (alerts that were real)", (s) => `${s.precision}%`, (a, b) => b.precision - a.precision],
    ["Recall (incidents caught)", (s) => `${s.recall}%`, (a, b) => b.recall - a.recall],
    ["F1 score", (s) => s.f1, (a, b) => b.f1 - a.f1],
  ];
  const cell = (cmp, a, b) => (cmp ? (cmp(a, b) > 0 ? "better" : cmp(a, b) < 0 ? "worse" : "") : "");
  return (
    <div className="table-wrap">
      <table className="table res-table">
        <thead>
          <tr><th rowSpan={2}>Metric</th><th className="n" colSpan={2}>Test: 7 unseen series, {model.test.trained.incidents} incidents</th><th className="n" colSpan={2}>Train: 17 series, {model.train.trained.incidents} incidents</th></tr>
          <tr><th className="n">Untrained rule</th><th className="n">Trained AEGIS</th><th className="n">Untrained rule</th><th className="n">Trained AEGIS</th></tr>
        </thead>
        <tbody>
          {rows.map(([label, f, cmp]) => (
            <tr key={label}>
              <td>{label}</td>
              <td className="n">{f(model.test.untrained)}</td>
              <td className={`n ${cell(cmp, model.test.untrained, model.test.trained)}`}>{f(model.test.trained)}</td>
              <td className="n">{f(model.train.untrained)}</td>
              <td className={`n ${cell(cmp, model.train.untrained, model.train.trained)}`}>{f(model.train.trained)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SeriesChart({ data, cursor }) {
  const pts = cursor == null ? data.points : data.points.slice(0, cursor + 1);
  const lastI = pts.length ? pts[pts.length - 1].i : -1;
  const alerts = data.alerts.filter((a) => a.i <= lastI);
  const byI = useMemo(() => Object.fromEntries(data.points.map((p) => [p.i, p.t])), [data]);
  const ticks = useMemo(() => {
    const n = data.points.length;
    return Array.from({ length: 6 }, (_, k) => data.points[Math.min(n - 1, Math.round((k * (n - 1)) / 5))]?.i);
  }, [data]);
  const nearest = (i) => byI[i] || data.points.reduce((b, p) => (Math.abs(p.i - i) < Math.abs(b.i - i) ? p : b), data.points[0]).t;
  const max = data.points[data.points.length - 1].i;
  return (
    <div style={{ height: 340 }}>
      <ResponsiveContainer>
        <ComposedChart data={pts} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid stroke={C.grid} vertical={false} />
          <XAxis type="number" dataKey="i" domain={[0, max]} ticks={ticks} tickFormatter={(i) => fmtDate(nearest(i))} {...axis} />
          <YAxis {...axis} width={56} domain={["auto", "auto"]} tickFormatter={(v) => (Math.abs(v) >= 1000 ? `${Math.round(v / 1000)}k` : Math.round(v * 10) / 10)} />
          <Tooltip {...tip} labelFormatter={(i) => nearest(i)} formatter={(v, n) => [v, n === "v" ? "Value" : n]} />
          {data.windows.map((w) => (
            <ReferenceArea key={w.i} x1={w.i} x2={Math.min(w.j, Math.max(w.i, lastI))} fill={w.detected ? C.ok : C.bad} fillOpacity={0.14}
              stroke={w.detected ? C.ok : C.bad} strokeOpacity={0.35} ifOverflow="hidden" />
          ))}
          <Line dataKey="v" name="Value" stroke={C.ink} strokeWidth={1.1} dot={false} isAnimationActive={false} />
          {alerts.map((a) => (
            <ReferenceDot key={a.i} x={a.i} y={a.v} r={a.true ? 5 : 4.5} fill={a.true ? C.ok : C.bad} stroke="#101010" strokeWidth={1.5} ifOverflow="extendDomain" />
          ))}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

function SweepChart({ sweep, trained }) {
  return (
    <div style={{ height: 260 }}>
      <ResponsiveContainer>
        <LineChart data={sweep} margin={{ top: 10, right: 16, left: -12, bottom: 0 }}>
          <CartesianGrid stroke={C.grid} vertical={false} />
          <XAxis dataKey="threshold" {...axis} label={{ value: "alert threshold (robust z-score)", position: "insideBottom", offset: -2, fill: C.muted, fontSize: 11.5 }} height={36} />
          <YAxis {...axis} domain={[0, 100]} unit="%" />
          <Tooltip {...tip} />
          <ReferenceLine x={trained} stroke={C.accent} strokeDasharray="4 4" label={{ value: "learned", fill: C.accent, fontSize: 11.5, position: "top" }} />
          <Line dataKey="recall" name="Recall" stroke={C.aegis} strokeWidth={1.6} dot={{ r: 2.5 }} {...ANIM} />
          <Line dataKey="precision" name="Precision" stroke={C.rogue} strokeWidth={1.6} dot={{ r: 2.5 }} {...ANIM} />
          <Line dataKey="f1" name="F1" stroke={C.ink} strokeWidth={2} dot={{ r: 3 }} {...ANIM} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function LiveProbe() {
  const [live, setLive] = useState(null);
  useEffect(() => {
    let alive = true;
    const load = () => api.realLive().then((d) => alive && setLive(d)).catch(() => {});
    load();
    const t = setInterval(load, 15000);
    return () => { alive = false; clearInterval(t); };
  }, []);
  if (!live) return <div className="empty">Connecting to the live probe.</div>;
  return (
    <>
      <div className="live-grid">
        {live.targets.map((t) => (
          <div className="card" key={t.id}>
            <div className="card-title">
              <div><h3>{t.name}</h3><div className="sub mono" style={{ fontSize: 11.5 }}>{t.url.replace("https://", "")}</div></div>
              <span className={`chip ${t.alerts ? "bad" : "ok"}`}>{t.alerts ? `${t.alerts} alert${t.alerts > 1 ? "s" : ""}` : "Normal"}</span>
            </div>
            <div className="row" style={{ gap: 18, marginBottom: 8 }}>
              <div><div className="big-num" style={{ fontSize: 24 }}>{t.latest_ms ?? "—"}<span className="muted" style={{ fontSize: 13 }}> ms</span></div><div className="muted" style={{ fontSize: 12 }}>latest</div></div>
              <div><div className="big-num" style={{ fontSize: 24 }}>{t.median_ms ?? "—"}<span className="muted" style={{ fontSize: 13 }}> ms</span></div><div className="muted" style={{ fontSize: 12 }}>median</div></div>
              <div><div className="big-num" style={{ fontSize: 24 }}>{t.samples.length}</div><div className="muted" style={{ fontSize: 12 }}>samples</div></div>
            </div>
            <div style={{ height: 120 }}>
              {t.samples.length < 2 ? <div className="empty" style={{ padding: 14 }}>Collecting samples (one every {live.interval_s} s).</div> : (
                <ResponsiveContainer>
                  <LineChart data={t.samples} margin={{ top: 6, right: 6, left: -22, bottom: 0 }}>
                    <CartesianGrid stroke={C.grid} vertical={false} />
                    <XAxis dataKey="ts" {...axis} minTickGap={40} />
                    <YAxis {...axis} />
                    <Tooltip {...tip} formatter={(v) => [`${v} ms`, "Response time"]} />
                    <Line dataKey="ms" stroke={C.ink} strokeWidth={1.3} isAnimationActive={false}
                      dot={(p) => (p.payload.alert ? <circle key={p.index} cx={p.cx} cy={p.cy} r={4} fill={C.bad} /> : <g key={p.index} />)} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        ))}
      </div>
      <p className="footnote" style={{ marginTop: 12 }}>
        Real HTTPS response time from this server to each endpoint, measured every {live.interval_s} s and kept for one hour.
        Each sample is scored by the trained detector (threshold {live.threshold}, {live.persist} points in a row, smoothing {live.alpha});
        its history window is the last {live.window_samples} samples, because live data starts when the server starts. Red points are alerts.
      </p>
    </>
  );
}

export default function RealData() {
  const [model, setModel] = useState(null);
  const [sweep, setSweep] = useState(null);
  const [sel, setSel] = useState("realKnownCause/ec2_request_latency_system_failure");
  const [series, setSeries] = useState(null);
  const [cursor, setCursor] = useState(null);
  const [training, setTraining] = useState(false);
  const timer = useRef(null);

  const loadAll = () => {
    api.realModel().then(setModel).catch((e) => toast(e.message, "bad"));
    api.realSweep().then(setSweep).catch(() => {});
  };
  useEffect(loadAll, []);
  useEffect(() => {
    setSeries(null); setCursor(null); clearInterval(timer.current);
    api.realSeries(sel).then(setSeries).catch((e) => toast(e.message, "bad"));
  }, [sel, model?.trained_at]);
  useEffect(() => () => clearInterval(timer.current), []);

  function replay() {
    if (!series) return;
    if (cursor != null) { clearInterval(timer.current); setCursor(null); return; }
    const n = series.points.length;
    const step = Math.max(1, Math.round(n / 360));
    let c = 0;
    setCursor(0);
    timer.current = setInterval(() => {
      c = Math.min(n - 1, c + step);
      setCursor(c);
      if (c >= n - 1) { clearInterval(timer.current); setTimeout(() => setCursor(null), 800); }
    }, 33);
  }

  async function retrain() {
    setTraining(true);
    try {
      const m = await api.realTrain();
      setModel(m);
      api.realSweep().then(setSweep).catch(() => {});
      toast(`Retrained: ${m.combinations_tried} settings tried in ${m.seconds} s`);
    } catch (e) {
      toast(e.message, "bad");
    } finally {
      setTraining(false);
    }
  }

  const replayStats = useMemo(() => {
    if (!series || cursor == null) return null;
    const lastI = series.points[cursor].i;
    const al = series.alerts.filter((a) => a.i <= lastI);
    return { time: series.points[cursor].t, alerts: al.length, falseAlarms: al.filter((a) => !a.true).length,
      detected: series.windows.filter((w) => al.some((a) => a.i >= w.i && a.i <= w.j)).length };
  }, [series, cursor]);

  const p = model?.params;
  const ordered = model ? [...model.per_series].sort((a, b) => (a.split === b.split ? 0 : a.split === "test" ? -1 : 1)) : [];

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <div className="eyebrow">Real-data validation</div>
          <h1 className="h-page">Is the detector actually working?</h1>
          <p className="lede">
            AEGIS's anomaly detector is trained on real server telemetry and then scored on real incidents it has never seen. Experts labelled
            when each incident happened, so every alert can be checked. Nothing on this page is simulated.
          </p>
        </div>
        <div className="row">
          <a className="btn" href="https://github.com/numenta/NAB" target="_blank" rel="noreferrer"><ExternalLink size={15} /> Dataset source</a>
          <button className="btn primary" onClick={retrain} disabled={training}><RefreshCw size={15} /> {training ? "Training…" : "Retrain model"}</button>
        </div>
      </div>

      {!model ? <div className="empty">Loading the trained model.</div> : (
        <>
          <div className="grid" style={{ gridTemplateColumns: "minmax(0,1fr) minmax(0,1.6fr)" }}>
            <div className="card">
              <div className="card-title"><h3>Dataset</h3><span className="chip">MIT licence</span></div>
              <dl className="kv">
                <dt>Source</dt><dd><a href={model.source.url} target="_blank" rel="noreferrer">{model.source.name}</a></dd>
                <dt>Series</dt><dd>{model.per_series.length} real time series</dd>
                <dt>Labelled incidents</dt><dd>{model.train.trained.incidents + model.test.trained.incidents}, labelled by experts</dd>
                <dt>Train set</dt><dd>17 AWS CloudWatch server metrics (CPU, network, disk, requests)</dd>
                <dt>Test set</dt><dd>7 real failures with a documented cause, never used in training</dd>
                <dt>Trained</dt><dd>{model.trained_at} · {model.combinations_tried.toLocaleString("en-IN")} settings tried in {model.seconds} s</dd>
              </dl>
            </div>
            <div className="card">
              <div className="card-title"><div><h3>How the detector works</h3><div className="sub">Deterministic and explainable: each setting below was learned from the train set</div></div></div>
              <p style={{ margin: "0 0 14px", color: "var(--ink-2)", fontSize: 13.5 }}>
                For each new point it measures how unusual the value is compared with recent history (a robust z-score using the median and
                median absolute deviation), smooths that score, and raises an alert when it stays above a threshold. Training searches every
                combination of the settings and keeps the one with the best F1 on the train set.
              </p>
              <div className="params">
                <div><span>History window</span><b><CountUp value={p.window_h} /> h</b><small>untrained: {model.defaults.window_h} h</small></div>
                <div><span>Threshold</span><b><CountUp value={p.threshold} decimals={1} /></b><small>untrained: {model.defaults.threshold}</small></div>
                <div><span>Points in a row</span><b>{p.persist}</b><small>untrained: {model.defaults.persist}</small></div>
                <div><span>Smoothing (α)</span><b>{p.alpha}</b><small>untrained: {model.defaults.alpha}</small></div>
                <div><span>Cool-down</span><b><CountUp value={p.cooldown_h} /> h</b><small>untrained: {model.defaults.cooldown_h} h</small></div>
              </div>
            </div>
          </div>

          <div className="section-head"><div><h2>Results</h2><p>Untrained rule = a standard 3-sigma alert on an 8-hour window. Green = trained model is better, red = worse.</p></div></div>
          <div className="card flush"><ResultsTable model={model} /></div>
          <p className="footnote" style={{ marginTop: 10 }}>
            An incident counts as detected when at least one alert falls inside its labelled window; any alert outside every window is a false alarm.
            The untrained rule catches more incidents only by alerting constantly ({model.test.untrained.false_per_day} false alarms a day on the test set), which no on-call team could act on.
          </p>

          <div className="section-head" id="explorer" style={{ scrollMarginTop: 72 }}>
            <div><h2>Explore a series</h2><p>Shaded areas are the expert-labelled incidents (green if caught, red if missed). Points are the detector's alerts.</p></div>
            <div className="series-pick">
              <select value={sel} onChange={(e) => setSel(e.target.value)} aria-label="Choose a series">
                <optgroup label="Test set (unseen real incidents)">
                  {ordered.filter((s) => s.split === "test").map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
                </optgroup>
                <optgroup label="Train set (AWS CloudWatch)">
                  {ordered.filter((s) => s.split === "train").map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
                </optgroup>
              </select>
              <button className="btn" onClick={replay} disabled={!series}>{cursor != null ? <><Pause size={15} /> Stop</> : <><Play size={15} /> Replay in real time</>}</button>
              {series && <a className="btn" href={series.source_csv} target="_blank" rel="noreferrer"><Download size={15} /> Source CSV</a>}
            </div>
          </div>
          <div className="card">
            {!series ? <div className="empty">Loading series.</div> : (
              <>
                <div className="row" style={{ justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div style={{ maxWidth: 760 }}>
                    <h3 style={{ margin: 0, fontSize: 16 }}>{series.title} <span className={`chip ${series.split === "test" ? "oracle" : ""}`}>{series.split === "test" ? "Test set" : "Train set"}</span></h3>
                    <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>
                      {series.about}{series.analogy ? ` Similar RYVO scenario: ${series.analogy.toLowerCase()} (${SCENARIO[series.scenario]}).` : ""}
                    </div>
                  </div>
                  <div className="row" style={{ gap: 6 }}>
                    <span className="chip ok">{replayStats ? replayStats.detected : series.evaluation.detected} of {series.evaluation.incidents} incidents caught</span>
                    <span className="chip bad">{replayStats ? replayStats.falseAlarms : series.evaluation.false_alarms} false alarms</span>
                    <span className="chip">{series.points_total.toLocaleString("en-IN")} points · {series.evaluation.days} days</span>
                  </div>
                </div>
                {replayStats && <div className="banner info" style={{ marginBottom: 10 }}>Replaying: {replayStats.time} · {replayStats.alerts} alerts so far</div>}
                <SeriesChart data={series} cursor={cursor} />
                <div className="legend-row" style={{ marginTop: 10 }}>
                  <span><i style={{ background: C.ink, height: 2, verticalAlign: 3 }} />Real value</span>
                  <span><i style={{ background: "rgba(160,202,146,.35)" }} />Labelled incident, caught</span>
                  <span><i style={{ background: "rgba(238,96,24,.35)" }} />Labelled incident, missed</span>
                  <span><i style={{ background: C.ok, borderRadius: "50%" }} />Correct alert</span>
                  <span><i style={{ background: C.bad, borderRadius: "50%" }} />False alarm</span>
                  <span className="muted">Chart shows {series.points_shown.toLocaleString("en-IN")} of {series.points_total.toLocaleString("en-IN")} points (peaks and every alert kept)</span>
                </div>
              </>
            )}
          </div>

          <div className="charts2" style={{ marginTop: 16 }}>
            <div className="card">
              <div className="card-title"><div><h3>Sensitivity trade-off</h3><div className="sub">Test-set precision and recall as the alert threshold changes</div></div></div>
              {sweep ? <SweepChart sweep={sweep} trained={p.threshold} /> : <div className="empty">Loading.</div>}
            </div>
            <div className="card flush">
              <div className="card-title" style={{ padding: "16px 20px 0" }}><div><h3>Every series</h3><div className="sub">Click a row to open it above</div></div></div>
              <div className="table-wrap" style={{ maxHeight: 300, overflowY: "auto" }}>
                <table className="table">
                  <thead><tr><th>Series</th><th>Set</th><th className="n">Caught</th><th className="n">False alarms</th><th className="n">Untrained false alarms</th></tr></thead>
                  <tbody>
                    {ordered.map((s) => (
                      <tr key={s.id} className={`clickable ${sel === s.id ? "sel" : ""}`} onClick={() => { setSel(s.id); document.getElementById("explorer")?.scrollIntoView({ block: "start" }); }}>
                        <td>{s.title}</td>
                        <td>{s.split === "test" ? "Test" : "Train"}</td>
                        <td className="n">{s.detected} / {s.incidents}</td>
                        <td className="n">{s.false_alarms}</td>
                        <td className="n muted">{s.untrained.false_alarms}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="section-head"><div><h2>Live, real-time data</h2><p>The same trained detector running on response times measured right now. Refreshes every 15 seconds.</p></div></div>
          <LiveProbe />
        </>
      )}
    </div>
  );
}
