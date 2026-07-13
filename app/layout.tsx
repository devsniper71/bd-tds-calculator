import type { Metadata, Viewport } from "next";
import { Newsreader, Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@/components/Analytics";
import { Analytics as VercelAnalytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { FAQ } from "@/lib/faq";

// Display — an editorial serif with optical sizing; carries the authoritative,
// trusted-publication feel and elegant lining numerals.
const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-display",
  axes: ["opsz"],
  style: ["normal", "italic"],
  display: "swap",
  // Next has no built-in metrics for Newsreader, so skip its automatic
  // size-adjusted fallback (which logs a warning) and give it an explicit
  // serif fallback instead.
  fallback: ["Georgia", "Times New Roman", "serif"],
  adjustFontFallback: false,
});

// UI / body — a neutral, highly legible grotesk with tabular-number support.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const SITE_URL = "https://ayakor.com";
const SITE_NAME = "ayakor";
const TITLE = "ayakor — Bangladesh Income Tax & TDS Calculator";
const DESCRIPTION =
  "A precise, modern Bangladesh income-tax and TDS calculator for salaried individuals. Built on the Income Tax Act 2023 as amended by the Finance Ordinance 2025 — covering Assessment Years 2025–26 and 2026–27, with every taxpayer category, investment rebate, minimum tax, and net-wealth surcharge. Free, open, and fully client-side.";

export const metadata: Metadata = {
  title: {
    default: `${TITLE} · AY 2026–27`,
    template: "%s · ayakor",
  },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [
    { name: "Md Rasel Ahmed", url: "https://github.com/meetRaselAhmed" },
  ],
  creator: "Md Rasel Ahmed",
  publisher: "ayakor",
  generator: "Next.js",
  category: "finance",
  classification: "Finance · Tax Calculator",
  keywords: [
    "ayakor",
    "Bangladesh income tax calculator",
    "Bangladesh TDS calculator",
    "BD tax calculator",
    "salary tax Bangladesh",
    "income tax calculator 2025-26",
    "income tax calculator 2026-27",
    "AY 2026-27",
    "AY 2025-26",
    "Assessment Year 2026-27",
    "ITA 2023",
    "Income Tax Act 2023",
    "Finance Ordinance 2025",
    "Finance Act 2024",
    "NBR",
    "National Board of Revenue",
    "investment rebate Bangladesh",
    "minimum tax Bangladesh",
    "net wealth surcharge calculator",
  ],
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/",
      "x-default": "/",
    },
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${TITLE} · AY 2026–27`,
    description:
      "The precise, modern way to calculate your Bangladesh income tax and monthly TDS. Built on ITA 2023 and the Finance Ordinance 2025 — free, open, and client-side.",
    locale: "en_US",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "ayakor — Bangladesh Income Tax Calculator",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${TITLE} · AY 2026–27`,
    description:
      "A precise, modern income-tax and TDS calculator for Bangladesh. Built on ITA 2023 and the Finance Ordinance 2025.",
    images: ["/opengraph-image"],
    creator: "@ayakor",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f2ea" },
    { media: "(prefers-color-scheme: dark)", color: "#141310" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

// JSON-LD structured data — tells search engines this is a finance web app
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "ayakor",
  alternateName: "Ayakor Bangladesh Tax Calculator",
  url: SITE_URL,
  description: DESCRIPTION,
  applicationCategory: "FinanceApplication",
  applicationSubCategory: "Tax Calculator",
  operatingSystem: "Any",
  browserRequirements: "Requires JavaScript. Requires HTML5.",
  inLanguage: "en-US",
  isAccessibleForFree: true,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "BDT",
  },
  author: {
    "@type": "Person",
    name: "Md Rasel Ahmed",
    email: "meetRaselAhmed@gmail.com",
    url: "https://github.com/meetRaselAhmed",
  },
  datePublished: "2025-07-01",
  softwareVersion: "3.0.0",
  about: [
    {
      "@type": "Thing",
      name: "Bangladesh Income Tax",
    },
    {
      "@type": "Thing",
      name: "Tax Deducted at Source (TDS)",
    },
    {
      "@type": "Thing",
      name: "Finance Ordinance 2025",
    },
  ],
  audience: {
    "@type": "Audience",
    geographicArea: {
      "@type": "Country",
      name: "Bangladesh",
    },
  },
  potentialAction: {
    "@type": "UseAction",
    target: SITE_URL,
  },
};

// FAQPage structured data — mirrors the on-page FAQ so Google can show rich
// results. Built from the same source as the visible section (lib/faq.ts).
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={[inter.variable, newsreader.variable].join(" ")}
    >
      <head>
        {/* Apply saved theme before paint to avoid a flash of the wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('ayakor-theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.documentElement.classList.add('dark');}catch(e){}})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body className="font-body antialiased">
        {children}
        {/* Google Analytics 4 — gated on NEXT_PUBLIC_GA_ID */}
        <Analytics />
        {/* Vercel Web Analytics + Speed Insights — no-op unless deployed on Vercel */}
        <VercelAnalytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
