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
  portrait: string;
  quote: string;
  metric: { value: string; label: string };
  logo: string;
};

// Homepage "Trusted by" stories. Only approved stories belong here; the
// section shows navigation automatically once there is more than one (max 3).
export const CUSTOMER_STORIES: CustomerStory[] = [
  {
    company: "SeamlessHR",
    person: "Seun Obatuyi",
    role: "Vice President",
    portrait: "/assets/testimonials/seun-obatuyi.webp",
    quote: "With JazzHQ, we were able to find the right partners, engage deeply with them and double revenue within a year.",
    metric: { value: "2×", label: "revenue within a year" },
    logo: "/assets/testimonials/logo-seamlesshr.svg",
  },
];
