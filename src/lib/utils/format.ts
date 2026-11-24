import { parseDateKey } from "./date";

export const formatCurrency = (value: number, currency: string) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);

// "+$26.00" / "-$11.03" / "$0.00". The sign carries profit vs loss on its own,
// so it survives a black-and-white print and never depends on colour alone.
// Takes value and currency. Returns a string with the sign and currency symbol, but no trailing space or currency code. The sign is omitted for zero.
export const formatSignedCurrency = (value: number, currency: string) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
    signDisplay: "exceptZero",
  }).format(value);

export const daysSince = (value: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round(
    (today.getTime() - parseDateKey(value).getTime()) / 86_400_000,
  ); // Math.round instead of Math.floor to avoid DST issues, like 2023-03-11 -> 2023-03-12 is 23 hours, not 24, so we want that to be "1 day ago" not "0 days ago"
};

// "today" / "yesterday" / "3 days ago" within the week, the plain date past it.
export const formatRelativeDay = (value: string) => {
  const days = daysSince(value);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 7) return `${days} days ago`;
  return formatDate(value);
};

export const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(parseDateKey(value));
