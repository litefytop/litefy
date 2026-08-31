import { ChevronDown } from "lucide-react";
import { type ClassNameValue, cn } from "@/lib";

export type SelectOption = {
  label: string;
  value: string;
};

export type SelectOptionGroup = {
  group: string;
  options: SelectOption[];
};

export interface SelectGroupProps extends Omit<React.ComponentProps<"div">, "className"> {
  className?: ClassNameValue;
}

export function SelectGroup({ className, ...props }: SelectGroupProps) {
  return <div {...props} className={cn("relative", className)} />;
}

export interface SelectRootProps extends Omit<React.ComponentProps<"select">, "className"> {
  className?: ClassNameValue;
  invalid?: boolean;
}

export function SelectRoot({ className, invalid, ...props }: SelectRootProps) {
  return (
    <select
      {...props}
      aria-invalid={invalid}
      data-invalid={invalid ? true : undefined}
      className={cn(
        "appearance-none border bg-background/75 rounded-md w-full min-w-3xs max-w-sm h-9 py-1 px-3 text-sm flex-1 items-center peer",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "data-[invalid=true]:border-destructive data-[invalid=true]:text-destructive",
        className,
      )}
    />
  );
}

export interface SelectIconProps extends Omit<React.ComponentProps<"span">, "className"> {
  className?: ClassNameValue;
}

export function SelectIcon({ className, children, ...props }: SelectIconProps) {
  return (
    <span
      {...props}
      aria-hidden
      className={cn("absolute top-1/2 right-2 -translate-y-1/2 flex items-center", className)}
    >
      {children ?? <ChevronDown className="size-4 peer-focus:rotate-180" />}
    </span>
  );
}

export interface SelectProps extends Omit<SelectRootProps, "className" | "children" | "invalid"> {
  invalid?: boolean;
  options: (SelectOption | SelectOptionGroup)[];
  placeholder?: string;
  classNames?: {
    group?: ClassNameValue;
    root?: ClassNameValue;
    icon?: ClassNameValue;
  };
  styles?: {
    group?: React.CSSProperties;
    root?: React.CSSProperties;
    icon?: React.CSSProperties;
  };
}

export function Select({
  invalid,
  options,
  placeholder,
  value,
  defaultValue = "",
  classNames,
  styles,
  ...props
}: SelectProps) {
  const isControlled = value !== undefined;

  return (
    <SelectGroup
      className={classNames?.group}
      style={styles?.group}
      data-invalid={invalid || undefined}
    >
      <SelectRoot
        {...props}
        invalid={invalid}
        {...(isControlled ? { value } : { defaultValue })}
        className={classNames?.root}
        style={styles?.root}
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
      </SelectRoot>
      <SelectIcon className={classNames?.icon} style={styles?.icon} />
    </SelectGroup>
  );
}
