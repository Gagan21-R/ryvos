// Picks the visual for the active chapter and wraps it in the sand transition.
import { RealDataVisual, SafetyVisual, SystemVisual } from "./ChapterVisual.jsx";
import SandTransition from "./SandTransition.jsx";

const NAMES = { emergency: "108 Emergency", food: "Free delivery", upi: "UPI payments" };

export default function ChapterVisualFor({ id, learn, data }) {
  let content;
  if (NAMES[id]) {
    const results = (learn.results || []).filter((r) => r.domain === id && r.resilience != null);
    content = <SystemVisual name={NAMES[id]} results={results} proof={data.proof?.[id]} />;
  } else if (id === "real") {
    content = <RealDataVisual series={data.series} model={data.model} />;
  } else {
    content = <SafetyVisual verdicts={learn.verdicts || []} />;
  }
  return <SandTransition className="w-full h-full mix-blend-lighten">{content}</SandTransition>;
}
