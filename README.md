# JazzHQ homepage

Standalone public homepage for JazzHQ. It contains only the `/` route and the
components, static content and assets it needs. There is no backend, API client
or application code in this repository.

## Develop

```bash
npm install
npm run dev
```

Checks: `npm run typecheck`, `npm run lint`, `npm run build`.

## Navigation

This build exposes only `/`. The header and footer link to no other pages, and
the CTA buttons do not navigate. The "Talk to … Agent" CTAs open an email to
`contact@jazzhq.ai`.

## Figma export mode

For HTML-to-Figma capture only. Set `NEXT_PUBLIC_FIGMA_EXPORT=true` on a separate
preview deployment (never production). The hero then renders
`public/figma-export/vinyl-player-static.png` instead of the WebGL turntable and
motion is frozen. With the variable unset or `false`, nothing changes.
