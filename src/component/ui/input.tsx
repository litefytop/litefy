import { ClassNameValue, cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { useRef, useState } from "react";

type WithDataAttributes<T> = T & {
  [key: `data-${string}`]: string | number | boolean | null | undefined;
    className?: ClassNameValue;
};

export type InputProps = Omit<
  React.ComponentProps<"input">,
  "value" | "onChange"
> & {
  value?: string;
  className?: ClassNameValue;
  label?: ReactNode;
  description?: ReactNode;
  invalid?: ReactNode;
  leading?: ReactNode;
  trailing?: ReactNode;
  itemProps?: {
    label?: WithDataAttributes<React.ComponentProps<"label">>;
    group?: WithDataAttributes<React.ComponentProps<"div">>;
    leading?: WithDataAttributes<React.ComponentProps<"span">>;
    trailing?: WithDataAttributes<React.ComponentProps<"span">>;
    invalid?: WithDataAttributes<React.ComponentProps<"div">>;
    description?: WithDataAttributes<React.ComponentProps<"small">>;
  };
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => void | { invalid?: string };
};

function Input({
  className,
  label,
  description,
  invalid: externalInvalid,
  leading,
  trailing,
  itemProps,
  onChange,
  value,
  ...props
}: InputProps) {
  const innerRef = useRef<HTMLInputElement>(null);
  const [internalInvalid, setInternalInvalid] = useState<string | undefined>();

  const finalInvalid = externalInvalid ?? internalInvalid;
  const isInvalid = Boolean(finalInvalid);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      <div
        {...itemProps?.group}
        data-invalid={isInvalid}
        className={cn(
          "border-input bg-background flex  px-2 items-center rounded-full border shadow-xs outline-none",
          "has-[>input:disabled]:pointer-events-none has-[>input:disabled]:cursor-not-allowed has-[>input:disabled]:opacity-50",
          "has-focus:border-primary has-focus:ring-2 has-focus:ring-primary/20",
          "data-[invalid=true]:border-destructive data-[invalid=true]:ring-destructive/20",
          itemProps?.group?.className,
        )}
      >
        {leading && (
          <span
            {...itemProps?.leading}
            className={cn(
              "shrink-0 text-muted-foreground [&>svg]:w-4 [&>svg]:h-4 [&>svg]:shrink-0 px-2",
              itemProps?.leading?.className,
            )}
          >
            {leading}
          </span>
        )}
        <input
          {...props}
          ref={innerRef}
          value={value}
          onChange={handleChange}
          className={cn(
            "appearance-none outline-none border-0 bg-transparent  h-8 px-2 py-1 text-sm flex-1 min-w-0",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "placeholder:text-muted-foreground",
            "selection:bg-primary selection:text-primary-foreground",
          )}
          autoComplete="off"
          aria-invalid={isInvalid}
          data-invalid={isInvalid}
        />
        {trailing && (
          <span
            {...itemProps?.trailing}
            className={cn(
              "shrink-0 text-muted-foreground [&>svg]:w-4 [&>svg]:h-4 [&>svg]:shrink-0 px-2",
              itemProps?.trailing?.className,
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
          (isInvalid ? itemProps?.invalid : itemProps?.description)?.className,
        )}
        role={isInvalid ? "alert" : undefined}
      >
        {isInvalid ? finalInvalid : description}
      </small>
    </div>
  );
}

export { Input };
