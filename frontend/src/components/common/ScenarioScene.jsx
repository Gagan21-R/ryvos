// Animated mini-scenes for the three scenario cards (108 · Free Delivery · UPI).
// One visual language: an inset "display" with a faint grid, thin ink outlines and a single accent per scenario.
// Motion runs only while the card is hovered/selected; otherwise the scene rests in a calm, frozen pose.
import { useEffect, useRef } from "react";

const INK = "#0e0e10";

function useSceneClock(active, restAt) {
  const ref = useRef(null);
  useEffect(() => {
    const svg = ref.current;
    if (!svg?.pauseAnimations) return;
    if (active) {
      svg.unpauseAnimations();
    } else {
      svg.pauseAnimations();
      svg.setCurrentTime(restAt);          // a composed resting frame, not the very first one
    }
  }, [active, restAt]);
  return ref;
}

function Frame({ id, accent, children }) {
  return (
    <>
      <defs>
        <pattern id={`grid-${id}`} width="12" height="12" patternUnits="userSpaceOnUse">
          <path d="M12 0H0V12" fill="none" stroke="rgba(14,14,16,.07)" strokeWidth="1" />
        </pattern>
        <radialGradient id={`glow-${id}`}>
          <stop offset="0" stopColor={accent} stopOpacity=".55" />
          <stop offset="1" stopColor={accent} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`trail-${id}`} x1="0" x2="1">
          <stop offset="0" stopColor={accent} stopOpacity="0" />
          <stop offset="1" stopColor={accent} stopOpacity=".55" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="240" height="88" rx="12" fill="#faf8f2" />
      <rect x="0" y="0" width="240" height="88" rx="12" fill={`url(#grid-${id})`} />
      {children}
      <rect x="0.75" y="0.75" width="238.5" height="86.5" rx="11.5" fill="none" stroke="rgba(14,14,16,.18)" strokeWidth="1.5" />
    </>
  );
}

// ---------------------------------------------------------------- 🚑 108 Emergency
function EmergencyScene({ active }) {
  const ref = useSceneClock(active, 1.6);
  const route = "M18 64 C 60 64, 70 30, 112 32 S 168 58, 206 34";
  return (
    <svg ref={ref} viewBox="0 0 240 88" className="scene" role="img" aria-label="Ambulance driving a route to an emergency call">
      <Frame id="em" accent="#e5194f">
        {/* city blocks */}
        <g fill="rgba(14,14,16,.05)">
          <rect x="30" y="12" width="26" height="14" rx="3" /><rect x="130" y="60" width="34" height="14" rx="3" />
          <rect x="176" y="62" width="22" height="12" rx="3" /><rect x="78" y="56" width="22" height="18" rx="3" />
        </g>
        <path id="em-route" d={route} fill="none" stroke="rgba(14,14,16,.22)" strokeWidth="5" strokeLinecap="round" />
        <path d={route} fill="none" stroke="#e5194f" strokeWidth="2" strokeLinecap="round" strokeDasharray="5 6">
          <animate attributeName="stroke-dashoffset" from="0" to="-22" dur="0.9s" repeatCount="indefinite" />
        </path>
        {/* destination: caller pin with emergency pulse */}
        <g transform="translate(206 34)">
          <circle r="5" fill="none" stroke="#e5194f" strokeWidth="1.5">
            <animate attributeName="r" values="5;17" dur="1.4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values=".9;0" dur="1.4s" repeatCount="indefinite" />
          </circle>
          <circle r="5" fill="none" stroke="#e5194f" strokeWidth="1.5">
            <animate attributeName="r" values="5;17" dur="1.4s" begin="0.7s" repeatCount="indefinite" />
            <animate attributeName="opacity" values=".9;0" dur="1.4s" begin="0.7s" repeatCount="indefinite" />
          </circle>
          <path d="M0 6 C -7 -2, -7 -11, 0 -12 C 7 -11, 7 -2, 0 6 Z" transform="translate(0 -6)" fill="#e5194f" stroke={INK} strokeWidth="1.2" />
          <circle cy="-12" r="2.2" fill="#fff" />
        </g>
        {/* ambulance (side view) following the route */}
        <g>
          <animateMotion dur="3.2s" repeatCount="indefinite" rotate="auto" keyPoints="0;1" keyTimes="0;1" calcMode="linear">
            <mpath href="#em-route" />
          </animateMotion>
          <g transform="translate(-17 -15)">
            <ellipse cx="17" cy="16" rx="18" ry="2.5" fill="rgba(14,14,16,.18)" />
            <circle cx="4" cy="1" r="9" fill="url(#glow-em)">
              <animate attributeName="opacity" values="1;.2;1" dur="0.5s" repeatCount="indefinite" />
            </circle>
            <path d="M1 13 V5 Q1 3 3 3 H22 L28 8 Q32 9 32 12 V13 Z" fill="#fff" stroke={INK} strokeWidth="1.3" strokeLinejoin="round" />
            <path d="M22 4 L27 8.5 H22 Z" fill="#9fd6ff" stroke={INK} strokeWidth="0.9" />
            <rect x="1.5" y="9" width="20" height="1.8" fill="#e5194f" />
            <path d="M10 5 v4 M8 7 h4" stroke="#e5194f" strokeWidth="1.6" />
            <rect x="3" y="1" width="3.5" height="2" rx="0.6" fill="#e5194f" stroke={INK} strokeWidth="0.6">
              <animate attributeName="fill" values="#e5194f;#1f6bff;#e5194f" dur="0.5s" repeatCount="indefinite" />
            </rect>
            <rect x="6.6" y="1" width="3.5" height="2" rx="0.6" fill="#1f6bff" stroke={INK} strokeWidth="0.6">
              <animate attributeName="fill" values="#1f6bff;#e5194f;#1f6bff" dur="0.5s" repeatCount="indefinite" />
            </rect>
            <circle cx="8" cy="13.5" r="2.6" fill={INK} /><circle cx="8" cy="13.5" r="1" fill="#ccc" />
            <circle cx="25" cy="13.5" r="2.6" fill={INK} /><circle cx="25" cy="13.5" r="1" fill="#ccc" />
          </g>
        </g>
      </Frame>
    </svg>
  );
}

// ---------------------------------------------------------------- 🛵 Free Delivery
function DeliveryScene({ active }) {
  const ref = useSceneClock(active, 1.4);
  const zone = "M22 20 L74 10 L132 16 L192 12 L222 40 L204 74 L140 78 L82 72 L30 66 Z";
  const ride = "M36 56 C 70 58, 86 34, 120 38 S 172 60, 196 44";
  return (
    <svg ref={ref} viewBox="0 0 240 88" className="scene" role="img" aria-label="Delivery scooter riding inside a free-delivery service area">
      <Frame id="dl" accent="#38bdf8">
        <defs>
          <linearGradient id="dl-scan" x1="0" x2="1">
            <stop offset="0" stopColor="#38bdf8" stopOpacity="0" />
            <stop offset=".5" stopColor="#38bdf8" stopOpacity=".28" />
            <stop offset="1" stopColor="#38bdf8" stopOpacity="0" />
          </linearGradient>
          <clipPath id="dl-clip"><path d={zone} /></clipPath>
        </defs>
        {/* simulated free-delivery service area */}
        <path d={zone} fill="rgba(56,189,248,.08)" stroke="#0a8fc9" strokeWidth="1.5" strokeDasharray="5 4" />
        {/* scanner sweeping the service area */}
        <g clipPath="url(#dl-clip)">
          <rect x="-60" y="0" width="60" height="88" fill="url(#dl-scan)">
            <animate attributeName="x" values="-60;240" dur="2.6s" repeatCount="indefinite" />
          </rect>
        </g>
        <path id="dl-ride" d={ride} fill="none" stroke="rgba(14,14,16,.18)" strokeWidth="1.2" strokeDasharray="2 4" />
        {/* customer pin */}
        <g transform="translate(196 44)">
          <circle r="4" fill="none" stroke="#0a8fc9" strokeWidth="1.4">
            <animate attributeName="r" values="4;14" dur="1.6s" repeatCount="indefinite" />
            <animate attributeName="opacity" values=".9;0" dur="1.6s" repeatCount="indefinite" />
          </circle>
          <circle r="4" fill="#0f9d58" stroke={INK} strokeWidth="1.2" />
        </g>
        {/* restaurant */}
        <g transform="translate(30 50)">
          <rect x="-1" y="-1" width="13" height="11" rx="2" fill="#fff" stroke={INK} strokeWidth="1.2" />
          <path d="M-2 -1 L5.5 -6 L13 -1 Z" fill="#ff8a3d" stroke={INK} strokeWidth="1" />
        </g>
        {/* scooter with delivery box + light-blue trail */}
        <g>
          <animateMotion dur="3s" repeatCount="indefinite" rotate="auto" calcMode="spline" keyTimes="0;1" keySplines=".45 0 .55 1">
            <mpath href="#dl-ride" />
          </animateMotion>
          <g transform="translate(-16 -17)">
            <rect x="-26" y="9" width="28" height="4" rx="2" fill="url(#trail-dl)" />
            <ellipse cx="15" cy="17" rx="15" ry="2.2" fill="rgba(14,14,16,.18)" />
            <rect x="2" y="2" width="10" height="8" rx="1.5" fill="#ff8a3d" stroke={INK} strokeWidth="1.1" />
            <path d="M4 5 h6" stroke="#fff" strokeWidth="1.1" />
            <path d="M3 12 Q4 9 9 10 H19 L23 5 L25 5" fill="none" stroke={INK} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9 10 H19 Q21 12 19 13 H8 Q6 13 7 11 Z" fill="#1f6bff" stroke={INK} strokeWidth="1" />
            <circle cx="16.5" cy="1.5" r="2.6" fill="#fff" stroke={INK} strokeWidth="1.1" />
            <path d="M15 4 L13 9" stroke={INK} strokeWidth="1.6" strokeLinecap="round" />
            <circle cx="6" cy="14.5" r="2.8" fill={INK} /><circle cx="6" cy="14.5" r="1" fill="#ccc" />
            <circle cx="24" cy="14.5" r="2.8" fill={INK} /><circle cx="24" cy="14.5" r="1" fill="#ccc" />
          </g>
        </g>
      </Frame>
    </svg>
  );
}

// ---------------------------------------------------------------- 💳 UPI Payments
function UpiScene({ active }) {
  const ref = useSceneClock(active, 0.9);
  const link = "M44 50 C 70 50, 90 26, 120 26 S 170 50, 196 50";
  return (
    <svg ref={ref} viewBox="0 0 240 88" className="scene" role="img" aria-label="Payment signal travelling from a phone through the gateway to a bank">
      <Frame id="upi" accent="#7a4dff">
        <path id="upi-link" d={link} fill="none" stroke="rgba(14,14,16,.2)" strokeWidth="1.4" strokeDasharray="3 4" />
        {/* phone */}
        <g transform="translate(26 30)">
          <rect x="0" y="0" width="18" height="32" rx="4" fill="#fff" stroke={INK} strokeWidth="1.4" />
          <rect x="3" y="4" width="12" height="20" rx="1.5" fill="#ece4ff" />
          <text x="9" y="18" textAnchor="middle" fontSize="9" fontWeight="800" fill="#7a4dff" fontFamily="Inter, sans-serif">₹</text>
          <circle cx="9" cy="28" r="1.4" fill={INK} />
        </g>
        {/* gateway hub with scanning ring */}
        <g transform="translate(120 26)">
          <circle r="15" fill="none" stroke="#7a4dff" strokeWidth="1.3" strokeDasharray="4 5">
            <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle r="11" fill="url(#glow-upi)" />
          <path d="M0 -8 L7 -4 V3 Q7 7 0 10 Q-7 7 -7 3 V-4 Z" fill="#fff" stroke={INK} strokeWidth="1.3" />
          <path d="M-3 1 L-0.5 3.5 L3.5 -1.5" fill="none" stroke="#7a4dff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        {/* bank */}
        <g transform="translate(184 34)">
          <path d="M0 8 L12 1 L24 8 Z" fill="#fff" stroke={INK} strokeWidth="1.3" strokeLinejoin="round" />
          <rect x="1" y="9" width="22" height="2" fill={INK} />
          <path d="M4 12 V22 M9.3 12 V22 M14.6 12 V22 M20 12 V22" stroke={INK} strokeWidth="1.8" />
          <rect x="0" y="22" width="24" height="3" rx="1" fill={INK} />
          <g opacity="0">
            <animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;.62;.7;.92;1" dur="2.4s" repeatCount="indefinite" />
            <circle cx="24" cy="-2" r="6" fill="#0f9d58" stroke={INK} strokeWidth="1" />
            <path d="M21.5 -2 L23.3 0 L26.7 -4" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
          </g>
        </g>
        {/* glowing transaction signal */}
        <g>
          <animateMotion dur="2.4s" repeatCount="indefinite" calcMode="spline" keyPoints="0;1;1" keyTimes="0;.68;1" keySplines=".4 0 .6 1;0 0 1 1">
            <mpath href="#upi-link" />
          </animateMotion>
          <circle r="9" fill="url(#glow-upi)" />
          <circle r="3.4" fill="#7a4dff" stroke="#fff" strokeWidth="1.2" />
        </g>
        {/* pulse at the sending phone */}
        <circle cx="35" cy="46" r="10" fill="none" stroke="#7a4dff" strokeWidth="1.2">
          <animate attributeName="r" values="10;20" dur="2.4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values=".7;0" dur="2.4s" repeatCount="indefinite" />
        </circle>
      </Frame>
    </svg>
  );
}

export default function ScenarioScene({ kind, active }) {
  if (kind === "emergency") return <EmergencyScene active={active} />;
  if (kind === "food") return <DeliveryScene active={active} />;
  return <UpiScene active={active} />;
}
