import { fill } from "./template.ts";

const locale = "en-US";

const collator = new Intl.Collator(locale);

export function compareText(a: string, b: string): number {
  return collator.compare(a, b);
}

const monthYear = new Intl.DateTimeFormat(locale, {
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

// No fallback: an unknown code gives no name, instead of the code itself.
const regions = new Intl.DisplayNames(locale, {
  type: "region",
  fallback: "none",
});

// The country's name in English, from its ISO 3166 code.
export function formatCountry(code: string): string {
  const name = regions.of(code);
  if (name === undefined) {
    throw new Error(`No country name for "${code}".`);
  }
  return name;
}

const kilobytes = new Intl.NumberFormat(locale, {
  style: "unit",
  unit: "kilobyte",
  maximumFractionDigits: 0,
});

const longDate = new Intl.DateTimeFormat(locale, {
  dateStyle: "long",
  timeZone: "UTC",
});

const mediumDate = new Intl.DateTimeFormat(locale, {
  dateStyle: "medium",
  timeZone: "UTC",
});

const monthDay = new Intl.DateTimeFormat(locale, {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

export function formatMonthDay(date: Date): string {
  return monthDay.format(date);
}

export function formatLongDate(date: Date): string {
  return longDate.format(date);
}

export function formatMediumDate(date: Date): string {
  return mediumDate.format(date);
}

export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function formatMonthYear(date: Date): string {
  return monthYear.format(date);
}

export function isoMonth(date: Date): string {
  return date.toISOString().slice(0, 7);
}

const plural = new Intl.PluralRules(locale);

// A count in words, from a content file's templates: "{count} posts".
export function formatCount(
  count: number,
  templates: { readonly one: string; readonly other: string },
): string {
  const template =
    plural.select(count) === "one" ? templates.one : templates.other;
  return fill(template, { count: String(count) });
}

export function formatFileSize(bytes: number): string {
  return kilobytes.format(Math.max(1, Math.round(bytes / 1000))).toUpperCase();
}

export type YearRange = {
  readonly start: number;
  readonly end?: number | undefined;
};

// `present` stands for the end of a range that hasn't ended.
export function formatYearRange(
  { start, end }: YearRange,
  present: string,
): string {
  return `${String(start)} – ${end === undefined ? present : String(end)}`;
}

const score = new Intl.NumberFormat(locale, {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

export function formatScore(value: number): string {
  return score.format(value);
}
