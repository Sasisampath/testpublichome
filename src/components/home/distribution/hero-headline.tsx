"use client";
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { IS_FIGMA_EXPORT } from "@/lib/figma-export";

// "Distribution" in the languages the hero cycles through. The first entry is
// always shown on load and is the word in the stable accessible headline.
const WORDS: { text: string; lang: string; dir?: "rtl" }[] = [
  { text: "Distribution", lang: "en" },
  { text: "distribución", lang: "es" },
  { text: "Vertrieb", lang: "de" },
  { text: "वितरण", lang: "hi" },
  { text: "விநியோகம்", lang: "ta" },
  { text: "分销", lang: "zh-Hans" },
  { text: "توزيع", lang: "ar", dir: "rtl" },
];

const HOLD_MS = 2000;
// Pixel size of the mosaic, relative to the headline font size.
const CELL_EM = 0.15;

// The morph (~460ms) as discrete steps of three shared values:
// z = pixel magnification, k = whole-pixel shift amount, drop = share of
// pixels missing. Stepping (not tweening) gives the precise digital feel.
const STEPS: { at: number; phase: "out" | "in"; z: number; k: number; drop: number }[] = [
  { at: 0, phase: "out", z: 1.6, k: 0, drop: 0 },
  { at: 60, phase: "out", z: 2.6, k: 0, drop: 0.06 },
  { at: 130, phase: "out", z: 3.4, k: 1, drop: 0.22 },
  { at: 200, phase: "in", z: 3.4, k: 1, drop: 0.22 },
  { at: 270, phase: "in", z: 2.6, k: 0, drop: 0.06 },
  { at: 340, phase: "in", z: 1.6, k: 0, drop: 0 },
  { at: 400, phase: "in", z: 1, k: 0, drop: 0 },
];
const MORPH_MS = 460;

type Slot = { w: number; h: number };
type Morph = { from: number; to: number; slot: Slot; cells: CSSProperties[]; key: number };

const pick = <T,>(values: readonly T[]) => values[Math.floor(Math.random() * values.length)];

// Square whole-pixel cells over the part of the slot either word occupies
// (plus a little above and below for tall scripts). Each cell magnifies its
// own centre, so it renders as one solid "pixel" of the glyph. Per-cell
// values are fixed; the shared step values above drive the motion.
function buildCells(slot: Slot, inkW: number, fontSize: number, align: string): CSSProperties[] {
  const size = Math.max(4, Math.round(fontSize * CELL_EM));
  const regionW = Math.min(slot.w, inkW + size * 2);
  const left = Math.round(align === "center" ? (slot.w - regionW) / 2 : slot.w - regionW);
  const top = Math.round(-slot.h * 0.1);
  const cols = Math.ceil(regionW / size);
  const rows = Math.ceil((slot.h * 1.2) / size);
  const cells: CSSProperties[] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = left + col * size;
      const y = top + row * size;
      cells.push({
        left: x, top: y, width: size, height: size,
        "--ix": `${-x}px`, "--iy": `${-y}px`,
        "--ox": `${x + size / 2}px`, "--oy": `${y + size / 2}px`,
        "--dx": `${pick([-1, 0, 0, 0, 0, 1]) * size}px`,
        "--dy": `${pick([-1, 0, 0, 0, 1]) * size}px`,
        "--r": Math.random().toFixed(3),
        "--a": pick([1, 1, 1, 0.55]),
      } as CSSProperties);
    }
  }
  return cells;
}

function WordText({ index, className, style }: { index: number; className: string; style?: CSSProperties }) {
  const word = WORDS[index];
  return <span className={className} lang={word.lang} dir={word.dir} style={style}>{word.text}</span>;
}

// Hero headline: "Full-stack AI / [Distribution] Platform". Only the word in
// the fixed-width slot changes, through a short pixel-fragment morph, and it
// takes the selected audience colour (var(--dh-accent)).
export function HeroHeadline() {
  const [index, setIndex] = useState(0);
  const [morph, setMorph] = useState<Morph | null>(null);
  const [slotW, setSlotW] = useState<number | null>(null);
  const widths = useRef<number[]>([]);
  const slotRef = useRef<HTMLSpanElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const morphRef = useRef<HTMLSpanElement>(null);

  // The slot is as wide as the widest translation, so "Platform" never moves.
  useLayoutEffect(() => {
    const measure = () => {
      const spans = measureRef.current?.children;
      if (!spans) return;
      widths.current = Array.from(spans, (s) => s.getBoundingClientRect().width);
      setSlotW(Math.ceil(Math.max(...widths.current)));
    };
    measure();
    void document.fonts?.ready.then(measure);
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    if (IS_FIGMA_EXPORT || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let current = 0;
    let pending: number | null = null;
    let timer = 0;

    const finish = () => {
      if (pending === null) return;
      current = pending;
      pending = null;
      setIndex(current);
      setMorph(null);
    };
    const step = () => {
      const el = slotRef.current;
      if (!el) return;
      const slot = { w: el.offsetWidth, h: el.offsetHeight };
      const style = getComputedStyle(el);
      pending = (current + 1) % WORDS.length;
      const inkW = Math.max(widths.current[current] ?? slot.w, widths.current[pending] ?? slot.w);
      const cells = buildCells(slot, inkW, parseFloat(style.fontSize), style.getPropertyValue("--word-align").trim());
      setMorph({ from: current, to: pending, slot, cells, key: Date.now() });
      timer = window.setTimeout(() => { finish(); schedule(); }, MORPH_MS);
    };
    const schedule = () => { timer = window.setTimeout(step, HOLD_MS); };
    // Pause while the tab is hidden; resume with a full hold on return.
    const onVisibility = () => {
      window.clearTimeout(timer);
      finish();
      if (!document.hidden) schedule();
    };

    schedule();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  // Drive the morph steps by writing the shared values straight to the DOM
  // (no re-render of the cells, no per-cell animations).
  useEffect(() => {
    const el = morphRef.current;
    if (!morph || !el) return;
    const timers = STEPS.map((step) => window.setTimeout(() => {
      el.classList.toggle("is-in", step.phase === "in");
      el.style.setProperty("--z", String(step.z));
      el.style.setProperty("--k", String(step.k));
      el.style.setProperty("--drop", String(step.drop));
    }, step.at));
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [morph]);

  return (
    <h1 id="distribution-title" className="dh-hero-title">
      <span className="sr-only">Full-stack AI Distribution Platform</span>
      <span className="dh-hero-title__visual" aria-hidden="true">
        <span className="dh-hero-title__line">Full-stack AI</span>
        <span className="dh-hero-title__line dh-hero-title__line--word">
          <span ref={slotRef} className="dh-word-slot" style={slotW ? ({ "--slot-w": `${slotW}px` } as CSSProperties) : undefined}>
            <WordText index={index} className={`dh-word${morph ? " is-morphing" : ""}`} />
            {morph && (
              <span ref={morphRef} key={morph.key} className="dh-word-px">
                {morph.cells.map((cell, i) => (
                  <span key={i} className="dh-px" style={cell}>
                    <WordText index={morph.from} className="dh-px__ink dh-px__ink--out" style={{ width: morph.slot.w, height: morph.slot.h }} />
                    <WordText index={morph.to} className="dh-px__ink dh-px__ink--in" style={{ width: morph.slot.w, height: morph.slot.h }} />
                  </span>
                ))}
              </span>
            )}
          </span>
          <span>Platform</span>
        </span>
        <span ref={measureRef} className="dh-word-measure">
          {WORDS.map((word) => <span key={word.lang} lang={word.lang} dir={word.dir}>{word.text}</span>)}
        </span>
      </span>
    </h1>
  );
}
