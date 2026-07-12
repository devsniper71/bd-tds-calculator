"use client";

interface Props {
  checked: boolean;
  onChange: (v: boolean) => void;
  ariaLabel?: string;
  id?: string;
  describedBy?: string;
}

export function Toggle({ checked, onChange, ariaLabel, id, describedBy }: Props) {
  return (
    <button
      type="button"
      id={id}
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      aria-describedby={describedBy}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 ease-swift self-end ml-auto ${
        checked ? "bg-emerald" : "bg-rule hover:bg-muted/40"
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-300 ease-swift ${
          checked ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}
