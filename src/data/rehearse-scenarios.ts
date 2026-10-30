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
  /** Banner image (optimised WebP, 16:7, ~960×420). Until the file exists in
   *  /public, the card shows a neutral placeholder. */
  image: string;
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
    image: "/assets/rehearsehq/partnership-terms.webp",
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
    image: "/assets/rehearsehq/solution-discovery.webp",
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
    image: "/assets/rehearsehq/partnership-revenue.webp",
    roleplayUrl: null,
  },
];
