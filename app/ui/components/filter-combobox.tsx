"use client";
import * as React from "react";
import { Check, RotateCcw, Search, X } from "./icons";
import { Button } from "./button";
import { Dialog } from "./dialog";
import { type FilterRule, toFilterParams } from "../utils/filter-query";
import {
    type ComboboxSuggestion,
    type FilterComboboxField,
    type FilterComboboxState,
    type FilterComboboxTexts,
    type FilterValueHint,
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
    trigger?: string;
    triggerLabel?: string;
    panel?: string;
    bar?: string;
    prefix?: string;
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
    footer?: string;
    status?: string;
    error?: string;
}

export type FilterComboboxStyles = Partial<Record<keyof FilterComboboxClassNames, React.CSSProperties>>;

export interface FilterComboboxDialogClassNames {
    root?: string;
    stage?: string;
    content?: string;
    close?: string;
    closeIcon?: string;
    closeKey?: string;
    header?: string;
    title?: string;
    titleIcon?: string;
}

export interface FilterComboboxDialogStyles {
    stage?: React.CSSProperties;
    content?: React.CSSProperties;
    close?: React.CSSProperties;
    header?: React.CSSProperties;
    title?: React.CSSProperties;
    titleIcon?: React.CSSProperties;
}

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
    disabled?: boolean;
    value?: FilterRule[];
    defaultValue?: FilterRule[];
    onChange?: (rules: FilterRule[]) => void;
    texts?: FilterComboboxTexts;
    separators?: string[];
    fetcher?: FilterComboboxFetcher;
    onResult?: (result: unknown) => void;
    onError?: (error: unknown) => void;
    resultCount?: number;
    renderOption?: FilterOptionRender;
    dialogClassNames?: FilterComboboxDialogClassNames;
    dialogStyles?: FilterComboboxDialogStyles;
    className?: string;
    classNames?: FilterComboboxClassNames;
    styles?: FilterComboboxStyles;
    ref?: React.Ref<FilterComboboxRef>;
};

const defaultRenderOption: FilterOptionRender = ({ item, active, id, onSelect, onHover, classNames, styles }) => (
    <div
        id={id}
        role="option"
        aria-selected={active}
        data-highlighted={active ? "true" : undefined}
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
    disabled,
    value,
    defaultValue,
    onChange,
    texts,
    separators,
    fetcher,
    onResult,
    onError,
    resultCount,
    renderOption,
    dialogClassNames,
    dialogStyles,
    className,
    style,
    classNames,
    styles,
    ref,
    ...rest
}: FilterComboboxProps) {
    const resolvedTexts = React.useMemo(() => resolveComboboxTexts(texts), [texts]);
    const [internal, setInternal] = React.useState<FilterRule[]>(() => defaultValue ?? []);
    const rules = value ?? internal;
    const rulesRef = React.useRef(rules);
    const [panelOpen, setPanelOpen] = React.useState(false);
    const [stage, setStage] = React.useState<"field" | "operator" | "value">("field");
    const [fieldName, setFieldName] = React.useState<string | null>(null);
    const [operator, setOperator] = React.useState<FilterRule["operator"] | null>(null);
    const [draft, setDraft] = React.useState("");
    const [activeIndex, setActiveIndex] = React.useState(0);
    const [ruleIndex, setRuleIndex] = React.useState(0);
    const [listOpen, setListOpen] = React.useState(false);
    // field 阶段空输入默认显示已提交条件列表；空格 / → 显式切换到字段名候选列表
    const [fieldListMode, setFieldListMode] = React.useState(false);
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
        if (disabled) return;
        if (value === undefined) setInternal(next);
        onChange?.(next);
    }, [value, onChange, disabled]);

    const submit = React.useCallback(async () => {
        if (disabled) return;
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
    }, [disabled]);

    React.useEffect(() => {
        if (!fetcherRef.current) return;
        const paramsKey = JSON.stringify(toFilterParams(rulesRef.current));
        if (paramsKey !== queryKey) return;
        void submit();
    }, [queryKey, submit]);
    React.useEffect(() => () => {
        controllerRef.current?.abort();
    }, []);

    // 关闭面板：放弃整条草稿回到 field 阶段，已提交规则保留
    const closePanel = React.useCallback(() => {
        setPanelOpen(false);
        setStage("field");
        setFieldName(null);
        setOperator(null);
        setDraft("");
        setEditingId(null);
        setValidationError(null);
        setActiveIndex(0);
        setRuleIndex(0);
        setListOpen(false);
        setFieldListMode(false);
    }, []);

    React.useEffect(() => {
        if (panelOpen) inputRef.current?.focus();
    }, [panelOpen]);

    const resetStage = React.useCallback(() => {
        setStage("field");
        setFieldName(null);
        setOperator(null);
        setDraft("");
        setEditingId(null);
        setValidationError(null);
        setActiveIndex(0);
        setRuleIndex(0);
        setListOpen(false);
        setFieldListMode(false);
        inputRef.current?.focus();
    }, []);

    const reset = React.useCallback(() => {
        if (disabled) return;
        commitRules([]);
        setStage("field");
        setFieldName(null);
        setOperator(null);
        setDraft("");
        setEditingId(null);
        setValidationError(null);
        setListOpen(false);
        setFieldListMode(false);
    }, [commitRules, disabled]);

    React.useImperativeHandle(ref, () => ({
        reset,
        submit,
        getRules: () => rulesRef.current,
        focusInput: () => {
            if (disabled) return;
            if (!panelOpen) setPanelOpen(true);
            else inputRef.current?.focus();
        },
    }), [reset, submit, disabled, panelOpen]);

    const activeField = fields.find((item) => item.name === fieldName) ?? null;

    const selectField = React.useCallback((field: FilterComboboxField) => {
        if (disabled) return;
        setFieldName(field.name);
        setStage("operator");
        setDraft("");
        setActiveIndex(0);
        setListOpen(true);
        inputRef.current?.focus();
    }, [disabled]);

    const selectOperator = React.useCallback((next: FilterRule["operator"]) => {
        if (disabled) return;
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
    }, [fieldName, editingId, commitRules, fields, resetStage, disabled]);

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
        if (disabled) return;
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

    // 列表区双态：field 阶段且输入为空 → 已提交条件列表；有输入或进入 operator/value 阶段 → 候选替换条件列表；
    // 空格 / → 在空输入下显式切换到字段名候选列表
    const showCandidates = listOpen && candidates.length > 0
        && (draft.trim() !== "" || stage !== "field" || fieldListMode);
    const showRulesList = !showCandidates && rules.length > 0 && stage === "field" && draft === "";
    // 列表容器常驻：空态也占位（面板固定高、footer 钉底不跳），有条目才挂 listbox 语义
    const listProps = showCandidates
        ? {
            id: listId,
            role: "listbox" as const,
            "aria-label": stage === "field"
                ? resolvedTexts.fieldPlaceholder
                : stage === "operator"
                    ? resolvedTexts.operatorPlaceholder
                    : resolvedTexts.valuePlaceholder,
        }
        : showRulesList
            ? { role: "listbox" as const, "aria-label": resolvedTexts.triggerCountText.replace("{count}", String(rules.length)) }
            : {};
    // 条件列表键盘选择：↑/↓ 高亮、Enter 编辑、Del 删除
    const effectiveRuleIndex = rules.length > 0 ? Math.min(ruleIndex, rules.length - 1) : 0;

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (disabled) return;
        if (event.key === "Escape") {
            if (stage === "value") {
                event.preventDefault();
                setStage("operator");
                setOperator(null);
                setEditingId(null);
                setDraft("");
                setValidationError(null);
                setListOpen(true);
            }
            else if (stage === "operator") {
                event.preventDefault();
                setStage("field");
                setFieldName(null);
                setEditingId(null);
                setDraft("");
                setListOpen(true);
            }
            // field 阶段：不拦截 Esc，交给 Dialog 的 cancel 关闭面板
            return;
        }
        if (stage === "field" && draft === "" && (event.key === " " || event.key === "ArrowRight")) {
            // 空格 / →：从条件列表切换到字段名候选列表（空格不进草稿）
            event.preventDefault();
            setFieldListMode(true);
            setListOpen(true);
            setActiveIndex(0);
            return;
        }
        if (stage === "field" && draft === "" && rules.length > 0 && !fieldListMode) {
            if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                event.preventDefault();
                setRuleIndex((index) => {
                    const delta = event.key === "ArrowDown" ? 1 : -1;
                    return (index + delta + rules.length) % rules.length;
                });
                return;
            }
            if (event.key === "Enter") {
                event.preventDefault();
                const rule = rules[effectiveRuleIndex];
                if (rule) editRule(rule);
                return;
            }
            if (event.key === "Delete") {
                event.preventDefault();
                const rule = rules[effectiveRuleIndex];
                if (rule) {
                    const state: FilterComboboxState = { stage, field: fieldName, operator, rules: rulesRef.current };
                    commitRules(removeRule(state, rule.id).rules);
                }
                return;
            }
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
            if (stage === "field" && draft === "" && !fieldListMode) return; // 条件列表态下箭头由上面的规则导航处理
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
            if (!showCandidates) return; // 条件列表态下 Enter 不误选隐藏候选
            const item = candidates[activeIndex] ?? candidates[0];
            if (item) item.select();
            return;
        }
        if (event.key === "Backspace" && stage === "field" && draft === "" && fieldListMode) {
            // 候选模式下退格：回到条件列表，不删规则
            event.preventDefault();
            setFieldListMode(false);
            return;
        }
        if (event.key === "Backspace" && draft === "" && stage === "field" && rules.length > 0) {
            event.preventDefault();
            const state: FilterComboboxState = { stage, field: fieldName, operator, rules: rulesRef.current };
            commitRules(removeRule(state, rules.at(-1)!.id).rules);
        }
    };

    const renderOptionItem = renderOption ?? defaultRenderOption;
    const draftFieldLabel = activeField?.label ?? "";
    const draftOperatorLabel = operator ? resolvedTexts.operatorLabels[operator] ?? operator : "";
    const showDraft = stage !== "field" && draftFieldLabel !== "";
    // 底部提示行（与 cmd footer 同款）：左固定 ↑↓ 键帽，右侧动态提示——
    // 条件列表态提示编辑与删除；field / operator 阶段提示回车选择与 Esc 取消；
    // value 阶段沿用 resolveValueHint（日期格式与分隔符键帽，文本无提示）
    const stageHints: FilterValueHint[] = showRulesList
        ? [
            { type: "keys", label: resolvedTexts.enterEditText, keys: ["↵"] },
            { type: "keys", label: resolvedTexts.deleteHintText, keys: ["Del"] },
            { type: "keys", label: resolvedTexts.spaceSearchText, keys: ["Space", "→"] },
        ]
        : stage === "value"
            ? resolveValueHint(activeField, operator, resolvedTexts)
            : stage === "field" || stage === "operator"
                ? [
                    { type: "keys", label: resolvedTexts.enterSelectText, keys: ["↵"] },
                    { type: "keys", label: resolvedTexts.escHintText, keys: ["esc"] },
                ]
                : [];
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

    const showCheck = stage === "value" && draft.trim() !== "";
    const triggerLabel = rules.length === 0
        ? resolvedTexts.triggerText
        : resolvedTexts.triggerCountText.replace("{count}", String(rules.length));

    return (
        <div {...rest} style={styles?.root ? { ...style, ...styles.root } : style} className={[classNames?.root, className].filter(Boolean).join(" ") || undefined} data-slot="filter-combobox" aria-busy={loading || undefined} data-disabled={disabled || undefined} aria-disabled={disabled || undefined}>
            <button
                type="button"
                disabled={disabled}
                data-slot="trigger"
                data-open={panelOpen || undefined}
                aria-haspopup="dialog"
                aria-expanded={panelOpen}
                className={classNames?.trigger}
                style={styles?.trigger}
                onClick={() => { if (!disabled) setPanelOpen(true); }}
            >
                <Search aria-hidden="true" />
                <span className={classNames?.triggerLabel} style={styles?.triggerLabel}>{triggerLabel}</span>
            </button>
            <Dialog
                open={panelOpen}
                onOpenChange={(open) => { if (!open) closePanel(); }}
                aria-label={triggerLabel}
                classNames={{ ...dialogClassNames, content: [dialogClassNames?.content, classNames?.panel].filter(Boolean).join(" ") || undefined }}
                styles={{ ...dialogStyles, content: styles?.panel }}
                data-slot="panel"
            >
                <div
                    className={classNames?.bar}
                    style={styles?.bar}
                    data-slot="bar"
                    onMouseDown={(event) => {
                        if (disabled) return;
                        const target = event.target as HTMLElement;
                        if (target.closest("button, input, [data-slot='chip']")) return;
                        event.preventDefault();
                        inputRef.current?.focus();
                        setListOpen(true);
                    }}
                    onBlur={(event) => {
                        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                            setListOpen(false);
                            setFieldListMode(false);
                        }
                    }}
                >
                    <span className={classNames?.prefix} style={styles?.prefix} data-slot="prefix">
                        <Search aria-hidden="true" />
                    </span>
                    {showDraft ? (
                        <span className={classNames?.draft} style={styles?.draft} data-slot="draft" aria-hidden="true">
                            {draftOperatorLabel ? `${draftFieldLabel} ${draftOperatorLabel}` : draftFieldLabel}
                        </span>
                    ) : null}
                    <input
                        ref={inputRef}
                        disabled={disabled}
                        role="combobox"
                        aria-autocomplete="list"
                        aria-haspopup="listbox"
                        aria-expanded={showCandidates}
                        aria-controls={showCandidates ? listId : undefined}
                        aria-activedescendant={showCandidates && candidates[activeIndex] ? `${listId}-${activeIndex}` : undefined}
                        aria-describedby={stageHints.length > 0 ? hintId : undefined}
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
                            setFieldListMode(false);
                        }}
                        onFocus={() => setListOpen(true)}
                        onKeyDown={handleKeyDown}
                    />
                    {showCheck ? (                        <Button type="button" data-variant="text" disabled={disabled} data-field-trailing="" className={classNames?.submit} style={styles?.submit} aria-label={resolvedTexts.submitText} icon={<Check />} onMouseDown={(event) => event.preventDefault()} onClick={commitValue}/>
                    ) : null}
                    {showDraft ? (
                        <Button
                            type="button"
                            data-variant="text"
                            disabled={disabled}
                            data-field-trailing=""
                            className={classNames?.cancel}
                            style={styles?.cancel}
                            aria-label={resolvedTexts.cancelDraftText}
                            icon={<X />}
                            onMouseDown={(event) => event.preventDefault()}
                            onClick={resetStage}
                        />
                    ) : null}
                    {rules.length > 0 ? (
                        <Button type="button" data-variant="text" disabled={disabled} className={classNames?.clear} style={styles?.clear} aria-label={resolvedTexts.clearText} icon={<RotateCcw />} onClick={reset}/>
                    ) : null}
                </div>
                <div
                    {...listProps}
                    className={classNames?.list}
                    style={styles?.list}
                    data-slot={showRulesList ? "rules-list" : showCandidates ? "suggestion-list" : "list"}
                >
                    {showRulesList
                        ? rules.map((rule, index) => {
                            const label = describeRule(rule, fields, resolvedTexts);
                            return (
                                <div
                                    key={rule.id}
                                    role="option"
                                    aria-selected={index === effectiveRuleIndex}
                                    data-slot="rule-row"
                                    data-highlighted={index === effectiveRuleIndex ? "true" : undefined}
                                    className={classNames?.option}
                                    style={styles?.option}
                                    onMouseMove={() => setRuleIndex(index)}
                                    onClick={(event) => {
                                        if ((event.target as HTMLElement).closest("button")) return;
                                        editRule(rule);
                                    }}
                                >
                                    <span className={classNames?.optionLabel} style={styles?.optionLabel}>{label}</span>
                                    <Button
                                        type="button"
                                        data-variant="text"
                                        disabled={disabled}
                                        className={classNames?.chipRemove}
                                        style={styles?.chipRemove}
                                        aria-label={`${resolvedTexts.removeLabel}: ${label}`}
                                        icon={<X />}
                                        onMouseDown={(event) => event.preventDefault()}
                                        onClick={() => removeRuleAt(rule)}
                                    />
                                </div>
                            );
                        })
                        : showCandidates
                            ? candidates.map((item, index) => (
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
                            ))
                            : null}
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
                {/* 底部提示行（cmd footer 同款）：左固定 ↑↓，右动态提示随阶段变化；触屏与窄屏整行隐藏 */}
                <div className={classNames?.footer} style={styles?.footer} data-slot="footer">
                    <span className={classNames?.hint} style={styles?.hint} data-slot="hint-arrows" aria-hidden="true">
                        <kbd className={classNames?.hintKey} style={styles?.hintKey}>↑</kbd>
                        <kbd className={classNames?.hintKey} style={styles?.hintKey}>↓</kbd>
                    </span>
                    {stageHints.length > 0 ? (
                        <span id={hintId} className={classNames?.hint} style={styles?.hint} data-slot="hint">
                            {stageHints.map((hint) =>
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
            </Dialog>
        </div>
    );
}
