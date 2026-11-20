export interface SortParam {
    field: string;
    direction: "asc" | "desc";
}

export type FilterOperator =
    | "is"
    | "isNot"
    | "contains"
    | "notContains"
    | "gt"
    | "gte"
    | "lt"
    | "lte"
    | "between"
    | "notBetween"
    | "before"
    | "after"
    | "isEmpty"
    | "isNotEmpty";

export interface FilterRule {
    id: string;
    field: string;
    operator: FilterOperator;
    value: string | string[] | null;
}

export interface FilterParam {
    field: string;
    operator: FilterOperator;
    value: string | string[] | null;
}

export interface DateRangeValue {
    start: string | null;
    end: string | null;
}

export function isDateRangeValid(value: DateRangeValue): boolean {
    return value.start === null || value.end === null || value.start <= value.end;
}

export function dateRangeToInput(value: DateRangeValue): string {
    if (value.start && value.end) return `${value.start} ${value.end}`;
    return value.start ?? value.end ?? "";
}

export function splitSegments(text: string, separators?: string[]): string[] {
    const list = separators ?? [",", "/", " ", "，", "～", "~", "–"];
    const pattern = new RegExp(`[${list.map((item) => item.replaceAll(/[.*+?^${}()|[\]\\]/gu, "\\$&")).join("")}]+`, "u");
    return text.trim().split(pattern).map((part) => part.trim()).filter(Boolean);
}

function joinDateSegments(parts: string[]): string | null {
    if (parts.length !== 3) return null;
    const [year, month, day] = parts;
    if (!/^\d{4}$/u.test(year) || !/^\d{1,2}$/u.test(month) || !/^\d{1,2}$/u.test(day)) return null;
    const monthNum = Number(month);
    const dayNum = Number(day);
    if (monthNum < 1 || monthNum > 12 || dayNum < 1 || dayNum > 31) return null;
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

export function normalizeDateText(text: string, separators?: string[]): string | null {
    const trimmed = text.trim();
    if (!trimmed) return null;
    if (/^\d{4}-\d{1,2}-\d{1,2}$/u.test(trimmed)) {
        return joinDateSegments(trimmed.split("-"));
    }
    return joinDateSegments(splitSegments(trimmed, separators).filter((part) => /^\d{1,4}$/u.test(part)));
}

export function parseDateRangeInput(text: string, separators?: string[]): DateRangeValue | null {
    const trimmed = text.trim();
    if (!trimmed) return { start: null, end: null };
    const single = normalizeDateText(trimmed, separators);
    if (single) return { start: single, end: null };
    const list = separators ?? [",", "/", " ", "，", "～", "~", "–"];
    const pattern = new RegExp(`[${list.map((item) => item.replaceAll(/[.*+?^${}()|[\]\\]/gu, "\\$&")).join("")}]+`, "u");
    const parts = trimmed.split(pattern).map((part) => part.trim()).filter(Boolean);
    if (parts.length === 3) {
        const start = normalizeDateText(parts.join(" "), separators);
        return start ? { start, end: null } : null;
    }
    if (parts.length === 6) {
        const start = normalizeDateText(parts.slice(0, 3).join(" "), separators);
        const end = normalizeDateText(parts.slice(3).join(" "), separators);
        return start && end ? { start, end } : null;
    }
    if (parts.length === 2) {
        const start = normalizeDateText(parts[0], separators);
        const end = normalizeDateText(parts[1], separators);
        return start && end ? { start, end } : null;
    }
    return null;
}

export function toFilterParams(rules: FilterRule[], sort: SortParam | null = null): { sort: SortParam | null; rules: FilterParam[] } {
    return {
        sort,
        rules: rules.map(({ field, operator, value }) => ({ field, operator, value })),
    };
}
