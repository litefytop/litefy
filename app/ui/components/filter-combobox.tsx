"use client";
import * as React from "react";
import { Check, RotateCcw, Search, X } from "./icons";
import { ButtonRoot } from "./button";
import { type FilterRule, toFilterParams } from "../utils/filter-query";
import {
    type ComboboxSuggestion,
    type FilterComboboxField,
    type FilterComboboxState,
    type FilterComboboxTexts,
    appendRule,
    createRule,
    describeRule,
    isValueOperator,
    removeRule,
    replaceRule,
    resolveComboboxTexts,
    resolveValueHint,
    suggestFields,
    suggestOperators,
    suggestValues,
    validateValue,
} from "../utils/combobox-query";

export type FilterComboboxFetcher = (params: ReturnType<typeof toFilterParams>, signal: AbortSignal) => Promise<unknown>;

export interface FilterComboboxClassNames {
    root?: string;
    bar?: string;
    chip?: string;
    chipLabel?: string;
    chipRemove?: string;
    draft?: string;
    input?: string;
    hint?: string;
    list?: string;
    option?: string;
    optionLabel?: string;
    optionDetail?: string;
    submit?: string;
    cancel?: string;
    clear?: string;
    hintKeys?: string;
    hintKey?: string;
    status?: string;
    error?: string;
}

export type FilterComboboxStyles = Partial<Record<keyof FilterComboboxClassNames, React.CSSProperties>>;

export interface FilterChipRenderArgs {
    rule: FilterRule;
    label: string;
    texts: Required<FilterComboboxTexts>;
    onEdit: () => void;
    onRemove: () => void;
    classNames?: FilterComboboxClassNames;
    styles?: FilterComboboxStyles;
}

export type FilterChipRender = (args: FilterChipRenderArgs) => React.ReactNode;

export interface FilterOptionRenderArgs {
    item: ComboboxSuggestion;
    active: boolean;
    index: number;
    id: string;
    onSelect: () => void;
    onHover: () => void;
    classNames?: FilterComboboxClassNames;
    styles?: FilterComboboxStyles;
}

export type FilterOptionRender = (args: FilterOptionRenderArgs) => React.ReactNode;

export type FilterComboboxRef = {
    reset: () => void;
    submit: () => void;
    getRules: () => FilterRule[];
    focusInput: () => void;
};

export type FilterComboboxProps = Omit<React.ComponentProps<"div">, "onChange" | "children" | "defaultValue" | "ref"> & {
    fields: FilterComboboxField[];
    value?: FilterRule[];
    defaultValue?: FilterRule[];
    onChange?: (rules: FilterRule[]) => void;
    texts?: FilterComboboxTexts;
    separators?: string[];
    fetcher?: FilterComboboxFetcher;
    onResult?: (result: unknown) => void;
    onError?: (error: unknown) => void;
    resultCount?: number;
    renderChip?: FilterChipRender;
    renderOption?: FilterOptionRender;
    className?: string;
    classNames?: FilterComboboxClassNames;
    styles?: FilterComboboxStyles;
    ref?: React.Ref<FilterComboboxRef>;
};

const defaultRenderChip: FilterChipRender = ({ label, texts, onEdit, onRemove, classNames, styles }) => (
    <span className={classNames?.chip} style={styles?.chip} data-slot="chip">
        <button type="button" className={classNames?.chipLabel} style={styles?.chipLabel} aria-label={`${texts.editLabel}: ${label}`} onClick={onEdit}>
            {label}
        </button>
        <button type="button" className={classNames?.chipRemove} style={styles?.chipRemove} aria-label={`${texts.removeLabel}: ${label}`} onClick={onRemove}>
            <X />
        </button>
    </span>
);

const defaultRenderOption: FilterOptionRender = ({ item, active, id, onSelect, onHover, classNames, styles }) => (
    <div
        id={id}
        role="option"
        aria-selected={active}
        data-highlighted={active || undefined}
        className={classNames?.option}
        style={styles?.option}
        onMouseDown={(event) => event.preventDefault()}
        onMouseMove={onHover}
        onClick={onSelect}
    >
        <span className={classNames?.optionLabel} style={styles?.optionLabel}>{item.label}</span>
        <span className={classNames?.optionDetail} style={styles?.optionDetail}>{item.detail}</span>
    </div>
);

export interface FilterComboboxStatusProps {
    loading?: boolean;
    error?: string | null;
    loadingText?: string;
    errorText?: string;
    resultCount?: number;
    resultCountText?: string;
    classNames?: Pick<FilterComboboxClassNames, "status" | "error">;
    styles?: Pick<FilterComboboxStyles, "status" | "error">;
}

export function FilterComboboxStatus({ loading, error, loadingText = "Loading", errorText, resultCount, resultCountText = "{count} results", classNames, styles }: FilterComboboxStatusProps) {
    return (
        <div className={classNames?.status} style={styles?.status} data-loading={loading || undefined} data-error={error ? true : undefined}>
            <span role="status">
                {loading ? loadingText : ""}
                {!loading && resultCount !== undefined ? <span className="sr-only">{resultCountText.replace("{count}", String(resultCount))}</span> : null}
            </span>
            <span role="alert" className={classNames?.error} style={styles?.error}>{error ? errorText ?? error : ""}</span>
        </div>
    );
}

interface Candidate extends ComboboxSuggestion {
    select: () => void;
}

export function FilterCombobox({
    fields,
    value,
    defaultValue,
    onChange,
    texts,
    separators,
    fetcher,
    onResult,
    onError,
    resultCount,
    renderChip,
    renderOption,
    className,
    classNames,
    styles,
    ref,
    ...rest
}: FilterComboboxProps) {
    const resolvedTexts = React.useMemo(() => resolveComboboxTexts(texts), [texts]);
    const [internal, setInternal] = React.useState<FilterRule[]>(() => defaultValue ?? []);
    const rules = value ?? internal;
    const rulesRef = React.useRef(rules);
    const [stage, setStage] = React.useState<"field" | "operator" | "value">("field");
    const [fieldName, setFieldName] = React.useState<string | null>(null);
    const [operator, setOperator] = React.useState<FilterRule["operator"] | null>(null);
    const [draft, setDraft] = React.useState("");
    const [activeIndex, setActiveIndex] = React.useState(0);
    const [listOpen, setListOpen] = React.useState(false);
    const [editingId, setEditingId] = React.useState<string | null>(null);
    const [validationError, setValidationError] = React.useState<string | null>(null);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const inputRef = React.useRef<HTMLInputElement | null>(null);
    const listId = React.useId();
    const controllerRef = React.useRef<AbortController | null>(null);
    const fetcherRef = React.useRef(fetcher);
    const onResultRef = React.useRef(onResult);
    const onErrorRef = React.useRef(onError);
    React.useLayoutEffect(() => {
        rulesRef.current = rules;
        fetcherRef.current = fetcher;
        onResultRef.current = onResult;
        onErrorRef.current = onError;
    });
    const queryKey = JSON.stringify(toFilterParams(rules));

    const commitRules = React.useCallback((next: FilterRule[]) => {
        if (value === undefined) setInternal(next);
        onChange?.(next);
    }, [value, onChange]);

    const submit = React.useCallback(async () => {
        const active = fetcherRef.current;
        if (!active) return;
        controllerRef.current?.abort();
        const controller = new AbortController();
        controllerRef.current = controller;
        setError(null);
        setLoading(true);
        try {
            const result = await active(toFilterParams(rulesRef.current), controller.signal);
            if (controller.signal.aborted) return;
            onResultRef.current?.(result);
        }
        catch (caught) {
            const aborted = controller.signal.aborted
                || (caught instanceof DOMException && caught.name === "AbortError");
            if (aborted) return;
            setError(caught instanceof Error ? caught.message : String(caught));
            onErrorRef.current?.(caught);
        }
        finally {
            if (controllerRef.current === controller) {
                controllerRef.current = null;
                setLoading(false);
            }
        }
    }, []);

    React.useEffect(() => {
        if (!fetcherRef.current) return;
        const paramsKey = JSON.stringify(toFilterParams(rulesRef.current));
        if (paramsKey !== queryKey) return;
        void submit();
    }, [queryKey, submit]);
    React.useEffect(() => () => {
        controllerRef.current?.abort();
    }, []);

    const resetStage = React.useCallback(() => {
        setStage("field");
        setFieldName(null);
        setOperator(null);
        setDraft("");
        setEditingId(null);
        setValidationError(null);
        setActiveIndex(0);
        setListOpen(false);
        inputRef.current?.focus();
    }, []);

    const reset = React.useCallback(() => {
        commitRules([]);
        setStage("field");
        setFieldName(null);
        setOperator(null);
        setDraft("");
        setEditingId(null);
        setValidationError(null);
        setListOpen(false);
    }, [commitRules]);

    React.useImperativeHandle(ref, () => ({
        reset,
        submit,
        getRules: () => rulesRef.current,
        focusInput: () => inputRef.current?.focus(),
    }), [reset, submit]);

    const activeField = fields.find((item) => item.name === fieldName) ?? null;

    const selectField = React.useCallback((field: FilterComboboxField) => {
        setFieldName(field.name);
        setStage("operator");
        setDraft("");
        setActiveIndex(0);
        setListOpen(true);
        inputRef.current?.focus();
    }, []);

    const selectOperator = React.useCallback((next: FilterRule["operator"]) => {
        setOperator(next);
        setDraft("");
        setActiveIndex(0);
        setValidationError(null);
        if (!isValueOperator(next)) {
            const rule = createRule(fieldName!, next, null);
            const state: FilterComboboxState = { stage: "operator", field: fieldName, operator: next, rules: rulesRef.current };
            const updated = editingId ? replaceRule(state, editingId, { ...rule, id: editingId }) : appendRule(state, rule);
            commitRules(updated.rules);
            resetStage();
            return;
        }
        setStage("value");
        const valueField = fields.find((item) => item.name === fieldName);
        setListOpen((valueField?.options?.length ?? 0) > 0);
        inputRef.current?.focus();
    }, [fieldName, editingId, commitRules, fields, resetStage]);

    const commitValueText = React.useCallback((text: string) => {
        if (!activeField || !operator) return;
        const result = validateValue(operator, text, activeField, resolvedTexts, separators);
        if (!result.valid) {
            setValidationError(result.error);
            return;
        }
        const rule = createRule(activeField.name, operator, result.value);
        const state: FilterComboboxState = { stage: "value", field: fieldName, operator, rules: rulesRef.current };
        const updated = editingId ? replaceRule(state, editingId, { ...rule, id: editingId }) : appendRule(state, rule);
        commitRules(updated.rules);
        resetStage();
    }, [activeField, operator, resolvedTexts, separators, fieldName, editingId, commitRules, resetStage]);

    const commitValue = () => commitValueText(draft);

    const editRule = (rule: FilterRule) => {
        const field = fields.find((item) => item.name === rule.field);
        if (!field) return;
        setFieldName(rule.field);
        setOperator(rule.operator);
        setEditingId(rule.id);
        setValidationError(null);
        if (!isValueOperator(rule.operator)) {
            setStage("operator");
            setDraft("");
            setListOpen(true);
        }
        else {
            setStage("value");
            setDraft(Array.isArray(rule.value) ? rule.value.join(" ") : rule.value ?? "");
            setListOpen((field.options?.length ?? 0) > 0);
        }
        inputRef.current?.focus();
    };

    const candidates: Candidate[] = React.useMemo(() => {
        if (stage === "field") {
            return suggestFields(fields, draft).map((item) => Object.assign({}, item, {
                select: () => {
                    const field = fields.find((entry) => item.id === `field:${entry.name}`);
                    if (field) selectField(field);
                },
            }));
        }
        if (stage === "operator" && activeField) {
            return suggestOperators(activeField, draft, resolvedTexts).map((item) => Object.assign({}, item, {
                select: () => selectOperator(item.id.slice("operator:".length) as FilterRule["operator"]),
            }));
        }
        if (stage === "value" && activeField) {
            return suggestValues(activeField, draft).map((item) => Object.assign({}, item, {
                select: () => commitValueText(item.detail ?? item.label),
            }));
        }
        return [];
    }, [stage, fields, draft, activeField, resolvedTexts, selectField, selectOperator, commitValueText]);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Escape") {
            event.preventDefault();
            if (stage === "value") {
                setStage("operator");
                setOperator(null);
                setEditingId(null);
                setDraft("");
                setValidationError(null);
                setListOpen(true);
            }
            else if (stage === "operator") {
                setStage("field");
                setFieldName(null);
                setEditingId(null);
                setDraft("");
                setListOpen(true);
            }
            else setListOpen(false);
            return;
        }
        if (stage === "field" && event.key === " ") {
            event.preventDefault();
            setListOpen(true);
            return;
        }
        if (stage === "value") {
            if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                if (candidates.length === 0) return;
                event.preventDefault();
                setListOpen(true);
                setActiveIndex((index) => {
                    const delta = event.key === "ArrowDown" ? 1 : -1;
                    return (index + delta + candidates.length) % candidates.length;
                });
                return;
            }
            if (event.key === "Enter") {
                event.preventDefault();
                const item = candidates[activeIndex] ?? candidates[0];
                if (item) item.select();
                else commitValue();
            }
            return;
        }
        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            setListOpen(true);
            setActiveIndex((index) => {
                if (candidates.length === 0) return 0;
                const delta = event.key === "ArrowDown" ? 1 : -1;
                return (index + delta + candidates.length) % candidates.length;
            });
            return;
        }
        if (event.key === "Enter") {
            event.preventDefault();
            const item = candidates[activeIndex] ?? candidates[0];
            if (item) item.select();
            return;
        }
        if (event.key === "Backspace" && draft === "" && stage === "field" && rules.length > 0) {
            event.preventDefault();
            const state: FilterComboboxState = { stage, field: fieldName, operator, rules: rulesRef.current };
            commitRules(removeRule(state, rules.at(-1)!.id).rules);
        }
    };

    const renderChipItem = renderChip ?? defaultRenderChip;
    const renderOptionItem = renderOption ?? defaultRenderOption;
    const showList = listOpen && candidates.length > 0;
    const draftFieldLabel = activeField?.label ?? "";
    const draftOperatorLabel = operator ? resolvedTexts.operatorLabels[operator] ?? operator : "";
    const showDraft = stage !== "field" && draftFieldLabel !== "";
    const hints = stage === "value" ? resolveValueHint(activeField, operator, resolvedTexts) : [];
    const hintId = React.useId();
    const placeholder = stage === "field"
        ? (rules.length === 0 ? resolvedTexts.placeholder : resolvedTexts.fieldPlaceholder)
        : stage === "operator"
            ? resolvedTexts.operatorPlaceholder
            : resolvedTexts.valuePlaceholder;

    const removeRuleAt = React.useCallback((rule: FilterRule) => {
        const state: FilterComboboxState = { stage, field: fieldName, operator, rules: rulesRef.current };
        commitRules(removeRule(state, rule.id).rules);
    }, [stage, fieldName, operator, commitRules]);

    const renderChipNode = (rule: FilterRule) => renderChipItem({
        rule,
        label: describeRule(rule, fields, resolvedTexts),
        texts: resolvedTexts,
        onEdit: () => editRule(rule),
        onRemove: () => removeRuleAt(rule),
        classNames,
        styles,
    });

    const showCheck = stage === "value" && draft.trim() !== "";

    return (
        <div {...rest} className={[classNames?.root, className].filter(Boolean).join(" ") || undefined} data-slot="filter-combobox" aria-busy={loading || undefined}>
            <div
                className={classNames?.bar}
                style={styles?.bar}
                data-slot="bar"
                data-clear={rules.length > 0 || undefined}
                onMouseDown={(event) => {
                    const target = event.target as HTMLElement;
                    if (target.closest("button, input, [data-slot='chip']")) return;
                    event.preventDefault();
                    inputRef.current?.focus();
                    setListOpen(true);
                }}
                onBlur={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setListOpen(false);
                }}
            >
                <Search aria-hidden="true" />
                {rules.map((rule) => renderChipNode(rule))}
                {showDraft ? (
                    <span className={classNames?.draft} style={styles?.draft} data-slot="draft" aria-hidden="true">
                        {draftOperatorLabel ? `${draftFieldLabel} ${draftOperatorLabel}` : draftFieldLabel}
                    </span>
                ) : null}
                <input
                    ref={inputRef}
                    role="combobox"
                    aria-autocomplete="list"
                    aria-haspopup="listbox"
                    aria-expanded={showList}
                    aria-controls={listId}
                    aria-activedescendant={showList && candidates[activeIndex] ? `${listId}-${activeIndex}` : undefined}
                    aria-describedby={hints.length > 0 ? hintId : undefined}
                    aria-label={placeholder}
                    className={classNames?.input}
                    style={styles?.input}
                    value={draft}
                    placeholder={placeholder}
                    onChange={(event) => {
                        setDraft(event.target.value);
                        setActiveIndex(0);
                        setValidationError(null);
                        setListOpen(true);
                    }}
                    onFocus={() => setListOpen(true)}
                    onKeyDown={handleKeyDown}
                />
                {showCheck ? (
                    <ButtonRoot
                        type="button"
                        className={classNames?.submit}
                        style={styles?.submit}
                        aria-label={resolvedTexts.submitText}
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={commitValue}
                    >
                        <Check />
                    </ButtonRoot>
                ) : null}
                {showDraft ? (
                    <ButtonRoot
                        type="button"
                        className={classNames?.cancel}
                        style={styles?.cancel}
                        aria-label={resolvedTexts.cancelDraftText}
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={resetStage}
                    >
                        <X />
                    </ButtonRoot>
                ) : null}
                {rules.length > 0 ? (
                    <ButtonRoot type="button" className={classNames?.clear} style={styles?.clear} aria-label={resolvedTexts.clearText} onClick={reset}>
                        <RotateCcw />
                    </ButtonRoot>
                ) : null}
                <div
                    id={listId}
                    role="listbox"
                    aria-label={stage === "field"
                        ? resolvedTexts.fieldPlaceholder
                        : stage === "operator"
                            ? resolvedTexts.operatorPlaceholder
                            : resolvedTexts.valuePlaceholder}
                    className={classNames?.list}
                    style={styles?.list}
                    hidden={!showList}
                    data-slot="suggestion-list"
                >
                    {candidates.map((item, index) => (
                        <React.Fragment key={item.id}>
                            {renderOptionItem({
                                item,
                                active: index === activeIndex,
                                index,
                                id: `${listId}-${index}`,
                                onSelect: item.select,
                                onHover: () => setActiveIndex(index),
                                classNames,
                                styles,
                            })}
                        </React.Fragment>
                    ))}
                </div>
                {hints.length > 0 ? (
                    <span id={hintId} className={classNames?.hint} style={styles?.hint} data-slot="hint">
                        {hints.map((hint) =>
                            hint.type === "keys" ? (
                                <span key={JSON.stringify(hint)} className={classNames?.hintKeys} style={styles?.hintKeys} data-slot="hint-keys">
                                    {hint.label ? <span>{hint.label}</span> : null}
                                    {hint.keys?.map((key) => (
                                        <kbd key={key} className={classNames?.hintKey} style={styles?.hintKey}>{key}</kbd>
                                    ))}
                                </span>
                            ) : (
                                <span key={JSON.stringify(hint)}>{hint.text}</span>
                            ),
                        )}
                    </span>
                ) : null}
            </div>
            <FilterComboboxStatus
                loading={loading}
                error={validationError ?? error}
                loadingText={resolvedTexts.loadingText}
                errorText={resolvedTexts.errorText || undefined}
                resultCount={resultCount}
                resultCountText={resolvedTexts.resultCountText}
                classNames={classNames}
                styles={styles}
            />
        </div>
    );
}
