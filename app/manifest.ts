import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ayakor — Bangladesh Income Tax & TDS Calculator",
    short_name: "ayakor",
    description:
      "A precise, modern Bangladesh income-tax and TDS calculator for salaried individuals. AY 2025-26 and 2026-27.",
    start_url: "/",
    display: "standalone",
    background_color: "#f6f2ea",
    theme_color: "#0a5d44",
    categories: ["finance", "productivity", "utilities"],
    lang: "en",
    icons: [
      {
        src: "/icon.svg",
        type: "image/svg+xml",
        sizes: "any",
        purpose: "any",
      },
    ],
  };
}
