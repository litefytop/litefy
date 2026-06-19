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
  disabled?: boolean;
  defaultValue?: string[];
  value?: string[];
  onValueChange?: (value: string[]) => void;
  invalid?: boolean;
  name?: string;
  className?: ClassNameValue;
  children?: React.ReactNode;
} & Omit<React.ComponentProps<"div">, "className">;

function CheckboxGroup({
  defaultValue = [],
  value: controlledValue,
  onValueChange,
  name,
  invalid,
  className,
  children,
  onBlur,
  disabled,
  ...props
}: CheckboxGroupProps) {
  const groupRef = React.useRef<HTMLDivElement>(null);
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

  const ctx = {
    selected: selectedSet,
    toggleValue,
    name,
    invalid,
  };

  return (
    <div
      {...props}
      inert={disabled || props.inert}
      ref={groupRef}
      aria-invalid={invalid}
      data-invalid={invalid || undefined}
      className={cn(
        "flex inert:cursor-not-allowed inert:opacity-50 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
    >
      <CheckboxGroupContext.Provider value={ctx}>
        {children}
      </CheckboxGroupContext.Provider>
    </div>
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
