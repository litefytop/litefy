import { ReactNode, useCallback, useRef, useState } from "react";
import { cn, ClassNameValue } from "@/lib";
import { Check } from "lucide-react";
import { ComponentProps } from "react";

type HTMLAttrs<T> = T & {
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
  invalid?: boolean ;
  defaultValue?: T;
  value?: T;
  onValueChange?: (value: T) => void;
  variant?: keyof typeof radioClass;
  slotProps?: {
    content?: HTMLAttrs<Omit<ComponentProps<"div">, "children">>;
    options?: Omit<RadioItemProps, "checked" | "value" | "label"|"variant">;
  };
  options: Omit<RadioItemProps, "checked"|"variant">[];
} & Omit<
  ComponentProps<"input">,
  "value" | "onChange" | "checked" | "children" | "className" | "type" | "style"
>;

export function Radio<T extends string>({
  defaultValue,
  value: controlledValues,
  onValueChange,
  invalid,
  disabled,
  name,
  onBlur,
  slotProps,
  options,
  variant,
  ...props
}: RadioProps<T>) {
  const groupRef = useRef<HTMLDivElement>(null);
  const [internalValue, setInternalValue] = useState<T | undefined>(
    defaultValue,
  );

  const selectedValue = controlledValues ?? internalValue;

  const setValue = (value: string) => {
    const val = value as T;
    onValueChange?.(val);
    if (controlledValues == undefined) {
      setInternalValue(val);
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
      {...slotProps?.content}
      role="radiogroup"
      aria-invalid={invalid}
      data-invalid={invalid ? true : undefined}
      ref={groupRef}
      inert={disabled}
      onKeyDown={handleKeyDown}
      className={cn(
        "flex inert:pointer-events-none inert:opacity-50 group my-1",
        slotProps?.content?.className,
      )}
    >
      <input
        {...props}
        type="hidden"
        name={name}
        value={selectedValue ?? ""}
        disabled={disabled}
        onBlur={onBlur}
      />
      {options.map((option, index) => (
        <RadioItem
          {...slotProps?.options}
          {...option}
          variant={variant}
          data-index={index}
          checked={selectedValue === option.value}
          key={option.value}
          onValueChange={setValue}
        />
      ))}
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
  indicator?: (checked: boolean) => ReactNode;
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
        "inline-flex items-center justify-center gap-2 shrink-0 disabled:pointer-events-none disabled:opacity-50 h-8 min-w-8 px-2 py-2 cursor-pointer group-data-[invalid=true]:text-destructive",
        radioClass[variant],
        className,
      )}
    >
       <span

          data-checked={checked}
          data-hidden={Boolean(indicator) || variant === "segment" || undefined}
          className={cn(
            "flex items-center justify-center size-4 rounded-full outline border",
            "data-[checked=true]:bg-primary data-[checked=true]:border-primary-foreground data-[checked=true]:text-primary-foreground",
            "group-data-[invalid=true]:border-destructive group-data-[invalid=true]:data-[checked=true]:bg-destructive",
            "data-hidden:hidden"
          )}
        >
          {checked ? <Check /> : null}
        </span>
         {indicator?.(checked)}
      {props.label}
    </button>
  );
};
