/**
 * Site-wide constants. Kept in one place so the canonical URL and the
 * "last updated" signal can't drift between the metadata, the sitemap,
 * robots.txt and the structured data.
 */

export const SITE_URL = "https://ayakor.com";
export const SITE_NAME = "ayakor";

/**
 * Date of the last substantive change to the tax data or the calculation
 * engine — NOT the build date. Search engines and AI assistants weigh
 * freshness heavily for tax content, and a timestamp that moves on every
 * deploy is noise: it claims the rates changed when only the CSS did.
 *
 * Bump this when a rate card changes (e.g. a new Finance Act), not for
 * copy tweaks or refactors.
 */
export const CONTENT_UPDATED = "2026-07-30";

/**
 * Author identity links. Centralised because these were previously written out
 * at six call sites and had already drifted in casing — LinkedIn resolves
 * case-insensitively, but the profile is displayed to readers and should read
 * the way its owner writes it.
 */
export const AUTHOR_NAME = "Md Rasel Ahmed";
export const AUTHOR_LINKEDIN = "https://www.linkedin.com/in/meetRaselAhmed";
export const AUTHOR_GITHUB = "https://github.com/meetRaselAhmed";
export const REPO_URL = "https://github.com/meetRaselAhmed/ayakor";
