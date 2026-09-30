import type { Metadata } from "next";
import { Geist_Mono, Inter, Manrope, Plus_Jakarta_Sans } from "next/font/google";
import {
  AnalyticsScripts,
  ConsentScripts,
} from "@/components/layout/analytics-scripts";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  DEFAULT_SITE_ICON,
  DEFAULT_TITLE,
  INDEXABLE_ROBOTS,
  pageAlternates,
  SITE_NAME,
  SITE_URL,
} from "@/lib/seo";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: pageAlternates("/"),
  title: {
    default: DEFAULT_TITLE,
    template: "%s",
  },
  description: DEFAULT_DESCRIPTION,
  icons: {
    icon: DEFAULT_SITE_ICON,
  },
  robots: INDEXABLE_ROBOTS,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        alt: SITE_NAME,
        width: 1470,
        height: 771,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
};

export const viewport: import("next").Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${manrope.variable} ${plusJakartaSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <ConsentScripts />
      </head>
      <body className="flex min-h-dvh flex-col bg-[#f7f6f2] font-sans text-[#111827]">
        {children}
        <AnalyticsScripts />
    </body>
  </html>
  );
}
