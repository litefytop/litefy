import { ClassNameValue, cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

type WithDataAttributes<T> = T & {
  [key: `data-${string}`]: string | number | boolean | null | undefined;
};

type SelectOption = {
  label: string;
  value: string;
};

type SelectOptionGroup = {
  group: string;
  options: SelectOption[];
};

export type SelectProps = Omit<
  React.ComponentProps<"select">,
  "className" | "onChange"
> & {
  className?: ClassNameValue;
  label?: ReactNode;
  description?: ReactNode;
  invalid?: ReactNode;
  leading?: ReactNode;
  trailing?: ReactNode;
  options: (SelectOption | SelectOptionGroup)[];
  placeholder?: string;
  itemProps?: {
    label?: WithDataAttributes<React.ComponentProps<"label">>;
    group?: WithDataAttributes<React.ComponentProps<"div">>;
    leading?: WithDataAttributes<React.ComponentProps<"span">>;
    trailing?: WithDataAttributes<React.ComponentProps<"span">>;
    invalid?: WithDataAttributes<React.ComponentProps<"small">>;
    description?: WithDataAttributes<React.ComponentProps<"small">>;
  };
  onChange?: (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => void | { invalid?: string };
};

const selectPickerStyle = `
select,
::picker(select) {
  appearance: base-select;
}
::picker(select) {
  background: var(--background);
  border-radius: calc(var(--radius) - 2px);
  padding: 4px;
  margin-block: 4px;
  border: 1px solid var(--border);
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

export function Select({
  className,
  label,
  description,
  invalid: externalInvalid,
  leading,
  trailing,
  options,
  placeholder,
  itemProps,
  onChange,
  value,
  ...props
}: SelectProps) {
  const [internalInvalid, setInternalInvalid] = useState<string | undefined>();

  const finalInvalid = externalInvalid ?? internalInvalid;
  const isInvalid = Boolean(finalInvalid);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const res = onChange?.(e);
    setInternalInvalid(res?.invalid);
  };
  useEffect(() => {
    const styleId = "select-picker-custom-style";
    if (document.getElementById(styleId)) return;
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = selectPickerStyle;
    document.head.appendChild(style);
  }, []);

  return (

      <div className={cn("flex flex-col gap-1", className)}>
        {label && (
          <label
            {...itemProps?.label}
            className={cn(
              "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 py-1 indent-2",
              itemProps?.label?.className
            )}
          >
            {label}
          </label>
        )}

        <div
          {...itemProps?.group}
          data-invalid={isInvalid}
          className={cn(
            "border-input bg-background flex w-3xs truncate min-h-9 items-center rounded-md border shadow-xs outline-none has-[>select:disabled]:pointer-events-none has-[>select:disabled]:cursor-not-allowed has-[>select:disabled]:opacity-50 data-[invalid=true]:ring-destructive/20 data-[invalid=true]:border-destructive",
            itemProps?.group?.className
          )}
        >
          {leading && (
            <span
              {...itemProps?.leading}
              className={cn(
                "shrink-0 text-muted-foreground [&>svg]:w-4 [&>svg]:h-4 [&>svg]:shrink-0 px-2",
                itemProps?.leading?.className
              )}
            >
              {leading}
            </span>
          )}

          <select
            {...props}
            value={value}
            onChange={handleChange}
            className={cn(
              "appearance-none outline-none w-full py-2 px-3 text-sm flex-1 min-w-0 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground data-[invalid=false]:focus-visible:border-ring data-[invalid=false]:focus-visible:ring-ring/50 data-[invalid=false]:focus-visible:ring-[3px]",
            )}
            autoComplete="off"
            aria-invalid={isInvalid}
            data-invalid={isInvalid}
          >
            {placeholder && (
              <option value="" disabled hidden>
                {placeholder}
              </option>
            )}

            {options.map((item, index) => {
              if ("group" in item) {
                return (
                  <optgroup
                    key={`group-${index}`}
                    label={item.group}
                    className="my-2 [&::label]:bg-muted [&::label]:text-foreground [&::label]:px-2 [&::label]:py-1 [&::label]:font-medium"
                  >
                    {item.options.map((opt) => (
                      <option
                        key={opt.value}
                        value={opt.value}
                        className="my-0.5 px-3 py-1.5 w-full truncate rounded-md hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground selected:bg-primary selected:text-primary-foreground"
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
                  className="my-0.5 px-3 py-1.5 rounded-md hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground selected:bg-primary selected:text-primary-foreground"
                >
                  {item.label}
                </option>
              );
            })}
          </select>

          {trailing && (
            <span
              {...itemProps?.trailing}
              className={cn(
                "shrink-0 text-muted-foreground [&>svg]:w-4 [&>svg]:h-4 [&>svg]:shrink-0 px-2",
                itemProps?.trailing?.className
              )}
            >
              {trailing}
            </span>
          )}
        </div>

        <small
          data-invalid={isInvalid}
          {...(isInvalid ? itemProps?.invalid : itemProps?.description)}
          className={cn(
            "text-sm indent-2 h-5 text-muted-foreground data-[invalid=true]:text-destructive",
            (isInvalid ? itemProps?.invalid : itemProps?.description)?.className
          )}
          role={isInvalid ? "alert" : undefined}
        >
          {isInvalid ? finalInvalid : description}
        </small>
      </div>
  
  );
}
