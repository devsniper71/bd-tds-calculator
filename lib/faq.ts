/**
 * FAQ content — the single source shared by the visible FAQ section
 * (components render it) and the FAQPage JSON-LD in the layout.
 * Google requires the structured data to match the on-page text, so both
 * read from here. Keep answers accurate and plain-text.
 */

export interface FaqItem {
  q: string;
  a: string;
}

export const FAQ: FaqItem[] = [
  {
    q: "How does the ayakor income tax calculator work?",
    a: "Enter your monthly salary components, annual bonuses, any other income, your eligible investment, and the tax already deducted. ayakor applies the correct tax-free threshold and progressive slabs for the assessment year you select, subtracts the salary exemption and any investment rebate, applies the minimum tax and net-wealth surcharge, and shows the monthly tax (TDS) to deduct along with a line-by-line breakdown. Everything is computed in your browser.",
  },
  {
    q: "What is the tax-free income limit in Bangladesh for AY 2026-27?",
    a: "For Assessment Year 2026-27 (Finance Act 2026) the general tax-free threshold is BDT 400,000. It is BDT 450,000 for women and senior citizens (65+), BDT 525,000 for persons with disability and third-gender taxpayers, and BDT 550,000 for gazetted war-wounded freedom fighters and gazetted July Warriors injured in the 2024 uprising, plus an extra BDT 50,000 per physically-challenged child — though where both parents are taxpayers only one of them may claim that addition. The same thresholds apply for Assessment Year 2027-28.",
  },
  {
    q: "Are house rent, medical, and conveyance allowances tax-free?",
    a: "No. Under the Income Tax Act 2023 the old component-wise exemptions for house rent, medical, and conveyance were abolished. They are replaced by a single employment-income exemption equal to the lower of one-third of total employment income or BDT 500,000 (BDT 450,000 for AY 2025-26).",
  },
  {
    q: "How much should I invest to get the maximum tax rebate?",
    a: "The investment rebate is the lowest of 15% of your eligible investment, 3% of your taxable income, or BDT 10,00,000. Because 15% of investment equals 3% of income at 20% of taxable income, investing about 20% of your taxable income unlocks the full rebate. Eligible investments include DPS, life insurance premiums, Sanchayapatra, provident fund, listed shares and mutual funds, and approved donations.",
  },
  {
    q: "What is the minimum tax?",
    a: "If your income exceeds the tax-free threshold, a minimum tax applies even if your computed tax is lower. For AY 2026-27 it is a flat BDT 5,000 nationwide (BDT 1,000 for first-time taxpayers). For AY 2025-26 it is area-based: BDT 5,000 in Dhaka and Chattogram city corporations, BDT 4,000 in other city corporations, and BDT 3,000 elsewhere.",
  },
  {
    q: "Which assessment years does the calculator support?",
    a: "ayakor supports Assessment Year 2025-26 (Finance Act 2024) and Assessment Year 2026-27 (Finance Act 2026). You can switch between them at the top of the form; the thresholds, slabs, minimum tax, and legal sources all update accordingly.",
  },
  {
    q: "Is freelancing or foreign remittance income taxable?",
    a: "Income from IT/ITES exports and freelancing (software, web/app development, digital services, IT outsourcing, and similar) is income-tax-exempt through 30 June 2027, provided it is received through a banking channel and you file a return (Income Tax Act 2023, Sixth Schedule paragraph 21). Wage-earner remittance sent to Bangladesh from abroad is tax-free for the recipient and earns a 2.5% cash incentive. Foreign income earned while working abroad is exempt if brought in through a banking channel (paragraph 17). Enter these under 'Tax-exempt income' — they are recorded but not added to your taxable income. Income that does not qualify — for example remote work that is not IT/ITES, or income not received through a banking channel — is taxable and belongs under 'Other income'.",
  },
  {
    q: "Is there a rebate for filing my return early?",
    a: "Yes. The Finance Act 2026 enacted a year-round filing system that rewards early filing and penalises late filing. Filing in the first quarter (1 July – 30 September) earns a rebate of 5% of your tax payable, capped at BDT 25,000, and the October–December window is neutral. Filing after that carries additional tax; the calculator applies the higher of 2% or BDT 3,000 for January–March and the higher of 5% or BDT 5,000 for April–June, and flags those late-filing figures as still being verified against the gazette. The adjustment applies to your final tax at filing, not to your monthly TDS.",
  },
  {
    q: "Is my financial data private?",
    a: "Yes. Your salary and tax figures are entered and calculated entirely in your browser and are never sent to any server. The site uses only anonymous usage analytics to count visits and improve the tool — it does not collect or transmit the numbers you enter.",
  },
];
