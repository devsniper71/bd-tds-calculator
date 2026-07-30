import { describe, it, expect } from "vitest";
import {
  calculate,
  DEFAULT_INPUT,
  type CalculatorInput,
  type IncomeComponents,
} from "./tax-calculator";

// ---------------------------------------------------------------------------
// Test helpers
// ---------------------------------------------------------------------------

const EMPTY_INCOME: IncomeComponents = {
  basicMonthly: 0,
  houseRentMonthly: 0,
  medicalMonthly: 0,
  conveyanceMonthly: 0,
  otherAllowanceMonthly: 0,
  festivalBonus1: 0,
  festivalBonus2: 0,
  performanceBonus: 0,
  overtime: 0,
  otherEmploymentIncome: 0,
  otherIncome: 0,
  dividendIncome: 0,
  itesIncome: 0,
  remittanceIncome: 0,
};

/** Build an input for `year`, defaulting to the neutral (Q2) filing quarter. */
function input(year: string, over: Partial<CalculatorInput> = {}): CalculatorInput {
  return { ...DEFAULT_INPUT, assessmentYear: year, filingQuarter: "q2", ...over };
}

/** Input with only a single lump of employment income, everything else zero. */
function employmentOnly(year: string, annual: number, over: Partial<CalculatorInput> = {}) {
  return input(year, {
    income: { ...EMPTY_INCOME, otherEmploymentIncome: annual },
    ...over,
  });
}

const near = (a: number, b: number) => expect(a).toBeCloseTo(b, 2);

// ---------------------------------------------------------------------------
// Default profile (documents the headline numbers)
// ---------------------------------------------------------------------------

describe("default salaried profile", () => {
  it("AY 2026-27 — taxable 8,64,000, annual tax 58,350, monthly 4,862.50", () => {
    const r = calculate(input("2026-27"));
    expect(r.taxableIncome).toBe(864000);
    expect(r.grossTax).toBe(58350);
    expect(r.annualTaxPayable).toBe(58350);
    near(r.monthlyTDS, 4862.5);
    expect(r.salaryExemptionCap).toBe(500000);
  });

  it("AY 2025-26 — 5% entry slab, annual tax 47,100, cap 4,50,000", () => {
    const r = calculate(input("2025-26"));
    expect(r.grossTax).toBe(47100);
    expect(r.salaryExemptionCap).toBe(450000);
  });
});

// ---------------------------------------------------------------------------
// Boundaries & guards
// ---------------------------------------------------------------------------

describe("boundaries and input guards", () => {
  it("zero income → zero tax", () => {
    const r = calculate(input("2026-27", { income: { ...EMPTY_INCOME } }));
    expect(r.taxableIncome).toBe(0);
    expect(r.annualTaxPayable).toBe(0);
    expect(r.monthlyTDS).toBe(0);
  });

  it("income exactly at the threshold → no tax, no minimum tax", () => {
    // employment 5,62,500 → 1/3 exemption 1,87,500 → taxable 3,75,000 = threshold
    const r = calculate(employmentOnly("2026-27", 562500));
    expect(r.taxableIncome).toBe(375000);
    expect(r.grossTax).toBe(0);
    expect(r.minimumTax).toBe(0);
    expect(r.annualTaxPayable).toBe(0);
  });

  it("just above the threshold → minimum tax floor binds", () => {
    const r = calculate(employmentOnly("2026-27", 600000)); // taxable 4,00,000
    expect(r.grossTax).toBe(2500); // 25,000 @ 10%
    expect(r.annualTaxPayable).toBe(5000); // min tax
  });

  it("negative and NaN inputs are coerced to zero", () => {
    const r = calculate(
      input("2026-27", {
        income: { ...EMPTY_INCOME, basicMonthly: -9, otherEmploymentIncome: NaN, itesIncome: NaN },
      })
    );
    expect(r.taxableIncome).toBe(0);
  });

  it("very large income reaches the 30% top slab", () => {
    const r = calculate(employmentOnly("2026-27", 60_000_000));
    expect(r.grossTax).toBe(17467500);
  });
});

// ---------------------------------------------------------------------------
// Taxpayer categories & thresholds
// ---------------------------------------------------------------------------

describe("taxpayer categories", () => {
  it("category thresholds (AY 2026-27)", () => {
    expect(calculate(input("2026-27", { category: "general_male" })).taxFreeThreshold).toBe(375000);
    expect(calculate(input("2026-27", { category: "female_or_senior" })).taxFreeThreshold).toBe(425000);
    expect(calculate(input("2026-27", { category: "disabled_or_third_gender" })).taxFreeThreshold).toBe(500000);
    expect(calculate(input("2026-27", { category: "freedom_fighter" })).taxFreeThreshold).toBe(525000);
  });

  it("+50,000 threshold per physically-challenged child", () => {
    expect(calculate(input("2026-27", { disabledChildren: 2 })).taxFreeThreshold).toBe(475000);
  });

  it("non-resident foreigner: flat 30%, no threshold or exemption", () => {
    const r = calculate(employmentOnly("2026-27", 1_200_000, { category: "non_resident_foreigner" }));
    expect(r.taxFreeThreshold).toBe(0);
    expect(r.salaryExemption).toBe(0);
    expect(r.grossTax).toBe(360000);
    expect(r.isNonResidentForeigner).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Investment rebate (ITA 2023 §78)
// ---------------------------------------------------------------------------

describe("investment rebate", () => {
  it("rebate = lowest of 3% taxable / 15% investment / cap", () => {
    // taxable 8,64,000; invest 20% = 1,72,800 → rebate = 3% = 25,920
    const r = calculate(input("2026-27", { actualInvestment: 172800 }));
    expect(r.investmentRebate).toBe(25920);
    expect(r.atMaxRebate).toBe(true);
  });

  it("over-investing does not exceed the 3%-of-taxable cap", () => {
    const r = calculate(input("2026-27", { actualInvestment: 9_999_999 }));
    expect(r.investmentRebate).toBe(25920);
  });
});

// ---------------------------------------------------------------------------
// Investment advisory — must never advise investing for rebate the minimum-tax
// floor claws straight back.
// ---------------------------------------------------------------------------

describe("investment advisory", () => {
  // employment 7,00,000 → taxable 4,66,666.67 → gross tax 9,166.67, floor 5,000.
  // Only 4,166.67 of rebate is useful, so 27,777.78 of investment is enough —
  // advising the statutory max (9,166.67 → 61,111) would lock up 33k for nothing.
  const nearFloor = (over: Partial<CalculatorInput> = {}) =>
    calculate(employmentOnly("2026-27", 700_000, over));

  it("advises only the investment that actually reduces tax", () => {
    const r = nearFloor();
    near(r.maxPossibleRebate, 4166.67);
    near(r.additionalInvestmentNeeded, 27777.78);
    near(r.possibleTaxSavings, 4166.67);
    expect(r.constrainedByMinimumTax).toBe(true);
  });

  it("the advised investment reaches the floor — and no more is needed", () => {
    const advised = nearFloor().additionalInvestmentNeeded;
    const r = nearFloor({ actualInvestment: advised });
    near(r.annualTaxPayable, 5000);
    expect(r.atMaxRebate).toBe(true);
    expect(r.possibleTaxSavings).toBe(0);
    // Investing the old (statutory-max) figure buys exactly nothing more.
    near(nearFloor({ actualInvestment: 61_111 }).annualTaxPayable, 5000);
  });

  it("gross tax below the floor → no useful rebate at all", () => {
    const r = calculate(employmentOnly("2026-27", 600_000)); // gross tax 2,500
    expect(r.maxPossibleRebate).toBe(0);
    expect(r.additionalInvestmentNeeded).toBe(0);
    expect(r.possibleTaxSavings).toBe(0);
    expect(r.constrainedByMinimumTax).toBe(true);
  });

  it("unconstrained income still targets the full statutory rebate", () => {
    const r = calculate(input("2026-27")); // taxable 8,64,000, tax 58,350
    expect(r.maxPossibleRebate).toBe(25920);
    expect(r.additionalInvestmentNeeded).toBe(172800);
    expect(r.constrainedByMinimumTax).toBe(false);
  });

  it("AY 2026-27 surcharge: rebate below the floor still shrinks the surcharge", () => {
    // Minimum tax sits OUTSIDE the surcharge base this year, so every taka of
    // rebate keeps working below the floor — the full statutory max is useful.
    const r = nearFloor({ ownsMultipleCars: true });
    near(r.maxPossibleRebate, 9166.67);
    near(r.additionalInvestmentNeeded, 61111.11);
    expect(r.constrainedByMinimumTax).toBe(false);
    // 4,166.67 off the tax (9,166.67 → the 5,000 floor) + the whole 916.67
    // surcharge, which is levied on tax-after-rebate and so falls to nil.
    near(r.possibleTaxSavings, 5083.33);
  });

  it("AY 2025-26 surcharge: minimum tax is inside the base, so the clamp holds", () => {
    const r = calculate(
      employmentOnly("2025-26", 700_000, { ownsMultipleCars: true })
    );
    expect(r.constrainedByMinimumTax).toBe(true);
    expect(r.maxPossibleRebate).toBeLessThan(r.grossTax);
  });
});

// ---------------------------------------------------------------------------
// Net-wealth surcharge (lower-exclusive / upper-inclusive brackets)
// ---------------------------------------------------------------------------

describe("net-wealth surcharge", () => {
  it.each([
    [40_000_000, 0], // exactly 4 crore → nil
    [40_000_001, 0.1], // just over 4 crore → 10%
    [100_000_000, 0.1], // exactly 10 crore → 10%
    [100_000_001, 0.2],
    [200_000_000, 0.2],
    [500_000_000, 0.3], // exactly 50 crore → 30%
    [500_000_001, 0.35], // over 50 crore → 35%
  ])("net wealth %d → rate %f", (wealth, rate) => {
    expect(calculate(input("2026-27", { netWealth: wealth })).surchargeRate).toBe(rate);
  });

  it("asset trigger is OR: one car alone → 10%", () => {
    expect(calculate(input("2026-27", { ownsMultipleCars: true })).surchargeRate).toBe(0.1);
  });

  it("asset trigger is OR: large property alone → 10%", () => {
    expect(calculate(input("2026-27", { ownsLargeProperty: true })).surchargeRate).toBe(0.1);
  });
});

// ---------------------------------------------------------------------------
// Minimum tax
// ---------------------------------------------------------------------------

describe("minimum tax", () => {
  it("AY 2025-26 is area-based (5,000 / 4,000 / 3,000)", () => {
    const low = { income: { ...EMPTY_INCOME, otherEmploymentIncome: 600000 } };
    expect(calculate(input("2025-26", { minTaxArea: "dhaka_ctg", ...low })).minimumTax).toBe(5000);
    expect(calculate(input("2025-26", { minTaxArea: "other_city", ...low })).minimumTax).toBe(4000);
    expect(calculate(input("2025-26", { minTaxArea: "other", ...low })).minimumTax).toBe(3000);
  });

  it("AY 2026-27 is a flat 5,000 regardless of location", () => {
    const low = { income: { ...EMPTY_INCOME, otherEmploymentIncome: 600000 } };
    expect(calculate(input("2026-27", { minTaxArea: "other", ...low })).minimumTax).toBe(5000);
  });

  it("first-time taxpayer minimum is 1,000 in both years", () => {
    const low = { isNewTaxpayer: true, income: { ...EMPTY_INCOME, otherEmploymentIncome: 600000 } };
    expect(calculate(input("2026-27", low)).minimumTax).toBe(1000);
    expect(calculate(input("2025-26", low)).minimumTax).toBe(1000);
  });

  it("non-resident foreigners get the same area / first-time modifiers", () => {
    const nr = (over: Partial<CalculatorInput>) =>
      calculate(employmentOnly("2025-26", 1_200_000, { category: "non_resident_foreigner", ...over }));
    expect(nr({ minTaxArea: "dhaka_ctg" }).minimumTax).toBe(5000);
    expect(nr({ minTaxArea: "other_city" }).minimumTax).toBe(4000);
    expect(nr({ minTaxArea: "other" }).minimumTax).toBe(3000);
    expect(nr({ isNewTaxpayer: true }).minimumTax).toBe(1000);
  });
});

// ---------------------------------------------------------------------------
// Dividend exemption
// ---------------------------------------------------------------------------

describe("dividend exemption", () => {
  it("first 50,000 of dividend is exempt", () => {
    const r = calculate(input("2026-27", { income: { ...DEFAULT_INPUT.income, dividendIncome: 100000 } }));
    expect(r.dividendExemption).toBe(50000);
    expect(r.taxableDividend).toBe(50000);
  });
});

// ---------------------------------------------------------------------------
// Year-round filing incentive (provisional)
// ---------------------------------------------------------------------------

describe("filing incentive", () => {
  it("Q1 early filing → rebate = min(5% of tax, 25,000)", () => {
    const r = calculate(input("2026-27", { filingQuarter: "q1" }));
    near(r.filingRebate, 2917.5);
    near(r.taxAfterFilingIncentive, 55432.5);
  });

  it("Q3 late filing → surcharge = max(2% of tax, 3,000)", () => {
    expect(calculate(input("2026-27", { filingQuarter: "q3" })).filingSurcharge).toBe(3000);
  });

  it("Q4 late filing → surcharge = max(5% of tax, 5,000)", () => {
    expect(calculate(input("2026-27", { filingQuarter: "q4" })).filingSurcharge).toBe(5000);
  });

  it("rebate is min-tax-safe: reported rebate collapses when the floor claws it back", () => {
    const r = calculate(employmentOnly("2026-27", 600000, { filingQuarter: "q1" }));
    expect(r.annualTaxPayable).toBe(5000);
    expect(r.filingRebate).toBe(0);
    expect(r.taxAfterFilingIncentive).toBe(5000);
  });

  it("AY 2025-26 has no filing incentive", () => {
    const r = calculate(input("2025-26", { filingQuarter: "q1" }));
    expect(r.filingRebate).toBe(0);
    expect(r.filingSurcharge).toBe(0);
  });

  it("the filing incentive never changes monthly TDS", () => {
    const base = calculate(input("2026-27"));
    const q1 = calculate(input("2026-27", { filingQuarter: "q1" }));
    expect(q1.monthlyTDS).toBe(base.monthlyTDS);
  });
});

// ---------------------------------------------------------------------------
// Tax-exempt income (freelance / ITES + remittance)
// ---------------------------------------------------------------------------

describe("tax-exempt income", () => {
  it("is recorded but excluded from every taxable figure", () => {
    const base = calculate(input("2026-27"));
    const withExempt = calculate(
      input("2026-27", {
        income: { ...DEFAULT_INPUT.income, itesIncome: 2_000_000, remittanceIncome: 800_000 },
      })
    );
    expect(withExempt.taxableIncome).toBe(base.taxableIncome);
    expect(withExempt.grossAnnualIncome).toBe(base.grossAnnualIncome);
    expect(withExempt.annualTaxPayable).toBe(base.annualTaxPayable);
    expect(withExempt.monthlyTDS).toBe(base.monthlyTDS);
    expect(withExempt.effectiveTaxRate).toBe(base.effectiveTaxRate);
    expect(withExempt.exemptIncome).toBe(2_800_000);
  });
});

// ---------------------------------------------------------------------------
// Reconciliation invariants (the "line-by-line transparency" promise)
// ---------------------------------------------------------------------------

describe("reconciliation invariants", () => {
  it("gross − dividend exemption − salary exemption = taxable income", () => {
    const r = calculate(input("2026-27", { income: { ...DEFAULT_INPUT.income, dividendIncome: 100000 } }));
    near(r.grossAnnualIncome - r.dividendExemption - r.salaryExemption, r.taxableIncome);
  });

  it("annual tax − applied filing rebate = tax after filing incentive", () => {
    const r = calculate(input("2026-27", { filingQuarter: "q1" }));
    near(r.annualTaxPayable - r.filingRebate, r.taxAfterFilingIncentive);
  });

  it("tax due = tax after filing incentive − tax already deducted", () => {
    const r = calculate(input("2026-27", { filingQuarter: "q1", taxAlreadyDeducted: 50000 }));
    near(r.taxDue, r.taxAfterFilingIncentive - 50000);
  });
});
