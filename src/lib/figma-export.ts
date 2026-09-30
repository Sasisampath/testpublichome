// Figma export mode: a preview-only build flag (NEXT_PUBLIC_FIGMA_EXPORT=true)
// that swaps the WebGL turntable for a still and freezes motion so
// HTML-to-Figma tools capture a stable page. Unset/false in production.
export const IS_FIGMA_EXPORT = process.env.NEXT_PUBLIC_FIGMA_EXPORT === "true";

export const FIGMA_VINYL_STILL = "/figma-export/vinyl-player-static.png";
