import { ReactNode, useId, useRef, useState } from "react";
import { cn, ClassNameValue } from "@/lib";
import { ComponentProps } from "react";

type WithDataAttributes<T> = T & {
  [key: `data-${string}`]: string | number | true | null | undefined;
  className?: ClassNameValue;
};

const checkboxClass = {
  toggle:
    "bg-secondary text-secondary-foreground border-y border-r first:border-l has-focus:ring-2 has-focus:ring-accent has-focus:ring-inset  has-checked:bg-primary has-checked:text-primary-foreground  group-data-invalid:text-destructive group-data-invalid:has-checked:bg-destructive group-data-invalid:accent-destructive group-data-invalid:ring-destructive",
  checkbox:
    "group-data-invalid:text-destructive group-data-invalid:accent-destructive",
};

export type CheckboxProps<T extends string> = {
  invalid?: boolean | string;
  defaultValue?: T[];
  value?: T[];
  label?: ReactNode;
  description?: ReactNode;
  onValueChange?: (value: T[]) => void | { invalid?: string | boolean };
  itemProps?: {
    content?: Omit<ComponentProps<"div">, "children">;
    label?: WithDataAttributes<ComponentProps<"span">>;
    description?: WithDataAttributes<ComponentProps<"small">>;
    invalid?: WithDataAttributes<ComponentProps<"span">>;
    options?: Omit<
      CheckboxItemProps,
      "checked" | "value" | "span" | "onValueChange"
    >;
  };
  options: Omit<CheckboxItemProps, "checked" | "onValueChange">[];
  className?: ClassNameValue;
  name?: string;
  required?: boolean;
  disabled?: boolean;
} & Omit<
  ComponentProps<"div">,
  "value" | "checked" | "children" | "className" | "type" | "style"
>;

export function Checkbox<T extends string>({
  defaultValue = [],
  value: controlledValues,
  onValueChange,
  invalid: externalInvalid,
  label,
  description,
  disabled,
  name,
  required,
  onBlur,
  itemProps,
  options,
  className,
  ...props
}: CheckboxProps<T>) {
  const groupRef = useRef<HTMLDivElement>(null);
  const [internalValues, setInternalValues] = useState<T[]>(defaultValue);
  const [internalInvalid, setInternalInvalid] = useState<
    boolean | string | undefined
  >();
  const internalId = useId();
  const labelId = itemProps?.label?.id || internalId;

  const selectedValues = controlledValues ?? internalValues;
  const finalInvalid = externalInvalid ?? internalInvalid;
  const isInvalid = Boolean(finalInvalid);
  const hasInvalidContent = typeof finalInvalid === "string";

  const setValue = (value: string) => {
    const newValues = selectedValues.includes(value as T)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value as T];

    if (controlledValues === undefined) {
      setInternalValues(newValues);
    }
    const result = onValueChange?.(newValues);

    if (required && newValues.length === 0) {
      setInternalInvalid(true);
    } else {
      setInternalInvalid(result?.invalid);
    }
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
      inert={disabled || props.inert}
      data-invalid={isInvalid ? true : undefined}
      className={cn(
        "flex flex-col gap-1 group inert:pointer-events-none inert:opacity-50",
        className,
      )}
    >
      {label && (
        <span
          {...itemProps?.label}
          id={labelId}
          className={cn(
            "text-sm font-medium leading-none indent-2 py-1",
            itemProps?.label?.className,
          )}
        >
          {label}
        </span>
      )}

      <div
        {...itemProps?.content}
        role="group"
        aria-invalid={isInvalid}
        aria-labelledby={labelId}
        ref={groupRef}
        inert={disabled}
        onKeyDown={handleKeyDown}
        className={cn("flex", itemProps?.content?.className)}
      >
        {options.map((option) => (
          <CheckboxItem
            {...itemProps?.options}
            {...option}
            disabled={disabled}
            checked={selectedValues.includes(option.value as T)}
            key={option.value}
            onValueChange={setValue}
            name={name}
            onBlur={onBlur}
          />
        ))}
      </div>

      <small
        {...(hasInvalidContent ? itemProps?.invalid : itemProps?.description)}
        className={cn(
          "text-sm indent-2 h-5 text-muted-foreground",
          "group-data-invalid:text-destructive",
          (hasInvalidContent ? itemProps?.invalid : itemProps?.description)
            ?.className,
        )}
        role={hasInvalidContent ? "alert" : undefined}
      >
        {hasInvalidContent ? finalInvalid : description}
      </small>
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
        "inline-flex items-center justify-center gap-2 shrink-0 h-9 min-w-9 px-3 py-1 cursor-pointer select-none relative",
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
          "accent-accent group-data-invalid:accent-destructive data-hidden:sr-only invalid:accent-destructive",
        )}
      />

      {indicator?.(checked)}
      {label}
    </label>
  );
};
