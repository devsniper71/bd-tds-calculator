import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // CSS-variable-backed tokens so light / dark themes swap seamlessly.
        // `<alpha-value>` lets utilities like bg-paper/85 keep working.
        paper: "rgb(var(--c-paper) / <alpha-value>)",
        ink: "rgb(var(--c-ink) / <alpha-value>)",
        muted: "rgb(var(--c-muted) / <alpha-value>)",
        rule: "rgb(var(--c-rule) / <alpha-value>)",
        surface: "rgb(var(--c-surface) / <alpha-value>)",
        emerald: {
          DEFAULT: "rgb(var(--c-emerald) / <alpha-value>)",
          deep: "rgb(var(--c-emerald-deep) / <alpha-value>)",
          soft: "rgb(var(--c-emerald-soft) / <alpha-value>)",
        },
        ember: "rgb(var(--c-ember) / <alpha-value>)",
        crimson: "rgb(var(--c-crimson) / <alpha-value>)",
      },
      backdropBlur: {
        glass: "14px",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      letterSpacing: { tightish: "-0.015em" },
      boxShadow: {
        card: "0 1px 0 rgb(var(--c-ink) / 0.03), 0 10px 30px -14px rgb(var(--c-ink) / 0.10)",
        cardHover: "0 1px 0 rgb(var(--c-ink) / 0.04), 0 20px 40px -18px rgb(var(--c-ink) / 0.18)",
        inset: "inset 0 0 0 1px rgb(var(--c-rule))",
        ring: "0 0 0 3px rgb(var(--c-emerald) / 0.18)",
      },
      transitionTimingFunction: { swift: "cubic-bezier(0.22, 1, 0.36, 1)" },
    },
  },
  plugins: [],
};

export default config;
