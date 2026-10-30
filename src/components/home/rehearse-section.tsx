"use client";

import { useCallback, useEffect, useRef, useState, type FocusEvent, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Clock, TrendingUp } from "lucide-react";
import { REHEARSE_SCENARIOS, REHEARSE_URL, type RehearseScenario } from "@/data/rehearse-scenarios";
import { Reveal } from "@/components/home/reveal";
import { IS_FIGMA_EXPORT } from "@/lib/figma-export";
import "./rehearse-section.css";

const AUTOPLAY_MS = 3000;
const SWIPE_PX = 45;
const COUNT = REHEARSE_SCENARIOS.length;

// Position of card `index` relative to the active card: -1 (left), 0, +1 (right).
const offsetOf = (index: number, active: number) => ((index - active + 1 + COUNT * 2) % COUNT) - 1;

// External RehearseHQ destination, or a same-looking button that does nothing
// while the URL has not been supplied yet.
function RehearseLink({ href, className, children, tabIndex, onClick }: {
  href: string | null; className: string; children: ReactNode; tabIndex?: number;
  onClick?: (event: React.MouseEvent) => void;
}) {
  if (href) {
    return <a href={href} target="_blank" rel="noopener noreferrer" className={className} tabIndex={tabIndex} onClick={onClick}>{children}</a>;
  }
  return <button type="button" className={className} tabIndex={tabIndex} onClick={onClick}>{children}</button>;
}

function Banner({ src }: { src: string }) {
  const [failed, setFailed] = useState(false);
  const ref = useRef<HTMLImageElement>(null);
  // The file may already have failed before hydration; onError would not fire then.
  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, []);
  return (
    <div className="dh-rh-card__banner" aria-hidden="true">
      {!failed && (
        // eslint-disable-next-line @next/next/no-img-element
        <img ref={ref} src={src} alt="" width={960} height={420} loading="lazy" decoding="async" draggable={false} onError={() => setFailed(true)} />
      )}
    </div>
  );
}

function ScenarioCard({ scenario, index, count, offset, jumping, active, onSelect }: {
  scenario: RehearseScenario; index: number; count: number; offset: number; jumping: boolean; active: boolean; onSelect: () => void;
}) {
  return (
    <article
      className={`dh-rh-card${active ? " is-active" : ""}${jumping ? " is-jump" : ""}`}
      style={{ "--o": offset } as React.CSSProperties}
      role="group"
      aria-roledescription="slide"
      aria-label={`${index + 1} of ${count}`}
      aria-hidden={active ? undefined : true}
    >
      <div className="dh-rh-card__tags">
        <ul className="dh-rh-card__roles">
          {scenario.roles.map((role) => <li key={role} className="dh-rh-tag">{role}</li>)}
        </ul>
        <span className="dh-rh-tag dh-rh-tag--level">{scenario.difficulty}</span>
      </div>
      <Banner src={scenario.image} />
      <h3 className="dh-rh-card__title">{scenario.title}</h3>
      <p className="dh-rh-card__desc">{scenario.description}</p>
      <div className="dh-rh-card__foot">
        <p className="dh-rh-card__meta">
          <span><Clock size={18} strokeWidth={1.75} aria-hidden="true" />{scenario.duration}</span>
          <span className="dh-rh-card__divider" aria-hidden="true" />
          <span className="dh-rh-card__rate"><TrendingUp size={18} strokeWidth={1.75} aria-hidden="true" />{scenario.winRate}</span>
        </p>
        {/* The whole card is clickable through this link (stretched with ::after);
            on a neighbouring card the first click just brings it to the front. */}
        <RehearseLink
          href={scenario.roleplayUrl}
          className="dh-rh-start"
          tabIndex={active ? undefined : -1}
          onClick={(event) => { if (!active) { event.preventDefault(); onSelect(); } }}
        >
          Start practice<ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
          <span className="sr-only"> — {scenario.title}</span>
        </RehearseLink>
      </div>
    </article>
  );
}

export function RehearseSection() {
  const [active, setActive] = useState(0);
  const [jump, setJump] = useState<number | null>(null);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [reduced, setReduced] = useState(false);
  const carousel = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number; moved: boolean } | null>(null);
  const suppressClick = useRef(false);

  const goTo = useCallback((next: number) => {
    setActive((current) => {
      if (next === current) return current;
      // With three cards, exactly one wraps the long way round; it re-enters from
      // the far side (placed instantly, fading in) instead of sweeping across.
      const wrapper = REHEARSE_SCENARIOS.findIndex((_, i) => Math.abs(offsetOf(i, next) - offsetOf(i, current)) === 2);
      setJump(wrapper >= 0 ? wrapper : null);
      return next;
    });
  }, []);
  const step = useCallback((dir: 1 | -1) => goTo((active + dir + COUNT) % COUNT), [active, goTo]);

  // Keyboard focus follows the active card, so it never rests on a hidden neighbour.
  useEffect(() => {
    const focus = document.activeElement;
    if (focus instanceof HTMLElement && focus.classList.contains("dh-rh-start") && carousel.current?.contains(focus)) {
      carousel.current.querySelector<HTMLElement>(".dh-rh-card.is-active .dh-rh-start")?.focus();
    }
  }, [active]);

  useEffect(() => {
    if (jump === null) return;
    let second = 0;
    const first = requestAnimationFrame(() => { second = requestAnimationFrame(() => setJump(null)); });
    return () => { cancelAnimationFrame(first); cancelAnimationFrame(second); };
  }, [jump]);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(query.matches);
    sync();
    query.addEventListener("change", sync);
    const onVisibility = () => setHidden(document.hidden);
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => { query.removeEventListener("change", sync); document.removeEventListener("visibilitychange", onVisibility); };
  }, []);

  // Autoplay: a fresh 3s wait after every change or resume, so it never jumps ahead.
  const paused = hovered || focused || dragging || hidden || reduced || IS_FIGMA_EXPORT;
  useEffect(() => {
    if (paused) return;
    const timer = window.setTimeout(() => step(1), AUTOPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [paused, step, active]);

  const onPointerDown = (event: PointerEvent) => { drag.current = { x: event.clientX, y: event.clientY, moved: false }; setDragging(true); };
  const onPointerMove = (event: PointerEvent) => {
    const start = drag.current;
    if (start && Math.abs(event.clientX - start.x) > 8) start.moved = true;
  };
  const endDrag = (event: PointerEvent) => {
    const start = drag.current;
    drag.current = null;
    setDragging(false);
    if (!start) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) >= SWIPE_PX && Math.abs(dx) > Math.abs(dy)) { suppressClick.current = true; step(dx < 0 ? 1 : -1); }
    else if (start.moved) suppressClick.current = true;
  };
  // A drag or swipe must not also "click" the card link underneath.
  const onClickCapture = (event: React.MouseEvent) => {
    if (suppressClick.current) { suppressClick.current = false; event.preventDefault(); event.stopPropagation(); }
  };

  const onFocus = (event: FocusEvent) => { if (event.target.matches(":focus-visible")) setFocused(true); };
  const onBlur = (event: FocusEvent) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); };
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "ArrowRight") { event.preventDefault(); step(1); }
    else if (event.key === "ArrowLeft") { event.preventDefault(); step(-1); }
  };

  return (
    <section className="dh-rehearse dh-container" aria-labelledby="rehearse-title">
      <Reveal className="dh-rehearse__grid">
        <div className="dh-rehearse__copy">
          <h2 id="rehearse-title">Practice hard conversations before they happen.</h2>
          <p>Create realistic AI roleplays for sales, partnerships, onboarding and difficult customer conversations. Practice safely, get instant feedback and build confidence before the real conversation.</p>
          <RehearseLink href={REHEARSE_URL} className="dh-agent-cta dh-rehearse__cta">
            Try RehearseHQ<span aria-hidden="true">→</span>
          </RehearseLink>
        </div>

        <div
          ref={carousel}
          className="dh-rehearse__carousel"
          role="region"
          aria-roledescription="carousel"
          aria-label="RehearseHQ practice scenarios"
          onPointerEnter={(event) => { if (event.pointerType === "mouse") setHovered(true); }}
          onPointerLeave={() => setHovered(false)}
          onFocus={onFocus}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
        >
          <div
            className="dh-rh-viewport"
            aria-live={paused ? "polite" : "off"}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onPointerLeave={endDrag}
            onClickCapture={onClickCapture}
          >
            {REHEARSE_SCENARIOS.map((scenario, index) => (
              <ScenarioCard
                key={scenario.id}
                scenario={scenario}
                index={index}
                count={COUNT}
                offset={offsetOf(index, active)}
                jumping={jump === index}
                active={index === active}
                onSelect={() => goTo(index)}
              />
            ))}
          </div>

          <div className="dh-rh-controls">
            <button type="button" className="dh-rh-arrow" aria-label="Previous scenario" onClick={() => step(-1)}><ChevronLeft size={20} aria-hidden="true" /></button>
            <div className="dh-rh-dots" role="group" aria-label="Choose scenario">
              {REHEARSE_SCENARIOS.map((scenario, index) => (
                <button
                  key={scenario.id}
                  type="button"
                  className={`dh-rh-dot${index === active ? " is-active" : ""}`}
                  aria-label={`Scenario ${index + 1} of ${COUNT}`}
                  aria-current={index === active ? "true" : undefined}
                  onClick={() => goTo(index)}
                />
              ))}
            </div>
            <button type="button" className="dh-rh-arrow" aria-label="Next scenario" onClick={() => step(1)}><ChevronRight size={20} aria-hidden="true" /></button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
