import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * Crawlers behind AI assistants and AI search. The wildcard rule already
 * permits them; naming them is a deliberate opt-in so a future tightening of
 * the wildcard can't silently drop the site out of those answers.
 *
 * `Google-Extended` and `Applebot-Extended` are opt-OUT tokens — absence means
 * "included", and staying included is the point.
 */
const AI_AGENTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "DuckAssistBot",
  "Amazonbot",
  "meta-externalagent",
  "cohere-ai",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // `/_next/` must stay crawlable: every stylesheet and script is served
        // from `/_next/static/`. Blocking it makes Googlebot render the page
        // unstyled, costing mobile-usability and layout signals — Google's own
        // guidance calls out disallowing CSS/JS as directly harmful.
        disallow: ["/api/"],
      },
      { userAgent: AI_AGENTS, allow: "/" },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
