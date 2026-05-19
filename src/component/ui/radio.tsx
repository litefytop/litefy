import { ReactNode, useCallback, useRef, useState } from "react";
import { cn, ClassNameValue } from "@/lib";
import { CheckIcon } from "./icons";
import { ComponentProps } from "react";

type WithDataAttributes<T> = T & {
  [key: `data-${string}`]: string | number | boolean | null | undefined;
  className?: ClassNameValue;
};

const radioClass = {
  segment:
    "aria-checked:bg-primary aria-checked:text-primary-foreground bg-secondary text-secondary-foreground border-y border-r first:border-l group-data-[invalid=true]:aria-checked:bg-destructive",
  radio:
    "aria-checked:text-foreground/80 group-data-[invalid=true]:aria-checked:text-destructive",
};

export type RadioProps<T extends string> = {
  invalid?: boolean | string;
  defaultValue?: T;
  value?: T;
  label?: ReactNode;
  description?: ReactNode;
  onValueChange?: (value: T) => void | { invalid?: string };
  itemProps?: {
    root?: WithDataAttributes<ComponentProps<"div">>;
    content?: WithDataAttributes<Omit<ComponentProps<"div">, "children">>;
    label?: WithDataAttributes<ComponentProps<"label">>;
    description?: WithDataAttributes<ComponentProps<"small">>;
    invalid?: WithDataAttributes<ComponentProps<"span">>;
    options?: Omit<RadioItemProps, "checked" | "value" | "label">;
  };
  options: Omit<RadioItemProps, "checked">[];
} & Omit<
  ComponentProps<"input">,
  "value" | "onChange" | "checked" | "children" | "className" | "type" | "style"
>;

export function Radio<T extends string>({
  defaultValue,
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
}: RadioProps<T>) {
  const groupRef = useRef<HTMLDivElement>(null);
  const [internalValue, setInternalValue] = useState<T | undefined>(
    defaultValue,
  );
  const [internalInvalid, setInternalInvalid] = useState<string | undefined>();

  const selectedValue = controlledValues ?? internalValue;
  const finalInvalid = externalInvalid ?? internalInvalid;
  const isInvalid = Boolean(finalInvalid);

  const setValue = (value: string) => {
    const val = value as T;

    if (controlledValues == undefined) {
      setInternalValue(val);
    }

    const result = onValueChange?.(val);
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

    const currentIndex = enabledOptions.findIndex(
      (option) => option.value === selectedValue,
    );
    if (currentIndex === -1) return;

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
    if (targetOption) {
      setValue(targetOption.value);
      const targetIndexInOriginal = options.indexOf(targetOption);
      (
        groupRef.current?.querySelector(
          `button[data-index="${targetIndexInOriginal}"]`,
        ) as HTMLButtonElement | null
      )?.focus();
    }
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
            "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 py-2 indent-2",
            itemProps?.label?.className,
          )}
        >
          {label}
        </label>
      )}

      <div
        {...itemProps?.content}
        role="radiogroup"
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
          <RadioItem
            {...itemProps?.options}
            {...option}
            data-index={index}
            checked={selectedValue === option.value}
            key={option.value}
            onValueChange={setValue}
          />
        ))}
      </div>
      <input
        {...props}
        type="hidden"
        name={name}
        value={selectedValue ?? ""}
        disabled={disabled}
        onBlur={onBlur}
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

type RadioItemProps = Omit<
  ComponentProps<"button">,
  "value" | "onChange" | "checked" | "children"
> & {
  checked: boolean;
  onCheckedChange?: (checked: boolean) => void;
  value: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  variant?: keyof typeof radioClass;
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

const RadioItem = ({
  value,
  onCheckedChange,
  disabled: controlledDisable,
  variant = "radio",
  className,
  indicator,
  onValueChange,
  checked,
  ...props
}: RadioItemProps) => {
  const disabled = controlledDisable;

  const handleClick = useCallback(() => {
    if (disabled || checked) return;
    onValueChange?.(value);
    onCheckedChange?.(true);
  }, [disabled, value, onValueChange, onCheckedChange, checked]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter") {
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
      role="radio"
      aria-checked={checked}
      tabIndex={0}
      disabled={disabled}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        "inline-flex items-center justify-center gap-2 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-8 min-w-8 px-2 py-2 cursor-pointer group-data-[invalid=true]:text-destructive",
        radioClass[variant],
        className,
      )}
    >
      {!indicator?.hidden && (
        <span
          {...indicator?.props}
          data-checked={checked}
          className={cn(
            "flex items-center justify-center size-4 rounded-full outline border  data-[checked=true]:bg-primary data-[checked=true]:border-primary-foreground data-[checked=true]:text-primary-foreground group-data-[invalid=true]:border-destructive group-data-[invalid=true]:data-[checked=true]:bg-destructive",
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
