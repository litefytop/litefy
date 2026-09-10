"use client";

import * as React from "react";
import { ChevronDown, ChevronRight, Plus, Trash2 } from "lucide-react";
import { formatQuery, type RuleGroupType, type RuleType } from "react-querybuilder";
import { type ClassNameValue, cn } from "..";
import { Button } from "./button";
import { Checkbox, CheckboxGroup } from "./checkbox";
import { DatePicker } from "./date-picker";
import { Input } from "./input";
import { SegmentGroup } from "./segment";
import { Select } from "./select";

export type QueryValueKind = "text" | "number" | "date" | "select";
export type QueryCombinator = "and" | "or";

export interface QueryFieldConfig {
  name: string;
  label: string;
  operators?: string[];
  valueKind?: QueryValueKind;
  options?: { label: string; value: string }[];
}

export interface QueryBuilderProps {
  fields: QueryFieldConfig[];
  defaultValue?: RuleGroupType;
  onSubmit?: (query: RuleGroupType) => void;
  onQueryChange?: (query: RuleGroupType) => void;
  onReset?: () => void;
  showPreview?: boolean;
  showConvert?: boolean;
  convertFormats?: string[];
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

const CONVERT_FORMATS = [
  "natural_language",
  "sql",
  "parameterized",
  "parameterized_named",
  "mongodb",
  "cel",
  "spel",
  "json",
  "jsonlogic",
];

const CONVERT_LABELS: Record<string, string> = {
  natural_language: "Natural Language",
  sql: "SQL",
  parameterized: "Parameterized",
  parameterized_named: "Parameterized (named)",
  mongodb: "MongoDB",
  cel: "CEL",
  spel: "SpEL",
  json: "JSON",
  jsonlogic: "JSONLogic",
};

interface DraftCondition {
  operator: string;
  value: string;
}

interface DraftFieldState {
  collapsed: boolean;
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

function isGroupNode(node: RuleType | RuleGroupType): node is RuleGroupType {
  return "combinator" in node;
}

function emptyFieldState(): DraftFieldState {
  return { collapsed: true, conditions: [], enumValues: [] };
}

function newDraftGroup(fields: QueryFieldConfig[]): DraftGroup {
  const fieldStates: Record<string, DraftFieldState> = {};
  for (const field of fields) fieldStates[field.name] = emptyFieldState();
  return { combinator: "and", collapsed: false, fields: fieldStates, groups: [] };
}

function fromQueryGroup(group: RuleGroupType, fields: QueryFieldConfig[]): DraftGroup {
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

function toQueryGroup(group: DraftGroup, fields: QueryFieldConfig[]): RuleGroupType {
  const rules: (RuleType | RuleGroupType)[] = [];
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

export function QueryBuilder({
  fields,
  defaultValue,
  onSubmit,
  onQueryChange,
  onReset,
  showPreview = true,
  showConvert = true,
  convertFormats = CONVERT_FORMATS,
  maxDepth = 2,
  disabled,
  className,
}: QueryBuilderProps) {
  const [draft, setDraft] = React.useState<DraftGroup>(() =>
    defaultValue ? fromQueryGroup(defaultValue, fields) : newDraftGroup(fields),
  );
  const [format, setFormat] = React.useState("natural_language");

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
      collapsed: false,
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
    try {
      const result: unknown = formatQuery(toQueryGroup(draft, fields), {
        format: format as never,
        fields: fields.map(({ name, label }) => ({ name, label })),
        ...(format === "natural_language" && {
          translations: { groupSuffix: "" },
          fallbackExpression: "No conditions yet",
        }),
      });
      return typeof result === "string" ? result : JSON.stringify(result, null, 2);
    } catch (error) {
      return String(error);
    }
  }, [draft, fields, format, showPreview]);

  const renderFieldNode = (group: DraftGroup, path: number[], config: QueryFieldConfig) => {
    const state = group.fields[config.name] ?? emptyFieldState();
    const kind = config.valueKind ?? "text";
    const ops = config.operators ?? KIND_OPERATORS[kind];
    const options = config.options ?? [];
    const allSelected =
      kind === "select" &&
      options.length > 0 &&
      options.every((o) => state.enumValues.includes(o.value));
    const summary =
      kind === "select"
        ? state.enumValues.length > 0 && `${state.enumValues.length} selected`
        : state.conditions.length > 0 &&
          `${state.conditions.length} condition${state.conditions.length > 1 ? "s" : ""}`;
    return (
      <div className="rounded-lg">
        <button
          type="button"
          disabled={disabled}
          onClick={() => editField(path, config.name, (f) => ({ ...f, collapsed: !f.collapsed }))}
          className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-hover"
        >
          {state.collapsed ? (
            <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
          ) : (
            <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
          )}
          <span className="truncate text-sm font-medium">{config.label}</span>
          <span className="rounded-sm bg-muted px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
            {kind}
          </span>
          {summary && (
            <span className="ml-auto shrink-0 text-xs text-muted-foreground">{summary}</span>
          )}
        </button>
        {!state.collapsed && (
          <div className="p-2">
            {kind === "select" ? (
              <div className="flex flex-col gap-1">
                <Checkbox
                  checked={allSelected}
                  disabled={disabled}
                  onCheckedChange={() =>
                    editField(path, config.name, (f) => ({
                      ...f,
                      enumValues: allSelected ? [] : options.map((o) => o.value),
                    }))
                  }
                  classNames={{
                    label:
                      "gap-2 cursor-pointer rounded px-1 py-0.5 text-sm font-normal hover:bg-hover",
                  }}
                >
                  All
                </Checkbox>
                <CheckboxGroup
                  className="ml-4 gap-1"
                  options={options.map((option) => ({
                    label: option.label,
                    value: option.value,
                  }))}
                  value={state.enumValues}
                  disabled={disabled}
                  onChange={(values) =>
                    editField(path, config.name, (f) => ({ ...f, enumValues: values }))
                  }
                  common={{
                    classNames: {
                      label:
                        "gap-2 cursor-pointer rounded px-1 py-0.5 text-sm font-normal hover:bg-hover",
                    },
                  }}
                />
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {state.conditions.map((condition, i) => (
                  <div key={i} className="grid grid-cols-[1fr_2fr_auto] items-center gap-2">
                    <div className="min-w-0">
                      <Select
                        className="min-w-0"
                        options={ops.map((op) => ({ label: op, value: op }))}
                        value={condition.operator}
                        disabled={disabled}
                        onValueChange={(v) =>
                          updateCondition(path, config.name, i, { operator: v })
                        }
                      />
                    </div>
                    <div className="min-w-0">
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
                    <button
                      type="button"
                      aria-label="Remove condition"
                      disabled={disabled}
                      onClick={() => removeCondition(path, config.name, i)}
                      className="inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-hover hover:text-danger"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => addCondition(path, config.name, ops[0])}
                  className="inline-flex h-7 cursor-pointer items-center justify-center gap-1 rounded-md px-2 text-xs text-muted-foreground"
                >
                  <Plus className="size-3.5" />
                  Condition
                </button>
              </div>
            )}
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
            {showConvert && (
              <Select
                className="ml-auto h-7 w-36 min-w-0 text-xs"
                options={convertFormats.map((f) => ({
                  label: CONVERT_LABELS[f] ?? f,
                  value: f,
                }))}
                value={format}
                onValueChange={setFormat}
              />
            )}
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
