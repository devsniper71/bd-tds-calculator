import {
  cloneElement,
  isValidElement,
  useId,
  type ReactElement,
  type ReactNode,
} from "react";

interface Props {
  label: string;
  hint?: string;
  htmlFor?: string;
  children: ReactNode;
  suffix?: string;
}

export function Field({ label, hint, htmlFor, children, suffix }: Props) {
  const generatedId = useId();
  const id = htmlFor ?? generatedId;
  const hintId = hint ? `${id}-hint` : undefined;

  // Link the label to its control, give screen readers an accessible name, and
  // point at the hint as a description — without every call site threading
  // id/ariaLabel/describedBy through by hand.
  const control = isValidElement(children)
    ? cloneElement(children as ReactElement<Record<string, unknown>>, {
        id: (children.props as Record<string, unknown>).id ?? id,
        ariaLabel:
          (children.props as Record<string, unknown>).ariaLabel ?? label,
        describedBy:
          (children.props as Record<string, unknown>).describedBy ?? hintId,
      })
    : children;

  return (
    <div className="grid grid-cols-[1fr_minmax(120px,180px)] sm:grid-cols-[1fr_minmax(140px,180px)] items-center gap-x-3 sm:gap-x-4 gap-y-1">
      <label htmlFor={id} className="leading-snug">
        <span className="block text-[13.5px] sm:text-[14px] text-ink">
          {label}
        </span>
        {hint ? (
          <span
            id={hintId}
            className="block text-[11px] sm:text-[11.5px] text-muted mt-0.5 leading-tight"
          >
            {hint}
          </span>
        ) : null}
      </label>
      <div className="flex items-center gap-1.5 sm:gap-2 justify-end">
        <div className="flex-1 min-w-0">{control}</div>
        {suffix ? (
          <span className="text-[10.5px] sm:text-[11px] uppercase tracking-wider text-muted whitespace-nowrap">
            {suffix}
          </span>
        ) : null}
      </div>
    </div>
  );
}
