import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#f6f2ea",
        ink: "#0d0d0b",
        muted: "#615f56",
        rule: "#e4ded0",
        surface: "#ffffff",
        emerald: {
          DEFAULT: "#0a5d44",
          deep: "#063b2c",
          soft: "#eaf1ec",
        },
        ember: "#b8852e",
        crimson: "#a23a2c",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
        bnDisplay: ["var(--font-bn-display)", "Georgia", "serif"],
        bn: ["var(--font-bn)", "system-ui", "sans-serif"],
      },
      letterSpacing: { tightish: "-0.015em" },
      boxShadow: {
        card: "0 1px 0 rgba(14,14,12,0.03), 0 10px 30px -14px rgba(14,14,12,0.10)",
        cardHover: "0 1px 0 rgba(14,14,12,0.04), 0 20px 40px -18px rgba(14,14,12,0.18)",
        inset: "inset 0 0 0 1px #e4ded0",
        ring: "0 0 0 3px rgba(10,93,68,0.18)",
      },
      transitionTimingFunction: { swift: "cubic-bezier(0.22, 1, 0.36, 1)" },
    },
  },
  plugins: [],
};

export default config;
