"use client";

import Image from "next/image";
import { useRef, useState, type KeyboardEvent } from "react";
import { CUSTOMER_STORIES } from "@/data/home";
import { Reveal } from "@/components/home/reveal";

const stories = CUSTOMER_STORIES.slice(0, 3);

export function CustomerProof() {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const story = stories[active];
  const hasNav = stories.length > 1;

  const go = (index: number) => {
    const next = (index + stories.length) % stories.length;
    setActive(next);
    return next;
  };
  const handleKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const delta = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!delta) return;
    event.preventDefault();
    tabRefs.current[go(index + delta)]?.focus();
  };

  if (!story) return null;

  return (
    <section className="dh-proof dh-container" aria-labelledby="proof-title">
      <Reveal className="dh-proof__head">
        <h2 id="proof-title">Trusted by</h2>
        <p>Hear from technology partners running active operations on JazzHQ.</p>
        {hasNav && (
          <div className="dh-proof__tabs" role="tablist" aria-label="Customer stories">
            {stories.map((item, i) => (
              <button
                key={item.company}
                ref={(node) => { tabRefs.current[i] = node; }}
                type="button"
                role="tab"
                id={`proof-tab-${i}`}
                aria-selected={i === active}
                aria-controls="proof-panel"
                tabIndex={i === active ? 0 : -1}
                onClick={() => setActive(i)}
                onKeyDown={(event) => handleKey(event, i)}
              >
                <span>{String(i + 1).padStart(2, "0")}</span>{item.company}
              </button>
            ))}
          </div>
        )}
      </Reveal>

      <Reveal className="dh-proof-stage">
        <figure
          key={story.company}
          id="proof-panel"
          className="dh-proof-card"
          {...(hasNav ? { role: "tabpanel", "aria-labelledby": `proof-tab-${active}` } : {})}
        >
          <div className="dh-proof-card__photo">
            <Image src={story.portrait} alt={`${story.person}, ${story.role}, ${story.company}`} width={1500} height={1250} sizes="(max-width: 767px) 90vw, 320px" />
          </div>
          <div className="dh-proof-card__quote">
            <span className="dh-proof-card__mark" aria-hidden="true">“</span>
            <blockquote>{story.quote}</blockquote>
            <figcaption>
              <span className="dh-proof-card__person"><strong>{story.person}</strong>{story.role}, {story.company}</span>
              <Image src={story.logo} alt={`${story.company} logo`} width={135} height={28} className="dh-proof-card__logo" />
            </figcaption>
          </div>
          <div className="dh-proof-card__stat">
            <p className="dh-proof-card__stat-value">{story.metric.value}</p>
            <p className="dh-proof-card__stat-label">{story.metric.label}</p>
          </div>
        </figure>

        {hasNav && (
          <div className="dh-proof__dots">
            <button type="button" aria-label="Previous customer story" onClick={() => go(active - 1)}>←</button>
            {stories.map((item, i) => (
              <button key={item.company} type="button" aria-label={`Show ${item.company} story`} aria-current={i === active} className="dh-proof__dot" onClick={() => setActive(i)} />
            ))}
            <button type="button" aria-label="Next customer story" onClick={() => go(active + 1)}>→</button>
          </div>
        )}
      </Reveal>
    </section>
  );
}
