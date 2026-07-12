/**
 * Bangladesh Income Tax (TDS) Calculator — core engine
 *
 * Multi-year: all rates live in `lib/tax-years.ts`, keyed by Assessment Year.
 * This engine is year-agnostic — it reads the config for `input.assessmentYear`
 * and computes from that. Adding a new year needs no change here.
 *
 * Statutory basis (see each year's `sources`):
 *   • Income Tax Act 2023 — §§ 21, 76, 78, 153, 166, 174, 264, 265
 *   • Finance Act 2023 / Finance Act 2024 / Finance Ordinance 2025
 */

import {
  getYearConfig,
  DEFAULT_YEAR_ID,
  type TaxpayerCategory,
  type MinTaxArea,
  type FilingQuarter,
  type FilingIncentive,
} from "./tax-years";

export type { TaxpayerCategory, MinTaxArea, FilingQuarter };

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

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
  /** Tax-exempt (recorded on the return but not taxed) — see notes in the engine. */
  itesIncome: number; // IT/ITES / freelance export income (Sixth Sch. ¶21)
  remittanceIncome: number; // wage-earner remittance / foreign income earned abroad (¶17)
}

export interface CalculatorInput {
  assessmentYear: string;
  category: TaxpayerCategory;
  disabledChildren: number;
  income: IncomeComponents;
  actualInvestment: number;
  taxAlreadyDeducted: number;
  netWealth?: number;
  ownsMultipleCars?: boolean;
  ownsLargeProperty?: boolean;
  isNewTaxpayer?: boolean;
  /** Only relevant for years with area-based minimum tax (AY ≤ 2025-26). */
  minTaxArea?: MinTaxArea;
  /** Return-filing quarter — drives the (provisional) year-round filing incentive. */
  filingQuarter?: FilingQuarter;
}

export interface SlabResult {
  rangeFrom: number;
  rangeTo: number | null;
  rate: number;
  taxableInThisSlab: number;
  taxAmount: number;
}

export interface CalculatorResult {
  assessmentYearId: string;

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

  // Exempt income — recorded for the return but excluded from taxable income.
  itesIncome: number;
  remittanceIncome: number;
  exemptIncome: number;

  salaryExemption: number;
  salaryExemptionCap: number;
  taxableIncome: number;

  taxFreeThreshold: number;
  slabBreakdown: SlabResult[];
  grossTax: number;

  investmentRebate: number;

  taxAfterRebate: number;
  surcharge: number;
  surchargeRate: number;
  minimumTax: number;
  annualTaxPayable: number;
  monthlyTDS: number;

  // Year-round filing incentive (provisional; only when the year has one)
  filingQuarter: FilingQuarter | null;
  filingRebate: number;
  filingSurcharge: number;
  taxAfterFilingIncentive: number;

  taxAlreadyDeducted: number;
  taxDue: number;
  effectiveTaxRate: number;

  // Investment planning advisory
  maxPossibleRebate: number;
  additionalInvestmentNeeded: number;
  possibleTaxSavings: number;
  atMaxRebate: boolean;
  constrainedByMinimumTax: boolean;

  isNonResidentForeigner: boolean;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const safe = (n: number | undefined | null) =>
  Number.isFinite(n as number) && (n as number) > 0 ? (n as number) : 0;

/** Format an amount as Bangladeshi Taka using the Indian grouping (lakh/crore). */
export function formatBDT(amount: number, decimals = 0): string {
  if (!Number.isFinite(amount)) return "৳ 0";
  const negative = amount < 0;
  const abs = Math.abs(amount);
  const formatted = new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(abs);
  return `${negative ? "−" : ""}৳ ${formatted}`;
}

export function formatPercent(rate: number, decimals = 2): string {
  return `${(rate * 100).toFixed(decimals)}%`;
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat("en-IN").format(n);
}

// Year-round filing incentive — early filing (Q1) rebate vs late (Q3/Q4)
// surcharge. Applies at return-filing time, so it adjusts the final liability
// but NOT the monthly TDS (which is deducted through the year). Min-tax-safe.
function computeFilingIncentive(
  filingIncentive: FilingIncentive | undefined,
  quarter: FilingQuarter | undefined,
  annualTaxPayable: number,
  minimumTax: number
) {
  if (!filingIncentive || !quarter || annualTaxPayable <= 0) {
    return {
      filingQuarter: filingIncentive && quarter ? quarter : null,
      filingRebate: 0,
      filingSurcharge: 0,
      taxAfterFilingIncentive: annualTaxPayable,
    };
  }
  let filingRebate = 0;
  let filingSurcharge = 0;
  if (quarter === "q1") {
    filingRebate = Math.min(
      annualTaxPayable * filingIncentive.earlyRebateRate,
      filingIncentive.earlyRebateCap
    );
  } else if (quarter === "q3") {
    filingSurcharge = Math.max(
      annualTaxPayable * filingIncentive.lateQ3Rate,
      filingIncentive.lateQ3Floor
    );
  } else if (quarter === "q4") {
    filingSurcharge = Math.max(
      annualTaxPayable * filingIncentive.lateQ4Rate,
      filingIncentive.lateQ4Floor
    );
  }
  let taxAfterFilingIncentive = annualTaxPayable - filingRebate + filingSurcharge;
  // The early rebate cannot push the payable below the minimum tax floor.
  if (filingRebate > 0) {
    taxAfterFilingIncentive = Math.max(taxAfterFilingIncentive, minimumTax);
    // Report only the rebate actually applied, so the breakdown reconciles.
    filingRebate = annualTaxPayable - taxAfterFilingIncentive;
  }
  return {
    filingQuarter: quarter,
    filingRebate,
    filingSurcharge,
    taxAfterFilingIncentive,
  };
}

// ---------------------------------------------------------------------------
// Main calculation
// ---------------------------------------------------------------------------

export function calculate(input: CalculatorInput): CalculatorResult {
  const cfg = getYearConfig(input.assessmentYear);
  const i = input.income;
  const isNonResidentForeigner = input.category === "non_resident_foreigner";

  const annualBasic = safe(i.basicMonthly) * 12;
  const annualHouseRent = safe(i.houseRentMonthly) * 12;
  const annualMedical = safe(i.medicalMonthly) * 12;
  const annualConveyance = safe(i.conveyanceMonthly) * 12;
  const annualOtherAllowance = safe(i.otherAllowanceMonthly) * 12;
  const totalFestivalBonuses = safe(i.festivalBonus1) + safe(i.festivalBonus2);
  const performanceBonus = safe(i.performanceBonus);
  const overtime = safe(i.overtime);
  const otherEmploymentIncome = safe(i.otherEmploymentIncome);
  const otherIncome = safe(i.otherIncome);
  const dividendIncome = safe(i.dividendIncome);

  // Fully exempt income — recorded but deliberately kept OUT of every taxable
  // figure (gross, taxable, slabs). IT/ITES freelance export income (Sixth
  // Schedule ¶21, exempt to 30 Jun 2027) and wage-earner remittance / foreign
  // income earned abroad (¶17) — both conditional on banking-channel receipt.
  const itesIncome = safe(i.itesIncome);
  const remittanceIncome = safe(i.remittanceIncome);
  const exemptIncome = itesIncome + remittanceIncome;

  const dividendExemption = Math.min(dividendIncome, cfg.dividendExemption);
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

  const grossAnnualIncome = totalEmploymentIncome + otherIncome + dividendIncome;

  // Non-resident foreigner: flat rate, no threshold / rebate.
  if (isNonResidentForeigner) {
    const taxableIncome = totalEmploymentIncome + otherIncome + taxableDividend;
    const grossTax = taxableIncome * cfg.nonResidentRate;
    const minimumTax = taxableIncome > 0 ? cfg.minimumTaxByArea.dhaka_ctg : 0;
    const annualTaxPayable = Math.max(grossTax, minimumTax);
    const monthlyTDS = annualTaxPayable / 12;
    const taxAlreadyDeducted = safe(input.taxAlreadyDeducted);

    return {
      assessmentYearId: cfg.id,
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
      itesIncome,
      remittanceIncome,
      exemptIncome,
      salaryExemption: 0,
      salaryExemptionCap: cfg.salaryExemptionCap,
      taxableIncome,
      taxFreeThreshold: 0,
      slabBreakdown: [
        {
          rangeFrom: 0,
          rangeTo: null,
          rate: cfg.nonResidentRate,
          taxableInThisSlab: taxableIncome,
          taxAmount: grossTax,
        },
      ],
      grossTax,
      investmentRebate: 0,
      taxAfterRebate: grossTax,
      surcharge: 0,
      surchargeRate: 0,
      minimumTax,
      annualTaxPayable,
      monthlyTDS,
      filingQuarter: null,
      filingRebate: 0,
      filingSurcharge: 0,
      taxAfterFilingIncentive: annualTaxPayable,
      taxAlreadyDeducted,
      taxDue: annualTaxPayable - taxAlreadyDeducted,
      effectiveTaxRate:
        grossAnnualIncome > 0 ? annualTaxPayable / grossAnnualIncome : 0,
      maxPossibleRebate: 0,
      additionalInvestmentNeeded: 0,
      possibleTaxSavings: 0,
      atMaxRebate: true,
      constrainedByMinimumTax: false,
      isNonResidentForeigner: true,
    };
  }

  // Resident / NRI Bangladeshi
  const salaryExemption = Math.min(
    totalEmploymentIncome * cfg.salaryExemptionFraction,
    cfg.salaryExemptionCap
  );

  const taxableIncome = Math.max(
    0,
    totalEmploymentIncome + otherIncome + taxableDividend - salaryExemption
  );

  let taxFreeThreshold = cfg.thresholds[input.category];
  const disabledChildren = Math.max(0, Math.floor(input.disabledChildren || 0));
  if (disabledChildren > 0) {
    taxFreeThreshold += disabledChildren * cfg.disabledChildThresholdBump;
  }

  const slabBreakdown: SlabResult[] = [];
  slabBreakdown.push({
    rangeFrom: 0,
    rangeTo: taxFreeThreshold,
    rate: 0,
    taxableInThisSlab: Math.min(taxableIncome, taxFreeThreshold),
    taxAmount: 0,
  });

  let remainingIncome = Math.max(0, taxableIncome - taxFreeThreshold);
  let cursor = taxFreeThreshold;
  let grossTax = 0;

  for (let idx = 0; idx < cfg.slabs.length; idx++) {
    const [width, rate] = cfg.slabs[idx];
    const isLast = !Number.isFinite(width);
    const taxableInThisSlab = isLast
      ? remainingIncome
      : Math.min(remainingIncome, width);
    const taxAmount = taxableInThisSlab * rate;
    grossTax += taxAmount;

    slabBreakdown.push({
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

  const twentyPercentOfTaxable = taxableIncome * cfg.investmentTaxableFraction;
  const maxAllowableInvestment = Math.min(
    twentyPercentOfTaxable,
    cfg.investmentCeiling
  );
  const eligibleInvestment = Math.min(
    safe(input.actualInvestment),
    maxAllowableInvestment
  );
  const rebateBy3PercentOfTaxable = taxableIncome * cfg.rebateRateOfTaxable;
  const rebateBy15PercentOfInvestment =
    eligibleInvestment * cfg.rebateRateOfInvestment;
  let investmentRebate = Math.min(
    rebateBy3PercentOfTaxable,
    rebateBy15PercentOfInvestment,
    cfg.rebateCeiling
  );
  investmentRebate = Math.min(investmentRebate, grossTax);

  const taxAfterRebate = Math.max(0, grossTax - investmentRebate);

  let surchargeRate = 0;
  const nw = safe(input.netWealth);
  if (nw > 0) {
    // Brackets are lower-exclusive / upper-inclusive: net wealth EXCEEDING a
    // floor (e.g. > 4 crore) attracts the rate, up to and including the ceiling.
    for (const b of cfg.surchargeBrackets) {
      if (nw > b.minWealth && nw <= b.maxWealth) {
        surchargeRate = b.rate;
        break;
      }
    }
  }
  // Asset-based trigger: owning MORE than one car OR a house > 8,000 sq ft —
  // either condition alone imposes the minimum surcharge, even below Tk 4 crore.
  if (
    surchargeRate === 0 &&
    (input.ownsMultipleCars || input.ownsLargeProperty)
  ) {
    surchargeRate = cfg.assetSurchargeRate;
  }
  // Minimum tax — area-based through AY 2025-26, flat after.
  const areaKey: MinTaxArea = input.minTaxArea ?? "dhaka_ctg";
  const baseMinimumTax = input.isNewTaxpayer
    ? cfg.minimumTaxNewTaxpayer
    : cfg.minimumTaxByArea[areaKey];
  const minimumTax = taxableIncome > taxFreeThreshold ? baseMinimumTax : 0;

  // Statutory order: regular tax less rebate, floored at the minimum tax, THEN
  // the net-wealth surcharge is added on top. Whether the minimum tax is part of
  // the surcharge base flips between AY 2025-26 (in) and AY 2026-27 (out).
  const taxBeforeSurcharge = Math.max(taxAfterRebate, minimumTax);
  const surchargeBase = cfg.minTaxInSurchargeBase
    ? taxBeforeSurcharge
    : taxAfterRebate;
  const surcharge = surchargeBase * surchargeRate;

  const annualTaxPayable = taxBeforeSurcharge + surcharge;
  const monthlyTDS = annualTaxPayable / 12;
  const taxAlreadyDeducted = safe(input.taxAlreadyDeducted);

  const filing = computeFilingIncentive(
    cfg.filingIncentive,
    input.filingQuarter,
    annualTaxPayable,
    minimumTax
  );

  // ─── Investment planning advisory ────────────────────────────────
  const maxPossibleRebate = Math.min(
    taxableIncome * cfg.rebateRateOfTaxable,
    cfg.rebateCeiling,
    grossTax
  );
  const investmentForMaxRebate =
    maxPossibleRebate > 0 ? maxPossibleRebate / cfg.rebateRateOfInvestment : 0;
  const additionalInvestmentNeeded = Math.max(
    0,
    investmentForMaxRebate - safe(input.actualInvestment)
  );
  const simulatedTaxAfterRebate = Math.max(0, grossTax - maxPossibleRebate);
  const simulatedTaxBeforeSurcharge = Math.max(
    simulatedTaxAfterRebate,
    minimumTax
  );
  const simulatedSurchargeBase = cfg.minTaxInSurchargeBase
    ? simulatedTaxBeforeSurcharge
    : simulatedTaxAfterRebate;
  const simulatedAnnualTax =
    simulatedTaxBeforeSurcharge + simulatedSurchargeBase * surchargeRate;
  const possibleTaxSavings = Math.max(0, annualTaxPayable - simulatedAnnualTax);
  const atMaxRebate = additionalInvestmentNeeded <= 1; // rounding tolerance
  const constrainedByMinimumTax =
    minimumTax > 0 && simulatedTaxAfterRebate < minimumTax;

  return {
    assessmentYearId: cfg.id,
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
    itesIncome,
    remittanceIncome,
    exemptIncome,
    salaryExemption,
    salaryExemptionCap: cfg.salaryExemptionCap,
    taxableIncome,
    taxFreeThreshold,
    slabBreakdown,
    grossTax,
    investmentRebate,
    taxAfterRebate,
    surcharge,
    surchargeRate,
    minimumTax,
    annualTaxPayable,
    monthlyTDS,
    filingQuarter: filing.filingQuarter,
    filingRebate: filing.filingRebate,
    filingSurcharge: filing.filingSurcharge,
    taxAfterFilingIncentive: filing.taxAfterFilingIncentive,
    taxAlreadyDeducted,
    taxDue: filing.taxAfterFilingIncentive - taxAlreadyDeducted,
    // Reflects the core statutory liability; the filing-timing incentive is a
    // settlement-time adjustment and is intentionally excluded from this rate.
    effectiveTaxRate:
      grossAnnualIncome > 0 ? annualTaxPayable / grossAnnualIncome : 0,
    maxPossibleRebate,
    additionalInvestmentNeeded,
    possibleTaxSavings,
    atMaxRebate,
    constrainedByMinimumTax,
    isNonResidentForeigner: false,
  };
}

export const DEFAULT_INPUT: CalculatorInput = {
  assessmentYear: DEFAULT_YEAR_ID,
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
    itesIncome: 0,
    remittanceIncome: 0,
  },
  actualInvestment: 0,
  taxAlreadyDeducted: 0,
  netWealth: 0,
  ownsMultipleCars: false,
  ownsLargeProperty: false,
  isNewTaxpayer: false,
  minTaxArea: "dhaka_ctg",
  filingQuarter: "q2", // neutral by default — no rebate or surcharge applied
};
