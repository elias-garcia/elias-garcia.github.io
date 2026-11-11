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

const kilobytes = new Intl.NumberFormat(locale, {
  style: "unit",
  unit: "kilobyte",
  maximumFractionDigits: 0,
});

const monthDay = new Intl.DateTimeFormat(locale, {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

export function formatMonthDay(date: Date): string {
  return monthDay.format(date);
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

export function formatFileSize(bytes: number): string {
  return kilobytes.format(Math.max(1, Math.round(bytes / 1000))).toUpperCase();
}

export type YearRange = {
  readonly start: number;
  readonly end?: number | undefined;
};

export function formatYearRange({ start, end }: YearRange): string {
  return `${String(start)}–${end === undefined ? "Now" : String(end)}`;
}
