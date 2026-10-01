/**
 * Pure calendar-date math on the native `Date` object.
 *
 * Dates are treated as calendar dates (no time zone semantics — the same
 * contract the original date props had). Every constructed date is
 * anchored at local noon so day arithmetic survives DST transitions, and
 * equality / ordering run on epoch-days (`Math.round(ms / 86400000)`) so a
 * shifted noon hour never leaks into comparisons.
 *
 * Month arithmetic clamps the day to the end of the target month:
 * Jan 31 + 1 month -> Feb 28/29.
 */

/** Month is 0-based, like `Date`; day is 1-based. Noon-anchored. */
export function dateFromParts(year: number, month: number, day: number): Date {
	return new Date(year, month, day, 12);
}

/** Today's calendar date, noon-anchored. */
export function currentDate(): Date {
	const now = new Date();
	return dateFromParts(now.getFullYear(), now.getMonth(), now.getDate());
}

/** The first day of the month the date falls in. */
export function startOfMonth(date: Date): Date {
	return dateFromParts(date.getFullYear(), date.getMonth(), 1);
}

/** Days in the given month. Month is 0-based, like `Date`. */
export function daysInMonth(year: number, month: number): number {
	return dateFromParts(year, month + 1, 0).getDate();
}

/** Day addition via Date normalization; DST-safe thanks to the noon anchor. */
export function addDays(date: Date, days: number): Date {
	return dateFromParts(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

/** Month addition with end-of-month clamping (Jan 31 + 1 -> Feb 28/29). */
export function addMonths(date: Date, months: number): Date {
	const base = dateFromParts(date.getFullYear(), date.getMonth() + months, 1);
	const day = Math.min(date.getDate(), daysInMonth(base.getFullYear(), base.getMonth()));
	return dateFromParts(base.getFullYear(), base.getMonth(), day);
}

/** Year addition; Feb 29 + 1 year clamps to Feb 28. */
export function addYears(date: Date, years: number): Date {
	return addMonths(date, years * 12);
}

const MS_PER_DAY = 86400000;

function epochDay(date: Date): number {
	return Math.round(date.getTime() / MS_PER_DAY);
}

/** Calendar-date equality, ignoring the (always-noon) time component. */
export function isSameDate(a: Date, b: Date): boolean {
	return epochDay(a) === epochDay(b);
}

/** Negative when `a` is earlier, positive when later, `0` when equal. */
export function compareDates(a: Date, b: Date): number {
	return Math.sign(epochDay(a) - epochDay(b));
}

/** `YYYY-MM-DD` in the local calendar — the display/attribute format the components commit to. */
export function toISODate(date: Date): string {
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${date.getFullYear()}-${month}-${day}`;
}

/** Strict `YYYY-MM-DD` parser; rejects impossible dates (e.g. Feb 30). */
export function parseISODate(iso: string): Date | null {
	const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
	if (!match) return null;
	const year = Number(match[1]);
	const month = Number(match[2]);
	const day = Number(match[3]);
	if (month < 1 || month > 12) return null;
	if (day < 1 || day > daysInMonth(year, month - 1)) return null;
	return dateFromParts(year, month - 1, day);
}

/** Locale-aware formatting through `Intl.DateTimeFormat` (no date library). */
export function formatDate(
	date: Date,
	locales?: string | string[],
	options?: Intl.DateTimeFormatOptions,
): string {
	return new Intl.DateTimeFormat(locales, options ?? { dateStyle: "medium" }).format(date);
}
