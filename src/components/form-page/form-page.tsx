import { GridBackground } from "@/components/layout/grid-background";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { LogoStripMarquee } from "@/components/shared/logo-strip-marquee";
import { FormVideo } from "@/components/form-page/form-video";
import { TRUSTED_BY_LOGOS } from "@/data/home";
import { FORM_PAGES } from "@/data/form-pages";
import type { JourneyKey } from "@/data/navigation";
import "./form-page.css";

export function FormPage({ variant }: { variant: JourneyKey }) {
  const page = FORM_PAGES[variant];

  return (
    <GridBackground>
      <Header />
      <main className="flex-1">
        <div className="vf-page">
          <div className="vf-left">
            <div>
              <h1>{page.heading}</h1>
              <p>{page.subheading}</p>
            </div>
            <FormVideo />
            <div className="vf-trusted">
              <p className="vf-trusted__label">TRUSTED BY</p>
              <LogoStripMarquee logos={TRUSTED_BY_LOGOS} className="vf-ticker" />
            </div>
          </div>

          <div className="vf-panel">
            {/* Exact Figma image, placed as in the frame: a 1606×1071 layer centred behind the form card. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="vf-panel__bg" src={page.backgroundImage} alt="" />
            {page.filloutId ? (
              // The existing Fillout form, embedded as-is; Fillout hosts it and handles submission.
              <iframe
                src={`https://embed.fillout.com/t/${page.filloutId}?fillout-embed-type=standard`}
                title={`${page.heading} form`}
                className="vf-fillout"
                loading="lazy"
              />
            ) : (
              <div className="vf-fillout vf-fillout--pending">Fillout form not connected yet</div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </GridBackground>
  );
}
