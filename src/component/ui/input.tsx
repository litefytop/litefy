import { ClassNameValue, cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { useId, useRef, useState } from "react";

type WithDataAttributes<T> = T & {
  [key: `data-${string}`]: string | number | boolean | null | undefined;
  className?: ClassNameValue;
};

export type InputProps = Omit<
  React.ComponentProps<"input">,
  "onChange" | "type"
> & {
  type?: "text" | "email" | "url" | "tel" | "search";
  value?: string;
  label?: ReactNode;
  description?: ReactNode;
  invalid?: ReactNode;
  leading?: ReactNode;
  trailing?: ReactNode;
  itemProps?: {
    root?: WithDataAttributes<React.ComponentProps<"div">>;
    label?: WithDataAttributes<React.ComponentProps<"label">>;
    group?: WithDataAttributes<React.ComponentProps<"div">>;
    leading?: WithDataAttributes<React.ComponentProps<"span">>;
    trailing?: WithDataAttributes<React.ComponentProps<"span">>;
    invalid?: WithDataAttributes<React.ComponentProps<"small">>;
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
  ...props
}: InputProps) {
  const innerRef = useRef<HTMLInputElement>(null);
  const [internalInvalid, setInternalInvalid] = useState<string | undefined>();
  const internalId = useId();
  const id = props.id ?? internalId;

  const finalInvalid = externalInvalid ?? internalInvalid;
  const isInvalid = Boolean(finalInvalid);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const res = onChange?.(e);
    setInternalInvalid(res?.invalid);
  };

  return (
    <div
      {...itemProps?.root}
      className={cn("flex flex-col gap-1", itemProps?.root?.className)}
    >
      {label && (
        <label
          {...itemProps?.label}
          data-disabled={props.disabled}
          htmlFor={id}
          className={cn(
            "text-sm font-medium leading-none",
            "data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-70 indent-2 py-1",
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
          "flex px-2 h-9 items-center border shadow-xs outline-none border-input bg-background rounded-full",
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
          onChange={handleChange}
          id={id}
          className={cn(
            "appearance-none outline-none border-0 bg-transparent px-2 py-1 flex-1",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "placeholder:text-muted-foreground",
            "selection:bg-primary selection:text-primary-foreground",
            className,
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
        data-disabled={props.disabled}
        className={cn(
          "text-sm indent-2 h-5 text-muted-foreground ",
          "data-[invalid=true]:text-destructive data-[disabled=true]:opacity-70",
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
