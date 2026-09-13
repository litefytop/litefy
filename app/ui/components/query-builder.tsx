"use client";

import * as React from "react";
import { ChevronDown, ChevronRight, Plus, Trash2 } from "lucide-react";
import { type ClassNameValue, cn } from "../utils/cn";
import { Button } from "./button";
import { Checkbox } from "./checkbox";
import { DatePicker } from "./date-picker";
import { Input } from "./input";
import { SegmentGroup } from "./segment";
import { Select } from "./select";

export type QueryValueKind = "text" | "number" | "date" | "select";
export type QueryCombinator = "and" | "or";

export type QueryRule = { field: string; operator: string; value: string | string[] };

export type QueryGroup = { combinator: QueryCombinator; rules: (QueryRule | QueryGroup)[] };

export interface QueryFieldConfig {
  name: string;
  label: string;
  operators?: string[];
  valueKind?: QueryValueKind;
  options?: { label: string; value: string }[];
}

export interface QueryBuilderProps {
  fields: QueryFieldConfig[];
  defaultValue?: QueryGroup;
  onSubmit?: (query: QueryGroup) => void;
  onQueryChange?: (query: QueryGroup) => void;
  onReset?: () => void;
  showPreview?: boolean;
  maxDepth?: number;
  disabled?: boolean;
  className?: ClassNameValue;
}

const KIND_OPERATORS: Record<QueryValueKind, string[]> = {
  text: ["=", "!=", "contains"],
  number: ["=", "!=", ">", ">=", "<", "<="],
  date: ["=", "!=", ">", ">=", "<", "<="],
  select: ["in"],
};

const DEFAULT_OPERATOR_LABELS: Record<string, string> = {
  "=": "is",
  "!=": "is not",
  ">": "is greater than",
  ">=": "is greater than or equal to",
  "<": "is less than",
  "<=": "is less than or equal to",
  contains: "contains",
  in: "is one of",
};

interface DraftCondition {
  operator: string;
  value: string;
}

interface DraftFieldState {
  conditions: DraftCondition[];
  enumValues: string[];
}

interface DraftGroup {
  combinator: QueryCombinator;
  collapsed: boolean;
  fields: Record<string, DraftFieldState>;
  groups: DraftGroup[];
}

function fieldConfig(fields: QueryFieldConfig[], name: string): QueryFieldConfig {
  const found = fields.find((f) => f.name === name);
  if (found) return found;
  return { name, label: name, operators: KIND_OPERATORS.text, valueKind: "text" };
}

function isGroupNode(node: QueryRule | QueryGroup): node is QueryGroup {
  return "combinator" in node;
}

function emptyFieldState(): DraftFieldState {
  return { conditions: [], enumValues: [] };
}

function newDraftGroup(fields: QueryFieldConfig[]): DraftGroup {
  const fieldStates: Record<string, DraftFieldState> = {};
  for (const field of fields) fieldStates[field.name] = emptyFieldState();
  return { combinator: "and", collapsed: false, fields: fieldStates, groups: [] };
}

function fromQueryGroup(group: QueryGroup, fields: QueryFieldConfig[]): DraftGroup {
  const draft = newDraftGroup(fields);
  draft.combinator = group.combinator === "or" ? "or" : "and";
  for (const node of group.rules) {
    if (isGroupNode(node)) {
      draft.groups.push(fromQueryGroup(node, fields));
      continue;
    }
    const state = draft.fields[node.field];
    if (!state) continue;
    if ((fieldConfig(fields, node.field).valueKind ?? "text") === "select") {
      const values = Array.isArray(node.value) ? node.value.map(String) : [];
      state.enumValues = [...new Set([...state.enumValues, ...values])];
    } else {
      state.conditions.push({ operator: String(node.operator), value: String(node.value ?? "") });
    }
  }
  return draft;
}

function toQueryGroup(group: DraftGroup, fields: QueryFieldConfig[]): QueryGroup {
  const rules: (QueryRule | QueryGroup)[] = [];
  for (const field of fields) {
    const state = group.fields[field.name];
    if (!state) continue;
    if ((field.valueKind ?? "text") === "select") {
      if (state.enumValues.length > 0) {
        rules.push({ field: field.name, operator: "in", value: [...state.enumValues] });
      }
      continue;
    }
    for (const condition of state.conditions) {
      if (String(condition.value ?? "").trim() === "") continue;
      rules.push({ field: field.name, operator: condition.operator, value: condition.value });
    }
  }
  for (const nested of group.groups) {
    const query = toQueryGroup(nested, fields);
    if (query.rules.length > 0) rules.push(query);
  }
  return { combinator: group.combinator, rules };
}

function updateGroupAt(
  group: DraftGroup,
  path: number[],
  updater: (g: DraftGroup) => DraftGroup,
): DraftGroup {
  if (path.length === 0) return updater(group);
  const [head, ...rest] = path;
  return {
    ...group,
    groups: group.groups.map((g, i) => (i === head ? updateGroupAt(g, rest, updater) : g)),
  };
}

function parsePlainDate(value: unknown): Temporal.PlainDate | null {
  if (typeof value !== "string" || value === "") return null;
  try {
    return Temporal.PlainDate.from(value);
  } catch {
    return null;
  }
}

// ├ / └ tree guide drawn with borders: the vertical line spans the whole row
// for non-last children and stops at the horizontal stub for the last one.
function TreeGuide({ last }: { last: boolean }) {
  return (
    <div aria-hidden className="relative h-full min-h-9 w-4 shrink-0">
      <div className={cn("absolute top-0 left-1/2 w-px bg-border", last ? "h-1/2" : "h-full")} />
      <div className="absolute top-1/2 left-1/2 h-px w-1/2 bg-border" />
    </div>
  );
}

function toNaturalLanguage(group: QueryGroup, fields: QueryFieldConfig[]): string {
  const quote = (value: string) => `'${value.replace(/'/g, "''")}'`;
  const renderValue = (config: QueryFieldConfig, value: string | string[]): string => {
    if (Array.isArray(value)) {
      return `(${value.map((v) => quote(String(v))).join(", ")})`;
    }
    if ((config.valueKind ?? "text") === "number") return String(value);
    return quote(String(value));
  };
  const renderRule = (rule: QueryRule): string => {
    const config = fieldConfig(fields, rule.field);
    const label = config.label || rule.field;
    const operator = QueryBuilder.operatorLabels[rule.operator] ?? rule.operator;
    return `${label} ${operator} ${renderValue(config, rule.value)}`;
  };
  const renderGroup = (node: QueryGroup): string => {
    const parts: string[] = [];
    for (const child of node.rules) {
      if (isGroupNode(child)) {
        const inner = renderGroup(child);
        if (inner !== "") parts.push(`(${inner})`);
      } else {
        parts.push(renderRule(child));
      }
    }
    if (parts.length === 0) return "";
    return parts.join(node.combinator === "or" ? " or " : " and ");
  };
  return renderGroup(group) || "No conditions yet";
}

function QueryBuilderImpl({
  fields,
  defaultValue,
  onSubmit,
  onQueryChange,
  onReset,
  showPreview = true,
  maxDepth = 2,
  disabled,
  className,
}: QueryBuilderProps) {
  const [draft, setDraft] = React.useState<DraftGroup>(() =>
    defaultValue ? fromQueryGroup(defaultValue, fields) : newDraftGroup(fields),
  );

  const editGroup = (path: number[], updater: (g: DraftGroup) => DraftGroup) =>
    setDraft((root) => updateGroupAt(root, path, updater));

  const editField = (
    path: number[],
    name: string,
    updater: (f: DraftFieldState) => DraftFieldState,
  ) =>
    setDraft((root) =>
      updateGroupAt(root, path, (g) => ({
        ...g,
        fields: { ...g.fields, [name]: updater(g.fields[name]) },
      })),
    );

  const addCondition = (path: number[], name: string, operator: string) =>
    editField(path, name, (f) => ({
      ...f,
      conditions: [...f.conditions, { operator, value: "" }],
    }));

  const updateCondition = (
    path: number[],
    name: string,
    index: number,
    patch: Partial<DraftCondition>,
  ) =>
    editField(path, name, (f) => ({
      ...f,
      conditions: f.conditions.map((c, i) => (i === index ? { ...c, ...patch } : c)),
    }));

  const removeCondition = (path: number[], name: string, index: number) =>
    editField(path, name, (f) => ({
      ...f,
      conditions: f.conditions.filter((_, i) => i !== index),
    }));

  const handleSubmit = () => {
    const query = toQueryGroup(draft, fields);
    onSubmit?.(query);
    onQueryChange?.(query);
  };

  const handleReset = () => {
    setDraft(defaultValue ? fromQueryGroup(defaultValue, fields) : newDraftGroup(fields));
    onReset?.();
  };

  const preview = React.useMemo(() => {
    if (!showPreview) return "";
    return toNaturalLanguage(toQueryGroup(draft, fields), fields);
  }, [draft, fields, showPreview]);

  const renderFieldNode = (group: DraftGroup, path: number[], config: QueryFieldConfig) => {
    const state = group.fields[config.name] ?? emptyFieldState();
    const kind = config.valueKind ?? "text";
    const ops = config.operators ?? KIND_OPERATORS[kind];
    const options = config.options ?? [];
    const allSelected =
      kind === "select" &&
      options.length > 0 &&
      options.every((o) => state.enumValues.includes(o.value));
    const toggleEnum = (value: string) =>
      editField(path, config.name, (f) => ({
        ...f,
        enumValues: f.enumValues.includes(value)
          ? f.enumValues.filter((v) => v !== value)
          : [...f.enumValues, value],
      }));
    const checkboxClass =
      "gap-2 cursor-pointer rounded px-1 py-0.5 text-sm font-normal hover:bg-hover";
    return (
      <div className="rounded-lg">
        <div className="flex items-center gap-2 rounded-lg px-2 py-1">
          <span className="truncate text-sm font-medium">{config.label}</span>
          <span className="rounded-sm bg-muted px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
            {kind}
          </span>
          {kind !== "select" && (
            <button
              type="button"
              aria-label={`Add condition to ${config.label}`}
              disabled={disabled}
              onClick={() => addCondition(path, config.name, ops[0])}
              className="ml-auto inline-flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-hover hover:text-foreground"
            >
              <Plus className="size-4" />
            </button>
          )}
        </div>
        {kind === "select" ? (
          options.length > 0 && (
            <div className="flex flex-col">
              <div className="flex items-center py-0.5 pr-2">
                <TreeGuide last={false} />
                <Checkbox
                  checked={allSelected}
                  disabled={disabled}
                  onCheckedChange={() =>
                    editField(path, config.name, (f) => ({
                      ...f,
                      enumValues: allSelected ? [] : options.map((o) => o.value),
                    }))
                  }
                  classNames={{ label: checkboxClass }}
                >
                  All
                </Checkbox>
              </div>
              {options.map((option, i) => (
                <div key={option.value} className="flex items-center py-0.5 pr-2">
                  <TreeGuide last={i === options.length - 1} />
                  <Checkbox
                    checked={state.enumValues.includes(option.value)}
                    disabled={disabled}
                    onCheckedChange={() => toggleEnum(option.value)}
                    classNames={{ label: checkboxClass }}
                  >
                    {option.label}
                  </Checkbox>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="flex flex-col">
            {state.conditions.map((condition, i) => (
              <div
                key={i}
                className="grid grid-cols-[16px_minmax(0,1fr)_minmax(0,2fr)_auto] items-stretch gap-2 py-0.5 pr-2"
              >
                <TreeGuide last={i === state.conditions.length - 1} />
                <div className="flex min-w-0 items-center">
                  <Select
                    className="min-w-0"
                    options={ops.map((op) => ({
                      label: QueryBuilder.operatorLabels[op] ?? op,
                      value: op,
                    }))}
                    value={condition.operator}
                    disabled={disabled}
                    onValueChange={(v) => updateCondition(path, config.name, i, { operator: v })}
                  />
                </div>
                <div className="flex min-w-0 items-center">
                  {kind === "date" ? (
                    <DatePicker
                      value={parsePlainDate(condition.value)}
                      disabled={disabled}
                      onValueChange={(date) =>
                        updateCondition(path, config.name, i, { value: date.toString() })
                      }
                    />
                  ) : (
                    <Input
                      inputMode={kind === "number" ? "decimal" : undefined}
                      value={condition.value}
                      disabled={disabled}
                      placeholder="Value"
                      onChange={(e) =>
                        updateCondition(path, config.name, i, { value: e.target.value })
                      }
                    />
                  )}
                </div>
                <div className="flex items-center">
                  <button
                    type="button"
                    aria-label="Remove condition"
                    disabled={disabled}
                    onClick={() => removeCondition(path, config.name, i)}
                    className="inline-flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-hover hover:text-danger"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderGroupHeader = (group: DraftGroup, path: number[]) => (
    <>
      <button
        type="button"
        aria-label={group.collapsed ? "Expand group" : "Collapse group"}
        disabled={disabled}
        onClick={() => editGroup(path, (g) => ({ ...g, collapsed: !g.collapsed }))}
        className="inline-flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-hover hover:text-foreground"
      >
        {group.collapsed ? <ChevronRight className="size-4" /> : <ChevronDown className="size-4" />}
      </button>
      <SegmentGroup
        value={group.combinator}
        disabled={disabled}
        onValueChange={(v) => editGroup(path, (g) => ({ ...g, combinator: v as QueryCombinator }))}
        options={[
          { label: "AND", value: "and" },
          { label: "OR", value: "or" },
        ]}
        itemClassName="h-7 px-2 text-xs"
      />
      <span className="text-xs text-muted-foreground">Group</span>
      <div className="ml-auto flex items-center gap-0.5">
        {path.length + 1 < maxDepth && (
          <button
            type="button"
            disabled={disabled}
            onClick={() =>
              editGroup(path, (g) => ({ ...g, groups: [...g.groups, newDraftGroup(fields)] }))
            }
            className="inline-flex h-7 cursor-pointer items-center gap-1 rounded-md px-2 text-xs text-muted-foreground transition-colors hover:bg-hover hover:text-foreground"
          >
            <Plus className="size-3.5" />
            Group
          </button>
        )}
        {path.length > 0 && (
          <button
            type="button"
            aria-label="Remove group"
            disabled={disabled}
            onClick={() =>
              editGroup(path.slice(0, -1), (g) => ({
                ...g,
                groups: g.groups.filter((_, i) => i !== path[path.length - 1]),
              }))
            }
            className="inline-flex size-7 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-hover hover:text-danger"
          >
            <Trash2 className="size-4" />
          </button>
        )}
      </div>
    </>
  );

  const renderGroupContent = (group: DraftGroup, path: number[]) => (
    <div className="ml-3 flex flex-col gap-2 border-l border-border p-2">
      {fields.map((config) => (
        <React.Fragment key={config.name}>{renderFieldNode(group, path, config)}</React.Fragment>
      ))}
      {group.groups.map((nested, i) => (
        <React.Fragment key={i}>{renderNestedGroup(nested, [...path, i])}</React.Fragment>
      ))}
    </div>
  );

  const renderNestedGroup = (group: DraftGroup, path: number[]) => (
    <div className="rounded-lg border border-border">
      <div className="flex items-center gap-1.5 border-b border-border px-2 py-1">
        {renderGroupHeader(group, path)}
      </div>
      {!group.collapsed && renderGroupContent(group, path)}
    </div>
  );

  return (
    <div
      className={cn(
        "flex h-96 w-full flex-col overflow-hidden overscroll-contain rounded-lg border bg-background text-foreground",
        className,
      )}
    >
      <div className="flex shrink-0 items-center gap-1.5 border-b border-border px-2 py-1">
        {renderGroupHeader(draft, [])}
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        {!draft.collapsed && renderGroupContent(draft, [])}
      </div>
      {showPreview && (
        <div className="shrink-0 border-t bg-muted/30 px-3 py-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">Preview</span>
          </div>
          <pre className="mt-1 max-h-20 overflow-auto text-xs whitespace-pre-wrap wrap-break-word text-muted-foreground">
            {preview}
          </pre>
        </div>
      )}
      <div className="flex shrink-0 items-center justify-center gap-2 border-t bg-background px-3 py-2">
        <Button variant="outline" disabled={disabled} onClick={handleReset}>
          Reset
        </Button>
        <Button disabled={disabled} onClick={handleSubmit}>
          Submit
        </Button>
      </div>
    </div>
  );
}

export const QueryBuilder = Object.assign(QueryBuilderImpl, {
  operatorLabels: DEFAULT_OPERATOR_LABELS,
});
