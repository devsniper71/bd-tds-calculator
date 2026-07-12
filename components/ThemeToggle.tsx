"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "ayakor-theme";

/**
 * Light / dark toggle. Initial class is applied pre-hydration by the inline
 * script in layout.tsx (no flash); this component just syncs + persists.
 */
export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
    } catch {
      // ignore
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={mounted ? dark : undefined}
      className="relative inline-flex items-center justify-center w-8 h-8 rounded-full border border-rule bg-paper/70 text-muted hover:text-emerald hover:border-emerald/40 transition-colors chip-button"
    >
      {/* Sun (light) */}
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
        className={`absolute transition-all duration-300 ${
          mounted && dark
            ? "opacity-0 scale-50 rotate-90"
            : "opacity-100 scale-100 rotate-0"
        }`}
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
      {/* Moon (dark) */}
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
        className={`absolute transition-all duration-300 ${
          mounted && dark
            ? "opacity-100 scale-100 rotate-0"
            : "opacity-0 scale-50 -rotate-90"
        }`}
      >
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
      </svg>
    </button>
  );
}
