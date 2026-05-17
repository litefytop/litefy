import { ReactNode, useCallback, useRef, useState } from "react";
import { cn, ClassNameValue } from "@/lib";
import { CheckIcon } from "./icons";
import { ComponentProps } from "react";

type WithDataAttributes<T> = T & {
  [key: `data-${string}`]: string | number | boolean | null | undefined;
    className?: ClassNameValue;
};

const checkboxClass = {
  toggle:
    "aria-checked:bg-primary aria-checked:text-primary-foreground bg-secondary text-secondary-foreground border-y border-r first:border-l group-data-[invalid=true]:aria-checked:bg-destructive",
  checkbox:
    "aria-checked:text-foreground/80 group-data-[invalid=true]:aria-checked:text-destructive",
};

export type CheckboxProps<T extends string> = {
  invalid?: boolean | string;
  defaultValue?: T[];
  value?: T[];
  label?: ReactNode;
  description?: ReactNode;
  onValueChange?: (value: T[]) => void | { invalid?: string };
  itemProps?: {
    root?: WithDataAttributes<ComponentProps<"div">>;
    content?: Omit<ComponentProps<"div">, "children">;
    label?: WithDataAttributes<ComponentProps<"label">>;
    description?: WithDataAttributes<ComponentProps<"small">>;
    invalid?: WithDataAttributes<ComponentProps<"span">>;
    options?: Omit<CheckboxItemProps, "checked" | "value" | "label">;
  };
  options: Omit<CheckboxItemProps, "checked">[];
} & Omit<
  ComponentProps<"input">,
  "value" | "onChange" | "checked" | "children" | "className" | "type" | "style"
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
  onBlur,
  itemProps,
  options,
  ...props
}: CheckboxProps<T>) {
  const groupRef = useRef<HTMLDivElement>(null);
  const [internalValues, setInternalValues] = useState<T[]>(defaultValue);
  const [internalInvalid, setInternalInvalid] = useState<string | undefined>();

  const selectedValues = controlledValues ?? internalValues;
  const finalInvalid = externalInvalid ?? internalInvalid;
  const isInvalid = Boolean(finalInvalid);

  const setValue = (value: string) => {
    const newValues = selectedValues.includes(value as T)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value as T];

    if (controlledValues == undefined) {
      setInternalValues(newValues);
    }

    const result = onValueChange?.(newValues);
    setInternalInvalid(result?.invalid);
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
          `button[data-index="${options.indexOf(opt)}"]`,
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
    const targetIndexInOriginal = options.indexOf(targetOption);
    (
      groupRef.current?.querySelector(
        `button[data-index="${targetIndexInOriginal}"]`,
      ) as HTMLButtonElement | null
    )?.focus();
  };

  return (
    <div
      {...itemProps?.root}
      className={cn("flex flex-col", itemProps?.root?.className)}
    >
      {label && (
        <label
          {...itemProps?.label}
          className={cn(
            "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 py-1 indent-2",
            itemProps?.label?.className,
          )}
        >
          {label}
        </label>
      )}

      <div
        {...itemProps?.content}
        role="group"
        aria-invalid={isInvalid}
        data-invalid={isInvalid}
        ref={groupRef}
        inert={disabled}
        onKeyDown={handleKeyDown}
        className={cn(
          "flex inert:pointer-events-none inert:opacity-50 group my-1",
          itemProps?.content?.className,
        )}
      >
        {options.map((option, index) => (
          <CheckboxItem
            {...itemProps?.options}
            {...option}
            data-index={index}
            checked={selectedValues.includes(option.value as T)}
            key={option.value}
            onValueChange={setValue}
          />
        ))}
      </div>
      <input
        {...props}
        type="checkbox"
        name={name}
        value={selectedValues}
        disabled={disabled}
        onBlur={onBlur}
        className="hidden"
      />
      <small
        data-invalid={isInvalid}
        {...(isInvalid ? itemProps?.invalid : itemProps?.description)}
        className={cn(
          "text-sm indent-2 h-5 text-muted-foreground data-[invalid=true]:text-destructive",
          (isInvalid ? itemProps?.invalid : itemProps?.description)?.className,
        )}
        role={isInvalid ? "alert" : undefined}
      >
        {isInvalid ? finalInvalid : description}
      </small>
    </div>
  );
}

type CheckboxItemProps = Omit<
  ComponentProps<"button">,
  "value" | "onChange" | "checked" | "children"
> & {
  checked: boolean;
  onCheckedChange?: (checked: boolean) => void;
  value: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  variant?: keyof typeof checkboxClass;
  indicator?: {
    checked?: ReactNode;
    unchecked?: ReactNode;
    hidden?: boolean;
    props?: Omit<ComponentProps<"span">, "className"> & {
      className?: ClassNameValue;
    };
  };
  className?: ClassNameValue;
  label?: ReactNode;
};

const CheckboxItem = ({
  value,
  onCheckedChange,
  disabled: controlledDisable,
  variant = "checkbox",
  className,
  indicator,
  onValueChange,
  checked,
  ...props
}: CheckboxItemProps) => {
  const disabled = controlledDisable;

  const handleClick = useCallback(() => {
    if (disabled) return;
    onValueChange?.(value);
    onCheckedChange?.(!checked);
  }, [disabled, value, onValueChange, onCheckedChange, checked]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === " ") {
        e.preventDefault();
        handleClick();
      }
    },
    [handleClick],
  );

  return (
    <button
      {...props}
      value={value}
      type="button"
      role="checkbox"
      aria-checked={checked}
      tabIndex={0}
      disabled={disabled}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        "inline-flex items-center justify-center gap-2 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-8 min-w-8 px-3 py-1 cursor-pointer group-data-[invalid=true]:text-destructive",
        checkboxClass[variant],
        className,
      )}
    >
      {!indicator?.hidden && (
        <span
          {...indicator?.props}
          data-checked={checked}
          className={cn(
            "flex items-center justify-center size-4 border outline rounded-md data-[checked=true]:bg-primary data-[checked=true]:border-primary-foreground data-[checked=true]:text-primary-foreground group-data-[invalid=true]:border-destructive group-data-[invalid=true]:data-[checked=true]:bg-destructive",
            indicator?.props?.className,
          )}
        >
          {checked
            ? (indicator?.checked ?? <CheckIcon />)
            : indicator?.unchecked}
        </span>
      )}
      {props.label}
    </button>
  );
};
