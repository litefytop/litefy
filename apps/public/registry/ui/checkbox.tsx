import {
  createContext,
  ReactNode,
  useContext,
  useId,
  useRef,
  useState,
} from "react";
import { cn, ClassNameValue } from "@/lib";
import { ComponentProps } from "react";

type HTMLAttrs<T> = Omit<T, "className" | "children"> & {
  [key: `data-${string}`]: string | number | boolean | null | undefined;
  className?: ClassNameValue;
};

const checkboxClass = {
  toggle:
    "bg-input text-input-foreground border-y border-r first:border-l has-focus-visible:ring-2 has-focus-visible:ring-ring has-focus-visible:ring-offset-2 has-focus-visible:outline-none has-checked:bg-primary has-checked:text-primary-foreground group-data-invalid:text-destructive group-data-invalid:has-checked:bg-destructive group-data-invalid:accent-destructive group-data-invalid:ring-destructive",
  checkbox:
    "group-data-invalid:text-destructive group-data-invalid:accent-destructive",
};

type CheckboxGroupContextValue = {
  selected: Set<string>;
  toggleValue: (v: string) => void;
  disabled?: boolean;
  name?: string;
};
const CheckboxGroupContext = createContext<CheckboxGroupContextValue | null>(
  null,
);

export type CheckboxGroupProps<T extends string> = {
  defaultValue?: T[];
  value?: T[];
  onValueChange?: (value: T[]) => void;
  invalid?: boolean;
  disabled?: boolean;
  name?: string;
  className?: ClassNameValue;
  children?: ReactNode;
} & Omit<React.ComponentProps<"div">, "className">;

function CheckboxGroup<T extends string>({
  defaultValue = [],
  value: controlledValue,
  onValueChange,
  disabled,
  name,
  invalid,
  className,
  children,
  ...props
}: CheckboxGroupProps<T>) {
  const groupRef = useRef<HTMLDivElement>(null);
  const [innerValue, setInnerValue] = useState<T[]>(defaultValue);

  const selectedArr = controlledValue ?? innerValue;
  const selectedSet = new Set(selectedArr);

  const toggleValue = (val: string) => {
    const next = selectedSet.has(val as T)
      ? selectedArr.filter((item) => item !== val)
      : [...selectedArr, val];

    if (controlledValue === undefined) setInnerValue(next as T[]);
    onValueChange?.(next as T[]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
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

    const curIdx = inputs.findIndex((el) => el === document.activeElement);
    if (curIdx === -1) return;
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
      default:
        return;
    }
    e.preventDefault();
    inputs[targetIdx].focus();
  };

  const ctx = {
    selected: selectedSet,
    toggleValue,
    disabled,
    name,
  };

  return (
    <div
      {...props}
      ref={groupRef}
      role="group"
      inert={disabled}
      onKeyDown={handleKeyDown}
      data-invalid={invalid || undefined}
      aria-invalid={invalid}
      className={cn(
        "flex group inert:cursor-not-allowed inert:opacity-50",
        className,
      )}
    >
      <CheckboxGroupContext.Provider value={ctx as CheckboxGroupContextValue}>
        {children}
      </CheckboxGroupContext.Provider>
    </div>
  );
}

export type CheckboxProps = {
  checked?: boolean;
  onValueChange?: (checked: boolean) => void;
  value?: string;
  label: ReactNode;
  disabled?: boolean;
  variant?: keyof typeof checkboxClass;
  indicator?: (checked: boolean) => ReactNode;
  name?: string;
} & HTMLAttrs<ComponentProps<"input">>;

export const Checkbox = ({
  value,
  variant = "checkbox",
  indicator,
  checked,
  onValueChange,
  disabled: itemDisabled,
  name: itemName,
  label,
  className,
  style,
  ...restInputProps
}: CheckboxProps) => {
  const ctx = useContext(CheckboxGroupContext);
  const inputId = useId();
  const [innerChecked, setInnerChecked] = useState(false);

  let isChecked: boolean;
  if (ctx && value) {
    isChecked = ctx.selected.has(value);
  } else if (checked !== undefined) {
    isChecked = checked;
  } else {
    isChecked = innerChecked;
  }


  const finalName = itemName ?? ctx?.name;
  const finalDisabled = ctx?.disabled || itemDisabled;

  const handleChange = () => {
    if (ctx && value) {
      ctx.toggleValue(value);
      return;
    }
    const next = !isChecked;
    if (checked === undefined) setInnerChecked(next);
    onValueChange?.(next);
  };

  return (
    <label
      htmlFor={inputId}
      style={style}
      className={cn(
        "inline-flex items-center justify-center gap-2 shrink-0 h-9 min-w-9 px-3 py-1 cursor-pointer select-none relative has-disabled:cursor-not-allowed has-disabled:opacity-50",
        "has-focus-visible:[&>*:first-child]:ring-2 has-focus-visible:[&>*:first-child]:ring-ring has-focus-visible:[&>*:first-child]:ring-offset-2 has-focus-visible:[&>*:first-child]:outline-none",
        checkboxClass[variant],
        className,
      )}
    >
      {indicator?.(isChecked)}
      <input
        {...restInputProps}
        type="checkbox"
        id={inputId}
        value={value}
        name={finalName}
        checked={isChecked}
        disabled={finalDisabled}
        onChange={handleChange}
        data-hidden={Boolean(indicator) || variant === "toggle" || undefined}
        className={cn(
          "accent-accent group-data-invalid:accent-destructive data-hidden:sr-only peer",
        )}
      />
      {label}
    </label>
  );
};

Checkbox.Group = CheckboxGroup;
