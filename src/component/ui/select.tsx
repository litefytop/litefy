import { ClassNameValue, cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

type SelectOption = {
  label: string;
  value: string;
};

type SelectOptionGroup = {
  group: string;
  options: SelectOption[];
};

type BaseSelectProps = Omit<
  React.ComponentProps<"select">,
  "className" | "value" | "defaultValue"
> & {
  className?: ClassNameValue;
  invalid?: boolean;
  options: (SelectOption | SelectOptionGroup)[];
  placeholder?: string;
};

type SingleSelectProps = BaseSelectProps & {
  multiple?: false;
  value?: string;
  defaultValue?: string;
};

type MultipleSelectProps = BaseSelectProps & {
  multiple: true;
  value?: string[];
  defaultValue?: string[];
};

export type SelectProps = SingleSelectProps | MultipleSelectProps;

const optionClass =
  "my-0.5 px-2 py-2.5 rounded-md";

export function Select({
  className,
  invalid,
  options,
  placeholder,
  multiple,
  onChange,
  ...props
}: SelectProps) {
  const selectRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    if (!multiple || !selectRef.current) return;

    const valueArray = (props.value as string[]) ?? [];
    const optionElements = Array.from(selectRef.current.options);
    for (const opt of optionElements) {
      opt.selected = valueArray.includes(opt.value);
    }
  }, [multiple, props.value]);

  const wrapEvent = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (multiple) {
      const selectedValues = Array.from(e.target.selectedOptions).map(
        (opt) => opt.value,
      );
      const jsonValue = JSON.stringify(selectedValues);
      Object.defineProperty(e.target, "value", {
        value: jsonValue,
        writable: true,
        configurable: true,
      });
    }
    return e;
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const event = wrapEvent(e);
    onChange?.(event);
  };

  const handleBlur = (e: React.FocusEvent<HTMLSelectElement>) => {
    if (multiple) {
      const selectedValues = Array.from(e.target.selectedOptions).map(
        (opt) => opt.value,
      );
      Object.defineProperty(e.target, "value", {
        value: JSON.stringify(selectedValues),
        writable: true,
        configurable: true,
      });
    }
    props.onBlur?.(e);
  };

  const handleInput = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (multiple) {
      const selectedValues = Array.from(e.target.selectedOptions).map(
        (opt) => opt.value,
      );
      Object.defineProperty(e.target, "value", {
        value: JSON.stringify(selectedValues),
        writable: true,
        configurable: true,
      });
    }
    props.onInput?.(e);
  };

  const defaultSelected = multiple
    ? (props.defaultValue as string[] | undefined)
    : undefined;

  return (
    <select
      {...props}
      ref={selectRef}
      multiple={multiple}
      onChange={handleChange}
      onBlur={handleBlur}
      onInput={handleInput}
      className={cn(
        "select-enhanced appearance-none border bg-background/75 rounded-md w-sm h-9 py-1 px-3 text-sm flex-1 items-center",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "[[multiple]]:rounded-xl [[multiple]]:overflow-y-auto [[multiple]]:h-fit [[multiple]]:max-h-1/2",
        "data-[invalid=true]:border-destructive data-[invalid=true]:text-destructive",
        className,
      )}
      aria-invalid={invalid}
      data-invalid={invalid ? true : undefined}
    >
      {placeholder && (
        <option className={optionClass} hidden disabled>
          {placeholder}
        </option>
      )}

      {options.map((item, index) => {
        if ("group" in item) {
          return (
            <optgroup
              key={`group-${index}`}
              label={item.group}
              className="my-2 "
            >
              {item.options.map((opt) => (
                <option
                  key={opt.value}
                  value={opt.value}
                  className={cn(optionClass)}
                
                  selected={
                    multiple &&
                    defaultSelected &&
                    defaultSelected.includes(opt.value)
                      ? true
                      : undefined
                  }
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
            selected={
              multiple &&
              defaultSelected &&
              defaultSelected.includes(item.value)
                ? true
                : undefined
            }
          >
            {item.label}
          </option>
        );
      })}
    </select>
  );
}
