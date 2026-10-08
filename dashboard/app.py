"""H · Live dashboard (Streamlit). Reads data/live.json (written by dashboard/recorder.py).

Run (normally started by run_all.py):  streamlit run dashboard/app.py
"""
import json
import math
import sys
from pathlib import Path

import plotly.graph_objects as go
import streamlit as st

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

import domains  # noqa: E402
from shared import bus, names  # noqa: E402

DATA = ROOT / "data"
st.set_page_config(page_title="RYVO", page_icon="🛡️", layout="wide")


# ------------------------------------------------------------------ theme + palette
def is_dark():
    try:
        return st.context.theme.type == "dark"
    except Exception:
        return False


DARK = is_dark()
C = {  # validated categorical slots + status colours (light / dark steps)
    "blue": "#3987e5" if DARK else "#2a78d6", "orange": "#d95926" if DARK else "#eb6834",
    "aqua": "#199e70" if DARK else "#1baf7a", "magenta": "#d55181" if DARK else "#e87ba4",
    "violet": "#9085e9" if DARK else "#4a3aa7", "green": "#008300",
    "critical": "#d03b3b", "warning": "#fab219", "good": "#0ca30c",
    "muted": "#898781", "grid": "#2c2c2a" if DARK else "#e1e0d9", "axis": "#383835" if DARK else "#c3c2b7",
    "ink2": "#c3c2b7" if DARK else "#52514e",
}
SEQ_BLUE = ["#cde2fb", "#9ec5f4", "#6da7ec", "#3987e5", "#256abf", "#184f95", "#0d366b"]
GROUPS = {  # map layer -> colour
    "unit_free": C["blue"], "unit_busy": C["violet"], "unit_problem": C["critical"], "unit_reserve": C["muted"],
    "site": C["aqua"], "site_bad": C["warning"], "demand": C["orange"], "demand_urgent": C["magenta"],
    "hub": C["green"],
}
WHO = {"red": ":red[**RED**]", "monitor": ":orange[**MONITOR**]", "diagnoser": ":blue[**DIAGNOSER**]",
       "fixer": ":blue[**FIXER**]", "referee": ":violet[**REFEREE**]", "twin": ":gray[**TWIN**]"}


def read_json(path, default):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (FileNotFoundError, json.JSONDecodeError, PermissionError):
        return default


def control(**msg):
    try:
        bus.publish(names.CONTROL, msg)
    except Exception as e:  # Redis not running
        st.toast(f"Could not reach the arena: {e}")


def style(fig, title, height=270, legend=False):
    fig.update_layout(title=dict(text=title, font=dict(size=14)), height=height,
                      margin=dict(l=8, r=8, t=40, b=8), paper_bgcolor="rgba(0,0,0,0)",
                      plot_bgcolor="rgba(0,0,0,0)", showlegend=legend,
                      legend=dict(orientation="h", yanchor="top", y=-0.12, xanchor="left", x=0),
                      hoverlabel=dict(font_size=12))
    fig.update_xaxes(showgrid=False, linecolor=C["axis"], tickfont=dict(color=C["muted"]), zeroline=False)
    fig.update_yaxes(gridcolor=C["grid"], gridwidth=1, linecolor=C["axis"], tickfont=dict(color=C["muted"]),
                     zeroline=False)
    return fig


# ------------------------------------------------------------------ sidebar: controls
LABELS = {d: f"{domains.get(d).ICON} {domains.get(d).TITLE}" for d in domains.ORDER}
LABELS["all"] = "🔁 Rotate all three"

live0 = read_json(DATA / "live.json", {})
status = live0.get("status", {})

with st.sidebar:
    st.markdown("## 🛡️ RYVO")
    st.caption("Red AI attacks a digital twin. Blue AI detects, diagnoses and fixes it, and learns every round.")

    st.markdown("#### System under test")
    options = list(LABELS)
    current_mode = status.get("domain_mode", "emergency")
    choice = st.radio("System under test", options, format_func=LABELS.get, label_visibility="collapsed",
                      index=options.index(current_mode) if current_mode in options else 0)
    if choice != current_mode:
        control(cmd="domain", domain=choice)
        st.caption("Switches at the start of the next round.")

    live_domain = (live0.get("state") or {}).get("domain", "emergency")
    pick_domain = live_domain if choice == "all" else choice
    D = domains.get(pick_domain)
    st.markdown(f"#### Next attack on {D.ICON}")
    if st.button("🎲 Let Red's AI choose", width="stretch"):
        control(cmd="scenario", name=None, attacks=[])
        st.toast("Red's bandit will pick the next attack")
    for name, attacks in D.SCENARIOS.items():
        if st.button(f"🌪️ {name}", width="stretch", help=" + ".join(attacks)):
            control(cmd="scenario", name=name, attacks=attacks)
            st.toast(f"Queued scenario: {name}")
    with st.expander("Single attacks"):
        for a in D.ATTACKS:
            if st.button(a, key=f"atk_{a}", width="stretch", help=D.ATTACK_INFO[a]):
                control(cmd="scenario", name=a, attacks=[a])
                st.toast(f"Queued: {a}")

    st.markdown("#### Arena")
    blue_on = st.toggle("Blue defenders active", value=status.get("blue_enabled", True))
    if blue_on != status.get("blue_enabled", True):
        control(cmd="blue", enabled=blue_on)
    paused = status.get("paused", False)
    if st.button("▶️ Resume" if paused else "⏸️ Pause", width="stretch"):
        control(cmd="resume" if paused else "pause")
    with st.expander("Reset learning"):
        st.caption("Clears Blue's playbook, Red's bandit memory and the graphs.")
        if st.button("Reset now", type="primary"):
            control(cmd="reset_learning")
            for f in ("results.jsonl", "playbook.json", "postmortems.md"):
                (DATA / f).unlink(missing_ok=True)
    st.divider()
    st.caption("*Disasters shouldn't be the first time your system gets tested.*")


# ------------------------------------------------------------------ live section (refreshes every second)
@st.fragment(run_every="1s")
def live_view():
    live = read_json(DATA / "live.json", None)
    if not live or not live.get("state"):
        st.info("Waiting for the arena… start it with `python run_all.py`")
        return
    s = live["state"]
    D = domains.get(s["domain"])
    truth = s.get("truth", {})

    st.markdown(f"### {D.ICON} {D.TITLE} — round {s['round']} "
                f"<span style='color:{C['muted']};font-size:0.8em'>· {D.STAKE} at stake · "
                f"t = {s['t']}/{s['round_ticks']} {D.TICK_UNIT}"
                f"{' · ⏸️ paused' if live['status'].get('paused') else ''}"
                f"{' · 🔵 Blue OFF' if not live['status'].get('blue_enabled', True) else ''}</span>",
                unsafe_allow_html=True)
    cols = st.columns([1.5, 1.5, 1, 1, 1])
    attacks = truth.get("attacks", [])
    fixes = truth.get("fixes", [])
    cols[0].markdown("🔴 **Red attack**  \n" + ("  \n".join(f"`{a}`" for a in attacks) or "_none yet_"))
    cols[1].markdown("🔵 **Blue fixes active**  \n" + ("  \n".join(f"`{f}`" for f in fixes) or "_none_"))
    for col, (label, value) in zip(cols[2:], s.get("kpis", [])):
        col.metric(label, value)

    left, right = st.columns([3, 2])
    with left:
        # Offline schematic map (x = longitude, y = latitude): no map tiles, so it works without internet
        m = s["map"]
        fig = go.Figure()
        labels = m.get("labels", [])
        fig.add_trace(go.Scatter(x=[lb["lon"] for lb in labels], y=[lb["lat"] for lb in labels], mode="text",
                                 text=[lb["text"] for lb in labels], textfont=dict(size=11, color=C["muted"]),
                                 hoverinfo="skip", showlegend=False))
        for ln in m.get("lines", []):
            fig.add_trace(go.Scatter(x=[ln["from"][1], ln["to"][1]], y=[ln["from"][0], ln["to"][0]], mode="lines",
                                     line=dict(width=2, color=GROUPS[ln["group"]]), opacity=0.6,
                                     hoverinfo="skip", showlegend=False))
        legend = D.MAP_LEGEND
        for group, color in GROUPS.items():
            pts = [p for p in m["points"] if p["group"] == group]
            if not pts:
                continue
            fig.add_trace(go.Scatter(
                x=[p["lon"] for p in pts], y=[p["lat"] for p in pts], mode="markers",
                marker=dict(size=[p.get("size", 9) for p in pts], color=color, opacity=0.9,
                            symbol="square" if group.startswith("site") or group == "hub" else "circle",
                            line=dict(width=1.5, color="#1a1a19" if DARK else "#fcfcfb")),
                text=[p["label"] for p in pts], hovertemplate="%{text}<extra></extra>",
                name=legend.get(group, group)))
        all_lat = [p["lat"] for p in m["points"]] + [lb["lat"] for lb in labels]
        all_lon = [p["lon"] for p in m["points"]] + [lb["lon"] for lb in labels]
        pad_lat = (max(all_lat) - min(all_lat)) * 0.06 + 1e-3
        pad_lon = (max(all_lon) - min(all_lon)) * 0.06 + 1e-3
        mid_lat = sum(all_lat) / len(all_lat)
        fig.update_layout(height=470, margin=dict(l=0, r=0, t=0, b=0), uirevision=s["domain"],
                          paper_bgcolor="rgba(0,0,0,0)", plot_bgcolor="#1a1a19" if DARK else "#f9f9f7",
                          legend=dict(orientation="h", yanchor="top", y=-0.01, x=0, font=dict(size=11)),
                          hoverlabel=dict(font_size=12))
        fig.update_xaxes(visible=False, range=[min(all_lon) - pad_lon, max(all_lon) + pad_lon])
        fig.update_yaxes(visible=False, range=[min(all_lat) - pad_lat, max(all_lat) + pad_lat],
                         scaleanchor="x", scaleratio=1 / math.cos(math.radians(mid_lat)))
        st.plotly_chart(fig, width="stretch", key="map", config={"displayModeBar": False})
        open_inc = live.get("incidents", {})
        if open_inc:
            st.caption("Open incidents: " + ", ".join(f"⚠️ `{v['key']}`" for v in open_inc.values()))
    with right:
        st.markdown("**Battle log**")
        box = st.container(height=470, border=True)
        lines = []
        for e in reversed(live["log"][-60:]):
            ic = domains.get(e["domain"]).ICON if e.get("domain") in domains.REGISTRY else ""
            when = f"r{e['round']}·t{e['t']}" if e.get("t") is not None else f"r{e['round']}"
            lines.append(f"`{when}` {ic} {WHO.get(e['who'], e['who'])} {e['text']}")
        box.markdown("  \n".join(lines) or "_nothing yet_")


# ------------------------------------------------------------------ learning section (refreshes every 3 s)
@st.fragment(run_every="3s")
def learning_view():
    live = read_json(DATA / "live.json", {})
    results = live.get("results", [])
    st.markdown("### 📈 Is everyone learning?")

    tiles = st.columns(3)
    for col, did in zip(tiles, domains.ORDER):
        Dd = domains.get(did)
        rs = [r for r in results if r["domain"] == did]
        on = [r for r in rs if r.get("blue_enabled", True) and r.get("detected")]
        scratch = [r["recovery_ticks"] for r in on if not r.get("playbook_hits")]
        learned = [r["recovery_ticks"] for r in on if r.get("playbook_hits")]
        with col.container(border=True):
            st.markdown(f"**{Dd.ICON} {Dd.TITLE}** · {len(rs)} rounds")
            if scratch and learned:
                a, b = sum(scratch) / len(scratch), sum(learned) / len(learned)
                st.metric("Blue recovery with playbook", f"{b:.1f} {Dd.TICK_UNIT}",
                          f"{(b / a - 1) * 100:.0f}% vs from scratch ({a:.1f} {Dd.TICK_UNIT})", delta_color="inverse")
            else:
                st.caption("Play a few rounds to see Blue learn.")

    default = (live.get("state") or {}).get("domain", "emergency")
    view = st.segmented_control("Show graphs for", domains.ORDER, format_func=LABELS.get,
                                default=default, key="view_domain") or default
    Dv = domains.get(view)
    rs = [r for r in results if r["domain"] == view]
    if not rs:
        st.caption("No finished rounds for this system yet.")
        return
    x = [r["domain_round"] for r in rs]
    head = Dv.METRICS[0]

    c1, c2 = st.columns(2)
    with c1:
        fig = go.Figure(go.Scatter(x=x, y=[r[head["key"]] for r in rs], mode="lines+markers",
                                   line=dict(color=C["blue"], width=2), marker=dict(size=8, color=C["blue"]),
                                   customdata=[", ".join(r["attacks"]) for r in rs],
                                   hovertemplate=f"Round %{{x}}<br>{head['label']}: %{{y}}{head['unit']}"
                                                 "<br>Attack: %{customdata}<extra></extra>"))
        style(fig, f"{head['label']} per round ({head['unit'] or 'count'}) · lower is better")
        fig.update_xaxes(title=None, dtick=max(1, len(x) // 10))
        st.plotly_chart(fig, width="stretch", key="head")
    with c2:
        on = [r for r in rs if r.get("blue_enabled", True)]
        pb = [r for r in on if r.get("playbook_hits")]
        rules = [r for r in on if not r.get("playbook_hits")]
        off = [r for r in rs if not r.get("blue_enabled", True)]
        fig = go.Figure()
        for subset, name, color in ((rules, "Investigated from scratch", C["muted"]),
                                    (pb, "Answered from playbook", C["aqua"]),
                                    (off, "Blue switched off", C["critical"])):
            if subset:
                fig.add_trace(go.Bar(x=[r["domain_round"] for r in subset], y=[r["recovery_ticks"] for r in subset],
                                     name=name, marker=dict(color=color, cornerradius=4),
                                     customdata=[", ".join(r["fixes"]) or "-" for r in subset],
                                     hovertemplate=f"Round %{{x}}: %{{y}} {Dv.TICK_UNIT}<br>Fixes: %{{customdata}}"
                                                   "<extra></extra>"))
        style(fig, f"Blue recovery time per round ({Dv.TICK_UNIT}) · lower is better", legend=True)
        fig.update_layout(bargap=0.25)
        fig.update_xaxes(dtick=max(1, len(x) // 10))
        st.plotly_chart(fig, width="stretch", key="recovery")

    c3, c4 = st.columns(2)
    with c3:
        fig = go.Figure(go.Scatter(
            x=x, y=[" + ".join(r["attacks"]) if r["red_mode"] == "scenario" else r["attacks"][0] for r in rs],
            mode="markers",
            marker=dict(size=13, color=[r["red_reward"] for r in rs], cmin=0, cmax=1,
                        colorscale=[[i / 6, c] for i, c in enumerate(SEQ_BLUE)], line=dict(width=1, color=C["axis"]),
                        colorbar=dict(title=dict(text="damage", side="right"), thickness=10, len=0.8)),
            customdata=[[r["red_reward"], r["red_mode"]] for r in rs],
            hovertemplate="Round %{x}: %{y}<br>Red reward %{customdata[0]} (%{customdata[1]})<extra></extra>"))
        style(fig, "Red's attack choices over time (darker = more damage)")
        fig.update_xaxes(dtick=max(1, len(x) // 10))
        st.plotly_chart(fig, width="stretch", key="choices")
    with c4:
        brain = read_json(DATA / "red_brain.json", {}).get(view, {})
        q = brain.get("q", {})
        if q:
            arms = sorted(q, key=q.get)
            fig = go.Figure(go.Bar(x=[q[a] for a in arms], y=arms, orientation="h",
                                   marker=dict(color=C["orange"], cornerradius=4),
                                   text=[f"{q[a]:.2f} · tried {brain['n'].get(a, 0)}×" for a in arms],
                                   textposition="outside", cliponaxis=False,
                                   hovertemplate="%{y}: expected damage %{x:.2f}<extra></extra>"))
            style(fig, "Red's current belief: expected damage per attack")
            fig.update_xaxes(range=[0, 1.15])
            st.plotly_chart(fig, width="stretch", key="qvals")

    c5, c6 = st.columns(2)
    with c5:
        st.markdown("**📘 Blue's playbook** (symptom → fix recipe that worked)")
        book = [e for e in read_json(DATA / "playbook.json", {}).values() if e["domain"] == view]
        if book:
            rows = ["| Symptom | Fix recipe | Wins | Avg recovery | Fixes that failed |", "|---|---|---|---|---|"]
            for e in sorted(book, key=lambda e: -e["successes"]):
                failed = ", ".join(f"{k} ×{v}" for k, v in e["failed_fixes"].items()) or "—"
                rec = f"{e['avg_recovery_ticks']} {Dv.TICK_UNIT}" if e["avg_recovery_ticks"] is not None else "—"
                rows.append(f"| `{e['symptom']}` | {' + '.join(e['fixes']) or '—'} | {e['successes']} | {rec} | {failed} |")
            st.markdown("\n".join(rows))
        else:
            st.caption("Empty: Blue hasn't solved anything here yet.")
    with c6:
        st.markdown("**📝 Latest postmortem**")
        reports = [r for r in live.get("reports", []) if r["domain"] == view]
        if reports:
            st.markdown(f"**{reports[-1]['title']}**\n\n{reports[-1]['text']}")
        else:
            st.caption("Written automatically after each round.")


live_view()
st.divider()
learning_view()
