import { ReactNode, useId, useState, useRef, useEffect } from "react";
import { cn, ClassNameValue } from "@/lib";
import { ComponentProps } from "react";

type WithDataAttributes<T> = T & {
  [key: `data-${string}`]: string | number | true | null | undefined;
  className?: ClassNameValue;
};

export type NumberFieldProps = Omit<
  ComponentProps<"input">,
  "className" | "value" | "onChange" | "type"
> & {
  defaultValue?: number;
  value?: number | undefined;
  className?: ClassNameValue;
  label?: ReactNode;
  description?: ReactNode;
  invalid?: string;
  min?: number;
  max?: number;
  step?: number;
  itemProps?: {
    root?: WithDataAttributes<ComponentProps<"div">>;
    label?: WithDataAttributes<ComponentProps<"label">>;
    group?: WithDataAttributes<ComponentProps<"div">>;
    btn?: WithDataAttributes<ComponentProps<"button">>;
    description?: WithDataAttributes<ComponentProps<"small">>;
    invalid?: WithDataAttributes<React.ComponentProps<"small">>;
  };
  onValueChange?: (val: number | undefined) => void | { invalid?: string };
};

export function NumberField({
  defaultValue,
  value: controlledValue,
  label,
  description,
  invalid: externalInvalid,
  min = -Infinity,
  max = Infinity,
  step = 1,
  disabled,
  itemProps,
  onValueChange,
  ...props
}: NumberFieldProps) {
  const [internalInvalid, setInternalInvalid] = useState<string>();
  const internalId = useId();
  const inputId = props?.id || internalId;
  const finalInvalid = externalInvalid ?? internalInvalid;
  const isInvalid = !!finalInvalid;
  const hasInvalidContent = typeof finalInvalid === "string";

  const [inputValue, setInputValue] = useState<string>(() =>
    defaultValue !== undefined ? String(defaultValue) : ""
  );
  const lastValidNumberRef = useRef<number | undefined>(defaultValue);
  const isControlled = controlledValue !== undefined;
  const isFocusedRef = useRef(false);

  useEffect(() => {
    if (isControlled && !isFocusedRef.current) {
      const newStr = controlledValue !== undefined ? String(controlledValue) : "";
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setInputValue(newStr);
      lastValidNumberRef.current = controlledValue;
    }
  }, [controlledValue, isControlled]);

  const commitValue = (str: string) => {
    if (str === "") {
      if (isControlled) {
        onValueChange?.(undefined);
        setInternalInvalid(undefined);
      } else {
        setInputValue("");
        onValueChange?.(undefined);
        setInternalInvalid(undefined);
      }
      lastValidNumberRef.current = undefined;
      return;
    }

    let num = parseFloat(str);
    if (isNaN(num)) {
      const rollbackStr = lastValidNumberRef.current !== undefined ? String(lastValidNumberRef.current) : "";
      setInputValue(rollbackStr);
      return;
    }

    let invalidMsg: string | undefined;
    if (num < min) invalidMsg = `Value must be at least ${min}`;
    if (num > max) invalidMsg = `Value must be at most ${max}`;
    const clampedVal = Math.max(min, Math.min(max, num));
    if (clampedVal !== num) {
      num = clampedVal;
    }

    const res = onValueChange?.(num);
    const error = invalidMsg ?? (res && typeof res === "object" ? res.invalid : undefined);
    setInternalInvalid(error);

    if (!isControlled) {
      setInputValue(String(num));
      lastValidNumberRef.current = num;
    } else {
      lastValidNumberRef.current = num;
    }
  };

  const stepDelta = (delta: number) => {
    const currentNum = parseFloat(inputValue);
    if (isNaN(currentNum)) {
      const base = lastValidNumberRef.current ?? 0;
      commitValue(String(base + delta));
    } else {
      commitValue(String(currentNum + delta));
    }
  };

  const handleMinus = () => stepDelta(-step);
  const handlePlus = () => stepDelta(step);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (!/^-?[0-9]*\.?[0-9]*$/.test(raw)) return;
    setInputValue(raw);
  };

  const handleBlur = () => {
    isFocusedRef.current = false;
    commitValue(inputValue);
  };

  const handleFocus = () => {
    isFocusedRef.current = true;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      commitValue(inputValue);
    }
  };

  const displayValue = inputValue;

  return (
    <div
      {...itemProps?.root}
      inert={disabled}
      data-invalid={isInvalid ? true : undefined}
      className={cn(
        "flex flex-col gap-1 group inert:cursor-not-allowed inert:opacity-50",
        itemProps?.root?.className,
      )}
    >
      {label && (
        <label
          {...itemProps?.label}
          htmlFor={inputId}
          className={cn(
            "text-sm font-medium leading-none indent-2 py-1 select-none",
            itemProps?.label?.className,
          )}
        >
          {label}
        </label>
      )}

      <div
        {...itemProps?.group}
        className={cn(
          "border-input bg-background flex w-3xs items-center rounded-full border shadow-xs outline-none",
          "focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20",
          "group-data-invalid:border-destructive",
          itemProps?.group?.className,
        )}
      >
        <button
          {...itemProps?.btn}
          type="button"
          aria-label="Decrease"
          disabled={disabled}
          onClick={handleMinus}
          className={cn(
            "h-8 w-10 flex items-center justify-center text-muted-foreground hover:text-primary rounded-l-full border-r border-input",
            itemProps?.btn?.className,
          )}
        >
          −
        </button>

        <input
          {...props}
          id={inputId}
          type="text"
          inputMode="decimal"
          pattern="-?[0-9]*(\.[0-9]+)?"
          role="spinbutton"
          disabled={disabled}
          value={displayValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          className={cn(
            "outline-none border-0 bg-transparent w-full h-8 px-2 text-sm flex-1 text-center",
            "placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground",
          )}
          aria-invalid={isInvalid}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={parseFloat(displayValue) || undefined}
        />

        <button
          {...itemProps?.btn}
          type="button"
          aria-label="Increase"
          disabled={disabled}
          onClick={handlePlus}
          className={cn(
            "h-8 w-10 flex items-center justify-center text-muted-foreground hover:text-primary rounded-r-full border-l border-input",
            itemProps?.btn?.className,
          )}
        >
          +
        </button>
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
