"use client";

import Image from "next/image";
import { useState } from "react";
import { CUSTOMER_STORIES } from "@/data/home";
import { Reveal } from "@/components/home/reveal";

// Data-driven: one approved story today, up to three later. Navigation only
// renders when there is more than one.
const testimonials = CUSTOMER_STORIES.slice(0, 3);

export function CustomerProof() {
  const [active, setActive] = useState(0);
  const story = testimonials[active];
  const hasNav = testimonials.length > 1;
  const go = (index: number) => setActive((index + testimonials.length) % testimonials.length);

  if (!story) return null;

  return (
    <section className="dh-proof dh-container" aria-labelledby="proof-title">
      <Reveal className="dh-section-head">
        <h2 id="proof-title">Trusted by</h2>
        <p>Hear from technology partners running active operations on JazzHQ.</p>
      </Reveal>

      <Reveal>
        <figure key={story.company} className="dh-proof-card" aria-live={hasNav ? "polite" : undefined}>
          <div className="dh-proof-card__photo">
            <Image src={story.portrait} alt={`${story.person}, ${story.role}, ${story.company}`} width={1500} height={1250} sizes="(max-width: 767px) 90vw, 260px" />
          </div>

          <div className="dh-proof-card__quote">
            <Image src="/assets/testimonials/quote-mark.svg" alt="" width={44} height={38} className="dh-proof-card__mark" />
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
          <div className="dh-proof__nav">
            <button type="button" aria-label="Previous customer story" onClick={() => go(active - 1)}>←</button>
            {testimonials.map((item, i) => (
              <button key={item.company} type="button" aria-label={`Show ${item.company} story`} aria-current={i === active} className="dh-proof__dot" onClick={() => setActive(i)} />
            ))}
            <button type="button" aria-label="Next customer story" onClick={() => go(active + 1)}>→</button>
          </div>
        )}
      </Reveal>
    </section>
  );
}
