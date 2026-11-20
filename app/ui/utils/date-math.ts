export function dateFromParts(year: number, month: number, day: number): Date {
	return new Date(year, month, day, 12);
}

export function currentDate(): Date {
	const now = new Date();
	return dateFromParts(now.getFullYear(), now.getMonth(), now.getDate());
}

export function startOfMonth(date: Date): Date {
	return dateFromParts(date.getFullYear(), date.getMonth(), 1);
}

export function daysInMonth(year: number, month: number): number {
	return dateFromParts(year, month + 1, 0).getDate();
}

export function addDays(date: Date, days: number): Date {
	return dateFromParts(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

export function addMonths(date: Date, months: number): Date {
	const base = dateFromParts(date.getFullYear(), date.getMonth() + months, 1);
	const day = Math.min(date.getDate(), daysInMonth(base.getFullYear(), base.getMonth()));
	return dateFromParts(base.getFullYear(), base.getMonth(), day);
}

export function addYears(date: Date, years: number): Date {
	return addMonths(date, years * 12);
}

export function isSameDate(a: Date, b: Date): boolean {
	return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function compareDates(a: Date, b: Date): number {
	if (a.getFullYear() !== b.getFullYear())
		return Math.sign(a.getFullYear() - b.getFullYear());
	if (a.getMonth() !== b.getMonth())
		return Math.sign(a.getMonth() - b.getMonth());
	return Math.sign(a.getDate() - b.getDate());
}

export function toISODate(date: Date): string {
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${date.getFullYear()}-${month}-${day}`;
}

export function parseISODate(iso: string): Date | null {
	const match = /^(\d{4})-(\d{2})-(\d{2})$/u.exec(iso);
	if (!match) return null;
	const year = Number(match[1]);
	const month = Number(match[2]);
	const day = Number(match[3]);
	if (month < 1 || month > 12) return null;
	if (day < 1 || day > daysInMonth(year, month - 1)) return null;
	return dateFromParts(year, month - 1, day);
}

export function formatDate(
	date: Date,
	locales?: string | string[],
	options?: Intl.DateTimeFormatOptions,
): string {
	return new Intl.DateTimeFormat(locales, options ?? { dateStyle: "medium" }).format(date);
}
