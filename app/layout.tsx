import type { Metadata, Viewport } from "next";
import { Fraunces, Hind_Siliguri, Tiro_Bangla } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  axes: ["opsz", "SOFT"],
  display: "swap",
});

const tiroBangla = Tiro_Bangla({
  subsets: ["bengali", "latin"],
  variable: "--font-bn-display",
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  variable: "--font-bn",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ayakor · Bangladesh Income Tax Calculator · AY 2026–27",
  description:
    "আয়কর — বাংলাদেশের আয়কর ও উৎসে কর কর্তন ক্যালকুলেটর। Bangla-first, English-ready. Built on ITA 2023 and Finance Ordinance 2025.",
  keywords: [
    "ayakor",
    "আয়কর",
    "Bangladesh TDS calculator",
    "Bangladesh income tax",
    "বাংলাদেশ আয়কর",
    "উৎসে কর কর্তন",
    "AY 2026-27",
    "ITA 2023",
    "Finance Ordinance 2025",
    "NBR",
  ],
  authors: [{ name: "Md Rasel Ahmed", url: "mailto:devsniper71@gmail.com" }],
  metadataBase: new URL("https://ayakor.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Ayakor · Bangladesh Income Tax Calculator · AY 2026–27",
    description:
      "Bangla-first bilingual calculator. Built on ITA 2023 and Finance Ordinance 2025.",
    type: "website",
    url: "https://ayakor.com",
    siteName: "Ayakor",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ayakor · Bangladesh Income Tax Calculator",
    description:
      "Bangla-first bilingual calculator built on ITA 2023 and Finance Ordinance 2025.",
  },
};

export const viewport: Viewport = {
  themeColor: "#f6f2ea",
  width: "device-width",
  initialScale: 1,
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
        tiroBangla.variable,
        hindSiliguri.variable,
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
      <body className="font-body">
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
