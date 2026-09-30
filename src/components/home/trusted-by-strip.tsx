import { TRUSTED_BY_LOGOS } from "@/data/home";
import { LogoStripMarquee } from "@/components/shared/logo-strip-marquee";

export function TrustedByStrip() {
  return <LogoStripMarquee logos={TRUSTED_BY_LOGOS} label="Trusted by" />;
}
