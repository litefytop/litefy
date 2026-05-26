import { ClassNameValue, cn } from "@/lib";
import {
  useActionState,
  useRef,
  useEffect,
  createContext,
  useContext,
} from "react";

type FormContextType = {
  isPending: boolean;
};

const FormContext = createContext<FormContextType>({
  isPending: false,
});

type FormProps = React.ComponentProps<"form"> & {
  onSubmit: (formData: FormData) => Promise<boolean>;
};

export function Form({
  children,
  onSubmit,
  className,
  ref,
  ...rest
}: FormProps) {
  const internalRef = useRef<HTMLFormElement>(null);

  const action = async (prevCount: number, formData: FormData) => {
    const success = await onSubmit(formData);
    return success ? prevCount + 1 : prevCount;
  };

  const [count, formAction, isPending] = useActionState(action, 0);

  useEffect(() => {
    if (count > 0) {
      internalRef.current?.reset();
    }
  }, [count]);

  const mergedRef = (node: HTMLFormElement) => {
    internalRef.current = node;
    if (typeof ref === "function") {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  };

  return (
    <FormContext.Provider value={{ isPending }}>
      <form ref={mergedRef} action={formAction} className={className} {...rest}>
        {children}
      </form>
    </FormContext.Provider>
  );
}

type FormSubmitProps = React.ComponentProps<"button"> & {
  loading?: boolean;
};

function FormSubmit({
  children,
  className,
  ref,
  loading,
  ...rest
}: FormSubmitProps) {
  const { isPending } = useContext(FormContext);

  return (
    <button
      type="submit"
      disabled={isPending || loading}
      ref={ref}
      className={cn(
        "cursor-pointer outline-none inline-flex items-center justify-center shrink-0 select-none [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 h-9 min-w-9 px-3 py-1 has-[>svg]:px-2 gap-1 rounded-md",
        className,
      )}
      {...rest}
    >
      {isPending || loading ? "Loading..." : children}
    </button>
  );
}

Form.Submit = FormSubmit;

import type { ReactNode } from "react";
import { useId, useState } from "react";

type WithDataAttributes<T> = T & {
  [key: `data-${string}`]: string | number | null | undefined | true;
  className?: ClassNameValue;
};
type FormFieldArg = {
  id: string;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
};

export type FormFieldProps = Omit<React.ComponentProps<"div">, "children"> & {
  label?: ReactNode;
  description?: ReactNode;
  invalid?: ReactNode;
  disabled?: boolean;
  direction?: "vertical" | "horizontal";
  itemProps?: {
    label?: WithDataAttributes<React.ComponentProps<"label">>;
    invalid?: WithDataAttributes<React.ComponentProps<"small">>;
    description?: WithDataAttributes<React.ComponentProps<"small">>;
  };
  name: string;
  children?: (Field: FormFieldArg) => React.ReactNode;
  validConfig?: {
    validate?: (value: string | number) => string | boolean | null | undefined;
    trigger?: "onChange" | "onBlur" | "onInput";
  };
};
function FormField({
  className,
  label,
  name,
  description,
  invalid: externalInvalid,
  direction = "vertical",
  itemProps,
  disabled,
  children,
  validConfig,
  ...props
}: FormFieldProps) {
  const [internalInvalid, setInternalInvalid] = useState<
    string | boolean | null | undefined
  >();
  const finalInvalid = externalInvalid ?? internalInvalid;
  const isInvalid = Boolean(finalInvalid);
  const hasInvalidContent = typeof finalInvalid === "string";
  const internalId = useId();
  const inputId = props?.id || internalId;
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (validConfig?.trigger === "onChange") {
      const invalid = validConfig?.validate?.(e.target.value);
      setInternalInvalid(invalid);
    }
  };
  const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (validConfig?.trigger === "onBlur") {
      const invalid = validConfig?.validate?.(e.target.value);
      setInternalInvalid(invalid);
    }
  };
  const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (validConfig?.trigger === "onInput") {
      const invalid = validConfig?.validate?.(e.target.value);
      setInternalInvalid(invalid);
    }
  };

  return (
    <div
      {...props}
      inert={disabled}
      data-invalid={isInvalid ? true : undefined}
      data-direction={direction}
      className={cn(
        "grid gap-1 group inert:cursor-not-allowed inert:opacity-50 items-center",
        "data-[direction=vertical]:grid-cols-1",
        "data-[direction=horizontal]:grid-cols-[128px_1fr]",
        className,
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
      {children?.({
        id: inputId,
        name,
        onChange,
        onBlur,
        onInput,
      })}
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

Form.Field = FormField;
