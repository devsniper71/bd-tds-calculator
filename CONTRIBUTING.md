# Contributing to ayakor

Thanks for your interest in improving **ayakor**, a free, open, client-side Bangladesh income-tax calculator. Contributions of every size are welcome — a typo fix, a UI refinement, a verified tax-rate correction, or a whole new assessment year.

Because this is a **tax tool people rely on for real money decisions**, accuracy is the highest priority. The rules below exist to keep every number correct and traceable. Please read the short sections that apply to your change before opening a pull request.

---

## Ground rules

1. **Accuracy over everything.** A wrong number is worse than a missing feature. When in doubt, cite a source or open an issue to discuss first.
2. **Every tax figure must be traceable to an authoritative source.** No exceptions. See [Changing tax data](#changing-tax-data).
3. **Be respectful.** See the [Code of Conduct](CODE_OF_CONDUCT.md).
4. **Keep it client-side.** No data may leave the browser. Do not add analytics, trackers, network calls, or backend dependencies to the calculation path.
5. **English-only UI.** The interface is English. Keep user-facing copy in `lib/i18n/en.ts`, not hard-coded in components.

---

## Project structure

```
lib/tax-years.ts      ← the single source of truth for every rate, threshold,
                        cap, and legal source, keyed by assessment year.
lib/tax-calculator.ts ← the year-agnostic calculation engine. It reads a year's
                        config and computes; it contains NO hard-coded rates.
lib/i18n/en.ts        ← all user-facing copy.
components/           ← presentational React components (no tax logic).
app/                  ← Next.js app-router pages, metadata, SEO.
```

**The most important architectural rule:** tax rates live in `lib/tax-years.ts` and nowhere else. Components and the engine must never hard-code a threshold, slab, or cap. If you find yourself typing a taka figure into a component, stop — it belongs in the year config.

---

## Development setup

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # must pass with zero type errors before you open a PR
```

Node 18+ recommended. There is no backend and no environment variables.

---

## Changing tax data

This is the one workflow with hard requirements. **Any pull request that adds, removes, or edits a numeric tax value must:**

1. **Change it only in `lib/tax-years.ts`** (or its shared constants).
2. **Cite an authoritative source in the PR description**, ideally with a direct URL and the exact clause/section/page. Acceptable authority, in order of preference:
   - **Primary law** — the Income Tax Act 2023 and the year's Finance Act / Ordinance on [bdlaws.minlaw.gov.bd](https://bdlaws.minlaw.gov.bd/) or [nbr.gov.bd](https://nbr.gov.bd/).
   - **Official NBR** — paripatra (circulars), SROs, or the official return form.
   - **Reputable professional summaries** — PwC Worldwide Tax Summaries, KPMG / Rahman Rahman Huq, Deloitte, ICAB. Cite these **in the pull request** to corroborate a figure. They must never be the sole basis for a statutory number, and they are **not** added to the app's `sources` array — see below.
   - Blogs and news articles may support a change but must not be the *only* source for a statutory number.
3. **Add the source** to that year's `sources` array so it surfaces in the app's *Legal sources* section — **government sources only**. `LawSource["kind"]` accepts `primary` (the statute) and `official` (NBR, Ministry of Law) and nothing else, so the compiler rejects a firm summary or news article here. A taxpayer following a citation should land on the law or on the authority that administers it, never on someone's reading of it. Corroborating links belong in the PR description.

   Check the URL resolves before adding it. Note that `bdlaws.minlaw.gov.bd` refuses TLS and serves plain **http://** only — an `https://` link to it is dead.
4. **State which assessment year** the change applies to. Remember: Bangladesh law is written per *income year* but charged the following *assessment year* — quoting the income year as the assessment year is the single most common error. Every figure in this project is keyed to the **assessment year**.

PRs that change a number without a citation will be asked for one before review.

### Adding a new assessment year

1. Append a new `TaxYearConfig` object in `lib/tax-years.ts` (copy the newest year as a template).
2. Fill every field from cited sources; attach that year's `sources`.
3. Add its id to `ASSESSMENT_YEAR_IDS` (newest first) and, if it should be the default, set `isDefault` and update `DEFAULT_YEAR_ID`.
4. No engine or component change should be necessary — if it is, the engine is missing a config field; add the field rather than hard-coding.

### Correcting an existing figure

Open an issue using the **Tax data correction** template (or describe: the year, the field, the current value, the correct value, and the source). A correction with a primary-law citation is the fastest kind of PR to merge.

---

## Verifying your change

- `npm test` (Vitest) and `npm run build` must both pass. `npm run lint` should be clean.
- If you touched `lib/tax-calculator.ts` or `lib/tax-years.ts`, **verify the numbers and add a test**. The engine has a committed suite in `lib/tax-calculator.test.ts` — add or update a case (with the source's own worked example where possible) so the new behaviour is locked in. Compute at least one example by hand and reference it in your PR.
- If you touched the UI, confirm it renders correctly in **both light and dark themes** and on a narrow (mobile) viewport.

---

## Code style

- **TypeScript**, strict. No `any` unless genuinely unavoidable.
- Match the surrounding code — naming, spacing, and comment density. The engine is heavily commented on purpose; keep it that way.
- Prefer pure functions in `lib/`. Components stay presentational.
- No new runtime dependencies for the calculation path. UI dependencies need a good reason.
- Keep comments about *why*, not *what*.

---

## Commits and pull requests

- Write clear commit messages. A [Conventional Commits](https://www.conventionalcommits.org/) prefix (`feat:`, `fix:`, `docs:`, `refactor:`) is appreciated.
- Keep PRs focused — one logical change per PR. A tax-data fix and a UI refactor should be two PRs.
- In the PR description, explain **what** changed, **why**, and — for any tax number — **the source**.
- Link the issue it resolves, if any.

---

## Reporting issues

- **Found a wrong number?** Use the *Tax data correction* issue template and include a source. This is the most valuable kind of report.
- **Found a bug?** Include the assessment year, the exact inputs, what you expected, and what you got.
- **Have a feature idea?** Open an issue to discuss before building something large.

---

## Disclaimer

ayakor is an unofficial tool, not affiliated with the NBR or the Government of Bangladesh, and is provided for guidance only. Contributions do not constitute professional tax advice. By contributing you agree your work is licensed under the project's [MIT License](LICENSE).
