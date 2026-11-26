import type { FilterOperator, FilterRule } from "./filter-query";
import { normalizeDateText, splitSegments } from "./filter-query";

export { normalizeDateText };

export type FilterComboboxFieldType = "text" | "number" | "date" | "enum";

export interface FilterComboboxField {
    name: string;
    label: string;
    type: FilterComboboxFieldType;
    aliases?: string[];
    operators: FilterOperator[];
    options?: { label: string; value: string }[];
}

export interface FilterComboboxState {
    stage: "field" | "operator" | "value";
    field: string | null;
    operator: FilterOperator | null;
    rules: FilterRule[];
}

export interface FilterComboboxTexts {
    triggerText?: string;
    triggerCountText?: string;
    placeholder?: string;
    fieldPlaceholder?: string;
    operatorPlaceholder?: string;
    valuePlaceholder?: string;
    emptyFieldsText?: string;
    emptyOperatorsText?: string;
    emptyValuesText?: string;
    invalidValueText?: string;
    invalidRangeText?: string;
    invertedRangeText?: string;
    separatorLabel?: string;
    separatorKeys?: string[];
    dateSeparatorKeys?: string[];
    dateValueHint?: string;
    cancelDraftText?: string;
    clearText?: string;
    enterSelectText?: string;
    escHintText?: string;
    enterEditText?: string;
    deleteHintText?: string;
    spaceSearchText?: string;
    removeLabel?: string;
    submitText?: string;
    loadingText?: string;
    errorText?: string;
    resultCountText?: string;
    operatorLabels?: Partial<Record<FilterOperator, string>>;
}

export const defaultSeparators = [",", "/", " ", "，", "～", "~", "–"];

export const defaultComboboxTexts: Required<FilterComboboxTexts> = {
    triggerText: "Filter",
    triggerCountText: "{count} filters",
    placeholder: "Add a filter",
    fieldPlaceholder: "Column name",
    operatorPlaceholder: "Operator",
    valuePlaceholder: "Value",
    emptyFieldsText: "No matching columns",
    emptyOperatorsText: "No matching operators",
    emptyValuesText: "No matching options",
    invalidValueText: "Enter a value",
    invalidRangeText: "Enter two values separated by a comma, slash, space or tilde",
    invertedRangeText: "Start must not exceed end",
    separatorLabel: "Separate with",
    separatorKeys: ["␣", ",", "/"],
    dateSeparatorKeys: ["␣", ",", "/", "-"],
    dateValueHint: "Format YYYY-MM-DD",
    cancelDraftText: "Cancel draft",
    clearText: "Clear all",
    enterSelectText: "Select",
    escHintText: "Cancel",
    enterEditText: "Edit",
    deleteHintText: "Delete",
    spaceSearchText: "Search fields",
    removeLabel: "Remove filter",
    submitText: "Apply",
    loadingText: "Loading",
    errorText: "",
    resultCountText: "{count} results",
    operatorLabels: {
        is: "is",
        isNot: "is not",
        contains: "contains",
        notContains: "does not contain",
        gt: "greater than",
        gte: "at least",
        lt: "less than",
        lte: "at most",
        between: "between",
        notBetween: "not between",
        before: "before",
        after: "after",
        isEmpty: "is empty",
        isNotEmpty: "is not empty",
    },
};

export function resolveComboboxTexts(texts?: FilterComboboxTexts): Required<FilterComboboxTexts> {
    return {
        ...defaultComboboxTexts,
        ...texts,
        operatorLabels: { ...defaultComboboxTexts.operatorLabels, ...texts?.operatorLabels },
    };
}

let sequence = 0;

function nextId(): string {
    sequence += 1;
    return `combo-${sequence}`;
}

export function createComboboxState(): FilterComboboxState {
    return { stage: "field", field: null, operator: null, rules: [] };
}

export function isValueOperator(operator: FilterOperator): boolean {
    return operator !== "isEmpty" && operator !== "isNotEmpty";
}

export function isRangeOperator(operator: FilterOperator): boolean {
    return operator === "between" || operator === "notBetween";
}

export interface FilterValueHint {
    type: "text" | "keys";
    text?: string;
    label?: string;
    keys?: string[];
}

export function resolveValueHint(
    field: FilterComboboxField | null,
    operator: FilterRule["operator"] | null,
    texts: Required<FilterComboboxTexts>,
): FilterValueHint[] {
    if (!field || !operator || !isValueOperator(operator)) return [];
    if (isRangeOperator(operator)) {
        const hints: FilterValueHint[] = [];
        if (field.type === "date") {
            hints.push({ type: "text", text: texts.dateValueHint }, { type: "keys", label: texts.separatorLabel, keys: texts.dateSeparatorKeys });
            return hints;
        }
        hints.push({ type: "keys", label: texts.separatorLabel, keys: texts.separatorKeys });
        return hints;
    }
    if (field.type === "date") return [{ type: "text", text: texts.dateValueHint }];
    return [];
}

export interface ComboboxSuggestion {
    id: string;
    label: string;
    detail?: string;
}

export function suggestFields(fields: FilterComboboxField[], query: string): ComboboxSuggestion[] {
    const lower = query.trim().toLowerCase();
    return fields
        .filter((field) => !lower
            || field.label.toLowerCase().includes(lower)
            || field.name.toLowerCase().includes(lower)
            || field.aliases?.some((alias) => alias.toLowerCase().includes(lower)))
        .map((field) => ({ id: `field:${field.name}`, label: field.label, detail: field.name }));
}

export function suggestOperators(
    field: FilterComboboxField,
    query: string,
    texts: Required<FilterComboboxTexts>,
): ComboboxSuggestion[] {
    const lower = query.trim().toLowerCase();
    return field.operators
        .map((operator) => ({ id: `operator:${operator}`, label: texts.operatorLabels[operator] ?? operator }))
        .filter((item) => !lower || item.label.toLowerCase().includes(lower));
}

export function suggestValues(field: FilterComboboxField, query: string): ComboboxSuggestion[] {
    const options = field.options ?? [];
    const lower = query.trim().toLowerCase();
    return options
        .filter((option) => !lower
            || option.label.toLowerCase().includes(lower)
            || option.value.toLowerCase().includes(lower))
        .map((option) => ({ id: `value:${option.value}`, label: option.label, detail: option.value }));
}

export function parseRangeValue(
    text: string,
    options: { separators?: string[]; type?: FilterComboboxFieldType } = {},
): { start: string; end: string } | null {
    const trimmed = text.trim();
    if (!trimmed) return null;
    if (options.type === "date") {
        const dates = trimmed.match(/\d{4}-\d{1,2}-\d{1,2}/gu);
        if (dates && dates.length === 2) return { start: dates[0], end: dates[1] };
        const parts = splitSegments(trimmed, options.separators);
        if (parts.length === 6 && parts.every((part) => /^\d{1,4}$/u.test(part))) {
            const start = normalizeDateText(parts.slice(0, 3).join(" "), options.separators);
            const end = normalizeDateText(parts.slice(3).join(" "), options.separators);
            if (start && end) return { start, end };
        }
    }
    const parts = splitSegments(trimmed, options.separators);
    return parts.length === 2 ? { start: parts[0], end: parts[1] } : null;
}

function isSingleValueValid(field: FilterComboboxField, value: string): boolean {
    if (field.type === "number") return Number.isFinite(Number(value));
    if (field.type === "enum" && field.options?.length) {
        return field.options.some((option) => option.value === value || option.label === value);
    }
    return value.trim() !== "";
}

export interface ValueValidation {
    valid: boolean;
    value: string | string[] | null;
    error: string | null;
}

export function validateValue(
    operator: FilterOperator,
    text: string,
    field: FilterComboboxField,
    texts: Required<FilterComboboxTexts>,
    separators?: string[],
): ValueValidation {
    if (!isValueOperator(operator)) return { valid: true, value: null, error: null };
    if (isRangeOperator(operator)) {
        const range = parseRangeValue(text, { separators, type: field.type });
        if (!range) return { valid: false, value: null, error: texts.invalidRangeText };
        let start = range.start;
        let end = range.end;
        if (field.type === "date") {
            const normalizedStart = normalizeDateText(start, separators);
            const normalizedEnd = normalizeDateText(end, separators);
            if (!normalizedStart || !normalizedEnd) {
                return { valid: false, value: null, error: texts.invalidRangeText };
            }
            start = normalizedStart;
            end = normalizedEnd;
        }
        else if (!isSingleValueValid(field, start) || !isSingleValueValid(field, end)) {
            return { valid: false, value: null, error: texts.invalidRangeText };
        }
        if (field.type === "number" ? Number(start) > Number(end) : start > end) {
            return { valid: false, value: null, error: texts.invertedRangeText };
        }
        return { valid: true, value: [start, end], error: null };
    }
    const value = text.trim();
    if (!value) return { valid: false, value: null, error: texts.invalidValueText };
    if (field.type === "date") {
        const normalized = normalizeDateText(value, separators);
        if (!normalized) return { valid: false, value: null, error: texts.invalidValueText };
        return { valid: true, value: normalized, error: null };
    }
    if (!isSingleValueValid(field, value)) {
        return { valid: false, value: null, error: texts.invalidValueText };
    }
    return { valid: true, value, error: null };
}

export function appendRule(state: FilterComboboxState, rule: FilterRule): FilterComboboxState {
    return { ...state, rules: [...state.rules, rule] };
}

export function replaceRule(state: FilterComboboxState, id: string, rule: FilterRule): FilterComboboxState {
    return { ...state, rules: state.rules.map((item) => item.id === id ? rule : item) };
}

export function removeRule(state: FilterComboboxState, id: string): FilterComboboxState {
    return { ...state, rules: state.rules.filter((item) => item.id !== id) };
}

export function clearRules(state: FilterComboboxState): FilterComboboxState {
    return { ...state, rules: [] };
}

export function createRule(field: string, operator: FilterOperator, value: string | string[] | null): FilterRule {
    return { id: nextId(), field, operator, value };
}

export function describeRule(
    rule: FilterRule,
    fields: FilterComboboxField[],
    texts: Required<FilterComboboxTexts>,
): string {
    const field = fields.find((item) => item.name === rule.field);
    const name = field?.label ?? rule.field;
    const operator = texts.operatorLabels[rule.operator] ?? rule.operator;
    if (!isValueOperator(rule.operator)) return `${name} ${operator}`;
    if (Array.isArray(rule.value)) {
        const separator = ` ${defaultSeparators[6]} `;
        return `${name} ${operator} ${rule.value[0] ?? ""}${separator}${rule.value[1] ?? ""}`;
    }
    const option = field?.options?.find((item) => item.value === rule.value || item.label === rule.value);
    return `${name} ${operator} ${option?.label ?? rule.value ?? ""}`;
}
