# ayakor · Bangladesh Income Tax Calculator

[![CI](https://github.com/meetRaselAhmed/ayakor/actions/workflows/ci.yml/badge.svg)](https://github.com/meetRaselAhmed/ayakor/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-0a5d44.svg)](LICENSE)

A precise, modern income-tax calculator for Bangladesh, built on the **Income Tax Act 2023** and its yearly Finance Acts / Ordinances. Covers **two assessment years** — AY 2025–26 and 2026–27 — each with its own fully-sourced rate card.

Live at **[ayakor.com](https://ayakor.com)**.

## Features

- **Multi-year rate engine** — pick the assessment year; thresholds, slabs, salary-exemption cap, minimum tax and legal sources all switch. Adding a future year is a data-only change in `lib/tax-years.ts`.
- **Two verified rate cards** — AY 2025–26 (Finance Act 2024: 5% entry slab, 30% top, area-based minimum tax) and AY 2026–27 (Finance Act 2026: no 5% slab, 4-lakh general threshold, flat minimum tax, 5-lakh salary cap). Every figure carries its own citations.
- **Correct ITA 2023 methodology** — the consolidated employment-income exemption (lower of ⅓ of employment income or the yearly cap; no separate HRA/medical/conveyance exemption), the §78 investment rebate (lowest of 3% of taxable income, 15% of eligible investment, or Tk 10 lakh), and the statutory order *tax − rebate → floor at minimum tax → add surcharge*.
- **Area-based minimum tax** — Tk 5,000 / 4,000 / 3,000 by location for AY 2025–26, flat Tk 5,000 from AY 2026–27; the location selector appears only when it applies.
- **Light + dark theme** — frosted-glass surfaces, warm editorial palette in both, no-flash theme init, preference saved locally.
- **Every taxpayer category** — general male, female / senior 65+, person with disability, third-gender, war-wounded freedom fighter / July Warrior 2024, non-resident foreigner (flat 30%), plus +BDT 50,000 per physically challenged child.
- **Full salary components** — Basic, House Rent, Medical, Conveyance, Other allowances, two Festival Bonuses, Performance Bonus, Overtime, plus non-employment and dividend income (first Tk 50,000 of listed-company dividend exempt).
- **Investment advisory card** — tells you exactly how much to invest for the maximum rebate and shows the savings.
- **Net-wealth surcharge** — 10–35% for wealth above BDT 4 crore, plus the multi-car / large-property asset trigger.
- **Per-year legal sources** — a dedicated section links the primary statute and the official NBR resources for the selected year. Government sources only; every link is checked to resolve.
- **Mobile sticky summary bar** — monthly TDS always visible while filling the form.
- **Client-side calculation** — the salary and tax figures you enter are computed entirely in your browser and never sent anywhere. Optional anonymous visit analytics (Google Analytics 4, off by default) can be enabled by the operator.

## Typography

A professional, editorial type system:

- **Newsreader** — display serif (optical sizing + italic) for headings and hero figures; the trusted-publication, lawyer-credible voice.
- **Inter** — UI and body, with tabular lining numerals for clean financial columns.

## SEO

- Comprehensive metadata — title template, keyword set, author, category, canonical URL
- **JSON-LD structured data** — `WebApplication` / `FinanceApplication` **and `FAQPage`** (the FAQ section renders the same content, so it's eligible for FAQ rich results)
- **On-page FAQ** section answering common Bangladesh income-tax questions (real content = better ranking)
- **OpenGraph** + **Twitter Card** with a dynamically generated OG image (1200×630 PNG via Next.js `ImageResponse`)
- **Web app manifest** (`app/manifest.ts`) for installable/mobile presentation
- `robots.txt` and `sitemap.xml` auto-generated via Next.js metadata files
- Semantic HTML with a single `<h1>` and descriptive `<h2>`s throughout

## Analytics

Google Analytics 4 is wired up but **disabled unless you provide a Measurement ID**. To enable it, set `NEXT_PUBLIC_GA_ID` (see [`.env.example`](.env.example)):

```bash
# .env.local  (git-ignored) — or set it in your host's env vars
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

Get the ID from GA4: **Admin → Data streams → your web stream → Measurement ID**. With no ID set, no analytics script loads at all (local dev and forks stay tracking-free). Only anonymous page-view/usage events are sent — the tax figures you enter never leave the browser. `anonymize_ip` is enabled.

## Quick start

```bash
npm install
npm run dev     # → http://localhost:3000
npm test        # run the calculation-engine test suite (Vitest)
```

## Deploy to Vercel

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin git@github.com:meetRaselAhmed/ayakor.git
git push -u origin main
```

Then visit <https://vercel.com/new>, import the repo, click **Deploy**. Optionally add the `NEXT_PUBLIC_GA_ID` environment variable in the Vercel project settings to turn on analytics.

Point `ayakor.com` at Vercel (add A/AAAA or CNAME records as Vercel's dashboard instructs).

## Project layout

```
.
├── app/
│   ├── globals.css            Theme tokens (light/dark), glass utilities, animations
│   ├── layout.tsx             Fonts (Newsreader/Inter), metadata, JSON-LD, FAQ schema, analytics
│   ├── page.tsx               Header, hero, calculator, slab reference, sources, FAQ, footer
│   ├── robots.ts              robots.txt
│   ├── sitemap.ts             sitemap.xml
│   ├── manifest.ts            Web app manifest (PWA/mobile)
│   ├── opengraph-image.tsx    Dynamic 1200×630 OG image
│   └── icon.svg               Favicon
├── components/
│   ├── CalculatorForm.tsx     Year picker, profile, salary, bonuses, investment, wealth
│   ├── ResultsPanel.tsx       Hero TDS card, settlement, investment advisory, income summary, slab breakdown
│   ├── ThemeToggle.tsx        Light / dark switch (no-flash, persisted)
│   ├── Analytics.tsx          GA4 loader (only when NEXT_PUBLIC_GA_ID is set)
│   └── ui/
│       ├── Field.tsx
│       ├── MoneyInput.tsx     Grouped (lakh/crore) money input
│       ├── Section.tsx        Collapsible numbered sections
│       └── Toggle.tsx
├── lib/
│   ├── tax-years.ts           Per-assessment-year rate cards + legal sources
│   ├── tax-calculator.ts      Year-agnostic calculation engine + formatters
│   ├── tax-calculator.test.ts Vitest suite for the engine (npm test)
│   ├── faq.ts                 FAQ content (shared by the section + FAQPage JSON-LD)
│   └── i18n/
│       ├── index.tsx          useTranslation hook (English, provider-less)
│       └── en.ts              UI copy dictionary
└── …config files
```

## Statutory sources

Each assessment year carries its own citation list in the app (see the *Legal sources* section). Primary references:

- **Income Tax Act 2023** — bdlaws.minlaw.gov.bd (Act 1429) / NBR consolidated PDF
- **Finance Act 2024** (AY 2025–26) and **Finance Act 2026** (AY 2026–27, gazetted 30 June 2026)
- **National Board of Revenue** — nbr.gov.bd (forms, circulars, e-Return)
- Citations shown in the app are **government sources only** — the statute and the NBR. Professional summaries are used to corroborate a change in review, not shown to the reader.

## Contributing

Contributions are welcome — see **[CONTRIBUTING.md](CONTRIBUTING.md)**. Because this is a tax tool, there is one firm rule: **any change to a tax figure must live in `lib/tax-years.ts` and cite an official source** (Income Tax Act 2023 / the year's Finance Act / an NBR paripatra). Firm summaries may corroborate it in the pull request, but only government sources are cited in the app. Issue and pull-request templates in `.github/` walk you through it. Please also read the [Code of Conduct](CODE_OF_CONDUCT.md).

## Disclaimer

ayakor is an **unofficial** tool, not affiliated with or endorsed by the NBR or the Government of Bangladesh. It is for guidance only; not professional tax advice. Complex situations (recognised provident fund, multiple-employer income, foreign income relief, perquisite valuation for free transport / accommodation, etc.) may need specialist review. For binding determinations consult a Bangladesh-licensed income tax practitioner or the **National Board of Revenue**.

## Author

**Md Rasel Ahmed**

- Email: <meetRaselAhmed@gmail.com>
- WhatsApp: +8801782449977
- GitHub: <https://github.com/meetRaselAhmed>

## License

[MIT](LICENSE) © 2025 Md Rasel Ahmed. Attribution appreciated.
