import type { MetadataRoute } from "next";
import { SITE_URL, CONTENT_UPDATED } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      // Tied to the real content date, not `new Date()` — a lastmod that moves
      // on every deploy claims the rates changed when only the CSS did, and
      // crawlers learn to discount it.
      lastModified: CONTENT_UPDATED,
      changeFrequency: "monthly",
      priority: 1.0,
    },
  ];
}
