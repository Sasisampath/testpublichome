"use client";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { Audience } from "./audiences";
import { IS_FIGMA_EXPORT } from "@/lib/figma-export";

// Pixel size of the mosaic, relative to the headline font size.
const CELL_EM = 0.15;

// The colour change (~460ms) as discrete steps of three shared values:
// z = pixel magnification, k = whole-pixel shift amount, drop = share of
// pixels missing. Half-way the pixels swap from the old colour to the new one.
// Stepping (not tweening) gives the precise digital feel.
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
// Short settle before the one-time page-load transition.
const LOAD_DELAY_MS = 250;

// "ink" is the neutral headline colour the word starts in before page load.
type Tone = Audience | "ink";
type Morph = { from: Tone; to: Tone; w: number; h: number; cells: CSSProperties[]; key: number };

const pick = <T,>(values: readonly T[]) => values[Math.floor(Math.random() * values.length)];

// Square whole-pixel cells over the word (plus a little above and below).
// Each cell magnifies its own centre, so it renders as one solid "pixel" of
// the glyph. Per-cell values are fixed; the shared step values drive motion.
function buildCells(w: number, h: number, fontSize: number): CSSProperties[] {
  const size = Math.max(4, Math.round(fontSize * CELL_EM));
  const left = -size;
  const top = Math.round(-h * 0.1);
  const cols = Math.ceil((w + size * 2) / size);
  const rows = Math.ceil((h * 1.2) / size);
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

// Hero headline: "Full-stack AI / Distribution Platform". The wording never
// changes; "Distribution" takes the selected audience colour through a short
// pixel transformation, once on load and once per actual role change.
export function HeroHeadline({ role }: { role: Audience }) {
  const [tone, setTone] = useState<Tone>(IS_FIGMA_EXPORT ? role : "ink");
  const [morph, setMorph] = useState<Morph | null>(null);
  const shown = useRef<Tone>(tone);
  const slotRef = useRef<HTMLSpanElement>(null);
  const morphRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (shown.current === role) return;
    const from = shown.current;
    const el = slotRef.current;
    if (!el || IS_FIGMA_EXPORT || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      shown.current = role;
      setMorph(null);
      setTone(role);
      return;
    }
    let timer = window.setTimeout(() => {
      shown.current = role;
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      setTone(role);
      setMorph({ from, to: role, w, h, cells: buildCells(w, h, parseFloat(getComputedStyle(el).fontSize)), key: Date.now() });
      timer = window.setTimeout(() => setMorph(null), MORPH_MS);
    }, from === "ink" ? LOAD_DELAY_MS : 0);
    return () => window.clearTimeout(timer);
  }, [role]);

  // Drive the steps by writing the shared values straight to the DOM
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

  const inkSize = morph ? { width: morph.w, height: morph.h } : undefined;
  return (
    <h1 id="distribution-title" className="dh-hero-title">
      <span className="sr-only">Full-stack AI Distribution Platform</span>
      <span className="dh-hero-title__visual" aria-hidden="true">
        <span className="dh-hero-title__line">Full-stack AI</span>
        <span className="dh-hero-title__line dh-hero-title__line--word">
          <span ref={slotRef} className="dh-word-slot">
            <span className={`dh-word dh-tone--${tone}${morph ? " is-morphing" : ""}`}>Distribution</span>
            {morph && (
              <span ref={morphRef} key={morph.key} className="dh-word-px">
                {morph.cells.map((cell, i) => (
                  <span key={i} className="dh-px" style={cell}>
                    <span className={`dh-px__ink dh-px__ink--out dh-tone--${morph.from}`} style={inkSize}>Distribution</span>
                    <span className={`dh-px__ink dh-px__ink--in dh-tone--${morph.to}`} style={inkSize}>Distribution</span>
                  </span>
                ))}
              </span>
            )}
          </span>
          <span>Platform</span>
        </span>
      </span>
    </h1>
  );
}
