import Script from "next/script";

const GA_MEASUREMENT_IDS = ["G-24396P8G2K", "G-PNF25CEB7X"] as const;
const COOKIEYES_SCRIPT_URL =
  "https://cdn-cookieyes.com/client_data/94742cc11931b834d66572cc/script.js";

const isProduction = process.env.NODE_ENV === "production";

export function ConsentScripts() {
  if (!isProduction) {
    return null;
  }

  return (
    <Script
      id="cookieyes"
      src={COOKIEYES_SCRIPT_URL}
      strategy="beforeInteractive"
    />
  );
}

export function AnalyticsScripts() {
  if (!isProduction) {
    return null;
  }

  return (
    <>
      <Script
        id="google-analytics-loader"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_IDS[0]}`}
        strategy="afterInteractive"
        data-cookieyes="cookieyes-analytics"
      />

      <Script
        id="google-analytics"
        strategy="afterInteractive"
        data-cookieyes="cookieyes-analytics"
      >
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          ${GA_MEASUREMENT_IDS.map((id) => `gtag('config', '${id}');`).join("\n          ")}
        `}
      </Script>

      <Script
        id="microsoft-clarity"
        strategy="afterInteractive"
        data-cookieyes="cookieyes-analytics"
      >
        {`
          (function (c, l, a, r, i, t, y) {
            c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments) };
            t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i;
            y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
          })(window, document, "clarity", "script", "tmy1bjv7eb");
        `}
      </Script>
    </>
  );
}
