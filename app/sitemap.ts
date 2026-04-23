import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://ayakor.com";
  const now = new Date();
  return [
    {
      url: base,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1.0,
      alternates: {
        languages: {
          "bn-BD": base,
          "en-US": `${base}/?lang=en`,
        },
      },
    },
  ];
}
