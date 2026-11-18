// Content and destinations for the Homepage RehearseHQ section.
// Everything editable lives here: scenarios, banner images and URLs.

/** "Try RehearseHQ →" (left CTA): the main RehearseHQ website.
 *  TODO: paste the real URL. While null, the button is shown but does not navigate. */
export const REHEARSE_URL: string | null = null;

export type RehearseScenario = {
  id: string;
  /** Role tags, top-left of the card. */
  roles: string[];
  /** Difficulty tag, top-right of the card. */
  difficulty: "Easy" | "Medium" | "Hard";
  title: string;
  description: string;
  duration: string;
  winRate: string;
  /** Banner image in /public/images/hero (WebP, cropped to 16:7 by the card).
   *  If the file is missing, the card shows a neutral placeholder. */
  image: string;
  /** Describes the banner for screen readers. */
  imageAlt: string;
  /** "Start practice →" (card CTA): this scenario's own RehearseHQ roleplay.
   *  TODO: paste each real URL. While null, the button is shown but does not navigate. */
  roleplayUrl: string | null;
};

export const REHEARSE_SCENARIOS: RehearseScenario[] = [
  {
    id: "partnership-terms",
    roles: ["Partner Executive", "Partner Manager"],
    difficulty: "Easy",
    title: "“We can’t approve those partnership terms.”",
    description: "The prospective partner is interested in working together but is unwilling to accept the proposed partnership terms.",
    duration: "4 min",
    winRate: "21% win rate",
    image: "/images/hero/hero-scenario-1.webp",
    imageAlt: "A partner holds up her hand to refuse a contract on a clipboard",
    roleplayUrl: null,
  },
  {
    id: "solution-discovery",
    roles: ["AI Vendor", "Sales Lead"],
    difficulty: "Medium",
    title: "“Why should we choose your solution?”",
    description: "Handle tough questions from a prospective buyer and make a compelling case for your AI solution.",
    duration: "6 min",
    winRate: "34% win rate",
    image: "/images/hero/hero-scenario-2.webp",
    imageAlt: "An AI vendor answers a buyer’s questions about her solution in a meeting",
    roleplayUrl: null,
  },
  {
    id: "partnership-revenue",
    roles: ["Channel Partner", "Partnerships Lead"],
    difficulty: "Medium",
    title: "“Show me how this partnership will drive revenue.”",
    description: "Present a strong business case and address key concerns from a potential channel partner.",
    duration: "5 min",
    winRate: "28% win rate",
    image: "/images/hero/hero-scenario-3.webp",
    imageAlt: "A partnerships lead walks a channel partner through a revenue growth dashboard",
    roleplayUrl: null,
  },
  {
    id: "broken-promise",
    roles: ["Customer", "CSM"],
    difficulty: "Hard",
    title: "“This isn’t what we were promised.”",
    description: "A frustrated customer says onboarding fell short of the sales pitch. Rebuild trust and agree a clear way forward.",
    duration: "7 min",
    winRate: "12% win rate",
    image: "/images/hero/hero-scenario-4.webp",
    imageAlt: "A business leader makes his case across the table, beside a growth arrow and handshake",
    roleplayUrl: null,
  },
];
