import { FOUNDING_LOGOS } from "@/data/home";
import { LogoStripMarquee } from "@/components/shared/logo-strip-marquee";
import { BackedByCards } from "@/components/home/backed-by-cards";
import { Reveal } from "@/components/home/reveal";

export function BackedBySection() {
  return (
    <section className="dh-backed" aria-labelledby="backed-title">
      <div className="dh-container">
        <Reveal className="dh-section-head">
          <h2 id="backed-title">Backed by the Best in the Industry</h2>
          <p>
            Our early investors include prominent founders and seasoned
            executives, who&apos;ve worked at large corporates and leading
            marketplaces
          </p>
        </Reveal>
        <Reveal><BackedByCards /></Reveal>
      </div>

      <LogoStripMarquee logos={FOUNDING_LOGOS} className="dh-backed__logos" />
    </section>
  );
}
