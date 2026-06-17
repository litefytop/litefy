import { ChevronDown } from "lucide-react";
import { useRef } from "react";
import { type ClassNameValue, cn } from "@/lib";

type SelectOption = {
  label: string;
  value: string;
};

type SelectOptionGroup = {
  group: string;
  options: SelectOption[];
};

export interface MultiSelectProps
  extends Omit<React.ComponentProps<"select">, "className" | "multiple"> {
  onValueChange?: (values: string[]) => void;
  emptyFallback?: string;
  className?: ClassNameValue;
  invalid?: boolean;
  options: (SelectOption | SelectOptionGroup)[];
}

const optionClass = "my-0.5 px-2 py-2.5";

export function MultiSelect({
  className,
  invalid,
  options,
  defaultValue = [],
  onValueChange,
  emptyFallback = "No options available...",
  ...props
}: MultiSelectProps) {
  const selectRef = useRef<HTMLSelectElement>(null);

  const handleChange = () => {
    if (!selectRef.current) return;
    const newValues = Array.from(selectRef.current.selectedOptions).map(
      (opt) => opt.value,
    );
    onValueChange?.(newValues);
  };

  const hasOptions = options.length > 0;

  return (
    <div className="relative">
      <select
        {...props}
        size={1}
        defaultValue={props.value ? undefined : defaultValue}
        ref={selectRef}
        multiple
        onChange={handleChange}
        className={cn(
          "appearance-none border bg-background/75 rounded-md w-full min-w-3xs max-w-sm h-9 py-1 px-3 text-sm flex-1 items-center peer",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "data-[invalid=true]:border-destructive data-[invalid=true]:text-destructive",
          className,
        )}
        aria-invalid={invalid}
        data-invalid={invalid ? true : undefined}
      >
        {!hasOptions && (
          <option className={optionClass} disabled>
            {emptyFallback}
          </option>
        )}
        {hasOptions &&
          options.map((item) => {
            if ("group" in item) {
              return (
                <optgroup key={item.group} label={item.group} className="my-2">
                  {item.options.map((opt) => (
                    <option
                      key={opt.value}
                      value={opt.value}
                      className={optionClass}
                    >
                      {opt.label}
                    </option>
                  ))}
                </optgroup>
              );
            }
            return (
              <option
                key={item.value}
                value={item.value}
                className={optionClass}
              >
                {item.label}
              </option>
            );
          })}
      </select>
      <ChevronDown className="absolute top-1/2 right-2 transform -translate-y-1/2 size-4 peer-focus:rotate-180" />
    </div>
  );
}
