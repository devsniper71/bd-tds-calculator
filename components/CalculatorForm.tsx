"use client";

import {
  CalculatorInput,
  CATEGORY_THRESHOLDS,
  TaxpayerCategory,
  formatBDT,
} from "@/lib/tax-calculator";
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
  const { t, locale } = useTranslation();
  const set = (patch: Partial<CalculatorInput>) =>
    onChange({ ...input, ...patch });
  const setIncome = (patch: Partial<CalculatorInput["income"]>) =>
    onChange({ ...input, income: { ...input.income, ...patch } });

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
          <div>
            <span className="label-eyebrow block mb-2">
              {t.fields.category}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {ALL_CATEGORIES.map((value) => {
                const checked = input.category === value;
                const threshold = CATEGORY_THRESHOLDS[value];
                return (
                  <button
                    type="button"
                    key={value}
                    onClick={() => set({ category: value })}
                    className={`chip-button text-left rounded-md border px-3 py-2.5 ${
                      checked
                        ? "border-emerald bg-emerald-soft text-emerald-deep shadow-inset"
                        : "border-rule bg-paper hover:border-emerald/40 hover:bg-white"
                    }`}
                  >
                    <span className="block text-[13.5px] leading-snug">
                      {t.categories[value]}
                    </span>
                    <span className="block text-[11px] text-muted mt-0.5 num">
                      {value === "non_resident_foreigner"
                        ? t.categories.flatRate
                        : `${t.categories.thresholdUpto} ${formatBDT(threshold, locale)}`}
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
      </Section>

      {/* ────── Section 4: Investment & TDS ────── */}
      <Section number="④" title={t.sections.investment}>
        {!isNRForeigner && (
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

          <Field label={t.fields.largeProperty}>
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
