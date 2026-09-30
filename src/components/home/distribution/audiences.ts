export type Audience = "buyer" | "vendor" | "partner";
export const AUDIENCES = {
  buyer: {
    name: "AI Buyer", heading: "I'm an AI Buyer", number: "01",
    proposition: "Find the right AI for your business.",
    description: "Discover AI products by business problem, industry and use case. Understand what they do, who they are built for and who can help you implement them.",
    cta: "Explore Marketplace", variant: "secondary",
  },
  vendor: {
    name: "AI Vendor", heading: "I'm an AI Vendor", number: "02",
    proposition: "Turn a great product into distribution.",
    description: "Get discovered by buyers and a global ecosystem of consultants, agencies and channel partners that can sell, refer, implement and support your product.",
    cta: "List Your Product", variant: "vendor",
  },
  partner: {
    name: "Channel Partner", heading: "I'm a Channel Partner", number: "03",
    proposition: "Build your AI revenue portfolio.",
    description: "Discover AI products your customers need and turn your expertise and relationships into new revenue.",
    cta: "Become a Partner", variant: "partner",
  },
} as const;
export const AUDIENCE_ORDER: Audience[] = ["buyer", "vendor", "partner"];
