"use client";

import Image from "next/image";
import { useEffect, useState, type CSSProperties } from "react";
import { CUSTOMER_STORIES } from "@/data/home";
import { Reveal } from "@/components/home/reveal";
import { IS_FIGMA_EXPORT } from "@/lib/figma-export";

const testimonials = CUSTOMER_STORIES.slice(0, 3);
const INTERVAL_MS = 5500;

export function CustomerProof() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  // Bumped on manual navigation and on resume so the timer and progress bar restart cleanly.
  const [cycle, setCycle] = useState(0);
  const [autoplay, setAutoplay] = useState(false);
  const hasNav = testimonials.length > 1;

  useEffect(() => {
    if (IS_FIGMA_EXPORT || !hasNav) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setAutoplay(!media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, [hasNav]);

  useEffect(() => {
    if (!autoplay || paused) return;
    const timer = window.setTimeout(() => setActive((index) => (index + 1) % testimonials.length), INTERVAL_MS);
    return () => window.clearTimeout(timer);
  }, [autoplay, paused, active, cycle]);

  const story = testimonials[active];
  if (!story) return null;

  const select = (index: number) => { setActive(index); setCycle((value) => value + 1); };
  const resume = () => { setPaused(false); setCycle((value) => value + 1); };
  const fit = story.portraitFit;

  return (
    <section className="dh-proof dh-container" aria-labelledby="proof-title">
      <Reveal className="dh-section-head">
        <h2 id="proof-title">Trusted by</h2>
        <p>Hear from technology partners running active operations on JazzHQ.</p>
      </Reveal>

      <Reveal>
        <div
          className="dh-proof__stage"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={resume}
          onFocus={() => setPaused(true)}
          onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) resume(); }}
        >
          <figure key={story.company} className={`dh-proof-card dh-accent--${story.tone}`} aria-live={autoplay ? "off" : "polite"}>
            <div className="dh-proof-card__photo">
              <Image
                src={story.portrait}
                alt={`${story.person}, ${story.role}`}
                width={480}
                height={480}
                sizes="260px"
                style={{ "--p-size": fit.size, "--p-x": fit.x, "--p-y": fit.y } as CSSProperties}
              />
            </div>

            <div className="dh-proof-card__quote">
              <Image src="/assets/testimonials/quote-mark.svg" alt="" width={44} height={38} className="dh-proof-card__mark" />
              <blockquote>{story.quote}</blockquote>
              <figcaption>
                <span className="dh-proof-card__person"><strong>{story.person}</strong>{story.role}</span>
                <Image src={story.logo} alt={`${story.company} logo`} width={135} height={28} className="dh-proof-card__logo" />
              </figcaption>
            </div>

            <div className="dh-proof-card__stat">
              <p className="dh-proof-card__stat-value">{story.metric.value}</p>
              <p className="dh-proof-card__stat-label">{story.metric.label}</p>
            </div>
          </figure>

          {hasNav && (
            <div className={`dh-proof__pager${autoplay ? " is-auto" : ""}${paused ? " is-paused" : ""}`} role="group" aria-label="Choose a customer story">
              {testimonials.map((item, index) => (
                <button
                  key={`${item.company}-${index === active ? cycle : "idle"}`}
                  type="button"
                  aria-label={`Show story ${index + 1} of ${testimonials.length}: ${item.person}, ${item.company}`}
                  aria-current={index === active}
                  onClick={() => select(index)}
                />
              ))}
            </div>
          )}
        </div>
      </Reveal>
    </section>
  );
}
