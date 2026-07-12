import Script from "next/script";

/**
 * Google Analytics 4 (gtag.js). Loads only when NEXT_PUBLIC_GA_ID is set, so
 * local dev and forks stay analytics-free unless a Measurement ID is provided.
 * Set NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX in your environment (e.g. Vercel project
 * settings) to enable it.
 *
 * Note: the tax calculation itself is entirely client-side — only anonymous
 * page-view / usage events are sent to Google.
 */
export function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  if (!gaId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
