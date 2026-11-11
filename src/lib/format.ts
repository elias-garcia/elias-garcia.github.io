const locale = "en-US";

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
