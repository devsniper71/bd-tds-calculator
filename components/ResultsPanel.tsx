"use client";

import { useEffect, useState } from "react";
import {
  CalculatorInput,
  CalculatorResult,
  formatBDT,
  formatPercent,
} from "@/lib/tax-calculator";
import { getYearConfig } from "@/lib/tax-years";
import { useTranslation, tmpl } from "@/lib/i18n";

interface Props {
  result: CalculatorResult;
  input: CalculatorInput;
}

export function ResultsPanel({ result, input }: Props) {
  const { t } = useTranslation();
  const cfg = getYearConfig(result.assessmentYearId);
  const isRefund = result.taxDue < 0;
  const dueAmount = Math.abs(result.taxDue);
  const filingLabel =
    cfg.filingIncentive && input.filingQuarter
      ? t.filing.quarters[input.filingQuarter]
      : null;

  const fmt = (n: number) => formatBDT(n);
  const pct = (r: number, d = 2) => formatPercent(r, d);

  // Set on mount to avoid a server/client hydration mismatch on the date.
  const [printDate, setPrintDate] = useState("");
  useEffect(() => {
    setPrintDate(
      new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    );
  }, []);

  return (
    <div className="space-y-6 results-panel">
      {/* Print-only computation-sheet header + key figures */}
      <div className="print-only">
        <div className="flex items-baseline justify-between border-b border-ink/30 pb-1.5 mb-2">
          <span className="font-head text-[17px] text-ink">
            ayakor — Income Tax Computation
          </span>
          <span className="num text-[11px] text-muted">
            {cfg.label}
            {printDate ? ` · ${printDate}` : ""}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-x-8 gap-y-0.5 text-[11px] mb-2">
          <PrintLine label="Taxpayer" value={t.categories[input.category]} />
          <PrintLine label="Statute" value={cfg.statute} />
          <PrintLine label="Monthly TDS" value={fmt(result.monthlyTDS)} num />
          <PrintLine
            label="Annual tax payable"
            value={fmt(result.annualTaxPayable)}
            num
          />
          <PrintLine label="Effective rate" value={pct(result.effectiveTaxRate)} num />
          {filingLabel && <PrintLine label="Return filing" value={filingLabel} />}
        </div>
        <p className="text-[9px] text-muted border-t border-ink/15 pt-1 mb-1">
          Unofficial estimate for guidance only — not professional tax advice.
          Generated at ayakor.com.
        </p>
      </div>

      {/* Print / Save-as-PDF button (screen only) */}
      <div className="no-print flex justify-end">
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 rounded-full border border-rule bg-paper/70 px-3 py-1.5 text-[11.5px] text-muted hover:text-emerald hover:border-emerald/40 transition-colors chip-button"
        >
          <PrinterIcon />
          {t.results.printButton}
        </button>
      </div>

      {/* Hero (screen only — the print sheet uses the compact header above) */}
      <div className="bg-emerald-deep text-paper rounded-2xl p-7 relative overflow-hidden card-lift glass-hero no-print">
        <div
          aria-hidden
          className="absolute -right-3 -top-2 hero-num text-[180px] leading-none opacity-[0.07] select-none"
        >
          ৳
        </div>
        {/* The page's single live region: one announcement per recalculation,
            covering the monthly figure, the annual total and the rate. */}
        <div className="relative" role="status" aria-live="polite">
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
              ? "border-ember/40 bg-ember/10"
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
              annual: fmt(result.taxAfterFilingIncentive),
              deducted: fmt(result.taxAlreadyDeducted),
            })}
          </p>
        </div>
      )}

      {/* Investment advisory (planning aid — screen only, not part of the computation) */}
      {!result.isNonResidentForeigner &&
        result.taxableIncome > result.taxFreeThreshold && (
          <div className="no-print">
            <InvestmentAdvisoryCard result={result} />
          </div>
        )}

      {/* Income summary */}
      <Card title={t.results.incomeSummary}>
        <Row
          label={t.results.totalEmployment}
          value={result.totalEmploymentIncome}        />
        {result.otherIncome > 0 && (
          <Row
            label={t.results.otherIncome}
            value={result.otherIncome}
          />
        )}
        {result.dividendIncome > 0 && (
          <Row
            label={t.results.dividendGross}
            value={result.dividendIncome}
          />
        )}
        <Row
          label={t.results.grossAnnual}
          value={result.grossAnnualIncome}
          strong
        />
        {result.dividendExemption > 0 && (
          <Row
            label={t.results.dividendExempt}
            value={-result.dividendExemption}
          />
        )}
        {!result.isNonResidentForeigner && (
          <Row
            label={t.results.salaryExemptionFull}
            value={-result.salaryExemption}
            hint={
              result.salaryExemption >= result.salaryExemptionCap
                ? tmpl(t.results.exemptionCapped, {
                    cap: formatBDT(result.salaryExemptionCap),
                  })
                : t.results.exemptionNotCapped
            }
          />
        )}
        <Row
          label={t.results.taxableIncome}
          value={result.taxableIncome}
          strong
          accent
        />
        {result.exemptIncome > 0 && (
          <Row
            label={t.results.exemptIncomeLine}
            value={result.exemptIncome}
            hint={t.results.exemptIncomeHint}
          />
        )}
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
            <SlabRow key={i} slab={slab} />
          ))}
        </div>
        <div className="rule-h !my-4" />
        <Row
          label={t.results.grossTax}
          value={result.grossTax}
          strong        />
        {result.investmentRebate > 0 && (
          <Row
            label={t.results.investmentRebate}
            value={-result.investmentRebate}
            hint={t.results.rebateHint}
          />
        )}
        {result.surcharge > 0 && (
          <Row
            label={tmpl(t.results.surcharge, {
              rate: pct(result.surchargeRate, 0),
            })}
            value={result.surcharge}
            hint={t.results.surchargeHint}
          />
        )}
        {result.minimumTax > 0 &&
          result.taxAfterRebate < result.minimumTax && (
            <Row
              label={t.results.minimumTax}
              value={result.minimumTax}
              hint={t.results.minimumTaxHint}
            />
          )}
        <Row
          label={t.results.annualTax}
          value={result.annualTaxPayable}
          strong
          accent
        />
        {(result.filingRebate > 0 || result.filingSurcharge > 0) && (
          <>
            {result.filingRebate > 0 && (
              <Row
                label={t.results.earlyFilingRebate}
                value={-result.filingRebate}
                hint={t.results.filingProvisionalNote}
              />
            )}
            {result.filingSurcharge > 0 && (
              <Row
                label={t.results.lateFilingSurcharge}
                value={result.filingSurcharge}
                hint={t.results.filingProvisionalNote}
              />
            )}
            <Row
              label={t.results.taxAfterFiling}
              value={result.taxAfterFilingIncentive}
              strong
              accent
            />
          </>
        )}
      </Card>

      {/* Statutory */}
      <div className="text-[11.5px] text-muted leading-relaxed pt-2 px-1">
        <p className="font-medium text-ink/70 mb-1.5 tracking-tight">
          {t.results.statutoryBasis}
        </p>
        <p>
          {tmpl(t.results.statutoryTextTmpl, {
            statute: cfg.statute,
            year: cfg.label,
            incomeYear: cfg.incomeYear,
          })}
        </p>
      </div>
    </div>
  );
}

function PrintLine({
  label,
  value,
  num = false,
}: {
  label: string;
  value: string;
  num?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-muted">{label}</span>
      <span
        className={`text-ink font-medium text-right ${num ? "num" : ""}`}
      >
        {value}
      </span>
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
    <div className="rounded-xl border border-rule glass p-5 shadow-card card-lift">
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
}: {
  label: string;
  value: number;
  hint?: string;
  strong?: boolean;
  accent?: boolean;
}) {
  const formatValue = (v: number) =>
    v < 0 ? `(${formatBDT(Math.abs(v))})` : formatBDT(v);
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
}: {
  slab: CalculatorResult["slabBreakdown"][number];
}) {
  const range = slab.rangeTo
    ? `${formatBDT(slab.rangeFrom)} – ${formatBDT(slab.rangeTo)}`
    : `≥ ${formatBDT(slab.rangeFrom)}`;
  const inactive = slab.taxableInThisSlab === 0;
  return (
    <>
      <span
        className={`num text-[12.5px] ${
          inactive ? "text-muted/40" : "text-emerald-deep font-medium"
        }`}
      >
        {formatPercent(slab.rate, 0)}
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
        {formatBDT(slab.taxAmount)}
      </span>
    </>
  );
}

// Deliberately NOT a live region. Every figure in the panel is animated, so
// announcing each one would fire a dozen-plus interruptions per keystroke. The
// hero below wraps the headline figure in the single live region for the page.
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
    <span key={formatted} className={`number-pop ${className ?? ""}`}>
      {formatted}
    </span>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// Investment Advisory Card — three states, checked in this order:
//   1. "Opportunity" — investing more still reduces tax
//   2. "Min-tax"     — nothing more to gain because the floor blocks it
//   3. "Maxed"       — nothing more to gain because the rebate is maxed
// Opportunity is checked first so a partially-useful rebate isn't reported as
// "maxed"; min-tax before maxed so the floor is named as the reason.
// ───────────────────────────────────────────────────────────────────────────

function InvestmentAdvisoryCard({ result }: { result: CalculatorResult }) {
  const { t } = useTranslation();
  const fmt = (n: number) => formatBDT(n);

  // State 1: Opportunity — invest more to save
  if (result.additionalInvestmentNeeded > 0 && result.possibleTaxSavings > 0) {
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

  // State 2: Minimum tax floor blocks any further saving
  if (result.constrainedByMinimumTax && result.possibleTaxSavings <= 0) {
    return (
      <div className="rounded-xl border border-ember/40 bg-ember/10 p-5 card-lift animate-fadeSlideUp">
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

  // State 3: Already claiming the full useful rebate
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

  return null;
}

function PrinterIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M6 9V2h12v7" />
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <rect x="6" y="14" width="12" height="8" rx="1" />
    </svg>
  );
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
