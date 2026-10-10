"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { IS_FIGMA_EXPORT } from "@/lib/figma-export";

// Illustrative prompts only. The panel depicts the buyer conversation;
// the real entry point is the "Talk to Buyer Agent" CTA beside it.
const EXAMPLE_PROBLEMS = [
  "Help our team spend less time on manual work.",
  "Qualify inbound leads before they reach sales",
  "Pull data out of invoices and contracts",
];

const EXAMPLE_TOPICS = ["Customer support", "Sales", "Operations", "Finance"];

// Mirrors the PDF copy: tell us → scope with experts → matched tools and providers.
const STEPS = [
  "Tell us what you're trying to achieve",
  "Scope the requirement with our expert team",
  "Get the right tools and service providers",
];

export function BuyerProblemPanel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (IS_FIGMA_EXPORT || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % EXAMPLE_PROBLEMS.length), 3600);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="dh-buyer-panel" role="img" aria-label="Illustration: describe the business problem you want to solve and JazzHQ scopes it with you">
      <div className="dh-window-bar" aria-hidden="true"><span /><span /><span /></div>
      <div className="dh-buyer-panel__body" aria-hidden="true">
        <p className="dh-buyer-panel__title">What are you trying to solve?</p>
        <p className="dh-buyer-panel__hint">Start with your business challenge.</p>
        <div className="dh-buyer-panel__field">
          <span key={index} className="dh-buyer-panel__prompt">{EXAMPLE_PROBLEMS[index]}</span>
          <span className="dh-buyer-panel__send"><ArrowUp size={18} strokeWidth={2.4} /></span>
        </div>
        <div className="dh-buyer-panel__chips">
          {EXAMPLE_TOPICS.map((topic) => <span key={topic}>{topic}</span>)}
        </div>
        <ol className="dh-buyer-panel__steps">
          {STEPS.map((step, i) => (
            <li key={step}><span>{String(i + 1).padStart(2, "0")}</span>{step}</li>
          ))}
        </ol>
        <p className="dh-buyer-panel__example">Example conversation — connect with our team to get started.</p>
      </div>
    </div>
  );
}
