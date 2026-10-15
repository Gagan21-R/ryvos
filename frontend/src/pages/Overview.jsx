// Landing page. Factory style (black canvas, Geist 400, bone cards, orange = failure, green = recovered) on the
// editorial structure: polygon wordmark, mono sub-nav, a live failure/recovery network behind the hero, a product
// window with live metrics, the RYVO loop ring, auto-cycling chapters and a bone CTA card.
import { ArrowRight, ArrowUpRight, BookOpen, Brain, Database, FlaskConical, Scale, Shield, ShieldCheck, Swords } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { PAGES, ThemeButton } from "../components/common/Layout.jsx";
import { systemById } from "../components/common/ui.jsx";
import ChapterVisualFor from "../components/landing/Chapters.jsx";
import DashboardFrame from "../components/landing/DashboardFrame.jsx";
import LoopRing from "../components/landing/LoopRing.jsx";
import Scene3D from "../components/three/Scene3D.jsx";
import { globe } from "../components/three/scenes.js";
import Wordmark, { EASE } from "../components/landing/Wordmark.jsx";
import { api } from "../services/api.js";
import { useArena } from "../state/arenaStore.js";
import { useStory } from "../story/director.js";
import { startRound } from "./Arena.jsx";

const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };
const NAV = [["Arena", "#/arena"], ["Real data", "#/realdata"], ["Metrics", "#/metrics"], ["Safety", "#/safety"], ["Agents", "#/agents"]];
const PHASE_NAME = { DISCOVER: "Discover", PLAN: "Plan", SAFETY: "Safety check", DISRUPT: "Disrupt", DETECT: "Detect", DIAGNOSE: "Diagnose",
  RECOVER: "Recover", VERIFY: "Verify", LEARN: "Learn", ADAPT: "Adapt" };
export const CHAPTERS = [
  { id: "emergency", name: "108 Emergency response", href: "#/arena" },
  { id: "food", name: "Free-delivery zones", href: "#/arena" },
  { id: "upi", name: "UPI payments", href: "#/arena" },
  { id: "real", name: "Real-data validation", href: "#/realdata" },
  { id: "safety", name: "Safety controller", href: "#/safety" },
];
const SOURCES = ["Numenta Anomaly Benchmark", "OpenStreetMap", "geoBoundaries", "FastAPI", "Redis", "React", "Leaflet"];

function PulseShield({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M12 2.8 4.5 5.6v5.6c0 4.6 3.1 8.6 7.5 10 4.4-1.4 7.5-5.4 7.5-10V5.6L12 2.8Z" />
      <path d="M7 12.4h2.6l1.4-2.8 2 5.2 1.5-2.4H17" />
    </svg>
  );
}

function useLanding() {
  const [model, setModel] = useState(null);
  const [series, setSeries] = useState(null);
  const [proof, setProof] = useState(null);
  useEffect(() => {
    api.realModel().then(setModel).catch(() => {});
    api.realSeries("realKnownCause/ec2_request_latency_system_failure").then(setSeries).catch(() => {});
    api.proof().then(setProof).catch(() => {});
  }, []);
  return { model, series, proof };
}

function IncidentTag({ incident, experiments }) {
  const name = experiments.length ? experiments[incident.exp % experiments.length] : "Latency injection";
  const tag = `EXP ${String(incident.exp).padStart(3, "0")}`;
  const line = {
    steady: ["All services healthy", "text-granite"],
    inject: [`${tag} · ROGUE · Injecting: ${name}`, "text-signal"],
    detect: [`${tag} · AEGIS · Anomaly detected`, "text-bone"],
    recover: [`${tag} · AEGIS · Recovered · MTTR ${(2.4 + (incident.exp % 5) * 0.4).toFixed(1)} s`, "text-metric"],
  }[incident.ph];
  return (
    <div className="absolute left-1/2 -translate-x-1/2 bottom-[9%] flex items-center gap-2 px-3 h-8 rounded-xs border border-ash bg-obsidian/80 backdrop-blur-sm font-mono text-[11px] uppercase tracking-caption whitespace-nowrap">
      <span className={`status-dot ${incident.ph === "recover" ? "ok" : incident.ph === "steady" ? "idle" : "live"}`} />
      <span key={incident.ph + incident.exp} className={`fade-in ${line[1]}`}>{line[0]}</span>
    </div>
  );
}

const Label = ({ children, className = "" }) => (
  <div className={`font-mono text-[12px] uppercase tracking-caption text-stone ${className}`}>{children}</div>
);

export default function Overview() {
  const [incident, setIncident] = useState({ ph: "steady", exp: 14 });
  const globeBuild = useMemo(() => globe({ onEvent: (ph, exp) => setIncident({ ph, exp }) }), []);
  const [active, setActive] = useState(0);
  const [hold, setHold] = useState(false);
  const [menu, setMenu] = useState(false);
  const live = useArena((s) => s.live);
  const learn = useArena((s) => s.learn);
  const meta = useArena((s) => s.meta);
  const story = useStory();
  const data = useLanding();
  const s = live?.state;
  const sys = systemById(s?.domain);
  const results = (learn.results || []).filter((r) => r.domain === s?.domain && r.resilience != null);
  const experiments = Object.values(meta?.domains?.[s?.domain]?.experiments || {}).map((e) => e.label);
  const go = (h) => { window.location.hash = h; };
  const start = async () => { await startRound(s?.domain || "emergency"); go("#/arena"); };

  useEffect(() => {
    if (hold) return undefined;
    const t = setInterval(() => setActive((a) => (a + 1) % CHAPTERS.length), 3500);
    return () => clearInterval(t);
  }, [hold]);

  return (
    <div className="bg-obsidian text-bone font-sans overflow-x-hidden min-h-screen">
      {/* ============================================================ 1 · HERO */}
      <section className="relative w-full min-h-screen flex flex-col overflow-hidden">
        <div className="absolute z-0 pointer-events-none hidden md:block left-[16%] right-[18%] top-[12%] bottom-0" style={{ animation: "fade 2s cubic-bezier(0.16,1,0.3,1) 0.8s both" }}>
          <Scene3D build={globeBuild} className="w-full h-full" label="3D globe of connected services: ROGUE injects a failure, AEGIS detects and recovers it" />
          <IncidentTag incident={incident} experiments={experiments} />
        </div>

        <motion.header className="relative pt-6 px-6 md:px-16 z-20" initial="initial" animate="animate" variants={{ animate: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } }}>
          <Wordmark />
          <motion.div variants={fadeUp} transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex justify-between items-start mt-8 font-mono text-[12px] uppercase tracking-caption">
            <div className="w-[34%] md:w-[15%] leading-[1.5] text-bone">Autonomous<br />Resilience<br />Testing</div>
            <ArrowRight size={14} strokeWidth={1} className="hidden md:block w-[5%] text-graphite mt-0.5" />
            <p className="m-0 flex-1 md:flex-none md:w-[30%] text-stone leading-[1.5]">
              <span className="hidden md:inline">AI agents that break systems safely,<br />recover them automatically and learn<br />from every failure.</span>
              <span className="md:hidden">AI agents that break<br />systems safely, recover<br />them automatically.</span>
            </p>
            <ArrowRight size={14} strokeWidth={1} className="hidden md:block w-[5%] text-graphite mt-0.5" />
            <nav className="hidden md:flex md:w-[15%] flex-col gap-1.5" aria-label="Main">
              {NAV.map(([l, h]) => <a key={l} href={h} className="text-bone no-underline transition-colors duration-200 hover:text-signal">{l}</a>)}
            </nav>
            <ThemeButton className="hidden md:grid place-items-center w-9 h-9 rounded-xs border border-ash bg-transparent text-bone cursor-pointer transition-colors duration-200 hover:border-bone mr-4" />
            <button onClick={() => setMenu((m) => !m)} aria-label={menu ? "Close menu" : "Open menu"} aria-expanded={menu}
              className="group relative z-[60] flex flex-col gap-[6px] items-end bg-transparent border-0 p-2 -mr-2 cursor-pointer">
              <span className={`block h-[1.5px] bg-bone transition-all duration-300 ${menu ? "w-8 rotate-45 translate-y-[3.75px]" : "w-8 group-hover:w-6"}`} />
              <span className={`block h-[1.5px] bg-bone transition-all duration-300 ${menu ? "w-8 -rotate-45 -translate-y-[3.75px]" : "w-8 group-hover:w-10"}`} />
            </button>
          </motion.div>
          <AnimatePresence>
            {menu && (
              <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} transition={{ duration: 0.4, ease: EASE }}
                className="absolute top-full left-0 right-0 mt-4 z-50 bg-obsidian border-y border-carbon px-6 md:px-16 py-8">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-x-6 gap-y-6 font-mono text-[14px] uppercase tracking-caption">
                  {PAGES.map((p) => <a key={p.id} href={`#/${p.id}`} onClick={() => setMenu(false)} className="text-stone no-underline hover:text-bone">{p.label}</a>)}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.header>

        <div className="relative z-10 flex justify-between gap-10 flex-1 px-10 md:px-16">
          <motion.div className="mt-14 md:mt-[min(7rem,8vh)] pb-32 w-[340px] shrink-0" initial="initial" animate="animate"
            variants={{ animate: { transition: { staggerChildren: 0.15, delayChildren: 0.6 } } }}>
            <motion.div variants={fadeUp} transition={{ duration: 0.8, ease: EASE }} className="flex items-center gap-3 font-mono text-[12px] text-stone">
              01 <span className="w-16 h-px bg-ash" />
            </motion.div>
            <motion.h2 variants={fadeUp} transition={{ duration: 0.8, ease: EASE }} className="m-0 mt-6 text-[3.5rem] md:text-[72px] font-normal tracking-display leading-[1] whitespace-nowrap">
              Break it<br />safely.
            </motion.h2>
            <motion.p variants={fadeUp} transition={{ duration: 0.8, ease: EASE }} className="m-0 mt-6 text-[16px] text-granite w-[300px] leading-[1.5]">
              Run controlled failure experiments on a digital twin, recover automatically and prove it with real data.
            </motion.p>
            <motion.div variants={fadeUp} transition={{ duration: 0.8, ease: EASE }} className="mt-8 flex items-center gap-3">
              <button onClick={start}
                className="group relative overflow-hidden isolate inline-flex items-center gap-2.5 h-11 px-5 bg-chalk text-obsidian border border-chalk rounded-xs cursor-pointer">
                <span className="absolute inset-0 -z-10 bg-carbon -translate-x-[101%] group-hover:translate-x-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" />
                <PulseShield className="w-[18px] h-[18px] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:text-bone group-hover:scale-110 group-hover:-rotate-12" />
                <span className="text-[15px] transition-colors duration-500 group-hover:text-bone">Start a round</span>
              </button>
              <a href="#/realdata" className="inline-flex items-center gap-2 h-11 px-4 text-[14px] text-bone no-underline border border-ash transition-colors duration-200 hover:border-chalk">
                Real-data results <ArrowRight size={15} strokeWidth={1.5} />
              </a>
            </motion.div>
          </motion.div>

          <div className="hidden lg:block w-[min(460px,38vw)] mt-[min(5rem,6vh)] shrink-0">
            <DashboardFrame system={sys?.name} round={s?.round} phase={PHASE_NAME[story.phase]} results={results} model={data.model} />
          </div>
        </div>

        <motion.a href="#explore" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 0.8 }}
          className="hidden md:flex absolute bottom-10 left-[2.5rem] md:left-[4rem] items-center gap-4 no-underline z-10">
          <span className="w-12 h-12 rounded-full border border-ash flex items-center justify-center gap-[4px] bg-obsidian">
            <span className="w-px h-3 bg-stone" /><span className="w-px h-3 bg-stone" />
          </span>
          <span className="font-mono text-[12px] uppercase tracking-caption text-granite">Scroll to explore</span>
        </motion.a>
      </section>

      {/* ============================================================ data sources strip */}
      <section className="border-y border-carbon py-10 overflow-hidden">
        <div className="flex gap-16 whitespace-nowrap w-max" style={{ animation: "marquee 40s linear infinite" }}>
          {[...SOURCES, ...SOURCES].map((x, i) => <span key={i} className="font-mono text-[14px] uppercase tracking-caption text-granite">{x}</span>)}
        </div>
      </section>

      {/* ============================================================ 2 · EXPLORE */}
      <section id="explore" className="relative w-full min-h-[75vh] md:min-h-screen flex flex-col items-center pt-24 md:pt-32 pb-0 z-20">
        <Label className="mb-12"><span className="text-granite">[ 02 ]</span> <span className="text-bone">Explore the platform</span></Label>
        <motion.h2 initial={{ y: 40, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 1, ease: EASE }}
          className="m-0 px-6 max-w-[1000px] text-center text-[2.2rem] md:text-[3.5rem] lg:text-[72px] leading-[1] font-normal tracking-display text-bone">
          Find where your systems break<br className="hidden md:block" /> <span className="text-granite">before your users do.</span>
        </motion.h2>
        <motion.div className="flex flex-wrap justify-center gap-3 mt-12 mb-10 md:mb-24 px-6" initial="initial" whileInView="animate" viewport={{ once: true }}
          variants={{ animate: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } } }}>
          {[[Swords, "Live arena", "#/arena"], [Database, "Real data", "#/realdata"], [Shield, "Safety", "#/safety"], [Brain, "Learning", "#/learning"], [BookOpen, "Scenarios", "#/scenarios"]].map(([Icon, l, h]) => (
            <motion.a key={l} href={h} variants={fadeUp} transition={{ duration: 0.6, ease: EASE }}
              className="inline-flex items-center gap-2 h-10 px-4 rounded-xs border border-ash font-mono text-[12px] uppercase tracking-caption text-bone no-underline transition-colors duration-200 hover:bg-chalk hover:text-obsidian hover:border-chalk">
              <Icon size={14} strokeWidth={1.6} />{l}
            </motion.a>
          ))}
        </motion.div>
        <div className="min-h-[260px] md:min-h-[460px]" />
        <div className="absolute bottom-0 left-0 right-0 px-8 md:px-16 pb-8 md:pb-12 pointer-events-none hidden md:flex justify-between font-mono text-[12px] uppercase tracking-caption text-granite">
          <span>We don't just break things.</span><span>RYVO © 2026</span>
        </div>
      </section>

      {/* ============================================================ 3 · COLLECTION */}
      <section className="relative w-full flex flex-col border-t border-carbon">
        <motion.div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120vw] md:w-[640px] pointer-events-none z-[25]"
          initial={{ y: "-55%", opacity: 0 }} whileInView={{ y: "-70%", opacity: 1 }} viewport={{ once: true, margin: "100px" }} transition={{ duration: 1.4, ease: "easeOut" }}>
          <LoopRing phase={story.phase} />
        </motion.div>

        <div className="relative z-10 px-8 md:px-16 pt-40 md:pt-56 mb-16 flex flex-col xl:flex-row justify-between gap-10">
          <h2 className="m-0 max-w-[1000px] text-[1.8rem] md:text-[44px] lg:text-[56px] leading-[1.1] font-normal tracking-heading text-bone">
            Built from every safe failure experiment
            <span className="inline-flex gap-2 md:gap-3 align-middle mx-2 md:mx-4 -translate-y-1">
              {[[FlaskConical, "ROGUE", "hover:text-signal hover:border-signal"], [ShieldCheck, "AEGIS", "hover:text-metric hover:border-metric"], [Scale, "ORACLE", "hover:text-bone hover:border-bone"]].map(([Icon, n, hov]) => (
                <a key={n} href="#/agents" title={n} aria-label={n}
                  className={`w-10 h-10 md:w-14 md:h-14 rounded-full border border-ash bg-obsidian text-granite inline-grid place-items-center transition-colors duration-200 ${hov}`}>
                  <Icon size={22} strokeWidth={1.5} />
                </a>
              ))}
            </span>
            <span className="text-granite">&amp; verified recovery.</span>
          </h2>
          <div className="xl:pt-4 shrink-0">
            <Label className="mb-6 leading-[1.5] text-granite">We don't just inject failures<br />We prove the recovery</Label>
            <div className="flex gap-3 flex-wrap">
              {["Safe", "Explainable", "Verified"].map((t) => (
                <span key={t} className="px-4 h-8 inline-flex items-center rounded-xs border border-ash font-mono text-[11px] uppercase tracking-caption text-stone transition-colors duration-200 hover:bg-chalk hover:text-obsidian hover:border-chalk cursor-default">{t}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="h-px bg-carbon" />
        <div className="flex flex-col md:flex-row" onMouseEnter={() => setHold(true)} onMouseLeave={() => setHold(false)}>
          <div className="md:w-[35%] border-b md:border-b-0 md:border-r border-carbon min-h-[400px] md:min-h-[500px] flex flex-col justify-between p-8 relative">
            <div className="text-graphite text-xl tracking-[0.3em]">***</div>
            <div className="absolute inset-0 m-auto w-[86%] h-[62%]">
              <AnimatePresence mode="wait">
                <ChapterVisualFor key={CHAPTERS[active].id} id={CHAPTERS[active].id} learn={learn} data={data} />
              </AnimatePresence>
            </div>
            <div className="flex items-center gap-2 font-mono text-[12px] uppercase tracking-caption text-granite">
              <div className="h-[14px] overflow-hidden">
                <AnimatePresence mode="popLayout">
                  <motion.div key={active} initial={{ y: 14 }} animate={{ y: 0 }} exit={{ y: -14 }} transition={{ duration: 0.5, ease: EASE }}>{String(active + 1).padStart(2, "0")}</motion.div>
                </AnimatePresence>
              </div>
              <span className="text-ash">/</span> 05
            </div>
          </div>
          <div className="md:w-[65%] flex flex-col">
            <div className="border-b border-carbon p-8 flex justify-between font-mono text-[12px] uppercase tracking-caption text-stone">
              <span className="flex items-center gap-2"><span className="status-dot live" />Break it safely. Recover it automatically.</span>
              <span className="h-[14px] overflow-hidden inline-block">
                <AnimatePresence mode="popLayout">
                  <motion.span key={active} className="block" initial={{ y: 14 }} animate={{ y: 0 }} exit={{ y: -14 }} transition={{ duration: 0.5, ease: EASE }}>Chapter {String(active + 1).padStart(2, "0")}</motion.span>
                </AnimatePresence>
              </span>
            </div>
            <ul className="m-0 p-0 list-none px-8">
              {CHAPTERS.map((c, i) => (
                <li key={c.id} className="border-b border-carbon last:border-b-0">
                  <button onClick={() => setActive(i)} onDoubleClick={() => go(c.href)}
                    className={`w-full py-8 flex justify-between items-center bg-transparent border-0 cursor-pointer text-left transition-colors duration-500 ${i === active ? "text-bone" : "text-graphite hover:text-granite"}`}>
                    <span className="text-2xl md:text-[36px] font-normal tracking-heading leading-[1.1]">{c.name}</span>
                    <AnimatePresence>
                      {i === active && (
                        <motion.a href={c.href} onClick={(e) => e.stopPropagation()} aria-label={`Open ${c.name}`} initial={{ opacity: 0, x: -10, y: 10 }} animate={{ opacity: 1, x: 0, y: 0 }}
                          exit={{ opacity: 0, x: 10, y: -10 }} transition={{ duration: 0.4, ease: EASE }} className="text-signal hover:text-bone">
                          <ArrowUpRight size={24} strokeWidth={1.2} />
                        </motion.a>
                      )}
                    </AnimatePresence>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="h-px bg-carbon" />
      </section>

      {/* ============================================================ CTA · bone card on black */}
      <section className="px-8 md:px-16 py-24 md:py-32 flex flex-col md:flex-row gap-10 justify-between items-start">
        <motion.div initial={{ y: 40, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 1, ease: EASE }}
          className="bg-bone text-obsidian rounded-card p-6 w-full md:w-[520px] relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.07] pointer-events-none" style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='120' height='120' filter='url(%23n)'/></svg>\")" }} />
          <div className="relative flex items-center gap-2 font-mono text-[12px] uppercase tracking-caption"><span className="status-dot live" />Run your first experiment</div>
          <h3 className="relative m-0 mt-16 text-[36px] leading-[1.1] font-normal tracking-heading">Break it safely.<br />Prove the recovery.</h3>
          <p className="relative m-0 mt-4 text-[14px] text-graphite max-w-[380px]">ROGUE plans the failure, ORACLE checks it is safe, AEGIS recovers it, and every number is scored.</p>
          <div className="relative mt-8 flex gap-3 flex-wrap">
            <button onClick={start} className="h-10 px-4 rounded-xs bg-obsidian text-bone border-0 text-[14px] cursor-pointer transition-colors duration-200 hover:bg-carbon">Start a round</button>
            <a href="#/arena" className="h-10 px-4 inline-flex items-center gap-2 rounded-xs border border-graphite text-obsidian no-underline text-[14px] transition-colors duration-200 hover:border-obsidian">Open the console <ArrowRight size={15} strokeWidth={1.5} /></a>
          </div>
        </motion.div>
        <div className="grid grid-cols-2 gap-x-16 gap-y-3 pt-2">
          <Label className="col-span-2 mb-2 text-bone">Console</Label>
          {PAGES.map((p) => <a key={p.id} href={`#/${p.id}`} className="text-[14px] text-granite no-underline transition-colors duration-200 hover:text-bone">{p.label}</a>)}
        </div>
      </section>

      <footer className="border-t border-carbon px-8 md:px-16 py-10 flex justify-between gap-6 flex-wrap font-mono text-[12px] uppercase tracking-caption text-granite">
        <span>Testing every failure before your users find it</span>
        <span>Arena: sandbox simulation · Validation: NAB real telemetry · Team Tech Architects</span>
      </footer>
    </div>
  );
}
