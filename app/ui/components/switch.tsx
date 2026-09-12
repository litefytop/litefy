import * as React from "react";
import { type ClassNameValue, cn } from "../utils/cn";

export interface SwitchRootProps extends Omit<React.ComponentProps<"input">, "type" | "className"> {
  className?: ClassNameValue;
}

export function SwitchRoot({ className, ...props }: SwitchRootProps) {
  return <input {...props} type="checkbox" className={cn("sr-only", className)} />;
}

export interface SwitchTrackProps extends Omit<React.ComponentProps<"span">, "className"> {
  className?: ClassNameValue;
  checked?: boolean;
}

export function SwitchTrack({ className, checked, ...props }: SwitchTrackProps) {
  return (
    <span
      {...props}
      data-checked={checked || undefined}
      className={cn(
        "relative inline-flex shrink-0 items-center rounded-full transition-colors duration-200 w-10 h-5",
        "has-focus-visible:ring-2 has-focus-visible:ring-ring has-focus-visible:ring-offset-2",
        "data-checked:bg-primary border",
        className,
      )}
    />
  );
}

export interface SwitchThumbProps extends Omit<React.ComponentProps<"span">, "className"> {
  className?: ClassNameValue;
  checked?: boolean;
}

export function SwitchThumb({ className, checked, ...props }: SwitchThumbProps) {
  return (
    <span
      {...props}
      data-checked={checked || undefined}
      className={cn(
        "pointer-events-none inline-block rounded-full bg-white shadow-lg ring-0 transition-transform duration-200",
        "data-checked:translate-x-5",
        "w-4 h-4",
        className,
      )}
    />
  );
}

export interface SwitchLabelProps extends Omit<React.ComponentProps<"label">, "className"> {
  className?: ClassNameValue;
}

export function SwitchLabel({ className, ...props }: SwitchLabelProps) {
  return <label {...props} className={cn("inline-flex items-center gap-2", className)} />;
}

export interface SwitchProps extends Omit<SwitchRootProps, "className"> {
  onCheckedChange?: (checked: boolean) => void;
  classNames?: {
    label?: ClassNameValue;
    track?: ClassNameValue;
    thumb?: ClassNameValue;
  };
  styles?: {
    label?: React.CSSProperties;
    track?: React.CSSProperties;
    thumb?: React.CSSProperties;
  };
}

export const Switch = ({
  children,
  checked: controlledChecked,
  defaultChecked = false,
  onCheckedChange,
  disabled,
  classNames,
  styles,
  ...props
}: SwitchProps) => {
  const [uncontrolledChecked, setUncontrolledChecked] = React.useState(defaultChecked);
  const isControlled = controlledChecked !== undefined;
  const checked = isControlled ? controlledChecked : uncontrolledChecked;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.checked;
    if (!isControlled) setUncontrolledChecked(next);
    onCheckedChange?.(next);
  };

  return (
    <SwitchLabel className={classNames?.label} style={styles?.label}>
      <SwitchTrack checked={checked} className={classNames?.track} style={styles?.track}>
        <SwitchRoot {...props} checked={checked} disabled={disabled} onChange={handleChange} />
        <SwitchThumb checked={checked} className={classNames?.thumb} style={styles?.thumb} />
      </SwitchTrack>
      {children}
    </SwitchLabel>
  );
};
