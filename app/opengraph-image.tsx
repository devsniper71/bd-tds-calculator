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
        {/* Decorative large ৳ watermark */}
        <div
          style={{
            position: "absolute",
            right: "-40px",
            top: "-120px",
            fontSize: "560px",
            color: "#0a5d44",
            opacity: 0.07,
            lineHeight: 1,
            fontWeight: 300,
          }}
        >
          ৳
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
          <div
            style={{
              fontSize: "88px",
              fontWeight: 300,
              color: "#0d0d0b",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
            }}
          >
            Calculate your{" "}
            <span
              style={{
                fontStyle: "italic",
                color: "#063b2c",
                fontWeight: 400,
              }}
            >
              TDS
            </span>{" "}
            with precision.
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
            <span>Finance Ordinance 2025</span>
            <span>·</span>
            <span>Bangla · English</span>
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
