import { ClassNameValue, cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { useId, useRef, useState } from "react";

type WithDataAttributes<T> = T & {
  [key: `data-${string}`]: string | number | null | undefined | true;
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
    direction?: "vertical" | "horizontal";
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
   direction = "vertical",
  leading,
  trailing,
  itemProps,
  onChange,
  disabled,
  ...props
}: InputProps) {
  const innerRef = useRef<HTMLInputElement>(null);
  const [internalInvalid, setInternalInvalid] = useState<string | undefined>();

  const finalInvalid = externalInvalid ?? internalInvalid;
  const isInvalid = Boolean(finalInvalid);
  const hasInvalidContent = typeof finalInvalid === "string";
  const internalId = useId();
  const inputId = props?.id || internalId;
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const res = onChange?.(e);
    setInternalInvalid(res?.invalid);
  };

  return (
    <div
      {...itemProps?.root}
      inert={disabled}
      data-invalid={isInvalid ? true : undefined}
      data-direction={direction}
      className={cn(
        "grid gap-1 group inert:cursor-not-allowed inert:opacity-50 items-center",
        "data-[direction=vertical]:grid-cols-1",
        "data-[direction=horizontal]:grid-cols-[128px_1fr]",
        itemProps?.root?.className,
      )}
    >
      {label && (
        <label
          {...itemProps?.label}
          htmlFor={inputId}
          className={cn(
            "text-sm font-medium leading-none indent-2 py-1 select-none",
            "group-data-[direction=horizontal]:text-end",
            itemProps?.label?.className,
          )}
        >
          {label}
        </label>
      )}
        <div
        {...itemProps?.group}
        className={cn(
          "flex px-2 h-9 items-center border shadow-xs outline-none border-input bg-background rounded-md w-sm",
          "has-focus:border-primary has-focus:ring-2 has-focus:ring-primary/20",
          "group-data-invalid:border-destructive/20",
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
          id={inputId}
          disabled={disabled}
          className={cn(
            "appearance-none outline-none border-0 bg-transparent px-2 py-1 flex-1",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "placeholder:text-muted-foreground",
            "selection:bg-primary selection:text-primary-foreground",
            className,
          )}
          autoComplete="off"
          aria-invalid={isInvalid}
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
        {...(hasInvalidContent ? itemProps?.invalid : itemProps?.description)}
        className={cn(
          "text-sm indent-2 h-5 text-muted-foreground",
          "group-data-invalid:text-destructive",
          "group-data-[direction=horizontal]:col-start-2",
          (hasInvalidContent ? itemProps?.invalid : itemProps?.description)
            ?.className,
        )}
        role={hasInvalidContent ? "alert" : undefined}
      >
        {hasInvalidContent ? finalInvalid : description}
      </small>
    </div>
  );
}

export { Input };
