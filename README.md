# ayakor · Bangladesh Income Tax Calculator

Bilingual (বাংলা / English) income tax calculator for Bangladesh, built on the **Income Tax Act 2023** as amended by the **Finance Ordinance 2025**. Covers Assessment Year 2026–27 and 2027–28.

Live at **[ayakor.com](https://ayakor.com)**.

## Features

- **বাংলা + English** — default Bangla, one-click toggle, preference saved locally
- **All six tax slabs** including the 30% top bracket
- **Every taxpayer category** — general male, female / senior 65+, person with disability, third-gender, war-wounded freedom fighter / July Warrior 2024, non-resident foreigner (flat 30%), plus +BDT 50,000 per physically challenged child
- **Full salary components** — Basic, House Rent, Medical, Conveyance, Other allowances, two Festival Bonuses, Performance Bonus, Overtime, plus non-employment and dividend income
- **Salary exemption** — lower of 1/3 of employment income or BDT 5 lakh
- **Investment advisory card** — tells you exactly how much to invest for maximum rebate and shows the savings
- **Net-wealth surcharge** — 10–35% for wealth above BDT 4 crore
- **Minimum tax floor** — BDT 5,000 (BDT 1,000 for new taxpayers)
- **Dynamic slab reference table** — reflects the currently selected taxpayer category
- **Mobile sticky summary bar** — monthly TDS always visible while filling the form
- **Fully client-side** — zero data ever leaves the browser, no tracking

## Typography

Professional type system for a finance product:

- **Noto Sans Bengali** — body text and Bengali numerals (Google-engineered, unambiguous digits)
- **Noto Serif Bengali** — Bangla display / hero numbers
- **Fraunces** — Latin display serif (variable font with opsz + SOFT axes)
- **Geist Sans** — Latin body
- **Geist Mono** — tabular numerals

Locale-aware CSS swaps font stacks based on `html[lang]`.

## SEO

- Comprehensive metadata — title template, keyword set, author, category
- **JSON-LD structured data** — WebApplication / FinanceApplication schema
- **OpenGraph** + **Twitter Card** with dynamically generated OG image (1200×630 PNG via Next.js `ImageResponse`)
- **Hreflang** alternates (bn-BD / en-US / x-default)
- `robots.txt` and `sitemap.xml` auto-generated via Next.js metadata files
- Semantic HTML throughout
- Canonical URL set

## Quick start

```bash
npm install
npm run dev     # → http://localhost:3000
```

## Deploy to Vercel

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin git@github.com:devsniper71/ayakor.git
git push -u origin main
```

Then visit <https://vercel.com/new>, import the repo, click **Deploy**. No environment variables needed.

Point `ayakor.com` at Vercel (add A/AAAA or CNAME records as Vercel's dashboard instructs).

## Project layout

```
.
├── app/
│   ├── globals.css            Design tokens, locale-aware typography, animations
│   ├── layout.tsx             Fonts, metadata, JSON-LD, root HTML
│   ├── page.tsx               Header, hero, two-column calculator, slab reference, footer
│   ├── robots.ts              robots.txt
│   ├── sitemap.ts             sitemap.xml with hreflang
│   ├── opengraph-image.tsx    Dynamic 1200×630 OG image
│   └── icon.svg               Favicon
├── components/
│   ├── CalculatorForm.tsx     Profile, salary, bonuses, investment, wealth sections
│   ├── ResultsPanel.tsx       Hero TDS card, settlement, investment advisory, income summary, slab breakdown
│   ├── LanguageToggle.tsx     Sliding-pill language switch
│   └── ui/
│       ├── Field.tsx
│       ├── MoneyInput.tsx     Locale-aware display (Bengali digits in BN mode)
│       ├── Section.tsx        Collapsible numbered sections
│       └── Toggle.tsx
├── lib/
│   ├── tax-calculator.ts      Pure calculation engine + formatters
│   └── i18n/
│       ├── index.tsx          React context + useTranslation hook
│       ├── en.ts              English source dictionary
│       └── bn.ts              Bangla dictionary (NBR terminology)
└── …config files
```

## Statutory sources

- **Finance Ordinance 2025** (gazetted 22 June 2025)
- **Income Tax Act 2023** as amended
- **PwC Worldwide Tax Summaries — Bangladesh** (Dec 2025)
- **KPMG / Rahman Rahman Huq Salient Features** bulletin (June 2025)

## Disclaimer

For guidance only; not professional tax advice. Complex situations (recognised provident fund, multiple-employer income, foreign income relief, perquisite valuation for free transport / accommodation, etc.) may need specialist review. For binding determinations consult a Bangladesh-licensed income tax practitioner or the **National Board of Revenue**.

## Author

**Md Rasel Ahmed**

- Email: <devsniper71@gmail.com>
- WhatsApp: +8801782449977
- GitHub: <https://github.com/devsniper71>

## License

MIT — do whatever you want with it. Attribution appreciated.
