"use client";

import { useEffect, useId, useRef, useState } from "react";
import { WORDMARK_SHAPES, WORDMARK_VIEWBOX, type WordmarkShape } from "./footer-wordmark-shapes";

// Giant closing wordmark, drawn inline from the real logo's paths.
//  - Base layer: the old dim monochrome logo (unrevealed state).
//  - Logo layer: dark letters with a faint outline; the Q's rings keep their colours.
//    Revealed bottom → top by a soft mask as the wordmark scrolls into view.
//  - Equalizer: the logo is an instrument of seven keys (J A Z Z · H Q). When the
//    visitor's pointer enters a key, violet LED bars pulse inside that letter and
//    its neighbours give a smaller, delayed green echo; Q pulses its rings instead.
//    A tap plays one short J → Q ripple. Reduced motion: a static highlight.
//    Silent. Only the visitor's input plays a beat; the floating cursors never do.
//  - Fine pointers only (hover + fine pointer, no reduced motion): a decorative
//    cursor layer ("you" + four pointers) drawn above the equalizer.
// Nothing in here is focusable or announced; the container stays aria-hidden.

type Variant = "base" | "logo";

/** Keys left to right: vertical bands of the viewBox (they tile its full width)
 *  and the index of each key's shape in WORDMARK_SHAPES. */
const KEYS = [
  { name: "J", left: 0, right: 52, shape: 7 },
  { name: "A", left: 52, right: 115, shape: 8 },
  { name: "Z1", left: 115, right: 166, shape: 9 },
  { name: "Z2", left: 166, right: 228, shape: 10 },
  { name: "dot", left: 228, right: 254, shape: 4 },
  { name: "H", left: 254, right: 319, shape: 1 },
  { name: "Q", left: 319, right: 382, shape: 6 },
] as const;
const Q_INDEX = KEYS.length - 1;
const Q_DISC = 0; // the Q's inner disc, drawn with its rings ("speaker")
const VIEW_W = 382;

// LED column heights (viewBox units), reused in a staggered order per key.
const LEVELS = [36, 45, 49, 39, 55, 46, 51, 37, 43, 54, 47, 41];
const LED = { hit: "#9484ff", echo: "#45d89c" } as const;

const BEAT_MS = 850; // a beat settles after this
const RIPPLE_STAGGER = 60;
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
const TOUCH = "(hover: none), (pointer: coarse)";

function Shape({ shape, variant }: { shape: WordmarkShape; variant: Variant }) {
  const isRing = shape.kind === "ring";
  // The base keeps the asset's original paint (white letters, coloured rings).
  const paint = isRing
    ? shape.paint === "stroke"
      ? { fill: "none", stroke: shape.color, strokeWidth: 2, strokeMiterlimit: 10 }
      : { fill: shape.color }
    : variant === "base"
      ? { fill: "#fff" }
      : { className: "site-wordmark__letter" };
  if (shape.tag === "path") return <path d={shape.d} {...paint} />;
  if (shape.tag === "polygon") return <polygon points={shape.points} {...paint} />;
  return <circle cx={shape.cx} cy={shape.cy} r={shape.r} {...paint} />;
}

/** Bare geometry (for clip paths). */
function Geometry({ shape }: { shape: WordmarkShape }) {
  if (shape.tag === "path") return <path d={shape.d} />;
  if (shape.tag === "polygon") return <polygon points={shape.points} />;
  return <circle cx={shape.cx} cy={shape.cy} r={shape.r} />;
}

/** LED columns for one key, clipped to its letter. Hidden until the key plays. */
function Meter({ index, tone, uid }: { index: number; tone: "hit" | "echo"; uid: string }) {
  const { left, right } = KEYS[index];
  return (
    <g className={`mark-meter mark-meter--${tone}`} clipPath={`url(#${uid}-clip-${index})`}>
      {Array.from({ length: Math.ceil((right - left) / 4) + 1 }, (_, i) => {
        const height = LEVELS[(i + index * 3) % LEVELS.length];
        return (
          <rect
            key={i}
            className="mark-column"
            x={Math.floor(left / 4) * 4 + i * 4}
            y={56 - height}
            width="4"
            height={height}
            fill={`url(#${uid}-led-${tone})`}
            style={{ animationDelay: `${(tone === "echo" ? 75 : 0) + (i % 4) * 12}ms` }}
          />
        );
      })}
    </g>
  );
}

function WordmarkSvg({ variant, className, uid }: { variant: Variant; className: string; uid: string }) {
  const rings = WORDMARK_SHAPES.filter((shape) => shape.kind === "ring");
  return (
    <svg className={`site-footer__wordmark ${className}`} viewBox={WORDMARK_VIEWBOX} focusable="false" aria-hidden="true">
      {variant === "logo" && (
        <defs>
          {KEYS.map(({ shape }, i) => (
            <clipPath key={i} id={`${uid}-clip-${i}`}><Geometry shape={WORDMARK_SHAPES[shape]} /></clipPath>
          ))}
          {(Object.keys(LED) as (keyof typeof LED)[]).map((tone) => (
            <pattern key={tone} id={`${uid}-led-${tone}`} width="4" height="2.5" patternUnits="userSpaceOnUse">
              <rect width="3.45" height="1.95" rx=".3" fill={LED[tone]} />
            </pattern>
          ))}
        </defs>
      )}
      {KEYS.map(({ name, shape }, i) => (
        <g key={name} className="mark-key" data-key={i}>
          <Shape shape={WORDMARK_SHAPES[shape]} variant={variant} />
          {i === Q_INDEX ? (
            <g className="mark-speaker">
              <Shape shape={WORDMARK_SHAPES[Q_DISC]} variant={variant} />
              {rings.map((ring, r) => <Shape key={r} shape={ring} variant={variant} />)}
            </g>
          ) : (
            variant === "logo" && (
              <>
                <Meter index={i} tone="hit" uid={uid} />
                <Meter index={i} tone="echo" uid={uid} />
              </>
            )
          )}
        </g>
      ))}
    </svg>
  );
}

// ── Decorative pointers ─────────────────────────────────────────────

const BOTS = [
  { label: "AI Buyer", tone: "buyer", seed: 11 },
  { label: "AI Vendor", tone: "vendor", seed: 23 },
  { label: "Channel Partner", tone: "partner", seed: 37 },
  { label: "Jazz AI", tone: "jazz", seed: 53 },
] as const;

const ARROW = "M1.6 1.6 15 6.9 8.9 8.9 6.9 15Z"; // tip at (1.6, 1.6)
const LABEL_X = 13; // label offset from the pointer tip
const LABEL_Y = 13;
const ARROW_SIZE = 16;

function Pointer({ label, className }: { label: string; className: string }) {
  return (
    <div className={`site-wordmark-cursor ${className}`}>
      <svg className="site-wordmark-cursor__arrow" width={ARROW_SIZE} height={ARROW_SIZE} viewBox="0 0 16 16" focusable="false" aria-hidden="true">
        <path d={ARROW} />
      </svg>
      {/* Label drawn by CSS (attr) so it never enters the page text or copy/paste. */}
      <span className="site-wordmark-cursor__label" data-label={label} />
    </div>
  );
}

// Small seeded PRNG so each pointer has its own, repeatable path.
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

type BotState = {
  el: HTMLElement; label: HTMLElement; rand: () => number;
  // Normalised (0–1) positions within the allowed area, so resizes just rescale.
  fx: number; fy: number; tx: number; ty: number;
  start: number; duration: number; pauseUntil: number;
  labelW: number; labelH: number; flipped: boolean;
};

// Below 640px the logo is too small for four labelled pointers (noisy), so it stays static.
const FINE_POINTER = "(hover: hover) and (pointer: fine) and (min-width: 640px)";

export function FooterWordmark() {
  const ref = useRef<HTMLDivElement>(null);
  const youRef = useRef<HTMLDivElement>(null);
  const botRefs = useRef<(HTMLDivElement | null)[]>([]);
  const uid = `wordmark-${useId().replace(/:/g, "")}`;
  // Changes only when the media queries change, never on pointer move or per frame.
  const [interactive, setInteractive] = useState(false);

  // Scroll reveal (unchanged behaviour).
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia(REDUCED_MOTION).matches) return;
    el.classList.add("is-scroll-reveal");

    // Blend band of the soft mask (must match --band in footer.css).
    const BAND = 32;
    let frame = 0;
    let current = -1;
    let target = 0;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 as the wordmark starts entering; 1 only once it is ~fully visible (page bottom).
      const start = vh * 0.98;
      const end = vh - rect.height * 0.96;
      target = Math.min(1, Math.max(0, (start - rect.top) / (start - end)));
    };
    const paint = () => {
      frame = 0;
      // Light easing toward the scroll position; settles within a few frames.
      current = current < 0 ? target : current + (target - current) * 0.18;
      if (Math.abs(target - current) < 0.002) current = target;
      // Band starts fully below the logo (0) and has passed the top at 1.
      el.style.setProperty("--reveal", `${(current * (100 + BAND) - BAND).toFixed(2)}%`);
      // Fully revealed: drop the mask so a lifted letter is never clipped.
      el.classList.toggle("is-revealed", current >= 1);
      if (current !== target) frame = requestAnimationFrame(paint);
    };
    const onScroll = () => { measure(); if (!frame) frame = requestAnimationFrame(paint); };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Effects only for hover-capable fine pointers without reduced motion.
  useEffect(() => {
    const fine = window.matchMedia(FINE_POINTER);
    const reduced = window.matchMedia(REDUCED_MOTION);
    // is-interactive is toggled on the element (not via the className prop) so a
    // re-render never wipes the scroll-reveal classes the effect above adds.
    const sync = () => {
      const on = fine.matches && !reduced.matches;
      setInteractive(on);
      ref.current?.classList.toggle("is-interactive", on);
    };
    sync();
    fine.addEventListener("change", sync);
    reduced.addEventListener("change", sync);
    return () => { fine.removeEventListener("change", sync); reduced.removeEventListener("change", sync); };
  }, []);

  // Pointer tracking and the decorative pointers. Refs + one rAF loop only.
  useEffect(() => {
    const el = ref.current;
    const you = youRef.current;
    if (!interactive || !el || !you) return;

    let width = 0;
    let height = 0;
    const measure = () => {
      width = el.clientWidth;
      height = el.clientHeight;
      for (const bot of bots) { bot.labelW = bot.label.offsetWidth; bot.labelH = bot.label.offsetHeight; }
    };

    // ── "you" cursor: written directly in the pointer handler (no lag, no state).
    const hideYou = () => { el.classList.remove("is-hovering"); };
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const rect = el.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      you.style.transform = `translate3d(${x - 1.6}px, ${y - 1.6}px, 0)`;
      el.classList.add("is-hovering");
    };
    const onLeave = () => hideYou();
    // Never leave the custom cursor stuck: window blur, tab hidden, page scroll.
    const onVisibility = () => { if (document.hidden) hideYou(); syncLoop(); };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerenter", onMove);
    el.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", hideYou);
    window.addEventListener("scroll", hideYou, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    // ── Decorative pointers: eased moves between seeded random waypoints, with pauses.
    const bots: BotState[] = BOTS.map((bot, i) => {
      const node = botRefs.current[i]!;
      const rand = mulberry32(bot.seed);
      const fx = rand();
      const fy = rand();
      return {
        el: node, label: node.querySelector<HTMLElement>(".site-wordmark-cursor__label")!, rand,
        fx, fy, tx: fx, ty: fy, start: 0, duration: 0, pauseUntil: 0, labelW: 0, labelH: 0, flipped: false,
      };
    });
    measure();

    const place = (bot: BotState, nx: number, ny: number) => {
      // Allowed area keeps the arrow and its label fully inside the wordmark box.
      const maxX = Math.max(0, width - ARROW_SIZE);
      const maxY = Math.max(0, height - LABEL_Y - bot.labelH);
      const x = nx * maxX;
      const y = ny * maxY;
      const flip = x + LABEL_X + bot.labelW > width;
      if (flip !== bot.flipped) { bot.flipped = flip; bot.el.classList.toggle("is-flipped", flip); }
      bot.el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
    };

    const plan = (bot: BotState, now: number) => {
      bot.fx = bot.tx; bot.fy = bot.ty;
      // Next waypoint: a moderate hop, not a jump across the whole logo.
      bot.tx = Math.min(1, Math.max(0, bot.fx + (bot.rand() - 0.5) * 0.7));
      bot.ty = bot.rand();
      const dist = Math.hypot((bot.tx - bot.fx) * width, (bot.ty - bot.fy) * height);
      bot.duration = Math.max(1400, (dist / 70) * 1000); // ~70px/s, slow and smooth
      // Occasional 1–3s pause after arriving, otherwise a short beat.
      const pause = bot.rand() < 0.45 ? 1000 + bot.rand() * 2000 : 150 + bot.rand() * 450;
      bot.start = now;
      bot.pauseUntil = now + bot.duration + pause;
    };

    let frame = 0;
    let visible = false;
    let last = 0;
    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      // Resume cleanly after a pause: shift timelines by the time spent stopped.
      if (last && now - last > 250) { const gap = now - last; for (const bot of bots) { bot.start += gap; bot.pauseUntil += gap; } }
      last = now;
      for (const bot of bots) {
        if (now >= bot.pauseUntil) plan(bot, now);
        const t = bot.duration ? Math.min(1, (now - bot.start) / bot.duration) : 1;
        const k = easeInOut(t);
        place(bot, bot.fx + (bot.tx - bot.fx) * k, bot.fy + (bot.ty - bot.fy) * k);
      }
    };
    const syncLoop = () => {
      const run = visible && !document.hidden;
      if (run && !frame) frame = requestAnimationFrame(tick);
      if (!run && frame) { cancelAnimationFrame(frame); frame = 0; }
    };

    const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; syncLoop(); }, { rootMargin: "64px 0px" });
    io.observe(el);
    const ro = new ResizeObserver(() => { measure(); if (!frame) for (const bot of bots) place(bot, bot.fx, bot.fy); });
    ro.observe(el);

    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
      ro.disconnect();
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerenter", onMove);
      el.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", hideYou);
      window.removeEventListener("scroll", hideYou);
      document.removeEventListener("visibilitychange", onVisibility);
      el.classList.remove("is-hovering");
    };
  }, [interactive]);

  // Equalizer beats: only the visitor's own pointer or tap plays one (the floating
  // cursors are decorative). Classes on the key groups through the DOM, no state.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia(REDUCED_MOTION);
    const touch = window.matchMedia(TOUCH);
    const timers = new Set<number>();
    const later = (fn: () => void, ms: number) => {
      const id = window.setTimeout(() => { timers.delete(id); fn(); }, ms);
      timers.add(id);
      return id;
    };
    const cancel = (id: number) => { window.clearTimeout(id); timers.delete(id); };
    let settle = 0;
    let current = -1; // key under the visitor's pointer
    let rippling = false;

    const groups = (index: number) => el.querySelectorAll<SVGGElement>(`.mark-key[data-key="${index}"]`);
    const clearAll = () => el.querySelectorAll(".mark-hit, .mark-echo").forEach((g) => g.classList.remove("mark-hit", "mark-echo"));
    const add = (index: number, name: string) => groups(index).forEach((g) => g.classList.add(name));
    // Removing then re-adding a class only restarts its CSS animations after a style flush.
    const flush = () => void el.offsetWidth;

    /** One beat on a key: violet bars in it, a smaller delayed green echo either side. */
    const beat = (index: number, hold = false) => {
      clearAll();
      flush();
      add(index, "mark-hit");
      if (!reduced.matches) {
        if (index > 0) add(index - 1, "mark-echo");
        if (index < Q_INDEX) add(index + 1, "mark-echo");
      }
      cancel(settle);
      // Reduced-motion hover keeps a static highlight while the pointer stays on the key.
      if (!hold) settle = later(clearAll, BEAT_MS);
    };

    // Key under a point: the bands tile the logo's width (bottom 12px gap excluded).
    const keyAt = (event: PointerEvent | MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const y = event.clientY - rect.top;
      if (!rect.width || y < 0 || y > rect.height - 12) return -1;
      const x = ((event.clientX - rect.left) / rect.width) * VIEW_W;
      return KEYS.findIndex(({ left, right }) => x >= left && x < right);
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch" || rippling) return;
      const index = keyAt(event);
      if (index === current) return; // holding still, or moving within a key: no new beat
      current = index;
      if (index >= 0) beat(index, reduced.matches);
      else if (reduced.matches) clearAll();
    };
    const onLeave = () => {
      current = -1;
      if (reduced.matches) clearAll();
    };

    // Touch: a tap (click; never touchstart, never preventDefault) plays one ripple J → Q.
    const onClick = (event: MouseEvent) => {
      const pointerType = (event as PointerEvent).pointerType;
      if (pointerType ? pointerType !== "touch" : !touch.matches) return;
      if (reduced.matches) {
        const index = keyAt(event);
        if (index >= 0) beat(index);
        return;
      }
      if (rippling) return;
      rippling = true;
      cancel(settle);
      clearAll();
      flush();
      KEYS.forEach((_, index) => later(() => add(index, "mark-hit"), index * RIPPLE_STAGGER));
      later(() => { clearAll(); rippling = false; }, Q_INDEX * RIPPLE_STAGGER + BEAT_MS);
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerenter", onMove);
    el.addEventListener("pointerleave", onLeave);
    el.addEventListener("click", onClick);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerenter", onMove);
      el.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("click", onClick);
      timers.forEach((id) => window.clearTimeout(id));
      timers.clear();
      clearAll();
    };
  }, []);

  return (
    <div ref={ref} className="site-footer__wordmark-reveal" aria-hidden="true">
      <WordmarkSvg variant="base" className="site-footer__wordmark--base" uid={uid} />
      <WordmarkSvg variant="logo" className="site-footer__wordmark--reveal" uid={uid} />
      {interactive && (
        <>
          <div className="site-wordmark-cursors">
            {BOTS.map((bot, i) => (
              <div key={bot.label} ref={(node) => { botRefs.current[i] = node; }} className={`site-wordmark-bot site-wordmark-bot--${bot.tone}`}>
                <Pointer label={bot.label} className="" />
              </div>
            ))}
            <div ref={youRef} className="site-wordmark-you"><Pointer label="you" className="site-wordmark-cursor--you" /></div>
          </div>
        </>
      )}
    </div>
  );
}
