"use client";

import {
  CalculatorResult,
  formatBDT,
  formatPercent,
  type LocaleCode,
} from "@/lib/tax-calculator";
import { useTranslation, tmpl } from "@/lib/i18n";

interface Props {
  result: CalculatorResult;
}

export function ResultsPanel({ result }: Props) {
  const { t, locale } = useTranslation();
  const isRefund = result.taxDue < 0;
  const dueAmount = Math.abs(result.taxDue);

  const fmt = (n: number) => formatBDT(n, locale);
  const pct = (r: number, d = 2) => formatPercent(r, locale, d);

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="bg-emerald-deep text-paper rounded-2xl p-7 relative overflow-hidden card-lift">
        <div
          aria-hidden
          className="absolute -right-3 -top-2 hero-num text-[180px] leading-none opacity-[0.07] select-none"
        >
          ৳
        </div>
        <div className="relative">
          <div className="label-eyebrow text-paper/60 mb-2">
            {t.results.monthlyTDS}
          </div>
          <AnimatedFigure
            value={result.monthlyTDS}
            className="hero-num text-[44px] sm:text-[52px] leading-none tracking-tight text-white block"
            format={fmt}
          />
          <div className="text-[13px] text-paper/70 mt-3 num">
            ≈ {fmt(result.annualTaxPayable)} {t.results.annualSummary}{" "}
            <span className="text-white">{pct(result.effectiveTaxRate)}</span>
          </div>
        </div>
      </div>

      {/* Settlement */}
      {result.taxAlreadyDeducted > 0 && (
        <div
          className={`rounded-xl border p-5 card-lift ${
            isRefund
              ? "border-emerald/30 bg-emerald-soft"
              : result.taxDue > 0
              ? "border-ember/40 bg-amber-50/40"
              : "border-rule bg-surface"
          }`}
        >
          <div className="flex items-baseline justify-between">
            <span className="label-eyebrow">
              {isRefund ? t.results.refundable : t.results.balanceDue}
            </span>
            <AnimatedFigure
              value={dueAmount}
              className="num text-[20px] font-medium text-ink"
              format={fmt}
            />
          </div>
          <p className="text-[12px] text-muted mt-1.5 leading-relaxed">
            {tmpl(t.results.settlementExplain, {
              annual: fmt(result.annualTaxPayable),
              deducted: fmt(result.taxAlreadyDeducted),
            })}
          </p>
        </div>
      )}

      {/* Investment advisory */}
      {!result.isNonResidentForeigner &&
        result.taxableIncome > result.taxFreeThreshold && (
          <InvestmentAdvisoryCard result={result} locale={locale} />
        )}

      {/* Income summary */}
      <Card title={t.results.incomeSummary}>
        <Row
          label={t.results.totalEmployment}
          value={result.totalEmploymentIncome}
          locale={locale}
        />
        {result.otherIncome > 0 && (
          <Row
            label={t.results.otherIncome}
            value={result.otherIncome}
            locale={locale}
          />
        )}
        {result.dividendIncome > 0 && (
          <>
            <Row
              label={t.results.dividendGross}
              value={result.dividendIncome}
              locale={locale}
            />
            <Row
              label={t.results.dividendExempt}
              value={-result.dividendExemption}
              locale={locale}
            />
          </>
        )}
        <Row
          label={t.results.grossAnnual}
          value={result.grossAnnualIncome}
          strong
          locale={locale}
        />
        {!result.isNonResidentForeigner && (
          <Row
            label={t.results.salaryExemptionFull}
            value={-result.salaryExemption}
            hint={
              result.salaryExemption === 500_000
                ? t.results.exemptionCapped
                : t.results.exemptionNotCapped
            }
            locale={locale}
          />
        )}
        <Row
          label={t.results.taxableIncome}
          value={result.taxableIncome}
          strong
          accent
          locale={locale}
        />
      </Card>

      {/* Slab-wise */}
      <Card title={t.results.slabTitle}>
        <div className="grid grid-cols-[auto_1fr_auto] gap-x-4 gap-y-2 items-baseline">
          <div className="label-eyebrow col-span-3 grid grid-cols-[auto_1fr_auto] gap-x-4 mb-1">
            <span>{t.results.rate}</span>
            <span>{t.results.range}</span>
            <span className="text-right">{t.results.tax}</span>
          </div>
          {result.slabBreakdown.map((slab, i) => (
            <SlabRow key={i} slab={slab} locale={locale} />
          ))}
        </div>
        <div className="rule-h !my-4" />
        <Row
          label={t.results.grossTax}
          value={result.grossTax}
          strong
          locale={locale}
        />
        {result.investmentRebate > 0 && (
          <Row
            label={t.results.investmentRebate}
            value={-result.investmentRebate}
            hint={t.results.rebateHint}
            locale={locale}
          />
        )}
        {result.surcharge > 0 && (
          <Row
            label={tmpl(t.results.surcharge, {
              rate: pct(result.surchargeRate, 0),
            })}
            value={result.surcharge}
            hint={t.results.surchargeHint}
            locale={locale}
          />
        )}
        {result.minimumTax > 0 &&
          result.taxAfterRebate + result.surcharge < result.minimumTax && (
            <Row
              label={t.results.minimumTax}
              value={result.minimumTax}
              hint={t.results.minimumTaxHint}
              locale={locale}
            />
          )}
        <Row
          label={t.results.annualTax}
          value={result.annualTaxPayable}
          strong
          accent
          locale={locale}
        />
      </Card>

      {/* Statutory */}
      <div className="text-[11.5px] text-muted leading-relaxed pt-2 px-1">
        <p className="font-medium text-ink/70 mb-1.5 tracking-tight">
          {t.results.statutoryBasis}
        </p>
        <p>{t.results.statutoryText}</p>
      </div>
    </div>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-rule bg-surface p-5 shadow-card card-lift">
      <h3 className="font-head text-[15px] font-medium text-ink mb-3 tracking-tightish">
        {title}
      </h3>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function Row({
  label,
  value,
  hint,
  strong = false,
  accent = false,
  locale,
}: {
  label: string;
  value: number;
  hint?: string;
  strong?: boolean;
  accent?: boolean;
  locale: LocaleCode;
}) {
  const formatValue = (v: number) =>
    v < 0 ? `(${formatBDT(Math.abs(v), locale)})` : formatBDT(v, locale);
  return (
    <>
      <div className="flex items-baseline justify-between gap-3">
        <span
          className={`text-[13px] ${
            strong ? "text-ink font-medium" : "text-muted"
          }`}
        >
          {label}
        </span>
        <AnimatedFigure
          value={value}
          className={`num ${
            accent
              ? "text-emerald-deep text-[15px] font-medium"
              : strong
              ? "text-ink text-[14px] font-medium"
              : "text-ink/85 text-[13px]"
          }`}
          format={formatValue}
        />
      </div>
      {hint ? (
        <p className="text-[10.5px] text-muted/85 italic -mt-0.5 mb-1.5">
          {hint}
        </p>
      ) : null}
    </>
  );
}

function SlabRow({
  slab,
  locale,
}: {
  slab: CalculatorResult["slabBreakdown"][number];
  locale: LocaleCode;
}) {
  const range = slab.rangeTo
    ? `${formatBDT(slab.rangeFrom, locale)} – ${formatBDT(
        slab.rangeTo,
        locale
      )}`
    : `≥ ${formatBDT(slab.rangeFrom, locale)}`;
  const inactive = slab.taxableInThisSlab === 0;
  return (
    <>
      <span
        className={`num text-[12.5px] ${
          inactive ? "text-muted/40" : "text-emerald-deep font-medium"
        }`}
      >
        {formatPercent(slab.rate, locale, 0)}
      </span>
      <span
        className={`num text-[11.5px] truncate ${
          inactive ? "text-muted/40" : "text-muted"
        }`}
        title={range}
      >
        {range}
      </span>
      <span
        className={`num text-[12.5px] text-right ${
          inactive ? "text-muted/40" : "text-ink"
        }`}
      >
        {formatBDT(slab.taxAmount, locale)}
      </span>
    </>
  );
}

function AnimatedFigure({
  value,
  format,
  className,
}: {
  value: number;
  format: (v: number) => string;
  className?: string;
}) {
  const formatted = format(value);
  return (
    <span
      key={formatted}
      className={`number-pop ${className ?? ""}`}
      aria-live="polite"
    >
      {formatted}
    </span>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// Investment Advisory Card — three states:
//   1. "Maxed"       — already claiming the maximum possible rebate
//   2. "Min-tax"     — tax already at the BDT 5,000 floor; more invest won't help
//   3. "Opportunity" — can invest more to reduce tax
// ───────────────────────────────────────────────────────────────────────────

function InvestmentAdvisoryCard({
  result,
  locale,
}: {
  result: CalculatorResult;
  locale: LocaleCode;
}) {
  const { t } = useTranslation();
  const fmt = (n: number) => formatBDT(n, locale);

  // State 1: Already claiming full rebate
  if (result.atMaxRebate && result.investmentRebate > 0) {
    return (
      <div className="rounded-xl border border-emerald/30 bg-emerald-soft/60 p-5 card-lift relative overflow-hidden animate-fadeSlideUp">
        <div className="flex items-baseline justify-between mb-2.5">
          <span className="label-eyebrow text-emerald-deep">
            {t.advisory.maxedEyebrow}
          </span>
          <CheckIcon />
        </div>
        <p className="text-[14.5px] text-ink leading-snug">
          {tmpl(t.advisory.maxedHeadline, {
            amount: fmt(result.investmentRebate),
          })}
        </p>
        <p className="text-[11.5px] text-muted mt-2 leading-relaxed">
          {t.advisory.maxedSub}
        </p>
      </div>
    );
  }

  // State 2: Minimum tax floor blocks further savings
  if (
    result.constrainedByMinimumTax &&
    result.possibleTaxSavings <= 0 &&
    result.additionalInvestmentNeeded > 0
  ) {
    return (
      <div className="rounded-xl border border-ember/40 bg-amber-50/40 p-5 card-lift animate-fadeSlideUp">
        <div className="flex items-baseline justify-between mb-2.5">
          <span className="label-eyebrow text-ember">
            {t.advisory.minTaxEyebrow}
          </span>
          <InfoIcon />
        </div>
        <p className="text-[14.5px] text-ink leading-snug">
          {tmpl(t.advisory.minTaxHeadline, {
            amount: fmt(result.minimumTax),
          })}
        </p>
        <p className="text-[11.5px] text-muted mt-2 leading-relaxed">
          {t.advisory.minTaxSub}
        </p>
      </div>
    );
  }

  // State 3: Opportunity — invest more to save
  if (
    result.additionalInvestmentNeeded > 0 &&
    result.possibleTaxSavings > 0
  ) {
    const rebateProgress =
      result.maxPossibleRebate > 0
        ? (result.investmentRebate / result.maxPossibleRebate) * 100
        : 0;
    return (
      <div className="rounded-2xl border border-emerald/40 bg-surface p-5 card-lift relative overflow-hidden animate-fadeSlideUp">
        {/* Decorative accent */}
        <div
          aria-hidden
          className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-emerald-soft/90 blur-2xl pointer-events-none"
        />

        <div className="relative">
          <div className="flex items-baseline justify-between mb-3">
            <span className="label-eyebrow text-emerald-deep">
              {t.advisory.opportunityEyebrow}
            </span>
            <LightbulbIcon />
          </div>

          <div className="space-y-1.5">
            <p className="text-[16px] text-ink font-medium leading-snug">
              {tmpl(t.advisory.investMore, {
                amount: fmt(result.additionalInvestmentNeeded),
              })}
            </p>
            <p className="text-[14px] text-emerald-deep leading-snug">
              {tmpl(t.advisory.saveTax, {
                amount: fmt(result.possibleTaxSavings),
              })}
            </p>
          </div>

          {/* Progress bar — current rebate vs max possible */}
          <div className="mt-4">
            <div
              className="h-1 bg-rule rounded-full overflow-hidden"
              role="progressbar"
              aria-valuenow={Math.round(rebateProgress)}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="h-full bg-emerald rounded-full transition-all duration-500 ease-swift"
                style={{ width: `${Math.min(100, Math.max(0, rebateProgress))}%` }}
              />
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-rule/60 grid grid-cols-2 gap-3">
            <div>
              <div className="label-eyebrow !text-[9.5px] mb-0.5">
                {t.advisory.currentRebateLabel}
              </div>
              <div className="num text-[13px] text-ink">
                {fmt(result.investmentRebate)}
              </div>
            </div>
            <div>
              <div className="label-eyebrow !text-[9.5px] mb-0.5">
                {t.advisory.maxRebateLabel}
              </div>
              <div className="num text-[13px] text-emerald-deep font-medium">
                {fmt(result.maxPossibleRebate)}
              </div>
            </div>
          </div>

          <p className="text-[10.5px] text-muted italic mt-3 leading-relaxed">
            {t.advisory.ruleHint}
          </p>
        </div>
      </div>
    );
  }

  return null;
}

function LightbulbIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-emerald"
      aria-hidden
    >
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M12 2a7 7 0 0 0-4 12.7c.3.3.6.8.7 1.3h6.6c.1-.5.4-1 .7-1.3A7 7 0 0 0 12 2z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-emerald"
      aria-hidden
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-ember"
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}
