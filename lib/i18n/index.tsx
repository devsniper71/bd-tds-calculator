import { en, type Dictionary } from "./en";

/**
 * The app is English-only. This hook keeps a single source of UI copy so the
 * strings stay out of the components; it intentionally has no provider/context.
 */
export function useTranslation(): { t: Dictionary } {
  return { t: en };
}

/** Simple template replacement for strings like "Hello {name}". */
export function tmpl(
  str: string,
  vars: Record<string, string | number>
): string {
  return str.replace(/\{(\w+)\}/g, (_, k) =>
    vars[k] !== undefined ? String(vars[k]) : `{${k}}`
  );
}
