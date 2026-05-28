import * as React from "react";
import { cn, ClassNameValue } from "@/lib";
import { ComponentProps } from "react";



export type DatePickerProps = Omit<ComponentProps<"input">, "type"> & {
  className?: ClassNameValue;
  invalid?: boolean;
  placeholder?: string;
  type?: "date" | "time" | "datetime-local" | "month" | "week";

  ref?: React.Ref<HTMLInputElement>;
};

export function DatePicker({
  placeholder,
  disabled,
  onChange,
  onBlur,
  value,
  className,
  type = "date",
  invalid,
  ref,
  ...props
}: DatePickerProps) {
  const internalRef = React.useRef<HTMLInputElement>(null);

  const inputRef = (ref ?? internalRef) as React.RefObject<HTMLInputElement>;

  const internalId = React.useId();
  const inputId = props.id ?? internalId;

  React.useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    if (value) {
      el.setAttribute("value", value as string);
    } else {
      el.removeAttribute("value");
    }
  }, [value, inputRef]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e);

    const val = e.target.value;
    if (val) e.currentTarget.setAttribute("value", val);
    else e.currentTarget.removeAttribute("value");
  };

  return (
    <input
      {...props}
      ref={inputRef}
      id={inputId}
      type={type}
      disabled={disabled}
      value={value}
      onChange={handleChange}
      onBlur={onBlur}
      placeholder={placeholder}
      data-invalid={invalid ? true : undefined}
      aria-invalid={invalid}
      className={cn(
        "h-9 w-sm rounded-md border border-input bg-background px-3 relative",
        "focus:outline-none focus:ring-1 focus:ring-ring",
        "disabled:opacity-50 disabled:pointer-events-none",
        "data-invalid:border-destructive",
        "[&:not([value])::-webkit-datetime-edit]:opacity-0  invalid:[&:not([value])::-webkit-datetime-edit]:opacity-100",
        "[[value]::-webkit-datetime-edit]:opacity-100",
        "before:absolute before:left-3 before:top-1/2 before:-translate-y-1/2 before:text-muted-foreground before:pointer-events-none",
        "before:content-[attr(placeholder)] [[value]]:before:content-[''] invalid:before:content-['']",
        className,
      )}
    />
  );
}
