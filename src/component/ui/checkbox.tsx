import { ReactNode, useId, useRef, useState } from "react";
import { cn, ClassNameValue } from "@/lib";
import { ComponentProps } from "react";

type WithDataAttributes<T> = T & {
  [key: `data-${string}`]: string | number | true | null | undefined;
  className?: ClassNameValue;
};

const checkboxClass = {
  toggle:
    "bg-input text-input-foreground border-y border-r first:border-l has-focus-visible:ring-2 has-focus-visible:ring-ring has-focus-visible:ring-offset-2 has-focus-visible:outline-none  has-checked:bg-primary has-checked:text-primary-foreground  group-data-invalid:text-destructive group-data-invalid:has-checked:bg-destructive group-data-invalid:accent-destructive group-data-invalid:ring-destructive",
  checkbox:
    "group-data-invalid:text-destructive group-data-invalid:accent-destructive",
};

export type CheckboxProps<T extends string> = {
  invalid?: boolean;
  defaultValue?: T[];
  value?: T[];
  onValueChange?: (value: T[]) => void;
  itemProps?: {
    options?: WithDataAttributes<
      Omit<
        CheckboxItemProps,
        "checked" | "value" | "span" | "onValueChange" | "label"
      > & { label?: ReactNode }
    >;
  };
  options: Omit<CheckboxItemProps, "checked" | "onValueChange">[];
  className?: ClassNameValue;
  name?: string;
  disabled?: boolean;
} & Omit<
  ComponentProps<"div">,
  "value" | "checked" | "children" | "className" | "type" | "style"
>;

export function Checkbox<T extends string>({
  defaultValue = [],
  value: controlledValues,
  onValueChange,
  disabled,
  name,
  onBlur,
  itemProps,
  options,
  invalid,
  className,
  ...props
}: CheckboxProps<T>) {
  const groupRef = useRef<HTMLDivElement>(null);
  const [internalValues, setInternalValues] = useState<T[]>(defaultValue);

  const selectedValues = controlledValues ?? internalValues;

  const setValue = (value: string) => {
    const newValues = selectedValues.includes(value as T)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value as T];

    if (controlledValues === undefined) {
      setInternalValues(newValues);
    }
    onValueChange?.(newValues);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const allowedKeys = [
      "ArrowRight",
      "ArrowDown",
      "ArrowLeft",
      "ArrowUp",
      "Home",
      "End",
    ];
    if (!allowedKeys.includes(e.key)) return;
    if (!groupRef.current?.contains(document.activeElement)) return;

    const enabledOptions = options.filter((opt) => !opt.disabled);
    if (!enabledOptions.length) return;

    const activeOption = enabledOptions.find(
      (opt) =>
        groupRef.current?.querySelector(
          `input[type="checkbox"][value="${CSS.escape(opt.value)}"]`,
        ) === document.activeElement,
    );
    if (!activeOption) return;

    const currentIndex = enabledOptions.indexOf(activeOption);
    let targetIndex: number;
    const len = enabledOptions.length;

    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
        targetIndex = (currentIndex + 1) % len;
        break;
      case "ArrowLeft":
      case "ArrowUp":
        targetIndex = (currentIndex - 1 + len) % len;
        break;
      case "Home":
        targetIndex = 0;
        break;
      case "End":
        targetIndex = len - 1;
        break;
      default:
        return;
    }

    e.preventDefault();
    const targetOption = enabledOptions[targetIndex];
    (
      groupRef.current?.querySelector(
        `input[type="checkbox"][value="${CSS.escape(targetOption.value)}"]`,
      ) as HTMLInputElement | null
    )?.focus();
  };

  return (
    <div
      {...props}
      role="group"
      ref={groupRef}
      inert={disabled}
      onKeyDown={handleKeyDown}
      data-invalid={invalid ? true : undefined}
      aria-invalid={invalid}
      className={cn("flex group inert:cursor-not-allowed inert:opacity-50 ", className)}
    >
      {options.map((option) => (
        <CheckboxItem
          {...itemProps?.options}
          {...option}
          disabled={disabled || option.disabled}
          checked={selectedValues.includes(option.value as T)}
          key={option.value}
          onValueChange={setValue}
          name={name}
          onBlur={onBlur}
        />
      ))}
    </div>
  );
}

export type CheckboxItemProps = {
  checked: boolean;
  value: string;
  label: ReactNode;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  variant?: keyof typeof checkboxClass;
  indicator?: (checked: boolean) => ReactNode;
  name?: string;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  itemProps?: {
    label?: Omit<ComponentProps<"label">, "children">;
  };
} & Omit<ComponentProps<"input">, "children" | "className">;

const CheckboxItem = ({
  value,
  variant = "checkbox",
  indicator,
  onValueChange,
  checked,
  disabled,
  name,
  onBlur,
  label,
  itemProps,
  ...props
}: CheckboxItemProps) => {
  const handleChange = () => onValueChange?.(value);
  const inputId = useId();

  return (
    <label
      {...itemProps?.label}
      htmlFor={inputId}
      className={cn(
        "inline-flex items-center justify-center gap-2 shrink-0 h-9 min-w-9 px-3 py-1 cursor-pointer select-none relative has-disabled:cursor-not-allowed has-disabled:opacity-50",
        checkboxClass[variant],
        itemProps?.label?.className,
      )}
    >
      <input
        {...props}
        type="checkbox"
        id={inputId}
        value={value}
        name={name}
        checked={checked}
        disabled={disabled}
        onChange={handleChange}
        onBlur={onBlur}
        data-hidden={indicator?.(checked) === undefined ? undefined : true}
        className={cn(
          "accent-accent group-data-invalid:accent-destructive data-hidden:sr-only peer",
        )}
      />

      {indicator?.(checked)}
      {label}
    </label>
  );
};
