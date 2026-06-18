import * as React from "react";
import { type ClassNameValue, cn } from "@/lib";

type HTMLAttrs<T> = Omit<T, "className" | "children"> & {
  [key: `data-${string}`]: string | number | boolean | null | undefined;
  className?: ClassNameValue;
};

const checkboxClass = {
  toggle:
    "bg-input text-input-foreground border-y border-r first:border-l has-focus-visible:ring-2 has-focus-visible:ring-ring has-focus-visible:ring-inset has-focus-visible:outline-none has-checked:bg-primary has-checked:text-primary-foreground data-invalid:text-destructive data-invalid:has-checked:bg-destructive data-invalid:accent-destructive data-invalid:ring-destructive",
  checkbox: "data-invalid:text-destructive data-invalid:accent-destructive",
};

type CheckboxGroupContextValue = {
  selected: Set<string>;
  toggleValue: (v: string) => void;
  name?: string;
  invalid?: boolean;
};
const CheckboxGroupContext =
  React.createContext<CheckboxGroupContextValue | null>(null);

export type CheckboxGroupProps = {
  defaultValue?: string[];
  value?: string[];
  onValueChange?: (value: string[]) => void;
  invalid?: boolean;
  name?: string;
  className?: ClassNameValue;
  children?: React.ReactNode;
  onBlur?: (event: FocusEvent) => void;
  legend?: string;
  slotProps?: {
    legend?: HTMLAttrs<Omit<React.ComponentProps<"legend">, "children">>;
  };
} & Omit<React.ComponentProps<"fieldset">, "className">;

function CheckboxGroup({
  defaultValue = [],
  value: controlledValue,
  onValueChange,
  name,
  invalid,
  className,
  children,
  onBlur,
  legend,
  slotProps,
  ...props
}: CheckboxGroupProps) {
  const groupRef = React.useRef<HTMLFieldSetElement>(null);
  const [uncontrolledValue, setUncontrolledValue] =
    React.useState<string[]>(defaultValue);

  const selectedArr = controlledValue ?? uncontrolledValue;
  const selectedSet = new Set(selectedArr);

  const toggleValue = (val: string) => {
    const next = selectedSet.has(val)
      ? selectedArr.filter((item) => item !== val)
      : [...selectedArr, val];

    if (controlledValue === undefined) setUncontrolledValue(next);
    onValueChange?.(next);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFieldSetElement>) => {
    const allowKeys = [
      "ArrowRight",
      "ArrowDown",
      "ArrowLeft",
      "ArrowUp",
      "Home",
      "End",
    ];
    if (
      !allowKeys.includes(e.key) ||
      !groupRef.current?.contains(document.activeElement)
    )
      return;

    const inputs = Array.from(
      groupRef.current.querySelectorAll<HTMLInputElement>(
        "input[type='checkbox']:not(:disabled)",
      ),
    );
    if (!inputs.length) return;

    const curIdx = inputs.indexOf(document.activeElement as HTMLInputElement);
    if (curIdx === -1) {
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        inputs[inputs.length - 1]?.focus();
      } else {
        inputs[0]?.focus();
      }
      e.preventDefault();
      return;
    }

    const len = inputs.length;
    let targetIdx = curIdx;
    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
        targetIdx = (curIdx + 1) % len;
        break;
      case "ArrowLeft":
      case "ArrowUp":
        targetIdx = (curIdx - 1 + len) % len;
        break;
      case "Home":
        targetIdx = 0;
        break;
      case "End":
        targetIdx = len - 1;
        break;
    }
    e.preventDefault();
    inputs[targetIdx]?.focus();
  };

  React.useEffect(() => {
    if (!onBlur) return;
    const el = groupRef.current;
    if (!el) return;
    const handleFocusOut = (e: FocusEvent) => {
      const relatedTarget = e.relatedTarget as HTMLElement | null;
      if (!el.contains(relatedTarget)) {
        onBlur(e);
      }
    };
    el.addEventListener("focusout", handleFocusOut);
    return () => {
      el.removeEventListener("focusout", handleFocusOut);
    };
  }, [onBlur]);

  const ctx = {
    selected: selectedSet,
    toggleValue,
    name,
    invalid,
  };

  return (
    <fieldset
      {...props}
      ref={groupRef}
      onKeyDown={handleKeyDown}
      aria-invalid={invalid}
      data-invalid={invalid || undefined}
      className={cn(
        "flex inert:cursor-not-allowed inert:opacity-50 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
    >
      {legend && (
        <legend
          {...slotProps?.legend}
          className={cn("text-sm font-medium", slotProps?.legend?.className)}
        >
          {legend}
        </legend>
      )}
      <CheckboxGroupContext.Provider value={ctx}>
        {children}
      </CheckboxGroupContext.Provider>
    </fieldset>
  );
}

export type CheckboxProps = {
  checked?: boolean;
  onValueChange?: (checked: boolean) => void;
  value?: string;
  variant?: keyof typeof checkboxClass;
  indicator?: (checked: boolean, wrapperClassName?: string) => React.ReactNode;
  name?: string;
  children?: React.ReactNode;
  invalid?: boolean;
} & HTMLAttrs<Omit<React.ComponentProps<"input">, "type">>;

export const Checkbox = ({
  value,
  defaultChecked = false,
  variant = "checkbox",
  indicator,
  checked,
  onValueChange,
  name,
  className,
  children,
  style,
  invalid,
  id,
  ...props
}: CheckboxProps) => {
  const ctx = React.useContext(CheckboxGroupContext);
  const fallbackId = React.useId();
  const _id = id ?? fallbackId;
  const [uncontrolledChecked, setUncontrolledChecked] =
    React.useState(defaultChecked);

  let isChecked: boolean;
  if (ctx && value !== undefined) {
    isChecked = ctx.selected.has(value);
  } else if (checked !== undefined) {
    isChecked = checked;
  } else {
    isChecked = uncontrolledChecked;
  }

  const _name = name ?? ctx?.name;
  const _invalid = invalid ?? ctx?.invalid;

  const handleChange = () => {
    if (ctx && value) {
      ctx.toggleValue(value);
      return;
    }
    const next = !isChecked;
    if (checked === undefined) setUncontrolledChecked(next);
    onValueChange?.(next);
  };

  return (
    <label
      htmlFor={_id}
      style={style}
      aria-invalid={!ctx && _invalid}
      data-invalid={_invalid || undefined}
      className={cn(
        "inline-flex items-center justify-center gap-2 shrink-0 h-9 min-w-9 px-3 py-1 cursor-pointer select-none relative has-disabled:cursor-not-allowed has-disabled:opacity-50",
        "has-focus-visible:[&>*:first-child]:ring-2 has-focus-visible:[&>*:first-child]:ring-ring has-focus-visible:[&>*:first-child]:ring-offset-2 has-focus-visible:[&>*:first-child]:outline-none",
        checkboxClass[variant],
        className,
      )}
    >
      {indicator?.(
        isChecked,
        "peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 flex items-center justify-center",
      )}

      <input
        {...props}
        type="checkbox"
        id={_id}
        value={value}
        name={_name}
        data-invalid={_invalid || undefined}
        checked={isChecked}
        onChange={handleChange}
        data-hidden={Boolean(indicator) || variant === "toggle" || undefined}
        className={cn(
          "accent-primary data-invalid:accent-destructive data-hidden:sr-only peer",
        )}
      />
      {children}
    </label>
  );
};

Checkbox.Group = CheckboxGroup;
