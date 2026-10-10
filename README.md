# JazzHQ homepage

Standalone public homepage for JazzHQ. It contains the homepage, the vendor form page and the
components, static content and assets they need. There is no backend, API client
or application code in this repository.

## Develop

```bash
npm install
npm run dev
```

Checks: `npm run typecheck`, `npm run lint`, `npm run build`.

## Pages and navigation

Frontend approval build with four routes: `/` (homepage) and three journey form
pages that share one component (`src/components/form-page`): `/for-vendors`,
`/for-partners` and `/for-buyers`. Each has the portrait video, the Trusted By
ticker and a Fillout form in an iframe over its Figma background image
(`public/forms/`). Copy, form IDs and images are in `src/data/form-pages.ts`;
the buyer form ID is not set yet. There is no backend or API code.

All destinations live in `src/data/navigation.ts`. An item with `href: null` is
shown but does not navigate (About Us, Marketplace, footer links, "Summarize
with AI"). Wire real destinations there.

## Figma export mode

For HTML-to-Figma capture only. Set `NEXT_PUBLIC_FIGMA_EXPORT=true` on a separate
preview deployment (never production). The hero then renders
`public/figma-export/vinyl-player-static.png` instead of the WebGL turntable and
motion is frozen. With the variable unset or `false`, nothing changes.
