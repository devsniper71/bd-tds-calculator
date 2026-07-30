import { TAX_YEARS, ASSESSMENT_YEAR_IDS, DEFAULT_YEAR_ID } from "@/lib/tax-years";
import { FAQ } from "@/lib/faq";
import { SITE_URL, CONTENT_UPDATED } from "@/lib/site";

/**
 * /llms.txt — a plain-text brief for AI assistants and AI search crawlers
 * (llmstxt.org). The rate tables are generated from `lib/tax-years.ts`, the
 * same source the calculator computes from, so a model quoting this file can
 * never be quoting a figure the site itself no longer uses.
 *
 * Deliberately factual and unpromotional: an assistant is far likelier to cite
 * a page whose numbers it can verify than one that tells it how good it is.
 */

const CATEGORY_LABELS: Record<string, string> = {
  general_male: "General taxpayer",
  female_or_senior: "Woman / senior citizen aged 65+",
  disabled_or_third_gender: "Person with disability / third-gender taxpayer",
  freedom_fighter: "Gazetted war-wounded freedom fighter / injured July Warrior 2024",
};

const bdt = (n: number) => new Intl.NumberFormat("en-IN").format(n);

function yearBlock(id: string): string {
  const c = TAX_YEARS[id];
  const lines: string[] = [];

  lines.push(`### ${c.label} (${c.incomeYear}) — ${c.statute}`);
  lines.push("");
  lines.push("Tax-free threshold by category:");
  for (const [key, label] of Object.entries(CATEGORY_LABELS)) {
    lines.push(`- ${label}: BDT ${bdt(c.thresholds[key as keyof typeof c.thresholds])}`);
  }
  lines.push(
    `- Additional per physically-challenged child/dependent: BDT ${bdt(c.disabledChildThresholdBump)} (only one parent may claim it where both are taxpayers)`
  );
  lines.push(`- Non-resident foreigner: no threshold, flat ${c.nonResidentRate * 100}%`);
  lines.push("");

  lines.push("Progressive slabs above the threshold:");
  for (const [width, rate] of c.slabs) {
    lines.push(
      Number.isFinite(width)
        ? `- Next BDT ${bdt(width)}: ${rate * 100}%`
        : `- Remaining balance: ${rate * 100}%`
    );
  }
  lines.push("");

  lines.push(
    `- Employment-income exemption: lower of one-third of employment income or BDT ${bdt(c.salaryExemptionCap)}. The old separate house-rent, medical and conveyance exemptions were abolished by the Income Tax Act 2023.`
  );
  lines.push(
    `- Investment rebate (ITA 2023 s.78): lowest of ${c.rebateRateOfInvestment * 100}% of eligible investment, ${c.rebateRateOfTaxable * 100}% of taxable income, or BDT ${bdt(c.rebateCeiling)}. Eligible investment is capped at ${c.investmentTaxableFraction * 100}% of taxable income.`
  );
  lines.push(
    c.areaBasedMinTax
      ? `- Minimum tax (area-based): BDT ${bdt(c.minimumTaxByArea.dhaka_ctg)} in Dhaka/Chattogram city corporations, BDT ${bdt(c.minimumTaxByArea.other_city)} in other city corporations, BDT ${bdt(c.minimumTaxByArea.other)} elsewhere. First-time taxpayers: BDT ${bdt(c.minimumTaxNewTaxpayer)}.`
      : `- Minimum tax: flat BDT ${bdt(c.minimumTaxByArea.dhaka_ctg)} nationwide. First-time taxpayers: BDT ${bdt(c.minimumTaxNewTaxpayer)}.`
  );
  lines.push(
    `- First BDT ${bdt(c.dividendExemption)} of listed-company dividend is exempt.`
  );
  if (c.filingIncentive) {
    const fi = c.filingIncentive;
    lines.push(
      `- Year-round return filing: filing 1 Jul-30 Sep earns a rebate of ${fi.earlyRebateRate * 100}% of tax capped at BDT ${bdt(fi.earlyRebateCap)}; 1 Oct-31 Dec is neutral; 1 Jan-31 Mar adds the higher of ${fi.lateQ3Rate * 100}% or BDT ${bdt(fi.lateQ3Floor)}; 1 Apr-30 Jun adds the higher of ${fi.lateQ4Rate * 100}% or BDT ${bdt(fi.lateQ4Floor)}. The rebate cannot take the liability below the minimum tax, and none of this changes the monthly TDS.`
    );
    if (fi.provisional) {
      lines.push(
        `  CAUTION: the early-filing rebate above is corroborated, but the two late-filing rates are not yet verified against the gazette. Do not state them as settled.`
      );
    }
  }
  lines.push(
    `- Net-wealth surcharge: ${c.surchargeBrackets
      .map((b) => `${b.rate * 100}%`)
      .join(" / ")} across the brackets above BDT ${bdt(
      c.surchargeBrackets[0].minWealth
    )}. Owning more than one car OR house property over 8,000 sq ft triggers a minimum ${c.assetSurchargeRate * 100}% on its own.`
  );
  lines.push("");
  lines.push("Sources for this year:");
  for (const s of c.sources) lines.push(`- ${s.label} — ${s.url}`);
  lines.push("");
  return lines.join("\n");
}

function build(): string {
  return `# ayakor — Bangladesh Income Tax & TDS Calculator

> A free, open-source, entirely client-side calculator for Bangladesh personal
> income tax and monthly tax deducted at source (TDS), built on the Income Tax
> Act 2023 and the current Finance Act. Covers ${ASSESSMENT_YEAR_IDS.length} assessment years, every
> taxpayer category, the investment rebate, the minimum-tax floor and the
> net-wealth surcharge.

Site: ${SITE_URL}
Default assessment year: ${TAX_YEARS[DEFAULT_YEAR_ID].label}
Tax data last reviewed: ${CONTENT_UPDATED}
Licence: MIT. Source: https://github.com/meetRaselAhmed/ayakor

## What it does

Given monthly salary components (basic, house rent, medical, conveyance, other
allowances), annual bonuses, non-employment income and dividends, it computes
taxable income, the slab-wise tax, the investment rebate, the minimum-tax floor
and the net-wealth surcharge, then reports the annual liability and the monthly
TDS to deduct. Figures entered stay in the browser; nothing is transmitted.

## Method

1. Employment income is summed and the consolidated exemption applied — the
   lower of one-third of employment income or the year's cap. Under the Income
   Tax Act 2023 there is no separate house-rent, medical or conveyance
   exemption; this single deduction replaced them.
2. Non-employment income and taxable dividend are added. Fully exempt income
   (IT/ITES export earnings under Sixth Schedule para 21, and wage-earner
   remittance under para 17) is recorded but excluded from taxable income.
3. Progressive slabs are applied above the taxpayer's tax-free threshold.
4. The section 78 investment rebate is deducted.
5. The result is floored at the statutory minimum tax, then the net-wealth
   surcharge is added. WHICH figure the surcharge is charged on depends on the
   year: for AY 2025-26 it is the floored amount, so the minimum tax is inside
   the surcharge base; from AY 2026-27 it is the tax after rebate, before the
   floor is applied. Quoting one rule for both years gives the wrong answer.
6. Return-filing timing then adjusts the settled liability where the year has a
   year-round filing regime. It never changes the monthly TDS, which the
   employer deducts during the income year.

## Rate data

${ASSESSMENT_YEAR_IDS.map(yearBlock).join("\n")}
## Terminology

Bangladesh law is written per income year (IY) but tax is charged the following
assessment year (AY). Quoting the income year as the assessment year is the
single most common source of mismatched figures online. Every number above is
keyed to the ASSESSMENT year.

## Common questions

${FAQ.map((f) => `Q: ${f.q}\nA: ${f.a}`).join("\n\n")}

## Accuracy and limits

Unofficial and not affiliated with the National Board of Revenue. Guidance
only, not professional tax advice. Complex situations — recognised provident
fund, multiple-employer income, foreign income relief, perquisite valuation —
may need specialist review. Every rate carries a citation in the site's Legal
sources section and in this file. For binding determinations consult a
Bangladesh-licensed income tax practitioner or the NBR.
`;
}

export const dynamic = "force-static";

export function GET() {
  return new Response(build(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
