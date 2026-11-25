"use client";
import * as React from "react";
import { FormContext } from "./form";
export interface RadioRootProps extends Omit<React.ComponentProps<"input">, "type" | "className"> {
  className?: string;
}
export function RadioRoot(props: RadioRootProps) {
  const autoId = React.useId();
  const id = props.id ?? autoId;
  return <input {...props} id={id} type="radio" />;
}
export interface RadioIndicatorProps extends Omit<React.ComponentProps<"span">, "className"> {
  className?: string;
}
export function RadioIndicator({ className, children, ...props }: RadioIndicatorProps) {
  return (
    <span
      {...props}
      className={className}
    >
      {children}
    </span>
  );
}
export interface RadioLabelProps extends Omit<React.ComponentProps<"label">, "className"> {
  className?: string;
}
export function RadioLabel({ className, children, ...props }: RadioLabelProps) {
  return (
    <label
      {...props}
      className={className}
    >
      {children}
    </label>
  );
}
export interface RadioProps extends Omit<RadioRootProps, "className" | "style"> {
  className?: string;
  style?: React.CSSProperties;
  onCheckedChange?: (checked: boolean) => void;
  indicator?: React.ReactNode;
  classNames?: {
    input?: string;
    indicator?: string;
    label?: string;
  };
  styles?: {
    indicator?: React.CSSProperties;
    label?: React.CSSProperties;
  };
}
export const Radio = ({
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
}: RadioProps) => {
  const [_checked, setChecked] = React.useState(defaultChecked ?? false);
  const isControlled = checked !== undefined;
  const checked$ = isControlled ? checked : _checked;
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e);
    if (e.target.checked) {
      if (!isControlled) setChecked(true);
      onCheckedChange?.(true);
    }
  };
  return (
    <RadioLabel className={[classNames?.label, className].filter(Boolean).join(" ")} style={style}>
      <RadioIndicator className={classNames?.indicator} style={styles?.indicator}>
        <RadioRoot {...props} disabled={disabled} checked={checked$} onChange={handleChange} className={classNames?.input} />
        {indicator}
      </RadioIndicator>
      {children}
    </RadioLabel>
  );
};
export interface RadioOptionConfig extends Omit<RadioProps, "children"> {
  label: string;
  value: string;
}
export interface RadioGroupProps {
  options: RadioOptionConfig[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  name?: string;
  disabled?: boolean;
  label?: React.ReactNode;
  className?: string;
  classNames?: {
    root?: string;
    groupLabel?: string;
  };
  "aria-label"?: string;
  common?: {
    classNames?: {
      input?: string;
      indicator?: string;
      label?: string;
    };
    styles?: {
      indicator?: React.CSSProperties;
      label?: React.CSSProperties;
    };
    indicator?: React.ReactNode;
  };
}
export function RadioGroup({
  options,
  value,
  defaultValue,
  onValueChange,
  name,
  disabled,
  label,
  className,
  classNames,
  "aria-label": ariaLabel,
  common,
}: RadioGroupProps) {
  const [_value, setValue] = React.useState<string | undefined>(defaultValue);
  const isControlled = value !== undefined;
  const value$ = isControlled ? value : _value;
  const {
    register: registerField,
    unregister: unregisterField,
    setFormValues,
  } = React.useContext(FormContext);
  React.useEffect(() => {
    if (!name) return;
    registerField(name, null, (v) => {
      const next =
        v === null || v === undefined
          ? undefined
          : Array.isArray(v)
            ? String(v[0] ?? "")
            : String(v);
      if (!isControlled) setValue(next);
      else if (next !== undefined) onValueChange?.(next);
    });
    return () => unregisterField(name);
  }, [name, isControlled, onValueChange, registerField, unregisterField]);
  const handleSelect = (val: string) => {
    if (!isControlled) setValue(val);
    onValueChange?.(val);
    if (name) setFormValues((prev) => ({ ...prev, [name]: val }));
  };
  const labelId = `${React.useId()}-label`;
  return (
    <div
      role="radiogroup"
      aria-label={label === undefined ? ariaLabel : undefined}
      aria-labelledby={label === undefined ? undefined : labelId}
      className={[classNames?.root, className].filter(Boolean).join(" ")}
    >
      {label !== undefined && (
        <span id={labelId} className={classNames?.groupLabel}>
          {label}
        </span>
      )}
      {options.map((option) => (
        <Radio
          key={option.value}
          id={option.id}
          value={option.value}
          name={name}
          disabled={disabled || option.disabled}
          checked={value$ === option.value}
          onCheckedChange={() => handleSelect(option.value)}
          classNames={option.classNames ?? common?.classNames}
          styles={option.styles ?? common?.styles}
          indicator={option.indicator ?? common?.indicator}
        >
          {option.label}
        </Radio>
      ))}
    </div>
  );
}
