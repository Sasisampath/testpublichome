import * as THREE from "three";
import { buildTurntable } from "./turntable-model";
import { AUDIENCES, type Audience } from "./audiences";

/** The approved model with scoped events, interruptible motion and explicit GPU cleanup. */
export function createTurntable(canvas: HTMLCanvasElement, onFailure: () => void) {
  const model = buildTurntable(canvas);
  const { renderer, scene, camera, camHome, player, spin, labelMat } = model;
  const media = matchMedia("(prefers-reduced-motion: reduce)");
  const abort = new AbortController();
  const options = { signal: abort.signal };
  let disposed = false, visible = true, playing = false, frame = 0, last = 0;
  let selected: Audience | null = null;
  let targetY = -0.12, targetX = 0, velocity = 0, omega = 0, swap = 0;
  let drag: { x: number; y: number; knob: THREE.Object3D | null } | null = null;
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const mouse = { x: 0, y: 0 };
  let rpm = 100 / 3;

  function label(audience: Audience | null) {
    const art = document.createElement("canvas");
    art.width = art.height = 512;
    const ctx = art.getContext("2d")!;
    const css = getComputedStyle(canvas);
    const color = audience === "vendor" ? css.getPropertyValue("--cta-vendor") : audience === "partner" ? css.getPropertyValue("--cta-partner") : css.getPropertyValue("--button-dark");
    ctx.fillStyle = color.trim() || "#131315";
    ctx.beginPath(); ctx.arc(256, 256, 256, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,.45)";
    [226, 211].forEach(radius => { ctx.beginPath(); ctx.arc(256, 256, radius, 0, Math.PI * 2); ctx.stroke(); });
    ctx.fillStyle = "#fff"; ctx.textAlign = "center";
    ctx.font = `600 25px ${css.fontFamily}`;
    ctx.fillText(audience ? AUDIENCES[audience].name.toUpperCase() : "AI DISTRIBUTION", 256, 166);
    ctx.font = `500 14px ${css.fontFamily}`;
    ctx.fillText("FULL STACK · HUMAN POWERED", 256, 194);
    ctx.font = `600 35px ${css.fontFamily}`; ctx.fillText("JazzHQ", 256, 333);
    ctx.font = `500 14px ${css.fontFamily}`; ctx.fillText("BUYERS + VENDORS + PARTNERS", 256, 362);
    const texture = new THREE.CanvasTexture(art);
    texture.colorSpace = THREE.SRGBColorSpace;
    labelMat.map?.dispose(); labelMat.map = texture; labelMat.needsUpdate = true;
  }

  function render(now: number) {
    frame = 0;
    if (disposed || !visible || document.hidden) return;
    const dt = Math.min((now - last) / 1000 || 0.016, 0.05); last = now;
    const reduced = media.matches;
    if (!drag && Math.abs(velocity) > 0.0004 && !reduced) { targetY += velocity; velocity *= Math.pow(0.94, dt * 60); }
    targetY = THREE.MathUtils.clamp(targetY, -1.15, 1.15);
    const ease = reduced ? 1 : Math.min(1, dt * 9);
    player.rotation.y += (targetY - player.rotation.y) * ease;
    player.rotation.x += (targetX - player.rotation.x) * ease;
    omega += (((playing && !reduced) ? rpm / 60 * Math.PI * 2 : 0) - omega) * Math.min(1, dt * 3);
    spin.rotation.y -= omega * dt;
    swap = reduced ? 0 : Math.max(0, swap - dt * 2.5);
    model.recordGroup.position.y = Math.sin(swap * Math.PI) * 0.12;
    model.armYaw.rotation.y += ((playing ? model.playYaw : model.restYaw) - model.armYaw.rotation.y) * ease;
    model.armLift.rotation.x += ((playing ? model.liftDown : model.liftUp) - model.armLift.rotation.x) * ease;
    model.cueLever.rotation.x += ((playing ? 0 : 0.55) - model.cueLever.rotation.x) * ease;
    model.led.material.emissiveIntensity = playing ? 2.6 : 0;
    camera.position.x = camHome.x + (reduced ? 0 : mouse.x * 0.10);
    camera.position.y = camHome.y + (reduced ? 0 : Math.sin(now * 0.0005) * 0.018 - mouse.y * 0.05);
    camera.lookAt(0, -0.06, 0);
    renderer.render(scene, camera);
    const settling = Math.abs(targetY - player.rotation.y) + Math.abs(targetX - player.rotation.x) > 0.001;
    if (!reduced || settling) wake();
  }
  function wake() { if (!frame && visible && !document.hidden && !disposed) frame = requestAnimationFrame(render); }
  function resize() {
    const { width, height } = canvas.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setPixelRatio(Math.min(devicePixelRatio, width < 500 ? 1.25 : 1.5));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.fov = Math.max(28, THREE.MathUtils.radToDeg(2 * Math.atan(2.95 / (6.5 * camera.aspect))));
    camera.updateProjectionMatrix(); wake();
  }
  function pick(event: PointerEvent) {
    const rect = canvas.getBoundingClientRect();
    pointer.set((event.clientX - rect.left) / rect.width * 2 - 1, -(event.clientY - rect.top) / rect.height * 2 + 1);
    raycaster.setFromCamera(pointer, camera);
    const controls = [model.volKnob, model.toneKnob, model.startBtn, model.speedKnob];
    let object = raycaster.intersectObjects(controls, true)[0]?.object;
    while (object) { if (controls.includes(object as THREE.Group)) return object; object = object.parent!; }
    return null;
  }
  canvas.addEventListener("pointerdown", event => {
    if (event.button !== 0) return;
    const control = pick(event);
    canvas.setPointerCapture(event.pointerId);
    velocity = 0;
    if (control === model.startBtn) { playing = !playing; wake(); return; }
    if (control === model.speedKnob) { rpm = rpm > 40 ? 100 / 3 : 45; model.speedKnob.rotation.y = rpm > 40 ? -0.9 : 0; wake(); return; }
    drag = { x: event.clientX, y: event.clientY, knob: control };
    canvas.style.cursor = "grabbing";
  }, options);
  canvas.addEventListener("pointermove", event => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = (event.clientX - rect.left) / rect.width * 2 - 1;
    mouse.y = (event.clientY - rect.top) / rect.height * 2 - 1;
    if (drag) {
      const dx = event.clientX - drag.x, dy = event.clientY - drag.y;
      if (drag.knob) drag.knob.rotation.y = THREE.MathUtils.clamp(drag.knob.rotation.y - dy * 0.012, -2.1, 2.1);
      else { targetY += dx * 0.006; velocity = media.matches ? 0 : dx * 0.006; targetX = THREE.MathUtils.clamp(targetX + dy * 0.002, -0.1, 0.16); }
      drag.x = event.clientX; drag.y = event.clientY;
    }
    wake();
  }, options);
  const release = () => { drag = null; canvas.style.cursor = "grab"; };
  canvas.addEventListener("pointerup", release, options);
  canvas.addEventListener("pointercancel", release, options);
  canvas.addEventListener("lostpointercapture", release, options);
  canvas.addEventListener("webglcontextlost", event => { event.preventDefault(); onFailure(); }, options);
  document.addEventListener("visibilitychange", () => { last = performance.now(); wake(); }, options);
  media.addEventListener("change", () => { velocity = 0; wake(); }, options);
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting; last = performance.now();
    if (!visible) { cancelAnimationFrame(frame); frame = 0; } else wake();
  });
  observer.observe(canvas);
  const sizeObserver = new ResizeObserver(resize); sizeObserver.observe(canvas);
  label(null); resize();
  document.fonts.ready.then(() => { if (!disposed) { label(selected); wake(); } });
  return {
    select(audience: Audience | null) { selected = audience; label(audience); playing = audience !== null; swap = 1; wake(); },
    rotate(direction: number) { targetY = THREE.MathUtils.clamp(targetY + direction * 0.35, -1.15, 1.15); velocity = 0; wake(); },
    reset() { targetY = targetX = velocity = 0; wake(); },
    pause() { playing = false; wake(); },
    dispose() { disposed = true; cancelAnimationFrame(frame); abort.abort(); observer.disconnect(); sizeObserver.disconnect(); model.dispose(); },
  };
}
export type TurntableController = ReturnType<typeof createTurntable>;
