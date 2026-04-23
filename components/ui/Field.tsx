import type { ReactNode } from "react";

interface Props {
  label: string;
  hint?: string;
  htmlFor?: string;
  children: ReactNode;
  suffix?: string;
}

export function Field({ label, hint, htmlFor, children, suffix }: Props) {
  return (
    <div className="grid grid-cols-[1fr_minmax(120px,180px)] sm:grid-cols-[1fr_minmax(140px,180px)] items-center gap-x-3 sm:gap-x-4 gap-y-1">
      <label htmlFor={htmlFor} className="leading-snug">
        <span className="block text-[13.5px] sm:text-[14px] text-ink">
          {label}
        </span>
        {hint ? (
          <span className="block text-[11px] sm:text-[11.5px] text-muted mt-0.5 leading-tight">
            {hint}
          </span>
        ) : null}
      </label>
      <div className="flex items-center gap-1.5 sm:gap-2 justify-end">
        <div className="flex-1 min-w-0">{children}</div>
        {suffix ? (
          <span className="text-[10.5px] sm:text-[11px] uppercase tracking-wider text-muted whitespace-nowrap">
            {suffix}
          </span>
        ) : null}
      </div>
    </div>
  );
}
