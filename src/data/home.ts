export const LOGO_MARQUEE_DURATION = "36s";

export type LogoItem = {
  name: string;
  src: string;
};

export const TRUSTED_BY_LOGOS: LogoItem[] = [
  {
    name: "SurveySparrow",
    src: "/assets/logos/surveysparrow.png",
  },
  {
    name: "Monday.com",
    src: "/assets/logos/monday.svg",
  },
  {
    name: "WATI",
    src: "/assets/logos/wati.svg",
  },
  {
    name: "SeamlessHR",
    src: "/assets/logos/seamlesshr.svg",
  },
  {
    name: "SuperOps",
    src: "/assets/logos/superops.svg",
  },
  {
    name: "Rocketlane",
    src: "/assets/logos/rocketlane.svg",
  },
  {
    name: "ElevenLabs",
    src: "/assets/logos/elevenlabs.svg",
  },
  {
    name: "HubSpot",
    src: "/assets/logos/hubspot-trusted.svg",
  },
];

export const ADVISORS = [
  {
    name: "Shan Krishnasamy",
    role: "Prev. Co-founder & CTO, Freshworks",
    photo: "/assets/backed-by/advisor-shan.webp",
  },
  {
    name: "Sidharth Malik",
    role: "Advisory Board Member WestBridge Capital;\nPrev. CEO, Clevertap; CRO, Freshworks;\nMD, Akamai Technologies",
    photo: "/assets/backed-by/advisor-sidharth.png",
  },
  {
    name: "Shihab Muhammed",
    role: "Founder & CEO, SurveySparrow;\nPrev. Emp #1 & Co-founder - Freshservice",
    photo: "/assets/backed-by/advisor-shihab.webp",
  },
];

export const FOUNDING_LOGOS: LogoItem[] = [
  {
    name: "ElevenLabs",
    src: "/assets/logos/elevenlabs.svg",
  },
  {
    name: "Intercom",
    src: "/assets/logos/intercom.svg",
  },
  {
    name: "EY",
    src: "/assets/logos/ey.svg",
  },
  {
    name: "plum",
    src: "/assets/logos/plum.svg",
  },
  {
    name: "Klarna",
    src: "/assets/logos/klarna.svg",
  },
  {
    name: "Microsoft",
    src: "/assets/logos/microsoft.svg",
  },
  {
    name: "Zoho",
    src: "/assets/logos/zoho.svg",
  },
  {
    name: "talabat",
    src: "/assets/logos/talabat.svg",
  },
  {
    name: "coupang",
    src: "/assets/logos/coupang.svg",
  },
];

export type CustomerStory = {
  company: string;
  person: string;
  role: string;
  /** Cut-out portrait from Figma, shown on a tile in the story's colour. */
  portrait: string;
  /** Portrait size and offset inside the 260×217 tile, as placed in Figma (px at full size). */
  portraitFit: { size: number; x: number; y: number };
  tone: "buyer" | "vendor" | "partner";
  quote: string;
  metric: { value: string; label: string };
  logo: string;
};

// Homepage "Trusted by" stories, from Figma node 3052:1100. One is shown at a
// time; pagination and auto-rotation appear when there is more than one.
export const CUSTOMER_STORIES: CustomerStory[] = [
  {
    company: "SeamlessHR",
    person: "Seun Obatuyi",
    role: "Vice President, SeamlessHR",
    portrait: "/assets/testimonials/seun-obatuyi-cutout.png",
    portraitFit: { size: 238.3, x: 0, y: 0 },
    tone: "partner",
    quote: "With JazzHQ, we were able to find the right partners, engage deeply with them and double revenue within a year.",
    metric: { value: "2x", label: "Revenue within a year" },
    logo: "/assets/testimonials/logo-seamlesshr.svg",
  },
  {
    company: "Monday.com",
    person: "Chhavi Porwal",
    role: "Regional Partnerships, Monday.com",
    portrait: "/assets/testimonials/chhavi-porwal-cutout.png",
    portraitFit: { size: 227.5, x: 0, y: 0 },
    tone: "buyer",
    quote: "I'm really proud of the partnership we've built with JazzHQ and I look forward to working with them in the future.",
    metric: { value: "2x", label: "Revenue within a year" },
    logo: "/assets/logos/monday.svg",
  },
  {
    company: "HubSpot",
    person: "Shashidhar Bellur",
    role: "Partner Development, HubSpot",
    portrait: "/assets/testimonials/shashidhar-bellur-cutout.png",
    portraitFit: { size: 238, x: -11, y: 31 },
    tone: "vendor",
    quote: "The evening has been fantastic, lots of lived experiences from people. Loved working with the Jazz HQ team.",
    metric: { value: "2x", label: "Revenue within a year" },
    logo: "/assets/logos/hubspot-trusted.svg",
  },
];
