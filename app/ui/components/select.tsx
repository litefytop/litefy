import { ChevronDown } from "lucide-react";
import { type ClassNameValue, cn } from "@/lib";

type SelectOption = {
  label: string;
  value: string;
};

type SelectOptionGroup = {
  group: string;
  options: SelectOption[];
};

interface SelectProps
  extends Omit<React.ComponentProps<"select">, "className"> {
  className?: ClassNameValue;
  invalid?: boolean;
  options: (SelectOption | SelectOptionGroup)[];
  placeholder?: string;
}

export function Select({
  className,
  invalid,
  options,
  placeholder,
  defaultValue = "",
  onChange,
  ...props
}: SelectProps) {
  return (
    <div className="relative">
      <select
        {...props}
        defaultValue={defaultValue}
        onChange={(e) => {
          onChange?.(e);
        }}
        className={cn(
          "appearance-none border bg-background/75 rounded-md w-full min-w-3xs max-w-sm h-9 py-1 px-3 text-sm flex-1 items-center peer",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "data-[invalid=true]:border-destructive data-[invalid=true]:text-destructive",
          className,
        )}
        aria-invalid={invalid}
        data-invalid={invalid ? true : undefined}
      >
        {placeholder && (
          <option hidden disabled>
            {placeholder}
          </option>
        )}
        {options.length === 0 && (
          <option hidden disabled>
            No options available
          </option>
        )}
        {options.map((item) => {
          if ("group" in item) {
            return (
              <optgroup key={item.group} label={item.group}>
                {item.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </optgroup>
            );
          }
          return (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          );
        })}
      </select>
      <ChevronDown className="absolute top-1/2 right-2 transform -translate-y-1/2 size-4 peer-focus:rotate-180" />
    </div>
  );
}
