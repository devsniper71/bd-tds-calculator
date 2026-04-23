/**
 * Bangladesh Income Tax (TDS) Calculator — core engine
 *
 * Assessment Year 2026-2027 & 2027-2028 (Income Year 2025-2026 / 2026-2027)
 *
 * Statutory basis:
 *   • Income Tax Act 2023 — §§ 21, 76, 78, 153, 166, 174, 264, 265
 *   • Finance Ordinance 2025 (gazetted 22 June 2025)
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type TaxpayerCategory =
  | "general_male"
  | "female_or_senior"
  | "disabled_or_third_gender"
  | "freedom_fighter"
  | "non_resident_foreigner";

export interface IncomeComponents {
  basicMonthly: number;
  houseRentMonthly: number;
  medicalMonthly: number;
  conveyanceMonthly: number;
  otherAllowanceMonthly: number;
  festivalBonus1: number;
  festivalBonus2: number;
  performanceBonus: number;
  overtime: number;
  otherEmploymentIncome: number;
  otherIncome: number;
  dividendIncome: number;
}

export interface CalculatorInput {
  category: TaxpayerCategory;
  disabledChildren: number;
  income: IncomeComponents;
  actualInvestment: number;
  taxAlreadyDeducted: number;
  netWealth?: number;
  ownsMultipleCars?: boolean;
  ownsLargeProperty?: boolean;
  isNewTaxpayer?: boolean;
}

export interface SlabResult {
  labelKey: string;
  rangeFrom: number;
  rangeTo: number | null;
  rate: number;
  taxableInThisSlab: number;
  taxAmount: number;
}

export interface CalculatorResult {
  annualBasic: number;
  annualHouseRent: number;
  annualMedical: number;
  annualConveyance: number;
  annualOtherAllowance: number;
  totalFestivalBonuses: number;
  performanceBonus: number;
  overtime: number;
  otherEmploymentIncome: number;
  totalEmploymentIncome: number;
  otherIncome: number;
  dividendIncome: number;
  dividendExemption: number;
  taxableDividend: number;
  grossAnnualIncome: number;

  salaryExemption: number;
  taxableIncome: number;

  taxFreeThreshold: number;
  slabBreakdown: SlabResult[];
  grossTax: number;

  twentyPercentOfTaxable: number;
  maxAllowableInvestment: number;
  eligibleInvestment: number;
  rebateBy3PercentOfTaxable: number;
  rebateBy15PercentOfInvestment: number;
  investmentRebate: number;

  taxAfterRebate: number;
  surcharge: number;
  surchargeRate: number;
  minimumTax: number;
  annualTaxPayable: number;
  monthlyTDS: number;

  taxAlreadyDeducted: number;
  taxDue: number;
  effectiveTaxRate: number;

  // Investment planning advisory
  maxPossibleRebate: number;
  investmentForMaxRebate: number;
  additionalInvestmentNeeded: number;
  possibleTaxSavings: number;
  atMaxRebate: boolean;
  constrainedByMinimumTax: boolean;

  isNonResidentForeigner: boolean;
}

// ---------------------------------------------------------------------------
// Rate tables
// ---------------------------------------------------------------------------

export const CATEGORY_THRESHOLDS: Record<TaxpayerCategory, number> = {
  general_male: 375_000,
  female_or_senior: 425_000,
  disabled_or_third_gender: 500_000,
  freedom_fighter: 525_000,
  non_resident_foreigner: 0,
};

export const SLABS_AFTER_THRESHOLD: ReadonlyArray<readonly [number, number]> = [
  [300_000, 0.10],
  [400_000, 0.15],
  [500_000, 0.20],
  [2_000_000, 0.25],
  [Infinity, 0.30],
];

export const SURCHARGE_BRACKETS: ReadonlyArray<{
  minWealth: number;
  maxWealth: number;
  rate: number;
}> = [
  { minWealth: 40_000_000, maxWealth: 100_000_000, rate: 0.10 },
  { minWealth: 100_000_000, maxWealth: 200_000_000, rate: 0.20 },
  { minWealth: 200_000_000, maxWealth: 500_000_000, rate: 0.30 },
  { minWealth: 500_000_000, maxWealth: Infinity, rate: 0.35 },
];

export const DIVIDEND_EXEMPTION = 25_000;
export const INVESTMENT_CEILING = 10_000_000;
export const REBATE_CEILING = 1_000_000;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const safe = (n: number | undefined | null) =>
  Number.isFinite(n as number) && (n as number) > 0 ? (n as number) : 0;

export type LocaleCode = "en" | "bn";

const BENGALI_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

/** Convert ASCII digits in a string to Bengali (Bangla) numerals. */
export function toBengaliNumerals(s: string): string {
  return s.replace(/[0-9]/g, (d) => BENGALI_DIGITS[Number(d)]);
}

export function formatBDT(
  amount: number,
  locale: LocaleCode = "en",
  decimals = 0
): string {
  if (!Number.isFinite(amount)) return locale === "bn" ? "৳ ০" : "৳ 0";
  const negative = amount < 0;
  const abs = Math.abs(amount);
  let formatted = new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(abs);
  if (locale === "bn") formatted = toBengaliNumerals(formatted);
  return `${negative ? "−" : ""}৳ ${formatted}`;
}

export function formatPercent(
  rate: number,
  locale: LocaleCode = "en",
  decimals = 2
): string {
  let s = `${(rate * 100).toFixed(decimals)}%`;
  if (locale === "bn") s = toBengaliNumerals(s);
  return s;
}

export function formatNumber(n: number, locale: LocaleCode = "en"): string {
  let s = new Intl.NumberFormat("en-IN").format(n);
  if (locale === "bn") s = toBengaliNumerals(s);
  return s;
}

// ---------------------------------------------------------------------------
// Main calculation
// ---------------------------------------------------------------------------

export function calculate(input: CalculatorInput): CalculatorResult {
  const i = input.income;
  const isNonResidentForeigner = input.category === "non_resident_foreigner";

  const annualBasic = safe(i.basicMonthly) * 12;
  const annualHouseRent = safe(i.houseRentMonthly) * 12;
  const annualMedical = safe(i.medicalMonthly) * 12;
  const annualConveyance = safe(i.conveyanceMonthly) * 12;
  const annualOtherAllowance = safe(i.otherAllowanceMonthly) * 12;
  const totalFestivalBonuses =
    safe(i.festivalBonus1) + safe(i.festivalBonus2);
  const performanceBonus = safe(i.performanceBonus);
  const overtime = safe(i.overtime);
  const otherEmploymentIncome = safe(i.otherEmploymentIncome);
  const otherIncome = safe(i.otherIncome);
  const dividendIncome = safe(i.dividendIncome);

  const dividendExemption = Math.min(dividendIncome, DIVIDEND_EXEMPTION);
  const taxableDividend = Math.max(0, dividendIncome - dividendExemption);

  const totalEmploymentIncome =
    annualBasic +
    annualHouseRent +
    annualMedical +
    annualConveyance +
    annualOtherAllowance +
    totalFestivalBonuses +
    performanceBonus +
    overtime +
    otherEmploymentIncome;

  const grossAnnualIncome =
    totalEmploymentIncome + otherIncome + dividendIncome;

  // Non-resident foreigner: flat 30%
  if (isNonResidentForeigner) {
    const taxableIncome =
      totalEmploymentIncome + otherIncome + taxableDividend;
    const grossTax = taxableIncome * 0.30;
    const minimumTax = taxableIncome > 0 ? 5_000 : 0;
    const annualTaxPayable = Math.max(grossTax, minimumTax);
    const monthlyTDS = annualTaxPayable / 12;
    const taxAlreadyDeducted = safe(input.taxAlreadyDeducted);

    return {
      annualBasic,
      annualHouseRent,
      annualMedical,
      annualConveyance,
      annualOtherAllowance,
      totalFestivalBonuses,
      performanceBonus,
      overtime,
      otherEmploymentIncome,
      totalEmploymentIncome,
      otherIncome,
      dividendIncome,
      dividendExemption,
      taxableDividend,
      grossAnnualIncome,
      salaryExemption: 0,
      taxableIncome,
      taxFreeThreshold: 0,
      slabBreakdown: [
        {
          labelKey: "slab.flat30",
          rangeFrom: 0,
          rangeTo: null,
          rate: 0.30,
          taxableInThisSlab: taxableIncome,
          taxAmount: grossTax,
        },
      ],
      grossTax,
      twentyPercentOfTaxable: 0,
      maxAllowableInvestment: 0,
      eligibleInvestment: 0,
      rebateBy3PercentOfTaxable: 0,
      rebateBy15PercentOfInvestment: 0,
      investmentRebate: 0,
      taxAfterRebate: grossTax,
      surcharge: 0,
      surchargeRate: 0,
      minimumTax,
      annualTaxPayable,
      monthlyTDS,
      taxAlreadyDeducted,
      taxDue: annualTaxPayable - taxAlreadyDeducted,
      effectiveTaxRate:
        grossAnnualIncome > 0 ? annualTaxPayable / grossAnnualIncome : 0,
      maxPossibleRebate: 0,
      investmentForMaxRebate: 0,
      additionalInvestmentNeeded: 0,
      possibleTaxSavings: 0,
      atMaxRebate: true,
      constrainedByMinimumTax: false,
      isNonResidentForeigner: true,
    };
  }

  // Resident / NRI Bangladeshi
  const salaryExemption = Math.min(totalEmploymentIncome / 3, 500_000);

  const taxableIncome = Math.max(
    0,
    totalEmploymentIncome +
      otherIncome +
      taxableDividend -
      salaryExemption
  );

  let taxFreeThreshold = CATEGORY_THRESHOLDS[input.category];
  const disabledChildren = Math.max(
    0,
    Math.floor(input.disabledChildren || 0)
  );
  if (disabledChildren > 0) {
    taxFreeThreshold += disabledChildren * 50_000;
  }

  const slabBreakdown: SlabResult[] = [];
  slabBreakdown.push({
    labelKey: "slab.threshold",
    rangeFrom: 0,
    rangeTo: taxFreeThreshold,
    rate: 0,
    taxableInThisSlab: Math.min(taxableIncome, taxFreeThreshold),
    taxAmount: 0,
  });

  let remainingIncome = Math.max(0, taxableIncome - taxFreeThreshold);
  let cursor = taxFreeThreshold;
  let grossTax = 0;
  const labelKeys = ["slab.s1", "slab.s2", "slab.s3", "slab.s4", "slab.s5"];

  for (let idx = 0; idx < SLABS_AFTER_THRESHOLD.length; idx++) {
    const [width, rate] = SLABS_AFTER_THRESHOLD[idx];
    const isLast = !Number.isFinite(width);
    const taxableInThisSlab = isLast
      ? remainingIncome
      : Math.min(remainingIncome, width);
    const taxAmount = taxableInThisSlab * rate;
    grossTax += taxAmount;

    slabBreakdown.push({
      labelKey: labelKeys[idx],
      rangeFrom: cursor,
      rangeTo: isLast ? null : cursor + width,
      rate,
      taxableInThisSlab,
      taxAmount,
    });

    if (!isLast) {
      remainingIncome = Math.max(0, remainingIncome - width);
      cursor += width;
    } else {
      remainingIncome = 0;
    }
    if (remainingIncome <= 0 && !isLast) break;
  }

  const twentyPercentOfTaxable = taxableIncome * 0.20;
  const maxAllowableInvestment = Math.min(
    twentyPercentOfTaxable,
    INVESTMENT_CEILING
  );
  const eligibleInvestment = Math.min(
    safe(input.actualInvestment),
    maxAllowableInvestment
  );
  const rebateBy3PercentOfTaxable = taxableIncome * 0.03;
  const rebateBy15PercentOfInvestment = eligibleInvestment * 0.15;
  let investmentRebate = Math.min(
    rebateBy3PercentOfTaxable,
    rebateBy15PercentOfInvestment,
    REBATE_CEILING
  );
  investmentRebate = Math.min(investmentRebate, grossTax);

  const taxAfterRebate = Math.max(0, grossTax - investmentRebate);

  let surchargeRate = 0;
  const nw = safe(input.netWealth);
  if (nw > 0) {
    for (const b of SURCHARGE_BRACKETS) {
      if (nw >= b.minWealth && nw < b.maxWealth) {
        surchargeRate = b.rate;
        break;
      }
      if (nw >= b.maxWealth) surchargeRate = b.rate;
    }
    if (
      surchargeRate === 0 &&
      input.ownsMultipleCars &&
      input.ownsLargeProperty
    ) {
      surchargeRate = 0.10;
    }
  }
  const surcharge = taxAfterRebate * surchargeRate;

  const minimumTax =
    taxableIncome > taxFreeThreshold
      ? input.isNewTaxpayer
        ? 1_000
        : 5_000
      : 0;

  const annualTaxPayable = Math.max(
    taxAfterRebate + surcharge,
    minimumTax
  );
  const monthlyTDS = annualTaxPayable / 12;
  const taxAlreadyDeducted = safe(input.taxAlreadyDeducted);

  // ─── Investment planning advisory ────────────────────────────────
  // What's the maximum rebate this taxpayer could claim, given their taxable income?
  const maxPossibleRebate = Math.min(
    taxableIncome * 0.03,
    REBATE_CEILING,
    grossTax
  );
  // Minimum investment required to reach that max rebate (15% × investment = rebate).
  const investmentForMaxRebate =
    maxPossibleRebate > 0 ? maxPossibleRebate / 0.15 : 0;
  const additionalInvestmentNeeded = Math.max(
    0,
    investmentForMaxRebate - safe(input.actualInvestment)
  );
  // Simulate the tax payable if the taxpayer invested enough to claim max rebate.
  const simulatedTaxAfterRebate = Math.max(0, grossTax - maxPossibleRebate);
  const simulatedSurcharge = simulatedTaxAfterRebate * surchargeRate;
  const simulatedAnnualTax = Math.max(
    simulatedTaxAfterRebate + simulatedSurcharge,
    minimumTax
  );
  const possibleTaxSavings = Math.max(0, annualTaxPayable - simulatedAnnualTax);
  const atMaxRebate = additionalInvestmentNeeded <= 1; // rounding tolerance
  const constrainedByMinimumTax =
    minimumTax > 0 &&
    simulatedTaxAfterRebate + simulatedSurcharge < minimumTax;

  return {
    annualBasic,
    annualHouseRent,
    annualMedical,
    annualConveyance,
    annualOtherAllowance,
    totalFestivalBonuses,
    performanceBonus,
    overtime,
    otherEmploymentIncome,
    totalEmploymentIncome,
    otherIncome,
    dividendIncome,
    dividendExemption,
    taxableDividend,
    grossAnnualIncome,
    salaryExemption,
    taxableIncome,
    taxFreeThreshold,
    slabBreakdown,
    grossTax,
    twentyPercentOfTaxable,
    maxAllowableInvestment,
    eligibleInvestment,
    rebateBy3PercentOfTaxable,
    rebateBy15PercentOfInvestment,
    investmentRebate,
    taxAfterRebate,
    surcharge,
    surchargeRate,
    minimumTax,
    annualTaxPayable,
    monthlyTDS,
    taxAlreadyDeducted,
    taxDue: annualTaxPayable - taxAlreadyDeducted,
    effectiveTaxRate:
      grossAnnualIncome > 0 ? annualTaxPayable / grossAnnualIncome : 0,
    maxPossibleRebate,
    investmentForMaxRebate,
    additionalInvestmentNeeded,
    possibleTaxSavings,
    atMaxRebate,
    constrainedByMinimumTax,
    isNonResidentForeigner: false,
  };
}

export const DEFAULT_INPUT: CalculatorInput = {
  category: "general_male",
  disabledChildren: 0,
  income: {
    basicMonthly: 60_000,
    houseRentMonthly: 30_000,
    medicalMonthly: 5_000,
    conveyanceMonthly: 3_000,
    otherAllowanceMonthly: 0,
    festivalBonus1: 60_000,
    festivalBonus2: 60_000,
    performanceBonus: 0,
    overtime: 0,
    otherEmploymentIncome: 0,
    otherIncome: 0,
    dividendIncome: 0,
  },
  actualInvestment: 0,
  taxAlreadyDeducted: 0,
  netWealth: 0,
  ownsMultipleCars: false,
  ownsLargeProperty: false,
  isNewTaxpayer: false,
};
