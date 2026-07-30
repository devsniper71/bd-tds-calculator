export const en = {
  brand: "ayakor",
  tagline: "Bangladesh Income Tax Calculator",

  hero: {
    title: {
      pre: "Calculate your monthly",
      accent: "tax-deducted-at-source",
      post: "with line-by-line transparency.",
    },
    subtitle:
      "Built on the Income Tax Act 2023 as amended by the Finance Act 2026. All six slabs, every taxpayer category, investment rebate, minimum tax floor, and net-wealth surcharge.",
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
    assessmentYear: "Assessment year",
    minTaxArea: "Location (for minimum tax)",
    category: "Category",
    disabledChildren: "Physically challenged children",
    disabledChildrenHint:
      "+BDT 50,000 to the threshold per child. If both parents are taxpayers, only one may claim it — enter it on one return only.",
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
    dividendHint:
      "First BDT 50,000 of listed-company dividend is tax-free (BDT 25,000 for mutual funds)",

    exemptGroup: "Tax-exempt income",
    itesIncome: "Freelance / IT-export (ITES) income",
    itesIncomeHint:
      "Exempt to 30 Jun 2027 if received via banking channel and you file a return (ITA 2023 Sixth Sch. ¶21).",
    remittanceIncome: "Wage-earner remittance / foreign income",
    remittanceIncomeHint:
      "Remittance from abroad is tax-free; foreign income earned abroad is exempt if brought in via banking channel (¶17).",
    exemptNote:
      "Recorded but not taxed when the conditions are met. Income that does not qualify — not IT/ITES, or not received via a banking channel — belongs under Other income above, so it is taxed.",

    investment: "Eligible investment for the year",
    investmentHint:
      "Your total for the year across all rebate-eligible schemes (see the list below).",
    tdsAlready: "Tax already deducted at source",
    tdsAlreadyHint: "From your salary, bank interest, etc. so far this year",

    netWealth: "Total net wealth",
    netWealthHint:
      "If above BDT 4 crore, an additional 10–35% surcharge applies on tax payable",
    multipleCars: "Owns more than one motor car",
    multipleCarsHint:
      "Triggers a minimum 10% surcharge on its own, even below BDT 4 crore",
    largeProperty: "Owns house property aggregating > 8,000 sq ft",
    largePropertyHint:
      "Also triggers the minimum 10% surcharge on its own",

    suffix: {
      perMonth: "/month",
      perYear: "/year",
      bdt: "BDT",
    },
  },

  investmentHelp: {
    title: "What counts as eligible investment?",
    intro:
      "Enter your total for the year. Each scheme carries its own cap under the ITA 2023 Sixth Schedule:",
    items: [
      "Life insurance premium — up to 10% of the sum assured",
      "Deposit Pension Scheme (DPS) — up to BDT 120,000 / year",
      "Sanchayapatra & government securities — up to BDT 5,00,000",
      "Listed shares, mutual funds & units, sukuk (BSEC) — funds up to BDT 5,00,000",
      "Recognised / general provident fund — own + employer contribution",
      "Universal (Sarbojanin) Pension Scheme",
      "Approved superannuation & benevolent fund",
      "Zakat fund & approved donations / CSR",
    ],
    footnote:
      "Rebate = the lowest of 15% of eligible investment, 3% of taxable income, or BDT 10,00,000.",
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

  minTaxAreas: {
    dhaka_ctg: "Dhaka / Chattogram city corp.",
    other_city: "Other city corporation",
    other: "Outside city corporation",
  },

  filing: {
    label: "Return filing time",
    hint: "Under the new year-round filing system, when you file adjusts your final tax.",
    provisional:
      "Enacted by the Finance Act 2026. The early-filing rebate is confirmed; the late-filing rates shown here are still being verified against the gazette.",
    quarters: {
      q1: "Jul – Sep",
      q2: "Oct – Dec",
      q3: "Jan – Mar",
      q4: "Apr – Jun",
    },
    q2Note: "no change",
  },

  results: {
    printButton: "Print / Save PDF",
    monthlyTDS: "Monthly TDS to deduct",
    annualSummary: "for the year · effective rate",
    balanceDue: "Balance to pay",
    refundable: "Likely refundable",
    settlementExplain:
      "Annual liability {annual} − already deducted {deducted}",
    earlyFilingRebate: "Early-filing rebate",
    lateFilingSurcharge: "Late-filing surcharge",
    taxAfterFiling: "Tax after filing incentive",
    filingProvisionalNote:
      "Provisional — based on the announced year-round filing system; verify against the gazetted Finance Act 2026.",

    incomeSummary: "Income summary",
    totalEmployment: "Total employment income",
    otherIncome: "Other income",
    dividendGross: "Dividend (gross)",
    dividendExempt: "Less: dividend exemption",
    grossAnnual: "Gross annual income",
    exemptIncomeLine: "Exempt income (recorded, not taxed)",
    exemptIncomeHint:
      "IT/ITES export & remittance — reported on the return but excluded from taxable income.",
    salaryExemptionFull: "Less: salary exemption",
    exemptionCapped: "Capped at {cap} (§21 ITA 2023 max)",
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
    statutoryTextTmpl:
      "Income Tax Act 2023, as amended by the {statute}. Slab structure, rebate and minimum-tax rules apply to {year} ({incomeYear}).",
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

  reference: {
    eyebrow: "Reference",
    title: {
      pre: "Slabs & rates,",
      accent: "in plain sight",
      post: ".",
    },
    body: "The Finance Act 2026 set the general tax-free threshold at BDT 4,00,000 and kept the bottom 5% slab abolished, so the first taxable taka is charged at 10%. The top marginal rate of 30% applies above BDT 36 lakh of taxable income for general taxpayers. Thresholds are fixed at this level for AY 2026–27 and 2027–28.",
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

  sources: {
    eyebrow: "Legal sources",
    title: {
      pre: "Every number,",
      accent: "traceable",
      post: ".",
    },
    body: "Bangladesh tax law changes each fiscal year. These are the authoritative references behind the rates used for the year you selected — primary statute, official NBR resources, and reputable professional summaries.",
    forYear: "References for:",
    kinds: {
      primary: "Primary law",
      official: "Official",
      secondary: "Firm summary",
    },
  },

  faq: {
    eyebrow: "FAQ",
    title: {
      pre: "Questions,",
      accent: "answered",
      post: ".",
    },
  },

  footer: {
    tagline:
      "Open source and free. Your salary and tax figures are computed entirely in your browser and never sent anywhere. Anonymous visit analytics help improve the tool.",
    disclaimerTitle: "Disclaimer",
    disclaimer:
      "This calculator is provided for guidance only. Complex situations (recognised provident fund, multiple-employer income, foreign income relief, perquisite valuation, etc.) may need specialist review. For binding determinations consult a Bangladesh-licensed income tax practitioner or the National Board of Revenue.",
    dueDateNote:
      "Return filing due date: 30 November (for individuals). Up to 90 days extension available in unavoidable circumstances.",
    lastUpdated: "Last updated for Finance Act 2026",
    credits: "Built by",
  },
};

export type Dictionary = typeof en;
