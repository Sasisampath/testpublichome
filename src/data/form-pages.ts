import type { JourneyKey } from "@/data/navigation";

// One shared layout for the three journey form pages; the variant supplies the
// copy, the Fillout form and the exact background image exported from its Figma frame.
export type FormPageVariant = {
  heading: string;
  subheading: string;
  /** Image behind the white form card, exported from the journey's Figma frame. */
  backgroundImage: string;
  /** Existing Fillout form ID. `null` = no form supplied for this journey yet. */
  filloutId: string | null;
  metaTitle: string;
};

export const FORM_PAGES: Record<JourneyKey, FormPageVariant> = {
  // Figma node 3018:19585
  vendor: {
    heading: "List Your AI Product",
    subheading: "Get discovered by thousands of partner agencies next week.",
    backgroundImage: "/forms/vendor-form-bg.png",
    filloutId: "iE9ufXCkRUus",
    metaTitle: "List Your AI Product | JazzHQ",
  },
  // Figma node 3018:23729
  partner: {
    heading: "I’m a Channel Partner",
    subheading: "Get discovered by thousands of partner agencies next week.",
    backgroundImage: "/forms/partner-form-bg.png",
    filloutId: "ah91Ye93Jrus",
    metaTitle: "Become a Channel Partner | JazzHQ",
  },
  // Figma node 3018:27873
  buyer: {
    heading: "Become an AI Buyer",
    subheading: "Find AI solutions",
    backgroundImage: "/forms/buyer-form-bg.png",
    filloutId: null,
    metaTitle: "Become an AI Buyer | JazzHQ",
  },
};
