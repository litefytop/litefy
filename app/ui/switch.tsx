import { useId, useState } from "react";
import { type ClassNameValue, cn } from "@/lib";

type HTMLAttrs<T> = Omit<T, "className" | "children"> & {
  [key: `data-${string}`]: string | number | boolean | null | undefined;
  className?: ClassNameValue;
};

export type SwitchProps = Omit<
  React.ComponentProps<"input">,
  "type" | "className"
> & {
  onCheckedChange?: (checked: boolean) => void;

  slotProps?: {
    wrapper?: HTMLAttrs<Omit<React.ComponentProps<"label">, "htmlFor">>;
    track?: HTMLAttrs<React.ComponentProps<"span">>;
    thumb?: HTMLAttrs<React.ComponentProps<"span">>;
  };
};

export function Switch({
  children,
  checked: controlledChecked,
  defaultChecked = false,
  onCheckedChange,
  disabled,
  slotProps = {},
  name,
  value,
  ...props
}: SwitchProps) {
  const id = useId();
  const inputId = props.id ?? id;
  const [uncontrolledChecked, setUncontrolledChecked] =
    useState(defaultChecked);
  const isControlled = controlledChecked !== undefined;
  const checked = isControlled ? controlledChecked : uncontrolledChecked;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newChecked = e.target.checked;
    if (!isControlled) setUncontrolledChecked(newChecked);
    onCheckedChange?.(newChecked);
  };

  const {
    wrapper: wrapperSlot,
    track: trackSlot,
    thumb: thumbSlot,
  } = slotProps;

  return (
    <label
      {...wrapperSlot}
      inert={disabled || wrapperSlot?.inert}
      className={cn(
        "inline-flex items-center gap-2",
        "inert:cursor-not-allowed inert:opacity-50",
        wrapperSlot?.className,
      )}
    >
      <span
        {...trackSlot}
        data-checked={checked || undefined}
        className={cn(
          "relative inline-flex shrink-0 items-center rounded-full transition-colors duration-200 w-10 h-5",
          "has-focus-visible:outline-none has-focus-visible:ring-2 has-focus-visible:ring-ring has-focus-visible:ring-offset-2",
          "bg-input data-checked:bg-primary",
          trackSlot?.className,
        )}
      >
        <input
          {...props}
          id={inputId}
          type="checkbox"
          name={name}
          value={value}
          checked={checked}
          disabled={disabled}
          onChange={handleChange}
          className="peer sr-only"
        />
        <span
          {...thumbSlot}
          className={cn(
            "pointer-events-none inline-block rounded-full bg-white shadow-lg ring-0 transition-transform duration-200",
            "peer-checked:translate-x-5",
            "w-4 h-4",
            thumbSlot?.className,
          )}
        />
      </span>
      {children}
    </label>
  );
}
