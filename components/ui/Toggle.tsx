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
    // The switch is the only hit target on these rows: its label renders as a
    // <span> rather than a <label>, because HTML only lets <label for> point at
    // form controls and this is a button. So the button carries vertical
    // padding pulled back out with a negative margin — a 44x44 target that
    // occupies exactly the same space as the 44x24 track it draws.
    <button
      type="button"
      id={id}
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      aria-describedby={describedBy}
      onClick={() => onChange(!checked)}
      className="group flex items-center self-end ml-auto py-2.5 -my-2.5 rounded-full"
    >
      <span
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 ease-swift ${
          checked ? "bg-emerald" : "bg-rule group-hover:bg-muted/40"
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-300 ease-swift ${
            checked ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </span>
    </button>
  );
}
