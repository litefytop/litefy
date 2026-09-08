import * as React from "react";
import { type ClassNameValue, cn } from "..";
import { Check } from "lucide-react";

export interface CheckboxRootProps extends Omit<
  React.ComponentProps<"input">,
  "type" | "className" | "value"
> {
  className?: ClassNameValue;
  value?: string;
}

export function CheckboxRoot({ className, onKeyDown, ...props }: CheckboxRootProps) {
  return (
    <input
      {...props}
      type="checkbox"
      className={cn("sr-only", className)}
      onKeyDown={(e) => {
        // Real-focus checkboxes toggle with Space natively; add Enter so
        // popover-hosted checkbox groups (multi-select) can select too.
        if (e.key === "Enter") {
          e.preventDefault();
          e.currentTarget.click();
        }
        onKeyDown?.(e);
      }}
    />
  );
}

export interface CheckboxIndicatorProps extends Omit<React.ComponentProps<"span">, "className"> {
  className?: ClassNameValue;
  checked?: boolean;
}

export function CheckboxIndicator({
  className,
  checked,
  children,
  ...props
}: CheckboxIndicatorProps) {
  return (
    <span
      {...props}
      role="checkbox"
      aria-checked={checked}
      className={cn(
        "inline-flex items-center justify-center min-w-3 min-h-3",
        "has-focus-visible:ring-2 has-focus-visible:ring-ring ",
        "[&_svg:not([class*='size-'])]:size-3 [&_svg]:stroke-4 ",
        "transition-colors duration-300 aria-checked:bg-primary text-background",
        "border border-border rounded-sm",
        className,
      )}
    >
      {children}
    </span>
  );
}

export interface CheckboxLabelProps extends Omit<React.ComponentProps<"label">, "className"> {
  className?: ClassNameValue;
}

export function CheckboxLabel({ className, children, ...props }: CheckboxLabelProps) {
  return (
    <label
      {...props}
      className={cn(
        "flex items-center gap-4 select-none font-medium",
        className,
      )}
    >
      {children}
    </label>
  );
}

export interface CheckboxProps extends Omit<CheckboxRootProps, "className" | "style" | "styles"> {
  className?: ClassNameValue;
  style?: React.CSSProperties;
  onCheckedChange?: (checked: boolean) => void;
  indicator?: React.ReactNode;
  classNames?: {
    indicator?: ClassNameValue;
    label?: ClassNameValue;
  };
  styles?: {
    indicator?: React.CSSProperties;
    label?: React.CSSProperties;
  };
}

export const Checkbox = ({
  className,
  style,
  children,
  checked,
  defaultChecked,
  onChange,
  onCheckedChange,
  disabled,
  classNames,
  styles,
  indicator,
  ...props
}: CheckboxProps) => {
  const [_checked, setChecked] = React.useState(defaultChecked ?? false);
  const isControlled = checked !== undefined;
  const checked$ = isControlled ? checked : _checked;
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e);
    const next = e.target.checked;
    if (!isControlled) {
      setChecked(next);
    }
    onCheckedChange?.(next);
  };
  return (
    <CheckboxLabel className={cn(classNames?.label, className)} style={style}>
      <CheckboxIndicator
        checked={checked$}
        aria-disabled={disabled}
        className={classNames?.indicator}
        style={styles?.indicator}
      >
        <CheckboxRoot {...props} disabled={disabled} checked={checked$} onChange={handleChange} />
        {indicator ?? <Check />}
      </CheckboxIndicator>
      {children}
    </CheckboxLabel>
  );
};

export interface CheckboxOptionConfig extends Omit<CheckboxProps, "children"> {
  label: string;
  value: string;
}

export interface CheckboxOptionGroup {
  group: string;
  options: CheckboxOptionConfig[];
}

export interface CheckboxGroupProps {
  options: (CheckboxOptionConfig | CheckboxOptionGroup)[];
  value?: string[];
  defaultValue?: string[];
  onChange?: (values: string[]) => void;
  name?: string;
  disabled?: boolean;
  className?: ClassNameValue;
  common?: {
    classNames?: {
      indicator?: ClassNameValue;
      label?: ClassNameValue;
    };
    styles?: {
      indicator?: React.CSSProperties;
      label?: React.CSSProperties;
    };
    indicator?: React.ReactNode;
  };
}

export function CheckboxGroup({
  options,
  value,
  defaultValue = [],
  onChange,
  name,
  disabled,
  className,
  common,
}: CheckboxGroupProps) {
  const [_value, setValue] = React.useState<string[]>(defaultValue);
  const isControlled = value !== undefined;
  const value$ = isControlled ? value : _value;
  const selectedSet = React.useMemo(() => new Set(value$), [value$]);

  const handleToggle = (val: string) => {
    const next = selectedSet.has(val) ? value$.filter((v) => v !== val) : [...value$, val];

    if (!isControlled) {
      setValue(next);
    }
    onChange?.(next);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (
      e.key !== "ArrowDown" &&
      e.key !== "ArrowUp" &&
      e.key !== "ArrowRight" &&
      e.key !== "ArrowLeft"
    ) {
      return;
    }
    const target = e.target as HTMLElement;
    if (target.tagName !== "INPUT") return;
    const inputs = Array.from(
      e.currentTarget.querySelectorAll<HTMLInputElement>('input[type="checkbox"]:not(:disabled)'),
    );
    const index = inputs.indexOf(target as HTMLInputElement);
    if (index === -1) return;
    e.preventDefault();
    const delta = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : -1;
    inputs[(index + delta + inputs.length) % inputs.length]?.focus();
  };

  return (
    <div className={cn("flex flex-col gap-2", className)} onKeyDown={handleKeyDown}>
      {options.map((item) =>
        "group" in item ? (
          <div key={item.group} className="flex flex-col gap-2">
            <span className="px-1 text-xs font-medium text-muted-foreground">{item.group}</span>
            {item.options.map((option) => (
              <Checkbox
                key={option.value}
                value={option.value}
                disabled={disabled || option.disabled}
                name={name}
                checked={selectedSet.has(option.value)}
                onCheckedChange={() => handleToggle(option.value)}
                classNames={option.classNames ?? common?.classNames}
                styles={option.styles ?? common?.styles}
                indicator={option.indicator ?? common?.indicator}
              >
                {option.label}
              </Checkbox>
            ))}
          </div>
        ) : (
          <Checkbox
            key={item.value}
            value={item.value}
            disabled={disabled || item.disabled}
            name={name}
            checked={selectedSet.has(item.value)}
            onCheckedChange={() => handleToggle(item.value)}
            classNames={item.classNames ?? common?.classNames}
            styles={item.styles ?? common?.styles}
            indicator={item.indicator ?? common?.indicator}
          >
            {item.label}
          </Checkbox>
        ),
      )}
    </div>
  );
}

Checkbox.Group = CheckboxGroup;
