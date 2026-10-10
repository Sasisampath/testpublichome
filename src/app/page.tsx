import type { Metadata } from "next";
import { GridBackground } from "@/components/layout/grid-background";
import { TopBanner } from "@/components/layout/top-banner";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { TrustedByStrip } from "@/components/home/trusted-by-strip";
import { DistributionHero } from "@/components/home/distribution/hero";
import { MarketplaceTabs } from "@/components/home/marketplace-tabs";
import { JazzClubClose } from "@/components/home/distribution/jazzclub-section";
import { CustomerProof } from "@/components/home/customer-proof";
import { DataResponsibilitySection } from "@/components/home/data-responsibility-section";
import { pageSeo } from "@/lib/seo";
import { IS_FIGMA_EXPORT } from "@/lib/figma-export";
import "@/components/home/distribution/homepage.css";

export const metadata: Metadata = pageSeo({
  title: "AI Distribution Platform | JazzHQ",
  description: "JazzHQ connects companies looking for AI with the vendors building it and the trusted partners who can sell, implement and support it.",
  path: "/",
});

export default function HomePage() {
  return <GridBackground>
    <TopBanner />
    <Header />
    <main className={`dh-home flex-1${IS_FIGMA_EXPORT ? " dh-figma-export" : ""}`}>
      <DistributionHero />
      <TrustedByStrip />
      <MarketplaceTabs />
      <DataResponsibilitySection />
      <CustomerProof />
      <JazzClubClose />
    </main>
    <Footer />
  </GridBackground>;
}
