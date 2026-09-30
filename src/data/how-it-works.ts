export type MarketplaceRole = "buyer" | "vendor" | "partner";

export type MarketplaceIconName =
  | "search" | "robot" | "eye" | "rocket" | "megaphone" | "ai"
  | "upload" | "users" | "templates" | "handshake" | "package" | "grid"
  | "percent" | "launchFast" | "shield" | "video" | "monitor" | "headset";

export type MarketplacePanel = {
  id: string;
  label: string;
  navIcon: MarketplaceIconName;
  title: string;
  description: string;
  paragraphs?: string[];
  points?: string[];
  image: string;
  imageAlt: string;
};

export type MarketplaceConfig = {
  role: MarketplaceRole;
  tabLabel: string;
  intro?: string;
  cta: string;
  href: string;
  panels: MarketplacePanel[];
};

// Until dedicated agent URLs are supplied, use the live site's public contact.
const supportHref = (role: MarketplaceRole) =>
  `mailto:contact@jazzhq.ai?subject=${encodeURIComponent(`JazzHQ ${role} support enquiry`)}`;

// Tab order for the homepage "How it works" section.
export const HOW_IT_WORKS_ORDER: MarketplaceRole[] = ["vendor", "partner", "buyer"];

export const MARKETPLACE_CONFIG: Record<MarketplaceRole, MarketplaceConfig> = {
  buyer: {
    role: "buyer",
    tabLabel: "AI Buyer",
    cta: "Talk to Buyer Agent",
    href: supportHref("buyer"),
    panels: [{
      id: "problem", label: "Start With the Problem", navIcon: "search",
      title: "Start With the Problem, Not the Product.",
      description: "You shouldn't need to evaluate hundreds of AI tools to solve one business problem.",
      paragraphs: ["Tell us what you're trying to achieve. Our expert team will work with you to scope out your requirement and find the right tools and service providers to drive outcomes."],
      image: "/assets/how-it-works/partner/discover.svg",
      imageAlt: "JazzHQ marketplace product directory",
    }],
  },
  vendor: {
    role: "vendor", tabLabel: "AI Vendor",
    intro: "Start by listing your product. Then activate the distribution engine around it.",
    cta: "Talk to Vendor Support Agent", href: supportHref("vendor"),
    panels: [
      { id: "listing", label: "List for Free", navIcon: "search", title: "List for Free",
        description: "Get discovered by buyers and partners.",
        image: "/assets/how-it-works/vendor/listing.svg", imageAlt: "JazzHQ product listing preview" },
      { id: "train", label: "Train and Enable", navIcon: "robot", title: "Train and Enable",
        description: "Give partners the knowledge, content and AI-powered practice they need to sell.",
        image: "/assets/how-it-works/vendor/ai-management.svg", imageAlt: "JazzHQ AI partner onboarding assistant preview" },
      { id: "scale", label: "Manage and Scale", navIcon: "rocket", title: "Manage and Scale",
        description: "Track deals, partner activity and ecosystem performance through JazzHQ.",
        image: "/assets/how-it-works/vendor/activation.svg", imageAlt: "JazzHQ partner performance overview" },
    ],
  },
  partner: {
    role: "partner", tabLabel: "Channel Partner",
    cta: "Talk to Partner Support Agent", href: supportHref("partner"),
    panels: [
      { id: "listing", label: "List for Free", navIcon: "search", title: "List for Free",
        description: "Get discovered by buyers looking to drive AI mandates.",
        image: "/assets/how-it-works/vendor/listing.svg", imageAlt: "JazzHQ listing experience preview" },
      { id: "build", label: "Build", navIcon: "package", title: "Build",
        description: "Use ready-to-launch AI and SaaS templates to package your expertise into products, services, and repeatable revenue streams.",
        image: "/assets/how-it-works/partner/saas-offering.svg", imageAlt: "JazzHQ AI template library" },
      { id: "learn", label: "Learn", navIcon: "handshake", title: "Learn",
        description: "Everything you need to learn, sell, and stay current on AI in one place — with exclusive vendor-led courses, certifications, playbooks, and AMA sessions co-created with leading AI companies.",
        image: "/assets/how-it-works/partner/learning-center.svg", imageAlt: "JazzHQ partner learning and enablement preview" },
      { id: "grow", label: "Grow", navIcon: "rocket", title: "Grow",
        description: "",
        points: ["Discover products to sell and implement", "Find programs that match your expertise", "Access marketing assets, battlecards and playbooks", "Earn referral, reseller and services revenue"],
        image: "/assets/how-it-works/partner/discover.svg", imageAlt: "JazzHQ product and program directory" },
    ],
  },
};
