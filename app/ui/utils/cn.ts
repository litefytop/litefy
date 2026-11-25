import { createCn } from "cn/config";

const merge = createCn({
  extend: {
    theme: {
      shadow: [
        "frame",
        "frame-hover",
        "frame-active",
        "frame-disabled",
        "block",
        "block-hover",
        "plain-hover",
        "field",
        "faint",
        "subtle",
        "base",
        "elevated",
        "surface",
        "pressed",
        "recess",
        "focus-danger",
        "field-focus",
        "field-focus-danger",
        "brutal-2",
        "brutal-4",
        "brutal-6",
        "brutal-8",
        "brutal-12",
        "accent-6",
        "accent-12",
      ],
      width: ["xs", "sm", "md", "lg", "xl", "2xl"],
      spacing: [
        "xs",
        "sm",
        "md",
        "lg",
        "xl",
        "tight",
        "snug",
        "loose",
        "control",
        "control-x",
        "pill-x",
        "plain-x",
        "panel",
        "field",
        "field-x",
        "field-y",
        "icon",
        "hit",
        "lift",
        "crush",
      ],
      "font-weight": ["label", "field", "emphasis", "strong"],
      leading: ["label", "head", "body", "field", "headline"],
      tracking: ["label", "headline", "overline"],
      text: [
        "label",
        "field",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "table-code",
        "headline",
        "kicker",
        "overline",
      ],
    },
    classGroups: {
      "border-w": [{ border: ["control", "hair", "frame"] }],
      "border-x-w": [{ "border-x": ["control", "hair", "frame"] }],
      "border-y-w": [{ "border-y": ["control", "hair", "frame"] }],
      "border-s-w": [{ "border-s": ["control", "hair", "frame"] }],
      "border-e-w": [{ "border-e": ["control", "hair", "frame"] }],
      "border-t-w": [{ "border-t": ["control", "hair", "frame"] }],
      "border-r-w": [{ "border-r": ["control", "hair", "frame"] }],
      "border-b-w": [{ "border-b": ["control", "hair", "frame"] }],
      "border-l-w": [{ "border-l": ["control", "hair", "frame"] }],
      rounded: [{ rounded: ["pill", "disc"] }],
      duration: [{ duration: ["sm", "md", "lg", "frame"] }],
    },
  },
});

export function cn(...inputs: Parameters<typeof merge>) {
  let single: string | undefined;
  for (const input of inputs) {
    if (!input) continue;
    if (typeof input !== "string" || single !== undefined) {
      single = undefined;
      break;
    }
    single = input;
  }
  return single ?? merge(...inputs);
}

export interface SlotState {
  disabled: boolean;
  highlighted?: boolean;
  active?: boolean;
  outsideMonth?: boolean;
}

export type SlotClassName<S extends SlotState = SlotState> =
  | string
  | ((state: S) => string | undefined);

export function resolveSlotClassName<S extends SlotState>(
  className: SlotClassName<S> | undefined,
  state: S,
): string | undefined {
  return typeof className === "function" ? className(state) : className;
}

type ClassMap = Record<string, string | undefined>;

export function mergeSlots<T extends object, O extends object = T>(
  base: T,
  override?: O,
): Record<keyof T | keyof O, string> {
  const out: Record<string, string> = {};
  const b = base as ClassMap;
  const o = override as ClassMap | undefined;
  for (const key of new Set([...Object.keys(b), ...Object.keys(o ?? {})])) {
    const merged = cn(b[key], o?.[key]);
    if (merged) out[key] = merged;
  }
  return out as Record<keyof T | keyof O, string>;
}

type Defined<T> = Exclude<T, undefined>;

type MergedStateSlot<B, O> = [Defined<B>] extends [never]
  ? Defined<O>
  : [Defined<O>] extends [never]
    ? Defined<B>
    : Defined<B> extends string
      ? Defined<O> extends string
        ? string
        : Defined<O>
      : Defined<B>;

type MergedStateSlots<T extends object, O extends object> = {
  [K in keyof T | keyof O]: MergedStateSlot<K extends keyof T ? T[K] : never, K extends keyof O ? O[K] : never>;
};

export function mergeStateSlots<T extends object, O extends object = T>(
  base: T,
  override?: O,
): MergedStateSlots<T, O> {
  const out: Record<string, SlotClassName> = {};
  const b = base as Record<string, SlotClassName | undefined>;
  const o = override as Record<string, SlotClassName | undefined> | undefined;
  for (const key of new Set([...Object.keys(b), ...Object.keys(o ?? {})])) {
    const baseClass = b[key];
    const overrideClass = o?.[key];
    if (typeof baseClass === "function" || typeof overrideClass === "function") {
      out[key] = (state) =>
        cn(
          typeof baseClass === "function" ? baseClass(state) : baseClass,
          typeof overrideClass === "function" ? overrideClass(state) : overrideClass,
        );
    } else {
      const merged = cn(baseClass, overrideClass);
      if (merged) out[key] = merged;
    }
  }
  return out as MergedStateSlots<T, O>;
}
