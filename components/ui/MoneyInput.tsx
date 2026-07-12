"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  id?: string;
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  min?: number;
  max?: number;
  ariaLabel?: string;
  describedBy?: string;
}

export function MoneyInput({
  id,
  value,
  onChange,
  placeholder,
  min = 0,
  max,
  ariaLabel,
  describedBy,
}: Props) {
  const ref = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);
  const [draft, setDraft] = useState<string>(value ? String(value) : "");

  useEffect(() => {
    if (!focused) setDraft(value ? String(value) : "");
  }, [value, focused]);

  // When editing, show raw digits; when not focused, show grouped (lakh/crore).
  const formatted = value ? new Intl.NumberFormat("en-IN").format(value) : "";

  return (
    <input
      ref={ref}
      id={id}
      type="text"
      inputMode="decimal"
      autoComplete="off"
      aria-label={ariaLabel}
      aria-describedby={describedBy}
      className="input-base"
      placeholder={placeholder ?? "0"}
      value={focused ? draft : formatted}
      onFocus={(e) => {
        setFocused(true);
        setDraft(value ? String(value) : "");
        requestAnimationFrame(() => e.target.select());
      }}
      onBlur={() => {
        setFocused(false);
        const normalized = draft.replace(/[^0-9.]/g, "");
        const parsed = parseFloat(normalized);
        if (Number.isNaN(parsed)) onChange(0);
        else if (typeof max === "number" && parsed > max) onChange(max);
        else if (parsed < min) onChange(min);
        else onChange(parsed);
      }}
      onChange={(e) => {
        const raw = e.target.value.replace(/[^0-9.]/g, "");
        setDraft(raw);
        const parsed = parseFloat(raw);
        if (!Number.isNaN(parsed)) onChange(parsed);
        else if (raw === "") onChange(0);
      }}
    />
  );
}
