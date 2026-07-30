/**
 * Bangladesh personal income-tax parameters, keyed by Assessment Year (AY).
 *
 * Tax law changes every fiscal year through the Finance Act / Ordinance.
 * Rather than hard-coding a single year's rates, the calculation engine reads
 * the parameters for the selected Assessment Year from this table. Adding a new
 * year is a data-only change: append a config below and list its id.
 *
 * NOTE on year naming — Bangladesh law is written per Income Year (IY); tax is
 * charged the following Assessment Year (AY). Many local sources quote the IY
 * loosely as the AY, which is the #1 cause of number-mismatch online. Every
 * figure here is keyed to the ASSESSMENT YEAR.
 *
 *   Finance Act 2024        → IY 2024-25 → AY 2025-26
 *   Finance Act 2026        → IY 2025-26 → AY 2026-27
 *
 * The Finance Ordinance 2025 had set AY 2026-27 thresholds at 3,75,000 / 4,25,000
 * / 5,00,000 / 5,25,000. The Finance Act 2026 (gazetted 30 Jun 2026, in force
 * 1 Jul 2026) replaced that schedule before the year began, raising every
 * threshold by 25,000 and fixing rates out to AY 2030-31. Those FO 2025 figures
 * never applied to an assessed year and are deliberately not kept here.
 *
 * Every number is sourced — see the `sources` array on each year.
 */

export type TaxpayerCategory =
  | "general_male"
  | "female_or_senior"
  | "disabled_or_third_gender"
  | "freedom_fighter"
  | "non_resident_foreigner";

/** Location bands for the (historically) area-based minimum tax. */
export type MinTaxArea = "dhaka_ctg" | "other_city" | "other";

export interface SurchargeBracket {
  minWealth: number;
  maxWealth: number;
  rate: number;
}

export interface LawSource {
  label: string;
  /** Authority tier — drives the badge in the UI. */
  kind: "primary" | "official" | "secondary";
  url: string;
  note?: string;
}

/** Return-filing quarters, driving the year-round filing incentive. */
export type FilingQuarter = "q1" | "q2" | "q3" | "q4";

/**
 * Year-round filing incentive (replaces the single 30-Nov "Tax Day"):
 * early filers (Q1) get a rebate; late filers (Q3/Q4) pay a surcharge.
 * PROVISIONAL — announced in the FY2026-27 budget; verify the enacted terms,
 * the exact assessment year it attaches to, and the minimum-tax interaction
 * against the gazetted Finance Act 2026 / an NBR paripatra before relying on it.
 */
export interface FilingIncentive {
  provisional: boolean;
  /** Q1 (1 Jul–30 Sep): rebate = lower of rate × tax or cap. */
  earlyRebateRate: number; // 0.05
  earlyRebateCap: number; // 25,000
  /** Q3 (1 Jan–31 Mar): surcharge = higher of rate × tax or floor. */
  lateQ3Rate: number; // 0.02
  lateQ3Floor: number; // 3,000
  /** Q4 (1 Apr–30 Jun): surcharge = higher of rate × tax or floor. */
  lateQ4Rate: number; // 0.05
  lateQ4Floor: number; // 5,000
}

export interface TaxYearConfig {
  /** Stable id, e.g. "2026-27". */
  id: string;
  label: string;
  incomeYear: string;
  /** Primary statute this year's numbers come from. */
  statute: string;
  /** True for the year we recommend / default to. */
  isDefault?: boolean;

  /** Tax-free threshold per taxpayer category (BDT). */
  thresholds: Record<TaxpayerCategory, number>;
  /** Extra threshold per physically-challenged child (BDT). */
  disabledChildThresholdBump: number;

  /** Progressive bands ABOVE the threshold: [bandWidth, rate]. Last width = Infinity. */
  slabs: ReadonlyArray<readonly [number, number]>;

  /** Salary (employment income) exemption: lower of fraction × income or cap. */
  salaryExemptionFraction: number;
  salaryExemptionCap: number;

  /** Investment rebate. */
  rebateRateOfInvestment: number; // e.g. 0.15
  rebateRateOfTaxable: number; // e.g. 0.03
  investmentCeiling: number; // absolute cap on eligible investment
  rebateCeiling: number; // absolute cap on the rebate itself
  /** Eligible investment is also capped at this fraction of taxable income. */
  investmentTaxableFraction: number; // e.g. 0.20

  /** Net-wealth surcharge brackets + asset-based trigger. */
  surchargeBrackets: ReadonlyArray<SurchargeBracket>;
  assetSurchargeRate: number; // triggered by >1 car OR house > 8,000 sqft, even below the wealth floor
  /** Whether the minimum-tax floor is part of the surcharge base (true ≤ AY 2025-26). */
  minTaxInSurchargeBase: boolean;

  /** Minimum tax floor (BDT). Area-based through AY 2025-26, flat after. */
  minimumTaxByArea: Record<MinTaxArea, number>;
  /** When true the three area values differ → the UI shows a location selector. */
  areaBasedMinTax: boolean;
  minimumTaxNewTaxpayer: number;

  /** Flat rate for non-resident foreigners. */
  nonResidentRate: number;

  dividendExemption: number;

  /** Optional — only years that have the year-round filing framework. */
  filingIncentive?: FilingIncentive;

  sources: ReadonlyArray<LawSource>;
}

// ─── Shared source references, reused across years ─────────────────────────
const SRC = {
  nbr: {
    label: "National Board of Revenue (NBR)",
    kind: "official",
    url: "https://nbr.gov.bd/",
    note: "The tax authority of Bangladesh — acts, SROs, circulars & return forms.",
  },
  nbrForms: {
    label: "NBR — income tax return forms",
    kind: "official",
    url: "https://nbr.gov.bd/form/income-tax/eng",
    note: "The official return encodes the slab & rebate maths.",
  },
  etax: {
    label: "NBR e-Return portal (eTax)",
    kind: "official",
    url: "https://etaxnbr.gov.bd/",
    note: "Official online filing — the closest thing to an official calculator.",
  },
  ita2023: {
    label: "Income Tax Act 2023",
    kind: "primary",
    url: "https://bdlaws.minlaw.gov.bd/act-1429.html",
    note: "The governing statute (আয়কর আইন, ২০২৩), official Laws of Bangladesh portal.",
  },
  ita2023Nbr: {
    label: "Income Tax Act 2023 (PDF, NBR)",
    kind: "primary",
    url: "https://nbr.gov.bd/uploads/acts/Income_tax_act_2023.pdf",
    note: "NBR's consolidated English copy.",
  },
  pwc: {
    label: "PwC Worldwide Tax Summaries — Bangladesh",
    kind: "secondary",
    url: "https://taxsummaries.pwc.com/bangladesh/individual/taxes-on-personal-income",
    note: "Year-labelled slabs, thresholds & minimum tax. Best single secondary source.",
  },
  pwcSurcharge: {
    label: "PwC WTS — Bangladesh, other taxes",
    kind: "secondary",
    url: "https://taxsummaries.pwc.com/bangladesh/individual/other-taxes",
  },
  financeAct2026: {
    label: "Finance Act 2026 (gazetted 30 Jun 2026)",
    kind: "primary",
    url: "https://nbr.gov.bd/regulations/acts/finance-acts/eng",
    note: "তফসিল-২ [ধারা ১৬০], প্রথম অংশ, অনুচ্ছেদ-ক — the AY 2026-27 rate table. Supersedes the Finance Ordinance 2025 schedule.",
  },
  dailyStarFA2026: {
    label: "The Daily Star — Finance Bill passed, threshold set at Tk 4 lakh",
    kind: "secondary",
    url: "https://www.thedailystar.net/business/bangladesh-budget-2025-26/news/finance-bill-passed-tax-free-income-threshold-set-tk-4-lakh-fy2026-27-4211511",
  },
  tnpFA2026: {
    label: "TNP Legal — Finance Act 2026 tax changes explained",
    kind: "secondary",
    url: "https://tnp.legal/blogs/finance-act-2026-bangladesh-tax-changes-explained/",
    note: "Five-year threshold ladder: 4 lakh (AY 2026-27/27-28) → 4.5 lakh → 5 lakh.",
  },
  kpmgFO2025: {
    label: "KPMG — Finance Ordinance 2025 tax proposals",
    kind: "secondary",
    url: "https://kpmg.com/us/en/taxnewsflash/news/2025/06/bangladesh-income-tax-vat-proposals-finance-ordinance-2025.html",
  },
  rrhFO2025: {
    label: "Rahman Rahman Huq (KPMG) — salient features, FO 2025 (PDF)",
    kind: "secondary",
    url: "https://assets.kpmg.com/content/dam/kpmg/bd/pdf/TaxUpdate/Salient_features_of_Finance_Ordinance_June_2025.pdf",
  },
  icabFO2025: {
    label: "ICAB — Finance Ordinance 2025, income tax (PDF)",
    kind: "secondary",
    url: "https://www.icab.org.bd/icabadmin/uploads/ckeditor/4053Finance%20Ordinance%202025_Income%20Tax_ICAB_3Sept25.pdf",
    note: "Institute of Chartered Accountants of Bangladesh.",
  },
} as const;

// ─── Constants shared across both years (stable in law) ────────────────────
const SURCHARGE_BRACKETS: ReadonlyArray<SurchargeBracket> = [
  { minWealth: 40_000_000, maxWealth: 100_000_000, rate: 0.1 },
  { minWealth: 100_000_000, maxWealth: 200_000_000, rate: 0.2 },
  { minWealth: 200_000_000, maxWealth: 500_000_000, rate: 0.3 },
  { minWealth: 500_000_000, maxWealth: Infinity, rate: 0.35 },
];

// Investment rebate has been constant across both years.
const REBATE = {
  rebateRateOfInvestment: 0.15,
  rebateRateOfTaxable: 0.03,
  investmentCeiling: 10_000_000,
  rebateCeiling: 1_000_000,
  investmentTaxableFraction: 0.2,
} as const;

// Dividend exemption — Sixth Schedule, Part 1. Tk 50,000 for dividends from a
// company listed on a Bangladesh stock exchange (cl. 11A); a separate Tk 25,000
// applies to mutual/unit-fund dividends (cl. 22A). The single "dividend income"
// field here assumes the common case (listed-company dividend).
const DIVIDEND_EXEMPTION = 50_000;

// ═══════════════════════════════════════════════════════════════════════════
// AY 2025-26 — Finance Act 2024 (IY 2024-25): 5% entry slab, top rate 30%,
// area-based minimum tax, salary-exemption cap 4.5 lakh.
// ═══════════════════════════════════════════════════════════════════════════
const AY_2025_26: TaxYearConfig = {
  id: "2025-26",
  label: "AY 2025–26",
  incomeYear: "Income Year 2024–2025",
  statute: "Finance Act 2024",

  thresholds: {
    general_male: 350_000,
    female_or_senior: 400_000,
    disabled_or_third_gender: 475_000,
    freedom_fighter: 500_000,
    non_resident_foreigner: 0,
  },
  disabledChildThresholdBump: 50_000,

  slabs: [
    [100_000, 0.05],
    [400_000, 0.1],
    [500_000, 0.15],
    [500_000, 0.2],
    [2_000_000, 0.25],
    [Infinity, 0.3],
  ],

  salaryExemptionFraction: 1 / 3,
  salaryExemptionCap: 450_000,

  ...REBATE,

  surchargeBrackets: SURCHARGE_BRACKETS,
  assetSurchargeRate: 0.1,
  minTaxInSurchargeBase: true, // AY 2025-26: minimum tax is inside the surcharge base

  minimumTaxByArea: { dhaka_ctg: 5_000, other_city: 4_000, other: 3_000 },
  areaBasedMinTax: true,
  minimumTaxNewTaxpayer: 1_000,

  nonResidentRate: 0.3,
  dividendExemption: DIVIDEND_EXEMPTION,

  sources: [
    SRC.nbr,
    SRC.ita2023,
    SRC.ita2023Nbr,
    SRC.kpmgFO2025, // documents the AY 2025-26 (350k) baseline it superseded
    SRC.pwc,
    SRC.pwcSurcharge,
    SRC.nbrForms,
    SRC.etax,
  ],
};

// ═══════════════════════════════════════════════════════════════════════════
// AY 2026-27 — Finance Act 2026 (IY 2025-26): general threshold 4,00,000, 5%
// entry slab abolished (first taxable taka @ 10%), flat minimum tax, salary
// cap 5 lakh. Thresholds are the opening step of a five-year schedule that
// runs to AY 2030-31 (Sch. 2 covers AY 2026-27 → 2030-31; ¶ক sets 2026-27 and
// 2027-28 at these rates).
// ═══════════════════════════════════════════════════════════════════════════
const AY_2026_27: TaxYearConfig = {
  id: "2026-27",
  label: "AY 2026–27",
  incomeYear: "Income Year 2025–2026",
  statute: "Finance Act 2026",
  isDefault: true,

  // Finance Act 2026, তফসিল-২ [ধারা ১৬০], প্রথম অংশ, অনুচ্ছেদ-ক:
  //   base table 4,00,000 · proviso (ক) women & 65+ 4,50,000
  //   proviso (খ) third-gender & person with disability 5,25,000
  //   proviso (গ) gazetted war-wounded freedom fighter / injured July Warrior
  //               2024, 5,50,000
  thresholds: {
    general_male: 400_000,
    female_or_senior: 450_000,
    disabled_or_third_gender: 525_000,
    freedom_fighter: 550_000,
    non_resident_foreigner: 0,
  },
  // Proviso (ঘ): +50,000 per physically-challenged child/dependent — but where
  // BOTH parents are taxpayers only one of them may claim it. The engine cannot
  // know that, so the field hint tells the user to claim it on one return only.
  disabledChildThresholdBump: 50_000,

  slabs: [
    [300_000, 0.1],
    [400_000, 0.15],
    [500_000, 0.2],
    [2_000_000, 0.25],
    [Infinity, 0.3],
  ],

  salaryExemptionFraction: 1 / 3,
  salaryExemptionCap: 500_000,

  ...REBATE,

  surchargeBrackets: SURCHARGE_BRACKETS,
  assetSurchargeRate: 0.1,
  minTaxInSurchargeBase: false, // AY 2026-27: minimum tax excluded from surcharge base

  minimumTaxByArea: { dhaka_ctg: 5_000, other_city: 5_000, other: 5_000 },
  areaBasedMinTax: false,
  minimumTaxNewTaxpayer: 1_000,

  nonResidentRate: 0.3,
  dividendExemption: DIVIDEND_EXEMPTION,

  // The year-round filing framework is now ENACTED by the Finance Act 2026.
  // The early-filing side is corroborated: 5% of tax capped at 25,000 for
  // 1 Jul–30 Sep, neutral through December. The late-filing rates below are
  // still the budget-announcement figures — kept `provisional: true` until the
  // Q3/Q4 terms are read off the gazette itself.
  filingIncentive: {
    provisional: true,
    earlyRebateRate: 0.05,
    earlyRebateCap: 25_000,
    lateQ3Rate: 0.02,
    lateQ3Floor: 3_000,
    lateQ4Rate: 0.05,
    lateQ4Floor: 5_000,
  },

  sources: [
    SRC.nbr,
    SRC.ita2023,
    SRC.financeAct2026,
    SRC.dailyStarFA2026,
    SRC.tnpFA2026,
    SRC.pwc,
    SRC.nbrForms,
    SRC.etax,
  ],
};

// ─── Registry ──────────────────────────────────────────────────────────────
export const TAX_YEARS: Record<string, TaxYearConfig> = {
  [AY_2025_26.id]: AY_2025_26,
  [AY_2026_27.id]: AY_2026_27,
};

/** Years in display order — newest first. */
export const ASSESSMENT_YEAR_IDS: string[] = ["2026-27", "2025-26"];

export const DEFAULT_YEAR_ID = "2026-27";

export function getYearConfig(id: string | undefined): TaxYearConfig {
  return (id && TAX_YEARS[id]) || TAX_YEARS[DEFAULT_YEAR_ID];
}
