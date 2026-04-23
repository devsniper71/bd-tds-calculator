"use client";

import { useEffect, useRef, useState } from "react";
import { toBengaliNumerals } from "@/lib/tax-calculator";
import { useTranslation } from "@/lib/i18n";

interface Props {
  id?: string;
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  min?: number;
  max?: number;
  ariaLabel?: string;
}

export function MoneyInput({
  id,
  value,
  onChange,
  placeholder,
  min = 0,
  max,
  ariaLabel,
}: Props) {
  const { locale } = useTranslation();
  const ref = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);
  const [draft, setDraft] = useState<string>(value ? String(value) : "");

  useEffect(() => {
    if (!focused) setDraft(value ? String(value) : "");
  }, [value, focused]);

  // When editing, show Latin digits (what the user typed); when not focused,
  // show the formatted value with locale-appropriate numerals.
  let formatted = value ? new Intl.NumberFormat("en-IN").format(value) : "";
  if (locale === "bn" && formatted) formatted = toBengaliNumerals(formatted);

  return (
    <input
      ref={ref}
      id={id}
      type="text"
      inputMode="decimal"
      autoComplete="off"
      aria-label={ariaLabel}
      className="input-base"
      placeholder={placeholder ?? (locale === "bn" ? "০" : "0")}
      value={focused ? draft : formatted}
      onFocus={(e) => {
        setFocused(true);
        setDraft(value ? String(value) : "");
        requestAnimationFrame(() => e.target.select());
      }}
      onBlur={() => {
        setFocused(false);
        // Accept Bengali numerals too if pasted — normalize to Latin before parsing.
        const normalized = draft
          .replace(/[০-৯]/g, (d) =>
            String("০১২৩৪৫৬৭৮৯".indexOf(d))
          )
          .replace(/[^0-9.]/g, "");
        const parsed = parseFloat(normalized);
        if (Number.isNaN(parsed)) onChange(0);
        else if (typeof max === "number" && parsed > max) onChange(max);
        else if (parsed < min) onChange(min);
        else onChange(parsed);
      }}
      onChange={(e) => {
        const raw = e.target.value
          .replace(/[০-৯]/g, (d) =>
            String("০১২৩৪৫৬৭৮৯".indexOf(d))
          )
          .replace(/[^0-9.]/g, "");
        setDraft(raw);
        const parsed = parseFloat(raw);
        if (!Number.isNaN(parsed)) onChange(parsed);
        else if (raw === "") onChange(0);
      }}
    />
  );
}
