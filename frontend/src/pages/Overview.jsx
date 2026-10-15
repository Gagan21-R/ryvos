// Landing page, built on the editorial framework: polygon wordmark, mono labels, a live network animation in the
// hero, the RYVO loop ring overlapping into a dark "collection" section with auto-cycling chapters.
import { ArrowRight, ArrowUpRight, BookOpen, Brain, Database, FlaskConical, Plus, Scale, Shield, ShieldCheck, Swords } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import ChapterVisualFor from "../components/landing/Chapters.jsx";
import LoopRing from "../components/landing/LoopRing.jsx";
import NetworkField from "../components/landing/NetworkField.jsx";
import Wordmark, { EASE } from "../components/landing/Wordmark.jsx";
import { PAGES } from "../components/common/Layout.jsx";
import { systemById } from "../components/common/ui.jsx";
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

function PulseShield({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M12 2.8 4.5 5.6v5.6c0 4.6 3.1 8.6 7.5 10 4.4-1.4 7.5-5.4 7.5-10V5.6L12 2.8Z" />
      <path d="M7 12.4h2.6l1.4-2.8 2 5.2 1.5-2.4H17" />
      <path d="M12 2.8v2.4" />
      <path d="M4.5 8.4h2" />
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

export default function Overview() {
  const [showField, setShowField] = useState(false);
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
  const latest = [...(learn.results || [])].reverse().find((r) => r.domain === s?.domain && r.resilience != null);
  const experiments = Object.values(meta?.domains?.[s?.domain]?.experiments || {}).map((e) => e.label);
  const go = (h) => { window.location.hash = h; };

  useEffect(() => { const t = setTimeout(() => setShowField(true), 1600); return () => clearTimeout(t); }, []);
  useEffect(() => {
    if (hold) return undefined;
    const t = setInterval(() => setActive((a) => (a + 1) % CHAPTERS.length), 3500);
    return () => clearInterval(t);
  }, [hold]);

  return (
    <div className="bg-[#fcfcfc] text-[#111] font-sans overflow-x-hidden selection:bg-black selection:text-white">
      {/* ============================================================ 1 · HERO */}
      <section className="relative w-full min-h-screen flex flex-col overflow-hidden">
        <AnimatePresence>
          {showField && (
            <motion.div className="absolute inset-0 pointer-events-none z-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.6 }}>
              <NetworkField experiments={experiments} className="w-full h-full block" />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.header className="relative pt-6 px-6 md:px-16 z-20" initial="initial" animate="animate" variants={{ animate: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } }}>
          <Wordmark />
          <motion.div variants={fadeUp} transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex justify-between items-start mt-8 text-[10px] md:text-[11px] font-mono tracking-[0.2em] uppercase">
            <div className="w-[34%] md:w-[15%] leading-relaxed">Autonomous<br />Resilience<br />Testing</div>
            <ArrowRight size={14} strokeWidth={1} className="hidden md:block w-[5%] text-gray-400 mt-1" />
            <p className="m-0 flex-1 md:flex-none md:w-[30%] text-gray-800 leading-relaxed font-mono">
              <span className="hidden md:inline">AI agents that break systems safely,<br />recover them automatically and learn<br />from every failure.</span>
              <span className="md:hidden">AI agents that break<br />systems safely, recover<br />them automatically and<br />learn from every failure.</span>
            </p>
            <ArrowRight size={14} strokeWidth={1} className="hidden md:block w-[5%] text-gray-400 mt-1" />
            <nav className="hidden md:flex md:w-[15%] flex-col gap-1" aria-label="Main">
              {NAV.map(([l, h]) => <a key={l} href={h} className="text-gray-800 no-underline hover:text-black hover:underline">{l}</a>)}
            </nav>
            <button onClick={() => setMenu((m) => !m)} aria-label={menu ? "Close menu" : "Open menu"} aria-expanded={menu}
              className="group relative z-[60] flex flex-col gap-[6px] items-end bg-transparent border-0 p-2 -mr-2 cursor-pointer">
              <span className={`block h-[1.5px] bg-black transition-all duration-300 ${menu ? "w-8 rotate-45 translate-y-[3.75px]" : "w-8 group-hover:w-6"}`} />
              <span className={`block h-[1.5px] bg-black transition-all duration-300 ${menu ? "w-8 -rotate-45 -translate-y-[3.75px]" : "w-8 group-hover:w-10"}`} />
            </button>
          </motion.div>
          <AnimatePresence>
            {menu && (
              <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} transition={{ duration: 0.4, ease: EASE }}
                className="absolute top-full left-0 right-0 mt-4 z-50 bg-[#fcfcfc] border-b border-gray-200 shadow-xl px-6 md:px-16 py-8">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-x-6 gap-y-6 text-sm font-mono tracking-[0.2em] uppercase">
                  {PAGES.map((p) => <a key={p.id} href={`#/${p.id}`} onClick={() => setMenu(false)} className="text-gray-800 no-underline hover:text-black hover:underline">{p.label}</a>)}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.header>

        <div className="relative z-10 flex justify-between flex-1">
          <motion.div className="px-10 md:px-16 mt-14 sm:mt-16 md:mt-[min(8rem,9vh)] pb-32 w-[340px] shrink-0" initial="initial" animate="animate"
            variants={{ animate: { transition: { staggerChildren: 0.15, delayChildren: 0.6 } } }}>
            <motion.div variants={fadeUp} transition={{ duration: 0.8, ease: EASE }} className="flex items-center gap-3 text-xs font-mono">
              01 <span className="w-16 h-[1.5px] bg-black/20" />
            </motion.div>
            <motion.h2 variants={fadeUp} transition={{ duration: 0.8, ease: EASE }} className="m-0 mt-6 text-[3.5rem] md:text-[5rem] font-normal tracking-tight leading-[1] whitespace-nowrap">
              BREAK IT<br />SAFELY.
            </motion.h2>
            <motion.p variants={fadeUp} transition={{ duration: 0.8, ease: EASE }} className="m-0 mt-6 text-[13px] md:text-[14px] text-gray-700 w-[270px] leading-[1.6]">
              Run controlled failure experiments on a digital twin, recover automatically and prove it with real data.
            </motion.p>
            <motion.div variants={fadeUp} transition={{ duration: 0.8, ease: EASE }} className="mt-8">
              <button onClick={async () => { await startRound(s?.domain || "emergency"); go("#/arena"); }}
                className="group relative overflow-hidden inline-flex items-center gap-3 bg-[#1a1a1a] px-6 py-3.5 border border-[#1a1a1a] rounded-md shadow-sm cursor-pointer transition-all duration-300 hover:-translate-y-[0.5px] hover:shadow-[3px_3px_0px_rgba(17,17,17,0.5)] active:translate-y-0 active:shadow-none">
                <span className="absolute inset-0 bg-[#fcfcfc] -translate-x-[101%] group-hover:translate-x-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" />
                <PulseShield className="relative w-5 h-5 text-white group-hover:text-[#111] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 group-hover:-rotate-12 group-hover:-translate-y-1" />
                <span className="relative text-[15px] font-medium text-white group-hover:text-[#111] transition-colors duration-700">Start a round</span>
              </button>
            </motion.div>
          </motion.div>

          <motion.div className="hidden md:flex flex-col gap-8 w-[220px] mt-10 md:mt-[min(6rem,7vh)] mr-6 md:mr-16" initial="initial" animate="animate"
            variants={{ animate: { transition: { staggerChildren: 0.15, delayChildren: 0.9 } } }}>
            <motion.div variants={fadeUp} transition={{ duration: 0.8, ease: EASE }}>
              <div className="text-[10px] font-bold font-mono tracking-widest uppercase">Live round {s?.round ? `#${s.round}` : ""}</div>
              <div className="text-[12px] text-gray-600 leading-[1.6] mt-2">{sys ? sys.name : "Connecting to the arena"}<br />Phase: {PHASE_NAME[story.phase] || "—"}</div>
            </motion.div>
            <motion.div variants={fadeUp} transition={{ duration: 0.8, ease: EASE }} className="flex flex-col gap-4">
              <div><div className="text-[10px] font-mono tracking-widest uppercase text-gray-500">Resilience</div><div className="text-[13px] font-medium mt-1">{latest?.resilience ?? "—"} / 100</div></div>
              <div><div className="text-[10px] font-mono tracking-widest uppercase text-gray-500">Real-data F1</div><div className="text-[13px] font-medium mt-1">{data.model?.test?.trained?.f1 ?? "—"} on unseen incidents</div></div>
            </motion.div>
            <motion.a variants={fadeUp} transition={{ duration: 0.8, ease: EASE }} href="#/arena" className="group flex items-center gap-3 no-underline text-[#111]">
              <span className="w-10 h-10 rounded-full border border-gray-400 grid place-items-center transition-colors duration-300 group-hover:border-black group-hover:bg-[#111]">
                <Plus size={16} strokeWidth={1.5} className="group-hover:text-white transition-colors duration-300" />
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest font-bold">View details</span>
            </motion.a>
          </motion.div>
        </div>

        <motion.a href="#explore" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 0.8 }}
          className="hidden md:flex absolute bottom-10 left-[2.5rem] md:left-[4rem] items-center gap-4 no-underline z-10">
          <span className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center gap-[4px] bg-[#fcfcfc]">
            <span className="w-[1px] h-[12px] bg-gray-600" /><span className="w-[1px] h-[12px] bg-gray-600" />
          </span>
          <span className="text-[10px] font-mono tracking-widest uppercase text-gray-500 font-semibold">Scroll to explore</span>
        </motion.a>
      </section>

      {/* ============================================================ 2 · EXPLORE */}
      <section id="explore" className="relative w-full min-h-[75vh] md:min-h-screen bg-[#fcfcfc] flex flex-col items-center pt-24 md:pt-32 pb-0 z-20">
        <div className="text-[10px] md:text-[11px] font-mono tracking-[0.2em] mb-12"><span className="text-gray-500">[ 02 ]</span> <span className="text-gray-900 font-bold uppercase">Explore the platform</span></div>
        <motion.h2 initial={{ y: 40, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 1, ease: EASE }}
          className="m-0 px-6 max-w-[1000px] text-center text-[2.2rem] md:text-[3.5rem] lg:text-[4.2rem] leading-[1.1] font-medium tracking-tight text-[#111]">
          Find where your systems break<br className="hidden md:block" /> before your users do, with safe experiments, automatic recovery and real data.
        </motion.h2>
        <motion.div className="flex flex-wrap justify-center gap-3 md:gap-4 mt-12 mb-10 md:mb-24 px-6" initial="initial" whileInView="animate" viewport={{ once: true }}
          variants={{ animate: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } } }}>
          {[[Swords, "Live arena", "#/arena"], [Database, "Real data", "#/realdata"], [Shield, "Safety", "#/safety"], [Brain, "Learning", "#/learning"], [BookOpen, "Scenarios", "#/scenarios"]].map(([Icon, l, h]) => (
            <motion.a key={l} href={h} variants={fadeUp} transition={{ duration: 0.6, ease: EASE }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-300 text-[11px] font-medium uppercase tracking-wider bg-white/50 backdrop-blur-sm text-gray-800 no-underline transition-colors duration-300 hover:border-black hover:bg-black hover:text-white">
              <Icon size={14} strokeWidth={2} />{l}
            </motion.a>
          ))}
        </motion.div>
        <div className="min-h-[260px] md:min-h-[460px]" />
        <div className="absolute bottom-0 left-0 right-0 px-8 md:px-16 pb-8 md:pb-12 pointer-events-none hidden md:flex justify-between text-[10px] font-mono tracking-widest uppercase text-gray-500 font-medium">
          <span>We don't just break things.</span><span>RYVO © 2026</span>
        </div>
      </section>

      {/* ============================================================ 3 · DARK COLLECTION */}
      <section className="relative w-full bg-[#0a0a0a] text-white flex flex-col">
        <motion.div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120vw] md:w-[640px] pointer-events-none z-[25] mix-blend-difference"
          initial={{ y: "-55%", opacity: 0 }} whileInView={{ y: "-70%", opacity: 1 }} viewport={{ once: true, margin: "100px" }} transition={{ duration: 1.4, ease: "easeOut" }}>
          <LoopRing phase={story.phase} />
        </motion.div>

        <div className="relative z-10 px-8 md:px-16 pt-40 md:pt-56 mb-16 flex flex-col xl:flex-row justify-between gap-10">
          <h2 className="m-0 max-w-[1000px] text-[1.8rem] md:text-[3rem] lg:text-[3.8rem] xl:text-[4rem] leading-[1.15] font-medium tracking-tight text-white">
            Built from every safe failure experiment
            <span className="inline-flex gap-2 md:gap-3 align-middle mx-2 md:mx-4 -translate-y-1">
              {[[FlaskConical, "ROGUE"], [ShieldCheck, "AEGIS"], [Scale, "ORACLE"]].map(([Icon, n]) => (
                <a key={n} href="#/agents" title={n} aria-label={n}
                  className="w-10 h-10 md:w-14 md:h-14 rounded-full border border-gray-600 bg-black text-gray-400 inline-grid place-items-center transition-colors duration-300 hover:bg-white hover:text-black hover:border-white">
                  <Icon size={22} strokeWidth={1.5} />
                </a>
              ))}
            </span>
            &amp; verified recovery.
          </h2>
          <div className="xl:pt-4 shrink-0">
            <div className="text-[9px] md:text-[10px] font-mono tracking-widest text-gray-400 uppercase mb-6 leading-relaxed">We don't just inject failures<br />We prove the recovery</div>
            <div className="flex gap-3 flex-wrap">
              {["Safe", "Explainable", "Verified"].map((t) => (
                <span key={t} className="px-5 py-2 rounded-full border border-gray-600 text-[9px] font-mono tracking-widest uppercase text-gray-300 transition-colors duration-300 hover:bg-white hover:text-black hover:border-white cursor-default">{t}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="h-[1px] bg-gray-800" />
        <div className="flex flex-col md:flex-row" onMouseEnter={() => setHold(true)} onMouseLeave={() => setHold(false)}>
          <div className="md:w-[35%] border-b md:border-b-0 md:border-r border-gray-800 min-h-[400px] md:min-h-[500px] flex flex-col justify-between p-8 relative">
            <div className="text-gray-500 text-xl tracking-[0.3em]">***</div>
            <div className="absolute inset-0 m-auto w-[86%] h-[62%]">
              <AnimatePresence mode="wait">
                <ChapterVisualFor key={CHAPTERS[active].id} id={CHAPTERS[active].id} learn={learn} data={data} />
              </AnimatePresence>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-[#888] uppercase">
              <div className="h-[14px] overflow-hidden">
                <AnimatePresence mode="popLayout">
                  <motion.div key={active} initial={{ y: 14 }} animate={{ y: 0 }} exit={{ y: -14 }} transition={{ duration: 0.5, ease: EASE }}>{String(active + 1).padStart(2, "0")}</motion.div>
                </AnimatePresence>
              </div>
              <span className="text-[#333]">/</span> 05
            </div>
          </div>
          <div className="md:w-[65%] flex flex-col">
            <div className="border-b border-gray-800 p-8 flex justify-between text-[10px] font-mono text-gray-400 tracking-widest uppercase">
              <span>Break it safely. Recover it automatically.</span>
              <span className="h-[14px] overflow-hidden inline-block">
                <AnimatePresence mode="popLayout">
                  <motion.span key={active} className="block" initial={{ y: 14 }} animate={{ y: 0 }} exit={{ y: -14 }} transition={{ duration: 0.5, ease: EASE }}>Chapter {String(active + 1).padStart(2, "0")}</motion.span>
                </AnimatePresence>
              </span>
            </div>
            <ul className="m-0 p-0 list-none px-8">
              {CHAPTERS.map((c, i) => (
                <li key={c.id} className="border-b border-gray-800/80 last:border-b-0">
                  <button onClick={() => setActive(i)} onDoubleClick={() => go(c.href)}
                    className={`w-full py-8 flex justify-between items-center bg-transparent border-0 cursor-pointer text-left transition-colors duration-500 ${i === active ? "text-white" : "text-[#444] hover:text-[#999]"}`}>
                    <span className="text-2xl md:text-[2rem] font-medium tracking-tight">{c.name}</span>
                    <AnimatePresence>
                      {i === active && (
                        <motion.a href={c.href} onClick={(e) => e.stopPropagation()} aria-label={`Open ${c.name}`} initial={{ opacity: 0, x: -10, y: 10 }} animate={{ opacity: 1, x: 0, y: 0 }}
                          exit={{ opacity: 0, x: 10, y: -10 }} transition={{ duration: 0.4, ease: EASE }} className="text-gray-400 hover:text-white">
                          <ArrowUpRight size={22} strokeWidth={1} />
                        </motion.a>
                      )}
                    </AnimatePresence>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="h-[1px] bg-gray-800" />
        <div className="px-8 py-8 flex justify-between gap-6 flex-wrap text-[10px] font-mono tracking-widest text-gray-500 uppercase bg-[#0a0a0a]">
          <span>Testing every failure before your users find it</span>
          <span>Arena: sandbox simulation · Validation: NAB real telemetry · Team Tech Architects</span>
        </div>
      </section>
    </div>
  );
}
