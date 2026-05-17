import { ClassNameValue, cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { useState } from "react";

type WithDataAttributes<T> = T & {
  [key: `data-${string}`]: string | number | boolean | null | undefined;
    className?: ClassNameValue;
};

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
  "className" | "onChange" | "value" | "defaultValue"
> & {
  className?: ClassNameValue;
  label?: ReactNode;
  description?: ReactNode;
  invalid?: ReactNode;
  options: (SelectOption | SelectOptionGroup)[];
  placeholder?: string;
  itemProps?: {
    label?: WithDataAttributes<React.ComponentProps<"label">>;
    invalid?: WithDataAttributes<React.ComponentProps<"small">>;
    description?: WithDataAttributes<React.ComponentProps<"small">>;
  };
  onChange?: (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => void | { invalid?: string };
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
  "my-0.5 px-3 py-1.5 rounded-md text-foreground focus:bg-accent focus:text-accent-foreground";

const selectPickerStyle = `
select,
::picker(select) {
  appearance: base-select;
}
::picker(select) {
  background: var(--muted);
  border-radius: calc(var(--radius) - 2px);
  padding: 4px;
  margin-block: 4px;
  border: 1px solid var(--border);
}
select:open::picker-icon {
  rotate: 180deg;
}
@supports not (appearance: base-select) {
  body::before {
    content: "Your browser does not support 'appearance: base-select'.";
    color: black;
    background-color: wheat;
    position: fixed;
    left: 0;
    right: 0;
    top: 40%;
    text-align: center;
    padding: 1rem 0;
    z-index: 1;
  }
}
`;
const styleId = "select-picker-custom-style";
if (typeof document !== "undefined" && !document.getElementById(styleId)) {
  const style = document.createElement("style");
  style.id = styleId;
  style.textContent = selectPickerStyle;
  document.head.appendChild(style);
}
export function Select({
  className,
  label,
  description,
  invalid: externalInvalid,
  options,
  placeholder,
  itemProps,
  onChange,
  multiple,
  ...props
}: SelectProps) {
  const [internalInvalid, setInternalInvalid] = useState<string | undefined>();

  const finalInvalid = externalInvalid ?? internalInvalid;
  const isInvalid = Boolean(finalInvalid);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const res = onChange?.(e);
    setInternalInvalid(res?.invalid);
  };

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {label && (
        <label
          {...itemProps?.label}
          className={cn(
            "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 py-1 indent-2",
            itemProps?.label?.className,
          )}
        >
          {label}
        </label>
      )}

      <select
        {...props}
        multiple={multiple}
        onChange={handleChange}
        className={cn(
          "border rounded-full w-3xs py-2 px-3 text-sm flex-1  bg-input truncate",
          "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 ",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] ",
          "[[multiple]]:rounded-xl [[multiple]]:overflow-y-auto",
          "data-[invalid=true]:border-destructive data-[invalid=true]:text-destructive",
        )}
        autoComplete="off"
        aria-invalid={isInvalid}
        data-invalid={isInvalid}
      >
        {placeholder && (
          <option className={optionClass} hidden>
            {placeholder}
          </option>
        )}

        {options.map((item, index) => {
          if ("group" in item) {
            return (
              <optgroup
                key={`group-${index}`}
                label={item.group}
                className="my-2 text-foreground"
              >
                {item.options.map((opt) => (
                  <option
                    key={opt.value}
                    value={opt.value}
                    className={cn(optionClass)}
                  >
                    {opt.label}
                  </option>
                ))}
              </optgroup>
            );
          }
          return (
            <option key={item.value} value={item.value} className={optionClass}>
              {item.label}
            </option>
          );
        })}
      </select>

      <small
        data-invalid={isInvalid}
        {...(isInvalid ? itemProps?.invalid : itemProps?.description)}
        className={cn(
          "text-sm indent-2 h-5 text-muted-foreground data-[invalid=true]:text-destructive",
          (isInvalid ? itemProps?.invalid : itemProps?.description)?.className,
        )}
        role={isInvalid ? "alert" : undefined}
      >
        {isInvalid ? finalInvalid : description}
      </small>
    </div>
  );
}
