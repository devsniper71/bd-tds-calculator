"use client";

import { useTranslation } from "@/lib/i18n";

export function LanguageToggle() {
  const { locale, setLocale } = useTranslation();

  return (
    <div
      role="tablist"
      aria-label="Language"
      className="relative inline-flex items-center bg-paper border border-rule rounded-full p-0.5 text-[12px] font-medium"
    >
      <span
        aria-hidden
        className="absolute top-0.5 bottom-0.5 rounded-full bg-emerald-deep transition-all duration-300 ease-swift"
        style={{
          width: "calc(50% - 2px)",
          left: locale === "bn" ? "2px" : "calc(50%)",
        }}
      />
      <button
        role="tab"
        aria-selected={locale === "bn"}
        onClick={() => setLocale("bn")}
        className={`relative z-10 px-3 py-1 rounded-full transition-colors duration-300 ${
          locale === "bn" ? "text-paper" : "text-muted hover:text-ink"
        }`}
        style={{ fontFamily: "var(--font-bn), var(--font-sans)" }}
      >
        বাংলা
      </button>
      <button
        role="tab"
        aria-selected={locale === "en"}
        onClick={() => setLocale("en")}
        className={`relative z-10 px-3 py-1 rounded-full transition-colors duration-300 ${
          locale === "en" ? "text-paper" : "text-muted hover:text-ink"
        }`}
      >
        EN
      </button>
    </div>
  );
}
