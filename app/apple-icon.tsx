import { ImageResponse } from "next/og";

/**
 * iOS ignores SVG for `apple-touch-icon`, so the SVG favicon alone leaves a
 * blank tile when the site is added to a home screen. This renders a PNG at
 * the size Apple asks for.
 *
 * The favicon's Bengali "আ" is not reused here: this renderer has no Bengali
 * font and drew an empty tofu rectangle. The Latin wordmark initial renders
 * everywhere and still reads as ayakor.
 */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#063b2c",
          color: "#f6f2ea",
          fontSize: 118,
          fontFamily: "serif",
          lineHeight: 1,
          letterSpacing: "-0.03em",
        }}
      >
        a
      </div>
    ),
    { ...size }
  );
}
