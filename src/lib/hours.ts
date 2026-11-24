import type { OpeningHours, Weekday } from "@/types/site";

const WEEK: readonly Weekday[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const short = (day: Weekday) => day.slice(0, 3);

function formatTime(value: string): string {
  const [hours, minutes] = value.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  return `${hours % 12 || 12}:${String(minutes).padStart(2, "0")} ${period}`;
}

function formatDays(days: readonly Weekday[]): string {
  const ordered = [...days].sort((a, b) => WEEK.indexOf(a) - WEEK.indexOf(b));
  const consecutive = ordered.every(
    (day, index) => index === 0 || WEEK.indexOf(day) === WEEK.indexOf(ordered[index - 1]) + 1,
  );

  if (ordered.length === 1) return short(ordered[0]);
  if (consecutive) return `${short(ordered[0])} – ${short(ordered[ordered.length - 1])}`;
  return ordered.map(short).join(", ");
}

export type DisplayHours = { days: string; hours: string };

export function formatOpeningHours(entries: readonly OpeningHours[]): DisplayHours[] {
  return entries.map(({ days, opens, closes }) => ({
    days: formatDays(days),
    hours: `${formatTime(opens)} – ${formatTime(closes)}`,
  }));
}

export function closedDays(entries: readonly OpeningHours[]): Weekday[] {
  const open = new Set(entries.flatMap((entry) => entry.days));
  return WEEK.filter((day) => !open.has(day));
}
