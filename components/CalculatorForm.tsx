"use client";

import {
  CalculatorInput,
  TaxpayerCategory,
  MinTaxArea,
  FilingQuarter,
  formatBDT,
  formatPercent,
} from "@/lib/tax-calculator";
import {
  getYearConfig,
  ASSESSMENT_YEAR_IDS,
  TAX_YEARS,
} from "@/lib/tax-years";
import { useTranslation } from "@/lib/i18n";
import { Field } from "./ui/Field";
import { MoneyInput } from "./ui/MoneyInput";
import { Section } from "./ui/Section";
import { Toggle } from "./ui/Toggle";

interface Props {
  input: CalculatorInput;
  onChange: (next: CalculatorInput) => void;
}

const ALL_CATEGORIES: TaxpayerCategory[] = [
  "general_male",
  "female_or_senior",
  "disabled_or_third_gender",
  "freedom_fighter",
  "non_resident_foreigner",
];

export function CalculatorForm({ input, onChange }: Props) {
  const { t } = useTranslation();
  const set = (patch: Partial<CalculatorInput>) =>
    onChange({ ...input, ...patch });
  const setIncome = (patch: Partial<CalculatorInput["income"]>) =>
    onChange({ ...input, income: { ...input.income, ...patch } });

  const cfg = getYearConfig(input.assessmentYear);
  const isNRForeigner = input.category === "non_resident_foreigner";

  return (
    <div>
      {/* ────── Section 1: Profile ────── */}
      <Section
        number="①"
        title={t.sections.profile}
        subtitle={t.sections.profileSub}
      >
        <div className="space-y-3">
          {/* Assessment year — drives every rate below */}
          <div>
            <span className="label-eyebrow block mb-2">
              {t.fields.assessmentYear}
            </span>
            <div
              role="group"
              aria-label={t.fields.assessmentYear}
              className="flex flex-wrap gap-2"
            >
              {ASSESSMENT_YEAR_IDS.map((id) => {
                const yc = TAX_YEARS[id];
                const checked = input.assessmentYear === id;
                return (
                  <button
                    type="button"
                    key={id}
                    onClick={() => set({ assessmentYear: id })}
                    aria-pressed={checked}
                    className={`chip-button rounded-full border px-3.5 py-1.5 text-[12.5px] num ${
                      checked
                        ? "border-emerald bg-emerald-deep text-paper"
                        : "border-rule bg-paper/60 text-muted hover:border-emerald/40 hover:text-ink"
                    }`}
                  >
                    {yc.label}
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-muted/90 italic mt-2 leading-relaxed">
              {cfg.statute}
              {" · "}
              {cfg.incomeYear}
            </p>
          </div>

          <div className="rule-h" />

          <div>
            <span className="label-eyebrow block mb-2">
              {t.fields.category}
            </span>
            <div
              role="group"
              aria-label={t.fields.category}
              className="grid grid-cols-1 sm:grid-cols-2 gap-2"
            >
              {ALL_CATEGORIES.map((value) => {
                const checked = input.category === value;
                const threshold = cfg.thresholds[value];
                return (
                  <button
                    type="button"
                    key={value}
                    onClick={() => set({ category: value })}
                    aria-pressed={checked}
                    className={`chip-button text-left rounded-md border px-3 py-2.5 ${
                      checked
                        ? "border-emerald bg-emerald-soft text-emerald-deep shadow-inset"
                        : "border-rule bg-paper hover:border-emerald/40 hover:bg-surface"
                    }`}
                  >
                    <span className="block text-[13.5px] leading-snug">
                      {t.categories[value]}
                    </span>
                    <span className="block text-[11px] text-muted mt-0.5 num">
                      {value === "non_resident_foreigner"
                        ? t.categories.flatRate
                        : `${t.categories.thresholdUpto} ${formatBDT(threshold)}`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {!isNRForeigner && (
            <>
              <div className="rule-h" />

              <Field
                label={t.fields.disabledChildren}
                hint={t.fields.disabledChildrenHint}
                htmlFor="disabled-children"
              >
                <MoneyInput
                  id="disabled-children"
                  value={input.disabledChildren}
                  onChange={(v) =>
                    set({ disabledChildren: Math.min(10, Math.max(0, v)) })
                  }
                  max={10}
                />
              </Field>

              <Field
                label={t.fields.newTaxpayer}
                hint={t.fields.newTaxpayerHint}
              >
                <Toggle
                  checked={!!input.isNewTaxpayer}
                  onChange={(v) => set({ isNewTaxpayer: v })}
                  ariaLabel={t.fields.newTaxpayer}
                />
              </Field>

              {/* Location — only affects the area-based minimum tax (AY ≤ 2025-26) */}
              {cfg.areaBasedMinTax && (
                <div>
                  <span className="label-eyebrow block mb-2">
                    {t.fields.minTaxArea}
                  </span>
                  <div
                    role="group"
                    aria-label={t.fields.minTaxArea}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-2"
                  >
                    {(
                      [
                        "dhaka_ctg",
                        "other_city",
                        "other",
                      ] as MinTaxArea[]
                    ).map((area) => {
                      const checked =
                        (input.minTaxArea ?? "dhaka_ctg") === area;
                      return (
                        <button
                          type="button"
                          key={area}
                          onClick={() => set({ minTaxArea: area })}
                          aria-pressed={checked}
                          className={`chip-button text-left rounded-md border px-3 py-2 ${
                            checked
                              ? "border-emerald bg-emerald-soft text-emerald-deep shadow-inset"
                              : "border-rule bg-paper hover:border-emerald/40 hover:bg-surface"
                          }`}
                        >
                          <span className="block text-[12.5px] leading-snug">
                            {t.minTaxAreas[area]}
                          </span>
                          <span className="block text-[10.5px] text-muted mt-0.5 num">
                            {formatBDT(cfg.minimumTaxByArea[area])}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </Section>

      {/* ────── Section 2: Salary ────── */}
      <Section
        number="②"
        title={t.sections.salary}
        subtitle={t.sections.salarySub}
      >
        <Field
          label={t.fields.basic}
          hint={t.fields.basicHint}
          suffix={t.fields.suffix.perMonth}
        >
          <MoneyInput
            value={input.income.basicMonthly}
            onChange={(v) => setIncome({ basicMonthly: v })}
          />
        </Field>

        <Field
          label={t.fields.houseRent}
          hint={t.fields.houseRentHint}
          suffix={t.fields.suffix.perMonth}
        >
          <MoneyInput
            value={input.income.houseRentMonthly}
            onChange={(v) => setIncome({ houseRentMonthly: v })}
          />
        </Field>

        <Field label={t.fields.medical} suffix={t.fields.suffix.perMonth}>
          <MoneyInput
            value={input.income.medicalMonthly}
            onChange={(v) => setIncome({ medicalMonthly: v })}
          />
        </Field>

        <Field label={t.fields.conveyance} suffix={t.fields.suffix.perMonth}>
          <MoneyInput
            value={input.income.conveyanceMonthly}
            onChange={(v) => setIncome({ conveyanceMonthly: v })}
          />
        </Field>

        <Field
          label={t.fields.otherAllowance}
          hint={t.fields.otherAllowanceHint}
          suffix={t.fields.suffix.perMonth}
        >
          <MoneyInput
            value={input.income.otherAllowanceMonthly}
            onChange={(v) => setIncome({ otherAllowanceMonthly: v })}
          />
        </Field>
      </Section>

      {/* ────── Section 3: Bonuses & one-offs ────── */}
      <Section
        number="③"
        title={t.sections.bonus}
        subtitle={t.sections.bonusSub}
      >
        <Field
          label={t.fields.festival1}
          hint={t.fields.festival1Hint}
          suffix={t.fields.suffix.perYear}
        >
          <MoneyInput
            value={input.income.festivalBonus1}
            onChange={(v) => setIncome({ festivalBonus1: v })}
          />
        </Field>

        <Field
          label={t.fields.festival2}
          hint={t.fields.festival2Hint}
          suffix={t.fields.suffix.perYear}
        >
          <MoneyInput
            value={input.income.festivalBonus2}
            onChange={(v) => setIncome({ festivalBonus2: v })}
          />
        </Field>

        <Field
          label={t.fields.performanceBonus}
          suffix={t.fields.suffix.perYear}
        >
          <MoneyInput
            value={input.income.performanceBonus}
            onChange={(v) => setIncome({ performanceBonus: v })}
          />
        </Field>

        <Field label={t.fields.overtime} suffix={t.fields.suffix.perYear}>
          <MoneyInput
            value={input.income.overtime}
            onChange={(v) => setIncome({ overtime: v })}
          />
        </Field>

        <Field
          label={t.fields.otherEmployment}
          hint={t.fields.otherEmploymentHint}
          suffix={t.fields.suffix.perYear}
        >
          <MoneyInput
            value={input.income.otherEmploymentIncome}
            onChange={(v) => setIncome({ otherEmploymentIncome: v })}
          />
        </Field>

        <div className="rule-h !my-5" />

        <Field
          label={t.fields.otherIncome}
          hint={t.fields.otherIncomeHint}
          suffix={t.fields.suffix.perYear}
        >
          <MoneyInput
            value={input.income.otherIncome}
            onChange={(v) => setIncome({ otherIncome: v })}
          />
        </Field>

        <Field
          label={t.fields.dividend}
          hint={t.fields.dividendHint}
          suffix={t.fields.suffix.perYear}
        >
          <MoneyInput
            value={input.income.dividendIncome}
            onChange={(v) => setIncome({ dividendIncome: v })}
          />
        </Field>

        <div className="rule-h !my-5" />
        <span className="label-eyebrow block">{t.fields.exemptGroup}</span>

        <Field
          label={t.fields.itesIncome}
          hint={t.fields.itesIncomeHint}
          suffix={t.fields.suffix.perYear}
        >
          <MoneyInput
            value={input.income.itesIncome}
            onChange={(v) => setIncome({ itesIncome: v })}
          />
        </Field>

        <Field
          label={t.fields.remittanceIncome}
          hint={t.fields.remittanceIncomeHint}
          suffix={t.fields.suffix.perYear}
        >
          <MoneyInput
            value={input.income.remittanceIncome}
            onChange={(v) => setIncome({ remittanceIncome: v })}
          />
        </Field>

        <p className="text-[11px] text-muted/90 italic leading-relaxed">
          {t.fields.exemptNote}
        </p>
      </Section>

      {/* ────── Section 4: Investment & TDS ────── */}
      <Section number="④" title={t.sections.investment}>
        {!isNRForeigner && (
          <>
            <Field
              label={t.fields.investment}
              hint={t.fields.investmentHint}
              suffix={t.fields.suffix.perYear}
            >
              <MoneyInput
                value={input.actualInvestment}
                onChange={(v) => set({ actualInvestment: v })}
              />
            </Field>

            <details className="group -mt-1 mb-1">
              <summary className="cursor-pointer list-none inline-flex items-center gap-1.5 text-[11.5px] text-emerald hover:text-emerald-deep transition-colors select-none">
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 12 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-transform duration-200 group-open:rotate-90"
                  aria-hidden
                >
                  <polyline points="4,3 8,6 4,9" />
                </svg>
                {t.investmentHelp.title}
              </summary>
              <div className="mt-2.5 pl-1 border-l-2 border-emerald-soft ml-1">
                <p className="text-[11.5px] text-muted leading-relaxed mb-2 pl-3">
                  {t.investmentHelp.intro}
                </p>
                <ul className="space-y-1 pl-3">
                  {t.investmentHelp.items.map((item) => (
                    <li
                      key={item}
                      className="text-[11.5px] text-ink/80 leading-relaxed flex gap-2"
                    >
                      <span className="text-emerald mt-[3px] shrink-0">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-[11px] text-muted italic leading-relaxed mt-2.5 pl-3">
                  {t.investmentHelp.footnote}
                </p>
              </div>
            </details>
          </>
        )}

        <Field
          label={t.fields.tdsAlready}
          hint={t.fields.tdsAlreadyHint}
          suffix={t.fields.suffix.perYear}
        >
          <MoneyInput
            value={input.taxAlreadyDeducted}
            onChange={(v) => set({ taxAlreadyDeducted: v })}
          />
        </Field>

        {/* Year-round filing incentive — provisional, AY 2026-27 only */}
        {!isNRForeigner && cfg.filingIncentive && (
          <div className="pt-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="label-eyebrow">{t.filing.label}</span>
              {cfg.filingIncentive.provisional && (
                <span className="rounded-full border border-ember/40 text-ember bg-ember/10 px-1.5 py-0.5 text-[9px] uppercase tracking-[0.1em] font-semibold">
                  {t.filing.badge}
                </span>
              )}
            </div>
            <p className="text-[11px] text-muted mb-2 leading-relaxed">
              {t.filing.hint}
            </p>
            <div
              role="group"
              aria-label={t.filing.label}
              className="grid grid-cols-2 sm:grid-cols-4 gap-2"
            >
              {(["q1", "q2", "q3", "q4"] as FilingQuarter[]).map((q) => {
                const fi = cfg.filingIncentive!;
                const checked = (input.filingQuarter ?? "q2") === q;
                let note: string;
                if (q === "q1")
                  note = `−${formatPercent(fi.earlyRebateRate, 0)} · ≤ ${formatBDT(fi.earlyRebateCap)}`;
                else if (q === "q3")
                  note = `+${formatPercent(fi.lateQ3Rate, 0)} · ≥ ${formatBDT(fi.lateQ3Floor)}`;
                else if (q === "q4")
                  note = `+${formatPercent(fi.lateQ4Rate, 0)} · ≥ ${formatBDT(fi.lateQ4Floor)}`;
                else note = t.filing.q2Note;
                return (
                  <button
                    type="button"
                    key={q}
                    onClick={() => set({ filingQuarter: q })}
                    aria-pressed={checked}
                    className={`chip-button text-left rounded-md border px-2.5 py-2 ${
                      checked
                        ? "border-emerald bg-emerald-soft text-emerald-deep shadow-inset"
                        : "border-rule bg-paper hover:border-emerald/40 hover:bg-surface"
                    }`}
                  >
                    <span className="block text-[12px] leading-snug">
                      {t.filing.quarters[q]}
                    </span>
                    <span className="block text-[9.5px] text-muted mt-0.5 num">
                      {note}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="text-[10.5px] text-muted/90 italic mt-2 leading-relaxed">
              {t.filing.provisional}
            </p>
          </div>
        )}
      </Section>

      {/* ────── Section 5: Wealth — collapsed by default ────── */}
      {!isNRForeigner && (
        <Section
          number="⑤"
          title={t.sections.wealth}
          subtitle={t.sections.wealthSub}
          defaultCollapsed
        >
          <Field
            label={t.fields.netWealth}
            hint={t.fields.netWealthHint}
            suffix={t.fields.suffix.bdt}
          >
            <MoneyInput
              value={input.netWealth ?? 0}
              onChange={(v) => set({ netWealth: v })}
            />
          </Field>

          <Field
            label={t.fields.multipleCars}
            hint={t.fields.multipleCarsHint}
          >
            <Toggle
              checked={!!input.ownsMultipleCars}
              onChange={(v) => set({ ownsMultipleCars: v })}
              ariaLabel={t.fields.multipleCars}
            />
          </Field>

          <Field
            label={t.fields.largeProperty}
            hint={t.fields.largePropertyHint}
          >
            <Toggle
              checked={!!input.ownsLargeProperty}
              onChange={(v) => set({ ownsLargeProperty: v })}
              ariaLabel={t.fields.largeProperty}
            />
          </Field>
        </Section>
      )}
    </div>
  );
}
