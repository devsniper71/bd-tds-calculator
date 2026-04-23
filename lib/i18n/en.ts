export const en = {
  brand: "ayakor",
  brandAccent: "আয়কর",
  tagline: "Bangladesh Income Tax Calculator · AY 2026–27",
  nav: {
    nbr: "NBR",
    language: "বাংলা",
  },

  hero: {
    eyebrow: "Bangladesh — Assessment Year 2026 / 2027",
    title: {
      pre: "Calculate your monthly",
      accent: "tax-deducted-at-source",
      post: "with line-by-line transparency.",
    },
    subtitle:
      "Built on the Income Tax Act 2023 as amended by the Finance Ordinance 2025. All six slabs, every taxpayer category, investment rebate, minimum tax floor, and net-wealth surcharge.",
  },

  sections: {
    profile: "Taxpayer profile",
    profileSub: "Determines threshold & rate table",
    salary: "Monthly salary components",
    salarySub: "Enter monthly amounts in BDT",
    bonus: "Annual bonuses & one-off pay",
    bonusSub: "Enter annual totals in BDT",
    investment: "Investments & tax already paid",
    wealth: "Net wealth surcharge",
    wealthSub: "Only applies above BDT 4 crore",
  },

  fields: {
    category: "Category",
    disabledChildren: "Physically challenged children",
    disabledChildrenHint: "+BDT 50,000 added to threshold per child",
    newTaxpayer: "First-time taxpayer (new TIN)",
    newTaxpayerHint: "Minimum tax becomes BDT 1,000 instead of 5,000",

    basic: "Basic salary",
    basicHint: "The core taxable component of your CTC",
    houseRent: "House rent allowance",
    houseRentHint: "Fully taxable under ITA 2023 (no separate exemption)",
    medical: "Medical allowance",
    conveyance: "Conveyance allowance",
    otherAllowance: "Other monthly allowances",
    otherAllowanceHint: "Special, washing, food, mobile, etc.",

    festival1: "Festival bonus 1",
    festival1Hint: "Usually equal to one month's basic",
    festival2: "Festival bonus 2",
    festival2Hint: "Second Eid / Pohela Boishakh / etc.",
    performanceBonus: "Performance / incentive bonus",
    overtime: "Overtime payments",
    otherEmployment: "Other employment income",
    otherEmploymentHint: "Leave encashment, gratuity (non-recognised), etc.",

    otherIncome: "Other income (non-employment)",
    otherIncomeHint:
      "Interest, rental, business income. Not eligible for the salary exemption.",
    dividend: "Dividend income",
    dividendHint: "First BDT 25,000 of dividend income is tax-free",

    investment: "Eligible investment for the year",
    investmentHint:
      "DPS, life insurance premium, savings certificates (BSP), provident fund, etc.",
    tdsAlready: "Tax already deducted at source",
    tdsAlreadyHint: "From your salary, bank interest, etc. so far this year",

    netWealth: "Total net wealth",
    netWealthHint:
      "If above BDT 4 crore, an additional 10–35% surcharge applies on tax payable",
    multipleCars: "Owns more than one motor car",
    multipleCarsHint:
      "Combined with large property, may trigger surcharge even below 4 crore",
    largeProperty: "Owns property aggregating > 8,000 sq ft",

    suffix: {
      perMonth: "/month",
      perYear: "/year",
      bdt: "BDT",
    },
  },

  categories: {
    general_male: "General taxpayer (male)",
    female_or_senior: "Female / Senior citizen (65+)",
    disabled_or_third_gender: "Person with disability / Third-gender",
    freedom_fighter: "War-wounded freedom fighter / July Warrior 2024",
    non_resident_foreigner: "Non-resident foreigner",
    thresholdUpto: "Tax-free up to",
    flatRate: "Flat 30% — no threshold",
  },

  results: {
    monthlyTDS: "Monthly TDS to deduct",
    annualSummary: "for the year · effective rate",
    balanceDue: "Balance to pay",
    refundable: "Likely refundable",
    settlementExplain:
      "Annual liability {annual} − already deducted {deducted}",

    incomeSummary: "Income summary",
    totalEmployment: "Total employment income",
    otherIncome: "Other income",
    dividendGross: "Dividend (gross)",
    dividendExempt: "Less: dividend exemption",
    grossAnnual: "Gross annual income",
    salaryExemptionFull: "Less: salary exemption",
    exemptionCapped: "Capped at BDT 5,00,000 (§21 ITA 2023 max)",
    exemptionNotCapped: "1/3 of employment income (cap not reached)",
    taxableIncome: "Taxable income",

    slabTitle: "Slab-wise tax computation",
    rate: "Rate",
    range: "Range / amount in slab",
    tax: "Tax",
    grossTax: "Gross tax",
    investmentRebate: "Less: investment rebate",
    rebateHint: "Lower of (3% of taxable, 15% of investment, BDT 10 lakh)",
    surcharge: "Plus: surcharge ({rate})",
    surchargeHint: "On net tax, due to high net wealth",
    minimumTax: "Minimum tax floor",
    minimumTaxHint:
      "Statutory minimum applies as it exceeds your computed tax",
    annualTax: "Annual tax payable",

    statutoryBasis: "Statutory basis",
    statutoryText:
      "Income Tax Act 2023 (as amended by the Finance Ordinance 2025, gazetted 22 June 2025). Slab structure and rebate rules apply to Assessment Year 2026–27 and 2027–28.",
  },

  advisory: {
    opportunityEyebrow: "Tax-saving opportunity",
    maxedEyebrow: "Maximum rebate achieved",
    minTaxEyebrow: "Minimum tax floor reached",

    investMore: "Invest {amount} more",
    saveTax: "to save {amount} in tax",

    currentRebateLabel: "Current rebate",
    maxRebateLabel: "Maximum possible rebate",
    ruleHint:
      "Rebate is 15% of eligible investment, capped at 3% of taxable income. Investing 20% of your taxable income unlocks the full rebate.",

    maxedHeadline: "You're already claiming the maximum rebate of {amount}",
    maxedSub:
      "You've invested enough (≥ 20% of taxable income) to claim the full 3% rebate under ITA 2023 §78.",

    minTaxHeadline: "Your tax is already at the {amount} statutory minimum",
    minTaxSub:
      "Additional investment won't reduce your tax liability further — the minimum tax floor applies once the computed tax falls below this amount.",
  },

  slabLabels: {
    "slab.threshold": "Tax-free threshold",
    "slab.s1": "First slab",
    "slab.s2": "Second slab",
    "slab.s3": "Third slab",
    "slab.s4": "Fourth slab",
    "slab.s5": "Fifth slab — balance",
    "slab.flat30": "Non-resident flat rate",
  },

  reference: {
    eyebrow: "Reference",
    title: {
      pre: "Slabs & rates,",
      accent: "in plain sight",
      post: ".",
    },
    body: "The progressive structure introduced in the Finance Ordinance 2025 raised the tax-free threshold by BDT 25,000 and merged the bottom 5% slab into the 10% bracket. The top marginal rate of 30% applies above roughly BDT 35.75 lakh of taxable income for general taxpayers.",
    thRange: "Range (BDT)",
    thRate: "Rate",
    thNote: "Slab",
    thresholdNote: "Tax-free threshold",
    balanceNote: "Balance — top marginal",
    nextLakhNote: "Next {n} lakh",
    nextCroreNote: "Next {n} crore",
    nilRate: "Nil",
    rangeAbove: "above",
    showsFor: "Showing for:",
  },

  footer: {
    tagline:
      "Open source, no tracking, no data leaves your browser. Computed entirely client-side.",
    disclaimerTitle: "Disclaimer",
    disclaimer:
      "This calculator is provided for guidance only. Complex situations (recognised provident fund, multiple-employer income, foreign income relief, perquisite valuation, etc.) may need specialist review. For binding determinations consult a Bangladesh-licensed income tax practitioner or the National Board of Revenue.",
    dueDateNote:
      "Return filing due date: 30 November (for individuals). Up to 90 days extension available in unavoidable circumstances.",
    lastUpdated: "Last updated for Finance Ordinance 2025",
    credits: "Built by",
  },
};

export type Dictionary = typeof en;
