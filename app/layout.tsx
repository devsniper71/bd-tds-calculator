import type { Metadata, Viewport } from "next";
import {
  Fraunces,
  Noto_Sans_Bengali,
  Noto_Serif_Bengali,
} from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n";

// Latin display — variable serif, elegant
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  axes: ["opsz", "SOFT"],
  display: "swap",
});

// Bengali display — Google's professional serif, unambiguous digits
const notoSerifBengali = Noto_Serif_Bengali({
  subsets: ["bengali", "latin"],
  variable: "--font-bn-display",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// Bengali body + numerals — Google's professional sans, clarity-focused
const notoSansBengali = Noto_Sans_Bengali({
  subsets: ["bengali", "latin"],
  variable: "--font-bn",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const SITE_URL = "https://ayakor.com";
const SITE_NAME = "ayakor";
const TITLE_EN = "ayakor — Bangladesh Income Tax & TDS Calculator · AY 2026–27";
const TITLE_BN = "ayakor — বাংলাদেশ আয়কর ও উৎসে কর ক্যালকুলেটর · করবর্ষ ২০২৬–২৭";
const DESCRIPTION =
  "বাংলাদেশের নিখুঁত আয়কর ও উৎসে কর (TDS) ক্যালকুলেটর — Income Tax Act 2023 ও Finance Ordinance 2025-এর ভিত্তিতে। ছয়টি করের স্তর, সব করদাতা শ্রেণী, বিনিয়োগ রেয়াত, সম্পদ সারচার্জ ও ন্যূনতম কর সহ সম্পূর্ণ হিসাব। Free, open, client-side. Calculate your Bangladesh income tax and TDS with precision.";

export const metadata: Metadata = {
  title: {
    default: TITLE_BN,
    template: "%s · ayakor",
  },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [
    { name: "Md Rasel Ahmed", url: "https://github.com/devsniper71" },
  ],
  creator: "Md Rasel Ahmed",
  publisher: "ayakor",
  generator: "Next.js",
  category: "finance",
  classification: "Finance · Tax Calculator",
  keywords: [
    "ayakor",
    "আয়কর",
    "আয়কর ক্যালকুলেটর",
    "বাংলাদেশ আয়কর",
    "বাংলাদেশ কর ক্যালকুলেটর",
    "উৎসে কর কর্তন",
    "TDS ক্যালকুলেটর",
    "Bangladesh income tax calculator",
    "Bangladesh TDS calculator",
    "BD tax calculator",
    "salary tax Bangladesh",
    "বেতনের কর",
    "AY 2026-27",
    "Assessment Year 2026-27",
    "করবর্ষ ২০২৬-২৭",
    "ITA 2023",
    "Income Tax Act 2023",
    "আয়কর আইন ২০২৩",
    "Finance Ordinance 2025",
    "অর্থ অধ্যাদেশ ২০২৫",
    "NBR",
    "National Board of Revenue",
    "জাতীয় রাজস্ব বোর্ড",
    "investment rebate Bangladesh",
    "বিনিয়োগ রেয়াত",
    "minimum tax Bangladesh",
    "ন্যূনতম কর",
    "surcharge calculator",
    "সম্পদ সারচার্জ",
  ],
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
    languages: {
      "bn-BD": "/",
      "en-US": "/?lang=en",
      "x-default": "/",
    },
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: TITLE_BN,
    description:
      "বাংলাদেশের আয়কর ও উৎসে কর হিসাবের সবচেয়ে সঠিক ও আধুনিক ক্যালকুলেটর। Bangla-first bilingual calculator, free and open.",
    locale: "bn_BD",
    alternateLocale: ["en_US"],
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
    title: TITLE_EN,
    description:
      "Bangla-first bilingual income tax calculator for Bangladesh. Built on ITA 2023 and Finance Ordinance 2025.",
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
    { media: "(prefers-color-scheme: dark)", color: "#f6f2ea" },
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
  alternateName: ["আয়কর", "Ayakor Bangladesh Tax Calculator"],
  url: SITE_URL,
  description: DESCRIPTION,
  applicationCategory: "FinanceApplication",
  applicationSubCategory: "Tax Calculator",
  operatingSystem: "Any",
  browserRequirements: "Requires JavaScript. Requires HTML5.",
  inLanguage: ["bn-BD", "en-US"],
  isAccessibleForFree: true,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "BDT",
  },
  author: {
    "@type": "Person",
    name: "Md Rasel Ahmed",
    email: "devsniper71@gmail.com",
    url: "https://github.com/devsniper71",
  },
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="bn"
      className={[
        fraunces.variable,
        notoSerifBengali.variable,
        notoSansBengali.variable,
        GeistSans.variable,
        GeistMono.variable,
      ].join(" ")}
      style={
        {
          "--font-sans": "var(--font-geist-sans)",
          "--font-mono": "var(--font-geist-mono)",
        } as React.CSSProperties
      }
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body className="font-body antialiased">
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
