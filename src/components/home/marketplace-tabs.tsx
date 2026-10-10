"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import {
  HOW_IT_WORKS_ORDER,
  MARKETPLACE_CONFIG,
  type MarketplaceConfig,
  type MarketplaceRole,
} from "@/data/how-it-works";
import { BuyerProblemPanel } from "@/components/home/buyer-problem-panel";
import { Reveal } from "@/components/home/reveal";

function AgentCta({ config }: { config: MarketplaceConfig }) {
  return (
    <a href={config.href} title="Contact the JazzHQ team by email" className="dh-agent-cta">
      {config.cta}
      <span aria-hidden="true">→</span>
    </a>
  );
}

function StepsPanel({ config }: { config: MarketplaceConfig }) {
  const [active, setActive] = useState(0);
  const panel = config.panels[active];

  // Screenshots are large; warm the rest of this audience's set once idle so
  // switching steps never shows an empty frame.
  useEffect(() => {
    const warm = () => config.panels.forEach(({ image }) => { new window.Image().src = image; });
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(warm);
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(warm, 1200);
    return () => clearTimeout(id);
  }, [config]);

  return (
    <div className="dh-how-grid">
      <div className="dh-how-steps">
        {config.intro && <p className="dh-how-intro">{config.intro}</p>}
        <div className="dh-step-selectors" aria-label={`${config.tabLabel} steps`}>
          {config.panels.map((step, i) => (
            <button key={step.id} type="button" className={`dh-step-choice ${i === active ? "is-open" : ""}`}
              aria-pressed={i === active} aria-controls={`step-content-${config.role}`} onClick={() => setActive(i)}>
              <span className="dh-step__num">{String(i + 1).padStart(2, "0")}</span>
              <span className="dh-step__title">{step.title}</span>
              <span className="dh-step-chevron" aria-hidden="true">↗</span>
            </button>
          ))}
        </div>
        <div id={`step-content-${config.role}`} className="dh-active-step" aria-live="polite" aria-atomic="true">
          <h3>{panel.title}</h3>
          {panel.description && <p>{panel.description}</p>}
          {panel.points && <ul>{panel.points.map(point => <li key={point}>{point}</li>)}</ul>}
        </div>
      </div>
      <figure className="dh-product-window">
        <div className="dh-window-bar" aria-hidden="true"><span /><span /><span /><small>JazzHQ / {panel.title}</small></div>
        <div className="dh-product-window__shot">
          <Image key={panel.image} src={panel.image} alt={panel.imageAlt} fill
            sizes="(max-width: 767px) 90vw, (max-width: 1023px) 55vw, 660px" className="dh-product-window__img" />
        </div>
        <figcaption>{String(active + 1).padStart(2, "0")} / {String(config.panels.length).padStart(2, "0")}<span>{panel.title}</span></figcaption>
      </figure>
      <div className="dh-how-cta"><AgentCta config={config} /></div>
    </div>
  );
}

function BuyerPanel({ config }: { config: MarketplaceConfig }) {
  const panel = config.panels[0];
  return (
    <div className="dh-how-grid dh-how-grid--buyer">
      <div className="dh-buyer-copy">
        <h3>Start With the Problem,<br />Not the Product.</h3>
        <p className="dh-buyer-copy__lead">{panel.description}</p>
        {panel.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        <AgentCta config={config} />
      </div>
      <BuyerProblemPanel />
    </div>
  );
}

export function MarketplaceTabs() {
  const [role, setRole] = useState<MarketplaceRole>(HOW_IT_WORKS_ORDER[0]);
  const roles = HOW_IT_WORKS_ORDER;
  const config = MARKETPLACE_CONFIG[role];
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const handleTabKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % roles.length;
    else if (event.key === "ArrowLeft") next = (index + roles.length - 1) % roles.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = roles.length - 1;
    else return;
    event.preventDefault(); setRole(roles[next]); tabRefs.current[next]?.focus();
  };

  return (
    <section id="marketplace" className="dh-how dh-container" aria-labelledby="how-title">
      <Reveal className="dh-section-head">
        <h2 id="how-title">How it works</h2>
      </Reveal>

      <div
        className={`dh-segmented dh-accent--${role}`}
        role="tablist"
        aria-label="Choose your audience"
        style={{ "--dh-seg-index": roles.indexOf(role), "--dh-seg-count": roles.length } as React.CSSProperties}
      >
        <span className="dh-segmented__thumb" aria-hidden="true" />
        {roles.map((item, index) => (
          <button
            key={item}
            ref={(node) => { tabRefs.current[index] = node; }}
            type="button"
            role="tab"
            id={`marketplace-tab-${item}`}
            aria-controls="marketplace-audience-panel"
            aria-selected={role === item}
            tabIndex={role === item ? 0 : -1}
            onClick={() => setRole(item)}
            onKeyDown={(event) => handleTabKey(event, index)}
          >
            {MARKETPLACE_CONFIG[item].tabLabel}
          </button>
        ))}
      </div>

      <div
        key={role}
        role="tabpanel"
        id="marketplace-audience-panel"
        aria-labelledby={`marketplace-tab-${role}`}
        className={`dh-how-panel dh-how-panel--${role} dh-accent--${role}`}
      >
        {role === "buyer" ? <BuyerPanel config={config} /> : <StepsPanel config={config} />}
      </div>
    </section>
  );
}
