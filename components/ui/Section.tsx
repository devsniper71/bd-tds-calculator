"use client";

import { useState, type ReactNode } from "react";

interface Props {
  number: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  defaultCollapsed?: boolean;
}

export function Section({
  number,
  title,
  subtitle,
  children,
  defaultCollapsed = false,
}: Props) {
  const [open, setOpen] = useState(!defaultCollapsed);

  return (
    <section className="mb-7 sm:mb-8">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full mb-4 sm:mb-5 flex items-baseline gap-2.5 sm:gap-3 border-b border-rule pb-3 group text-left"
        aria-expanded={open}
      >
        <span className="font-head text-[15px] text-emerald font-medium tabular-nums">
          {number}
        </span>
        <h2 className="font-head text-[17px] sm:text-[19px] text-ink font-medium tracking-tightish">
          {title}
        </h2>
        {subtitle ? (
          <span className="text-[12px] text-muted ml-auto italic hidden sm:inline-block pr-6 sm:pr-10">
            {subtitle}
          </span>
        ) : null}
        <span
          aria-hidden
          className={`ml-auto sm:ml-0 text-muted transition-transform duration-300 ${
            open ? "rotate-0" : "-rotate-90"
          }`}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="3,4 6,8 9,4" />
          </svg>
        </span>
      </button>
      <div
        className={`grid transition-all duration-[400ms] ease-swift ${
          open
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0 pointer-events-none"
        }`}
      >
        <div className="overflow-hidden">
          <div className="space-y-4 pt-1 pb-2">{children}</div>
        </div>
      </div>
    </section>
  );
}
