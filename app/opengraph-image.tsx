import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "ayakor — Bangladesh Income Tax & TDS Calculator";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "flex-start",
          backgroundColor: "#f6f2ea",
          padding: "72px",
          position: "relative",
          fontFamily: "serif",
        }}
      >
        {/* Decorative watermark. Latin "Tk", not the ৳ sign: the image renderer
            ships no Bengali font, so ৳ came out as an empty tofu rectangle. */}
        <div
          style={{
            position: "absolute",
            right: "56px",
            top: "-24px",
            fontSize: "300px",
            color: "#0a5d44",
            opacity: 0.06,
            lineHeight: 1,
            fontWeight: 300,
            letterSpacing: "-0.05em",
          }}
        >
          Tk
        </div>

        {/* Top: wordmark */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: "12px",
          }}
        >
          <div
            style={{
              fontSize: "52px",
              fontWeight: 500,
              color: "#0d0d0b",
              letterSpacing: "-0.02em",
            }}
          >
            ayakor
          </div>
          <div
            style={{
              width: "14px",
              height: "14px",
              borderRadius: "999px",
              backgroundColor: "#0a5d44",
              transform: "translateY(-8px)",
            }}
          />
        </div>

        {/* Center: hero statement */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            maxWidth: "880px",
          }}
        >
          <div
            style={{
              fontSize: "20px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#615f56",
              fontWeight: 500,
            }}
          >
            Bangladesh Income Tax · AY 2026–27
          </div>
          {/* Satori requires an explicit `display` on any node with more than
              one child. Without it the whole image fails to render and the
              route returns an empty body — so the words are discrete spans in
              a flex row rather than text interleaved with a <span>. */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "baseline",
              fontSize: "88px",
              fontWeight: 300,
              color: "#0d0d0b",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
            }}
          >
            {/* Word spacing via marginRight, not `gap` — the renderer ignores
                the two-value gap shorthand here and ran the words together. */}
            <span style={{ marginRight: "24px" }}>Calculate your</span>
            <span style={{ marginRight: "24px", color: "#063b2c", fontWeight: 400 }}>
              TDS
            </span>
            <span>with precision.</span>
          </div>
        </div>

        {/* Bottom: meta strip */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            paddingTop: "24px",
            borderTop: "1px solid #e4ded0",
            fontSize: "22px",
            color: "#615f56",
          }}
        >
          <div style={{ display: "flex", gap: "32px" }}>
            <span>ITA 2023</span>
            <span>·</span>
            <span>Finance Act 2026</span>
            <span>·</span>
            <span>Free &amp; client-side</span>
          </div>
          <div
            style={{
              fontSize: "22px",
              color: "#0a5d44",
              fontWeight: 500,
              letterSpacing: "0.02em",
            }}
          >
            ayakor.com
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
