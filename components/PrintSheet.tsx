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

/**
 * The printed / saved-PDF computation sheet.
 *
 * A separate document rather than a restyling of the screen panel, because it
 * has a different job: the screen answers "what do I owe?" interactively,
 * whereas this has to stand on its own once detached from the app. That means
 * it must show the INPUTS as well as the result — a computation nobody can
 * check against the figures that produced it is not much use to an employer,
 * an accountant, or the same person a year later.
 *
 * Everything else on the page is `no-print`; this is the whole document.
 */

interface Props {
  result: CalculatorResult;
  input: CalculatorInput;
}

const fmt = (n: number) => formatBDT(n);

export function PrintSheet({ result, input }: Props) {
  const { t } = useTranslation();
  const cfg = getYearConfig(result.assessmentYearId);

  // Set after mount: a date rendered on the server would differ from the
  // client's and trip a hydration mismatch.
  const [printDate, setPrintDate] = useState("");
  useEffect(() => {
    setPrintDate(
      new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    );
  }, []);

  const i = input.income;
  const showFiling =
    !!cfg.filingIncentive &&
    (result.filingRebate > 0 || result.filingSurcharge > 0);
  const isRefund = result.taxDue < 0;

  // Subtotals are printed only when a line actually sits between them and the
  // total below — otherwise the sheet states the same figure twice under two
  // labels, which reads as an error rather than as a step.
  const hasNonEmploymentIncome =
    result.otherIncome > 0 || result.dividendIncome > 0;
  const hasTaxAdjustments =
    result.investmentRebate > 0 ||
    result.surcharge > 0 ||
    (result.minimumTax > 0 && result.taxAfterRebate < result.minimumTax);

  return (
    <div className="print-only print-sheet">
      {/* ── Letterhead ─────────────────────────────────────────────── */}
      <header className="ps-head">
        <div className="ps-head-brand">
          <span className="ps-wordmark">ayakor</span>
          <span className="ps-dot" aria-hidden />
          <span className="ps-site">ayakor.com</span>
        </div>
        <div className="ps-head-doc">
          <div className="ps-doctitle">{t.print.docTitle}</div>
          <div className="ps-docyear num">
            {t.print.assessmentYear} {cfg.label.replace("AY ", "")}
          </div>
        </div>
      </header>

      {/* ── Particulars of the return ──────────────────────────────── */}
      <section className="ps-meta">
        <Meta label={t.print.prepared} value={printDate} />
        <Meta label={t.print.statute} value={cfg.statute} />
        <Meta label={t.print.incomeYear} value={cfg.incomeYear} />
        <Meta label={t.print.taxpayer} value={t.categories[input.category]} />
        {cfg.areaBasedMinTax && !result.isNonResidentForeigner && (
          <Meta
            label={t.print.location}
            value={t.minTaxAreas[input.minTaxArea ?? "dhaka_ctg"]}
          />
        )}
        {input.isNewTaxpayer && (
          <Meta label={t.print.firstTime} value={t.print.yes} />
        )}
        {input.disabledChildren > 0 && (
          <Meta
            label={t.print.disabledChildren}
            value={String(input.disabledChildren)}
          />
        )}
        {cfg.filingIncentive && input.filingQuarter && (
          <Meta
            label={t.print.returnFiling}
            value={t.filing.quarters[input.filingQuarter]}
          />
        )}
      </section>

      {/* ── 1. Income particulars — the inputs, so the sheet is checkable */}
      <Section n="1" title={t.print.sec1}>
        <table className="ps-table">
          <thead>
            <tr>
              <th>{t.print.colParticulars}</th>
              <th className="ps-r">{t.print.colMonthly}</th>
              <th className="ps-r">{t.print.colAnnual}</th>
            </tr>
          </thead>
          <tbody>
            <Money label={t.fields.basic} monthly={i.basicMonthly} annual={result.annualBasic} />
            <Money label={t.fields.houseRent} monthly={i.houseRentMonthly} annual={result.annualHouseRent} />
            <Money label={t.fields.medical} monthly={i.medicalMonthly} annual={result.annualMedical} />
            <Money label={t.fields.conveyance} monthly={i.conveyanceMonthly} annual={result.annualConveyance} />
            <Money label={t.fields.otherAllowance} monthly={i.otherAllowanceMonthly} annual={result.annualOtherAllowance} />
            <Money label={t.fields.festival1} annual={i.festivalBonus1} />
            <Money label={t.fields.festival2} annual={i.festivalBonus2} />
            <Money label={t.fields.performanceBonus} annual={result.performanceBonus} />
            <Money label={t.fields.overtime} annual={result.overtime} />
            <Money label={t.fields.otherEmployment} annual={result.otherEmploymentIncome} />
            {/* The employment subtotal only earns a line when something follows
                it. With no non-employment income it equals the gross below, and
                two bold rows carrying the same figure read as a mistake. */}
            {hasNonEmploymentIncome && (
              <Money label={t.results.totalEmployment} annual={result.totalEmploymentIncome} total />
            )}
            <Money label={t.results.otherIncome} annual={result.otherIncome} />
            <Money label={t.results.dividendGross} annual={result.dividendIncome} />
            <Money label={t.results.grossAnnual} annual={result.grossAnnualIncome} total />
          </tbody>
        </table>
        {result.exemptIncome > 0 && (
          <p className="ps-note">
            {t.results.exemptIncomeLine}: {fmt(result.exemptIncome)} —{" "}
            {t.results.exemptIncomeHint}
          </p>
        )}
      </Section>

      {/* ── 2. Taxable income ──────────────────────────────────────── */}
      <Section n="2" title={t.print.sec2}>
        <table className="ps-table">
          <tbody>
            <Money label={t.results.grossAnnual} annual={result.grossAnnualIncome} />
            {result.dividendExemption > 0 && (
              <Money label={t.results.dividendExempt} annual={-result.dividendExemption} />
            )}
            {!result.isNonResidentForeigner && (
              <Money label={t.results.salaryExemptionFull} annual={-result.salaryExemption} />
            )}
            <Money label={t.results.taxableIncome} annual={result.taxableIncome} total />
          </tbody>
        </table>
      </Section>

      {/* ── 3. Tax computation ─────────────────────────────────────── */}
      <Section n="3" title={t.print.sec3}>
        <table className="ps-table">
          <thead>
            <tr>
              <th>{t.print.colRate}</th>
              <th>{t.print.colSlab}</th>
              <th className="ps-r">{t.print.colInSlab}</th>
              <th className="ps-r">{t.print.colTax}</th>
            </tr>
          </thead>
          <tbody>
            {result.slabBreakdown.map((s, idx) => (
              <tr key={idx}>
                <td className="num">{formatPercent(s.rate, 0)}</td>
                <td className="num">
                  {s.rangeTo !== null
                    ? `${fmt(s.rangeFrom)} – ${fmt(s.rangeTo)}`
                    : `≥ ${fmt(s.rangeFrom)}`}
                </td>
                <td className="ps-r num">{fmt(s.taxableInThisSlab)}</td>
                {/* Em dash for the nil band, matching the monthly column —
                    a column of figures reads faster when zero is not one. */}
                <td className="ps-r num">{s.taxAmount ? fmt(s.taxAmount) : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <table className="ps-table ps-tight">
          <tbody>
            {/* Same reasoning as the income subtotal: with nothing between them
                the gross tax IS the annual tax, so print one row, under the
                label that the summary below refers to. */}
            {hasTaxAdjustments && (
              <Money label={t.results.grossTax} annual={result.grossTax} total />
            )}
            {result.investmentRebate > 0 && (
              <Money label={t.results.investmentRebate} annual={-result.investmentRebate} />
            )}
            {result.minimumTax > 0 && result.taxAfterRebate < result.minimumTax && (
              <Money label={t.results.minimumTax} annual={result.minimumTax} />
            )}
            {result.surcharge > 0 && (
              <Money
                label={tmpl(t.results.surcharge, {
                  rate: formatPercent(result.surchargeRate, 0),
                })}
                annual={result.surcharge}
              />
            )}
            <Money label={t.results.annualTax} annual={result.annualTaxPayable} total />
            {showFiling && (
              <>
                {result.filingRebate > 0 && (
                  <Money label={t.results.earlyFilingRebate} annual={-result.filingRebate} />
                )}
                {result.filingSurcharge > 0 && (
                  <Money label={t.results.lateFilingSurcharge} annual={result.filingSurcharge} />
                )}
                <Money label={t.print.afterFiling} annual={result.taxAfterFilingIncentive} total />
              </>
            )}
          </tbody>
        </table>
      </Section>

      {/* ── 4. Summary ─────────────────────────────────────────────── */}
      <Section n="4" title={t.print.sec4}>
        <div className="ps-summary">
          <SummaryCell label={t.print.monthlyTds} value={fmt(result.monthlyTDS)} lead />
          <SummaryCell label={t.print.annualTax} value={fmt(result.annualTaxPayable)} />
          {/* Without this the summary claims 54,600 is payable while section 3
              above it says 51,870 — the reader is left to spot which is the
              amount that actually settles the year. */}
          {showFiling && (
            <SummaryCell
              label={t.print.afterFilingShort}
              value={fmt(result.taxAfterFilingIncentive)}
            />
          )}
          <SummaryCell
            label={t.print.effectiveRate}
            value={formatPercent(result.effectiveTaxRate)}
          />
        </div>
        {result.taxAlreadyDeducted > 0 && (
          <table className="ps-table ps-tight">
            <tbody>
              <Money label={t.print.afterFiling} annual={result.taxAfterFilingIncentive} />
              <Money label={t.print.alreadyDeducted} annual={-result.taxAlreadyDeducted} />
              <Money
                label={isRefund ? t.print.refundable : t.print.balanceDue}
                annual={Math.abs(result.taxDue)}
                total
              />
            </tbody>
          </table>
        )}
      </Section>

      {/* ── Colophon ───────────────────────────────────────────────── */}
      <footer className="ps-foot">
        <p className="ps-foot-src">
          {tmpl(t.print.sourceNote, {
            statute: cfg.statute,
            year: cfg.label,
          })}
        </p>
        <p className="ps-foot-disc">{t.print.disclaimer}</p>
        <div className="ps-foot-credit">
          <span>{t.print.generatedBy}</span>
          <span>{t.print.builtBy} · linkedin.com/in/meetraselahmed</span>
        </div>
      </footer>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────────

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="ps-meta-row">
      <span className="ps-meta-k">{label}</span>
      <span className="ps-meta-v">{value}</span>
    </div>
  );
}

function Section({
  n,
  title,
  children,
}: {
  n: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="ps-sec">
      <h2 className="ps-sec-h">
        <span className="ps-sec-n num">{n}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

/**
 * A money row. Zero rows are dropped — a statement listing a dozen nil lines
 * reads as a form, not a computation — but totals always print, even at zero,
 * so the arithmetic never appears to skip a step.
 */
function Money({
  label,
  monthly,
  annual,
  total = false,
}: {
  label: string;
  monthly?: number;
  annual: number;
  total?: boolean;
}) {
  if (!total && !annual) return null;
  const show = (v: number) => (v < 0 ? `(${fmt(Math.abs(v))})` : fmt(v));
  return (
    <tr className={total ? "ps-total" : undefined}>
      <td>{label}</td>
      {monthly !== undefined ? (
        <td className="ps-r num">{monthly ? fmt(monthly) : "—"}</td>
      ) : (
        <td className="ps-r" />
      )}
      <td className="ps-r num">{show(annual)}</td>
    </tr>
  );
}

function SummaryCell({
  label,
  value,
  lead = false,
}: {
  label: string;
  value: string;
  lead?: boolean;
}) {
  return (
    <div className={`ps-sum-cell${lead ? " ps-sum-lead" : ""}`}>
      <div className="ps-sum-k">{label}</div>
      <div className="ps-sum-v num">{value}</div>
    </div>
  );
}
