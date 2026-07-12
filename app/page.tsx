"use client";

import { useMemo, useState } from "react";
import { CalculatorForm } from "@/components/CalculatorForm";
import { ResultsPanel } from "@/components/ResultsPanel";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  calculate,
  DEFAULT_INPUT,
  formatBDT,
  type TaxpayerCategory,
} from "@/lib/tax-calculator";
import { getYearConfig, type TaxYearConfig } from "@/lib/tax-years";
import { FAQ } from "@/lib/faq";
import { useTranslation, tmpl } from "@/lib/i18n";

export default function HomePage() {
  const [input, setInput] = useState(DEFAULT_INPUT);
  const result = useMemo(() => calculate(input), [input]);
  const { t } = useTranslation();
  const cfg = getYearConfig(input.assessmentYear);

  return (
    <main className="min-h-dvh">
      {/* ────── Masthead ────── */}
      <header className="border-b border-rule glass-header sticky top-0 z-30 no-print">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <div className="flex items-baseline gap-2 sm:gap-3 min-w-0">
            <BrandMark text={t.brand} size="sm" />
            <span className="hidden md:inline-block text-[10.5px] tracking-wide text-muted truncate">
              {t.tagline}
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            <span className="num text-[10.5px] text-muted border border-rule rounded-full px-2 py-1 leading-none">
              {cfg.label}
            </span>
            <ThemeToggle />
            <a
              href="https://github.com/meetRaselAhmed/ayakor"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View source on GitHub"
              className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-rule bg-paper/70 text-muted hover:text-emerald hover:border-emerald/40 transition-colors chip-button"
            >
              <GitHubIcon />
            </a>
          </div>
        </div>
      </header>

      {/* ────── Mobile-only sticky summary strip ────── */}
      <div
        className="lg:hidden sticky top-[52px] z-20 bg-emerald-deep text-paper border-b border-emerald-deep/20 no-print"
        role="status"
        aria-live="polite"
      >
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
          <span className="text-[10px] uppercase tracking-[0.16em] text-paper/70 font-medium">
            {t.results.monthlyTDS}
          </span>
          <span
            key={result.monthlyTDS}
            className="num text-[16px] font-medium text-white number-pop"
          >
            {formatBDT(result.monthlyTDS)}
          </span>
        </div>
      </div>

      {/* ────── Hero ────── */}
      <section className="border-b border-rule no-print">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 pt-10 sm:pt-16 pb-8 sm:pb-10">
          <div className="grid grid-cols-12 gap-6 sm:gap-8 items-end">
            <div className="col-span-12 lg:col-span-8">
              <div className="label-eyebrow mb-3 sm:mb-4">
                {`Bangladesh · Assessment Year ${cfg.label.replace("AY ", "")}`}
              </div>
              <h1 className="font-head tracking-tightish text-ink font-light text-[32px] sm:text-[44px] lg:text-[56px] leading-[1.02]">
                {t.hero.title.pre}{" "}
                <span className="italic font-normal text-emerald-deep">
                  {t.hero.title.accent}
                </span>{" "}
                {t.hero.title.post}
              </h1>
            </div>
            <div className="col-span-12 lg:col-span-4 lg:text-right">
              <p className="text-[13.5px] sm:text-[14px] text-muted leading-relaxed lg:max-w-[280px] lg:ml-auto">
                {t.hero.subtitle}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ────── Two-column layout ────── */}
      <section className="max-w-[1240px] mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="calc-grid grid grid-cols-12 gap-x-8 lg:gap-x-10 gap-y-8 lg:gap-y-10">
          <div className="col-span-12 lg:col-span-7 no-print">
            <CalculatorForm input={input} onChange={setInput} />
          </div>
          <div className="col-span-12 lg:col-span-5">
            <div className="lg:sticky lg:top-[72px]">
              <ResultsPanel result={result} input={input} />
            </div>
          </div>
        </div>
      </section>

      {/* ────── Reference ────── */}
      <section className="border-t border-rule bg-surface/30 no-print">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-10 sm:py-12">
          <div className="grid grid-cols-12 gap-6 sm:gap-8">
            <div className="col-span-12 lg:col-span-4">
              <div className="label-eyebrow mb-3">{t.reference.eyebrow}</div>
              <h2 className="font-head tracking-tightish text-ink mb-4 text-[24px] sm:text-[28px] leading-tight">
                {t.reference.title.pre}{" "}
                <span className="italic">{t.reference.title.accent}</span>
                {t.reference.title.post}
              </h2>
              <p className="text-[13.5px] text-muted leading-relaxed mb-4">
                {t.reference.body}
              </p>
              <p className="text-[12px] text-muted italic">
                {t.reference.showsFor}{" "}
                <span className="text-ink not-italic font-medium">
                  {t.categories[input.category]}
                </span>
                {" · "}
                <span className="text-ink not-italic font-medium num">
                  {cfg.label}
                </span>
              </p>
            </div>
            <div className="col-span-12 lg:col-span-8">
              <SlabReferenceTable cfg={cfg} category={input.category} t={t} />
            </div>
          </div>
        </div>
      </section>

      {/* ────── Sources / legal references ────── */}
      <SourcesSection cfg={cfg} t={t} />

      {/* ────── FAQ ────── */}
      <FaqSection t={t} />

      {/* ────── Footer ────── */}
      <footer className="border-t border-rule no-print">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-10">
          <div className="grid grid-cols-12 gap-8">
            {/* Brand + tagline + due date */}
            <div className="col-span-12 md:col-span-5">
              <BrandMark text={t.brand} size="lg" />
              <div className="text-[11.5px] text-muted font-mono tracking-wide mt-1 mb-4">
                ayakor.com
              </div>
              <p className="text-[12px] text-muted leading-relaxed max-w-md mb-4">
                {t.footer.tagline}
              </p>
              <p className="text-[11.5px] text-muted leading-relaxed">
                {t.footer.dueDateNote}
              </p>
            </div>

            {/* Disclaimer */}
            <div className="col-span-12 md:col-span-4">
              <div className="label-eyebrow mb-2">
                {t.footer.disclaimerTitle}
              </div>
              <p className="text-[11.5px] text-muted leading-relaxed">
                {t.footer.disclaimer}
              </p>
            </div>

            {/* Built by */}
            <div className="col-span-12 md:col-span-3">
              <div className="label-eyebrow mb-3">{t.footer.credits}</div>
              <div className="font-head text-[15px] text-ink font-medium mb-3">
                Md Rasel Ahmed
              </div>
              <div className="flex flex-col gap-2">
                <ContactLink
                  href="mailto:meetRaselAhmed@gmail.com"
                  icon={<MailIcon />}
                  label="meetRaselAhmed@gmail.com"
                  breakAll
                />
                <ContactLink
                  href="https://wa.me/8801782449977"
                  icon={<WhatsAppIcon />}
                  label="+880 1782 449977"
                />
                <ContactLink
                  href="https://github.com/meetRaselAhmed"
                  icon={<GitHubIcon />}
                  label="github.com/meetRaselAhmed"
                />
              </div>
            </div>
          </div>

          <div className="rule-h !my-7" />
          <div className="flex flex-col sm:flex-row items-baseline justify-between gap-2 text-[11px] text-muted">
            <div className="num">© {new Date().getFullYear()} · ayakor.com</div>
            <div className="italic">{t.footer.lastUpdated}</div>
          </div>
        </div>
      </footer>
    </main>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// Brand mark — wordmark with emerald dot accent
// ───────────────────────────────────────────────────────────────────────────

function BrandMark({
  text,
  size = "sm",
}: {
  text: string;
  size?: "sm" | "lg";
}) {
  const textSize =
    size === "lg" ? "text-[24px]" : "text-[19px] sm:text-[20px]";
  const dotSize = size === "lg" ? "w-1.5 h-1.5" : "w-[5px] h-[5px]";
  const dotOffset = size === "lg" ? "-translate-y-[4px]" : "-translate-y-[3px]";
  return (
    <span className="inline-flex items-baseline gap-1 select-none">
      <span
        className={`font-head font-medium text-ink tracking-tightish ${textSize}`}
      >
        {text}
      </span>
      <span
        aria-hidden
        className={`inline-block rounded-full bg-emerald ${dotSize} ${dotOffset}`}
      />
    </span>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// Contact link — consistent row with icon + label
// ───────────────────────────────────────────────────────────────────────────

function ContactLink({
  href,
  icon,
  label,
  breakAll = false,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  breakAll?: boolean;
}) {
  const isExternal = !href.startsWith("mailto:");
  return (
    <a
      href={href}
      {...(isExternal
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
      className="flex items-center gap-2 text-[12px] text-muted hover:text-emerald transition-colors w-fit max-w-full group"
    >
      <span className="text-muted group-hover:text-emerald transition-colors shrink-0">
        {icon}
      </span>
      <span className={breakAll ? "break-all" : ""}>{label}</span>
    </a>
  );
}

function MailIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-10 6L2 7" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.9 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0012.04 2zm0 18.15h-.01c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.26 8.26 0 01-1.27-4.38c0-4.55 3.71-8.25 8.27-8.25 2.21 0 4.28.86 5.84 2.42a8.2 8.2 0 012.42 5.84c0 4.55-3.71 8.24-8.26 8.24z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.4 3-.405 1.02.005 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// Dynamic slab reference — derives rows from the rate engine.
// Reflects the currently selected category + assessment year.
// ───────────────────────────────────────────────────────────────────────────

interface Row {
  from: number;
  to: number | null;
  rate: number | null;
  note: string;
}

function buildRows(
  cfg: TaxYearConfig,
  category: TaxpayerCategory,
  t: ReturnType<typeof useTranslation>["t"]
): Row[] {
  if (category === "non_resident_foreigner") {
    return [
      {
        from: 0,
        to: null,
        rate: cfg.nonResidentRate,
        note: t.categories.non_resident_foreigner,
      },
    ];
  }

  const threshold = cfg.thresholds[category];
  const rows: Row[] = [
    { from: 0, to: threshold, rate: null, note: t.reference.thresholdNote },
  ];
  let cursor = threshold;
  for (const [width, rate] of cfg.slabs) {
    const isLast = !Number.isFinite(width);
    const to = isLast ? null : cursor + width;

    let note: string;
    if (isLast) {
      note = t.reference.balanceNote;
    } else {
      const crores = width / 10_000_000;
      const lakhs = width / 100_000;
      if (crores >= 1 && Number.isInteger(crores)) {
        note = tmpl(t.reference.nextCroreNote, { n: String(crores) });
      } else {
        note = tmpl(t.reference.nextLakhNote, { n: String(lakhs) });
      }
    }

    rows.push({ from: cursor, to, rate, note });
    if (!isLast) cursor += width;
  }
  return rows;
}

function SlabReferenceTable({
  cfg,
  category,
  t,
}: {
  cfg: TaxYearConfig;
  category: TaxpayerCategory;
  t: ReturnType<typeof useTranslation>["t"];
}) {
  const rows = buildRows(cfg, category, t);

  const formatRate = (r: number | null) => {
    if (r === null) return t.reference.nilRate;
    return `${Math.round(r * 100)}%`;
  };

  return (
    <div className="border border-rule rounded-xl overflow-hidden glass card-lift">
      <table className="w-full">
        <thead>
          <tr className="bg-paper/60 border-b border-rule">
            <th className="text-left label-eyebrow py-3 px-3 sm:px-4">
              {t.reference.thRange}
            </th>
            <th className="text-right label-eyebrow py-3 px-3 sm:px-4">
              {t.reference.thRate}
            </th>
            <th className="text-right label-eyebrow py-3 px-4 hidden sm:table-cell">
              {t.reference.thNote}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr
              key={i}
              className="border-b border-rule last:border-b-0 hover:bg-emerald-soft/40 transition-colors"
            >
              <td className="py-3 px-3 sm:px-4 num text-[12px] sm:text-[13px] text-ink">
                {formatBDT(r.from)} —{" "}
                {r.to !== null ? formatBDT(r.to) : t.reference.rangeAbove}
              </td>
              <td className="py-3 px-3 sm:px-4 text-right num text-[12px] sm:text-[13px] font-medium text-emerald-deep">
                {formatRate(r.rate)}
              </td>
              <td className="py-3 px-4 text-right text-[12px] text-muted italic hidden sm:table-cell">
                {r.note}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// Sources — authoritative legal references for the selected assessment year.
// Tax law changes yearly; each year carries its own citation list.
// ───────────────────────────────────────────────────────────────────────────

function SourcesSection({
  cfg,
  t,
}: {
  cfg: TaxYearConfig;
  t: ReturnType<typeof useTranslation>["t"];
}) {
  return (
    <section className="border-t border-rule no-print">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-10 sm:py-12">
        <div className="grid grid-cols-12 gap-6 sm:gap-8">
          <div className="col-span-12 lg:col-span-4">
            <div className="label-eyebrow mb-3">{t.sources.eyebrow}</div>
            <h2 className="font-head tracking-tightish text-ink mb-4 text-[24px] sm:text-[28px] leading-tight">
              {t.sources.title.pre}{" "}
              <span className="italic">{t.sources.title.accent}</span>
              {t.sources.title.post}
            </h2>
            <p className="text-[13.5px] text-muted leading-relaxed mb-3">
              {t.sources.body}
            </p>
            <p className="text-[12px] text-muted italic">
              {t.sources.forYear}{" "}
              <span className="text-ink not-italic font-medium num">
                {cfg.label}
              </span>{" "}
              ·{" "}
              <span className="text-ink not-italic">{cfg.statute}</span>
            </p>
          </div>

          <div className="col-span-12 lg:col-span-8">
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {cfg.sources.map((s) => (
                <li key={s.url}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col gap-1 h-full rounded-xl border border-rule glass px-4 py-3 card-lift hover:border-emerald/40"
                  >
                    <div className="flex items-center gap-2">
                      <SourceBadge kind={s.kind} t={t} />
                      <span className="text-[13px] text-ink font-medium leading-snug group-hover:text-emerald transition-colors">
                        {s.label}
                      </span>
                      <span className="ml-auto text-muted group-hover:text-emerald transition-colors shrink-0 text-[12px]">
                        ↗
                      </span>
                    </div>
                    {s.note ? (
                      <p className="text-[11px] text-muted leading-relaxed">
                        {s.note}
                      </p>
                    ) : null}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// FAQ — accessible native <details> accordion. Content is shared with the
// FAQPage JSON-LD in the layout (lib/faq.ts) for rich search results.
// ───────────────────────────────────────────────────────────────────────────

function FaqSection({ t }: { t: ReturnType<typeof useTranslation>["t"] }) {
  return (
    <section className="border-t border-rule no-print">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-10 sm:py-12">
        <div className="grid grid-cols-12 gap-6 sm:gap-8">
          <div className="col-span-12 lg:col-span-4">
            <div className="label-eyebrow mb-3">{t.faq.eyebrow}</div>
            <h2 className="font-head tracking-tightish text-ink text-[24px] sm:text-[28px] leading-tight">
              {t.faq.title.pre}{" "}
              <span className="italic">{t.faq.title.accent}</span>
              {t.faq.title.post}
            </h2>
          </div>
          <div className="col-span-12 lg:col-span-8">
            <div className="border border-rule rounded-xl overflow-hidden glass">
              {FAQ.map((item, i) => (
                <details
                  key={item.q}
                  className="group border-b border-rule last:border-b-0"
                  {...(i === 0 ? { open: true } : {})}
                >
                  <summary className="cursor-pointer list-none flex items-start gap-3 px-4 sm:px-5 py-3.5 hover:bg-emerald-soft/40 transition-colors">
                    <span className="text-[14px] text-ink font-medium leading-snug flex-1">
                      {item.q}
                    </span>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-muted mt-1 shrink-0 transition-transform duration-200 group-open:rotate-180"
                      aria-hidden
                    >
                      <polyline points="3,5 7,9 11,5" />
                    </svg>
                  </summary>
                  <p className="px-4 sm:px-5 pb-4 -mt-0.5 text-[13px] text-muted leading-relaxed">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SourceBadge({
  kind,
  t,
}: {
  kind: "primary" | "official" | "secondary";
  t: ReturnType<typeof useTranslation>["t"];
}) {
  const styles: Record<typeof kind, string> = {
    primary: "border-emerald/40 text-emerald-deep bg-emerald-soft",
    official: "border-ember/40 text-ember bg-ember/10",
    secondary: "border-rule text-muted bg-paper/50",
  };
  return (
    <span
      className={`shrink-0 rounded-full border px-1.5 py-0.5 text-[9px] uppercase tracking-[0.12em] font-semibold ${styles[kind]}`}
    >
      {t.sources.kinds[kind]}
    </span>
  );
}
