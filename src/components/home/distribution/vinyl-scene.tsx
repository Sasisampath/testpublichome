"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Audience } from "./audiences";
import type { TurntableController } from "./turntable-controller";
import { FIGMA_VINYL_STILL, IS_FIGMA_EXPORT } from "@/lib/figma-export";

export function VinylScene({ audience }: { audience: Audience | null }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const controller = useRef<TurntableController | null>(null);
  const selection = useRef(audience);
  const [status, setStatus] = useState<"loading" | "ready" | "fallback">("loading");
  useEffect(() => {
    selection.current = audience;
    controller.current?.select(audience);
  }, [audience]);
  useEffect(() => {
    if (IS_FIGMA_EXPORT) return; // Still image only; never mount WebGL.
    let cancelled = false;
    const fail = () => { controller.current?.dispose(); controller.current = null; setStatus("fallback"); };
    import("./turntable-controller").then(({ createTurntable }) => {
      if (cancelled || !canvas.current) return;
      try { controller.current = createTurntable(canvas.current, fail); controller.current.select(selection.current); setStatus("ready"); }
      catch { fail(); }
    }).catch(() => { if (!cancelled) fail(); });
    return () => { cancelled = true; controller.current?.dispose(); controller.current = null; };
  }, []);
  return <div className="dh-scene">
    <div className="dh-scene-stage">
      {IS_FIGMA_EXPORT ? <div className="dh-scene-fallback">
        <Image src={FIGMA_VINYL_STILL} alt="JazzHQ walnut turntable" fill sizes="(max-width: 767px) 100vw, 55vw" priority unoptimized className="object-contain" />
      </div> : status !== "ready" && <div className="dh-scene-fallback">
        <Image src="/assets/home/turntable.webp" alt="JazzHQ walnut turntable" fill sizes="(max-width: 767px) 100vw, 55vw" priority className="object-contain" />
      </div>}
      {!IS_FIGMA_EXPORT && <canvas ref={canvas} className="dh-canvas" style={{ opacity: status === "ready" ? 1 : 0 }} aria-label="Interactive JazzHQ turntable. Drag horizontally to rotate, or use the buttons below." />}
    </div>
    <div className="dh-scene-caption"><span>{status === "fallback" ? "JazzHQ / AI Distribution" : "Drag to explore · Choose a record below"}</span>
      {(status === "ready" || IS_FIGMA_EXPORT) && <div className="dh-scene-controls">
        <button type="button" onClick={() => controller.current?.rotate(-1)} aria-label="Rotate turntable left">↶</button>
        <button type="button" onClick={() => controller.current?.reset()} aria-label="Reset turntable view">Reset</button>
        <button type="button" onClick={() => controller.current?.rotate(1)} aria-label="Rotate turntable right">↷</button>
        <button type="button" onClick={() => controller.current?.pause()} aria-label="Pause record rotation">Ⅱ</button>
      </div>}
    </div>
  </div>;
}
