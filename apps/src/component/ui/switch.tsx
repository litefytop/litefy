import { useState, useRef, useImperativeHandle } from "react";
import { cn } from "@/lib";

export type SwitchProps = {
  children?: React.ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  name?: string;
  value?: string;
  ref?: React.Ref<HTMLInputElement>;
};

export function Switch({
  children,
  checked: controlledChecked,
  defaultChecked = false,
  onCheckedChange,
  disabled = false,
  className,
  name,
  value,
  ref,
}: SwitchProps) {
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const isControlled = controlledChecked !== undefined;
  const checked = isControlled ? controlledChecked : internalChecked;
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => inputRef.current!);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newChecked = e.target.checked;
    if (!isControlled) setInternalChecked(newChecked);
    onCheckedChange?.(newChecked);
  };

  return (
    <label
      className={cn(
        "inline-flex items-center gap-2",
        disabled && "cursor-not-allowed opacity-50",
        !disabled && "cursor-pointer",
        className,
      )}
    >
      <span
        className={cn(
          "relative inline-flex shrink-0 items-center rounded-full transition-colors duration-200",
          "w-10 h-5",
          "has-focus-visible:outline-none has-focus-visible:ring-2 has-focus-visible:ring-ring has-focus-visible:ring-offset-2",
          checked ? "bg-primary" : "bg-input",
        )}
      >
        <input
          ref={inputRef}
          type="checkbox"
          name={name}
          value={value}
          checked={checked}
          disabled={disabled}
          onChange={handleChange}
          className="peer sr-only"
        />
        <span
          className={cn(
            "pointer-events-none inline-block rounded-full bg-white shadow-lg ring-0 transition-transform duration-200",
            "peer-checked:translate-x-5",
            "w-4 h-4",
          )}
        />
      </span>
      {children && <span className="text-sm select-none">{children}</span>}
    </label>
  );
}
