"use client";

import { ClassNameValue, cn } from "@/lib";
import { Loader2 } from "lucide-react";
import {
  useActionState,
  useRef,
  useEffect,
  createContext,
  useContext,
  useImperativeHandle,
  useCallback,
} from "react";
import type { ReactNode } from "react";
import { useId, useState } from "react";

type FormContextType = {
  isPending: boolean;
  register: (name: string, element: HTMLInputElement | null) => void;
};

const FormContext = createContext<FormContextType>({
  isPending: false,
  register: () => {},
});

type FormProps = Omit<React.ComponentProps<"form">, "onSubmit"> & {
  onSubmit: (formData: FormData) => Promise<boolean>;
  autoReset?: boolean;
  ref?: React.Ref<{
    setValue: (name: string, value: string | number) => void;
    setValues: (values: Record<string, string | number>) => void;
  }>;
};

export function Form({
  children,
  onSubmit,
  className,
  ref: externalRef,
  autoReset = true,
  ...props
}: FormProps) {
  const internalRef = useRef<HTMLFormElement>(null);
  const elementsRef = useRef<Map<string, HTMLInputElement>>(new Map());

  const register = useCallback(
    (name: string, element: HTMLInputElement | null) => {
      if (element) {
        elementsRef.current.set(name, element);
      } else {
        elementsRef.current.delete(name);
      }
    },
    [],
  );

  const setValue = useCallback((name: string, value: string | number) => {
    const element = elementsRef.current.get(name);
    if (element) {
      const oldValue = element.value;
      element.value = String(value);
      if (oldValue !== String(value)) {
        element.dispatchEvent(new Event("change", { bubbles: true }));
      }
    }
  }, []);

  const setValues = useCallback(
    (values: Record<string, string | number>) => {
      Object.entries(values).forEach(([name, value]) => setValue(name, value));
    },
    [setValue],
  );

  useImperativeHandle(externalRef, () => ({ setValue, setValues }), [
    setValue,
    setValues,
  ]);

  const action = async (prevCount: number, formData: FormData) => {
    const success = await onSubmit(formData);
    return success ? prevCount + 1 : prevCount;
  };
  const [count, formAction, isPending] = useActionState(action, 0);

  useEffect(() => {
    if (count > 0 && autoReset) {
      internalRef.current?.reset();
    }
  }, [count, autoReset]);

  return (
    <FormContext.Provider value={{ isPending, register }}>
      <form
        ref={internalRef}
        action={formAction}
        className={className}
        {...props}
      >
        {children}
      </form>
    </FormContext.Provider>
  );
}

type FormSubmitProps = React.ComponentProps<"button"> & {
  loadingIcon?: React.ReactNode;
};

function FormSubmit({
  children,
  className,
  ref,
  loadingIcon,
  ...props
}: FormSubmitProps) {
  const { isPending } = useContext(FormContext);

  return (
    <button
      type="submit"
      disabled={isPending}
      ref={ref}
      className={cn(
        "border border-input cursor-pointer outline-none inline-flex items-center justify-center shrink-0 select-none [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 h-9 min-w-9 px-3 py-1 has-[>svg]:px-2 gap-1 rounded-md",
        className,
      )}
      {...props}
    >
      {isPending && (loadingIcon ?? <Loader2 className="animate-spin" />)}
      {children}
    </button>
  );
}

Form.Submit = FormSubmit;

type WithDataAttributes<T> = T & {
  [key: `data-${string}`]: string | number | null | undefined | true;
  className?: ClassNameValue;
};

type FormFieldArg = {
  id: string;
  name: string;
  ref: (el: HTMLInputElement | null) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  invalid: boolean;
  "aria-describedby": string;
};

export type FormFieldProps<T  > = Omit<
  React.ComponentProps<"div">,
  "children"
> & {
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
  inputId?: string;
  name: string;
  children?: (field: FormFieldArg) => React.ReactNode;
  validConfig?: {
    validate?: (event: T) => string | boolean | null | undefined;
    trigger?: "onChange" | "onBlur" | "onInput";
  };
};

function FormField<T>({
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
  inputId,
  ...props
}: FormFieldProps<T>) {
  const { register } = useContext(FormContext);
  const [internalInvalid, setInternalInvalid] = useState<
    string | boolean | null | undefined
  >();
  const finalInvalid = externalInvalid ?? internalInvalid;
  const isInvalid = Boolean(finalInvalid);
  const hasInvalidContent = typeof finalInvalid === "string";

  const internalId = useId();
  const id = inputId ?? internalId;
  const baseId = useId();
  const { id: descId, ...descriptionProps } = itemProps?.description ?? {};
  const { id: invId, ...invalidProps } = itemProps?.invalid ?? {};;

  const descriptionId = descId ?? `${baseId}-desc`;
  const invalidId = invId ?? `${baseId}-error`;
  const currentDescribedById = hasInvalidContent ? invalidId : descriptionId;

  const inputRef = useCallback(
    (el: HTMLInputElement | null) => {
      register(name, el);
    },
    [register, name],
  );

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (validConfig?.trigger === "onChange") {
        const invalid = validConfig?.validate?.(e as T);
        setInternalInvalid(invalid);
      }
    },
    [validConfig],
  );

  const onBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      if (validConfig?.trigger === "onBlur") {
        const invalid = validConfig?.validate?.(e as T);
        setInternalInvalid(invalid);
      }
    },
    [validConfig],
  );

  const onInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (validConfig?.trigger === "onInput") {
        const invalid = validConfig?.validate?.(e as T);
        setInternalInvalid(invalid);
      }
    },
    [validConfig],
  );

  return (
    <div
      {...props}
      inert={disabled}
      data-invalid={isInvalid ? true : undefined}
      data-direction={direction}
      className={cn(
        "grid gap-1 group inert:cursor-not-allowed inert:opacity-50 items-center",
        "data-[direction=vertical]:grid-cols-1",
        "data-[direction=horizontal]:grid-cols-[auto_1fr]",
        className,
      )}
    >
      {label && (
        <label
          {...itemProps?.label}
          htmlFor={id}
          className={cn(
            "text-sm font-medium leading-none indent-2 py-1 select-none min-w-16",
            "group-data-[direction=horizontal]:text-end",
            itemProps?.label?.className,
          )}
        >
          {label}
        </label>
      )}
      {children?.({
        id,
        name,
        ref: inputRef,
        onChange,
        onBlur,
        onInput,
        invalid: isInvalid,
        "aria-describedby": currentDescribedById,
      })}
      <small
        id={currentDescribedById}
        {...(hasInvalidContent ? invalidProps : descriptionProps)}
        className={cn(
          "text-sm indent-2 h-5 text-muted-foreground",
          "group-data-invalid:text-destructive",
          "group-data-[direction=horizontal]:col-start-2",
          (hasInvalidContent ? invalidProps : descriptionProps).className,
        )}
        role={hasInvalidContent ? "alert" : undefined}
      >
        {hasInvalidContent ? finalInvalid : description}
      </small>
    </div>
  );
}

Form.Field = FormField;

type FormFieldsetArg = {
  invalid: boolean;
  name: string;
  "aria-describedby": string;
};

type FormFieldsetProps = {
  name: string;
  label?: ReactNode;
  description?: ReactNode;
  invalid?: ReactNode;
  disabled?: boolean;
  direction?: "vertical" | "horizontal";
  className?: string;
  itemProps?: {
    label?: WithDataAttributes<React.ComponentProps<"legend">>;
    invalid?: WithDataAttributes<React.ComponentProps<"small">>;
    description?: WithDataAttributes<React.ComponentProps<"small">>;
  };
  children: (arg: FormFieldsetArg) => ReactNode;
};

function FormFieldset({
  name,
  label,
  description,
  invalid,
  disabled,
  direction = "vertical",
  className,
  itemProps,
  children,
  ...rest
}: FormFieldsetProps) {

  const isInvalid = Boolean(invalid);
  const hasInvalidContent = typeof invalid !== "boolean" && isInvalid;

  const baseId = useId();
  const { id: descId, ...descriptionProps } = itemProps?.description ?? {};
  const { id: invId, ...invalidProps } = itemProps?.invalid ?? {};

  const descriptionId = descId ?? `${baseId}-desc`;
  const invalidId = invId ?? `${baseId}-error`;
  const currentDescribedById = hasInvalidContent ? invalidId : descriptionId;

  return (
    <fieldset
      {...rest}
      disabled={disabled}
      className={cn(
        "grid gap-1 group border-0 p-0 m-0",
        "data-[direction=vertical]:grid-cols-1",
        "data-[direction=horizontal]:grid-cols-[auto_1fr]",
        className,
      )}
      data-invalid={isInvalid ? true : undefined}
      data-direction={direction}
      aria-invalid={isInvalid}
      aria-describedby={isInvalid ? currentDescribedById : undefined}
    >
      {label && (
        <legend
          {...itemProps?.label}
          className={cn(
            "text-sm font-medium leading-none indent-2 py-1 select-none min-w-16",
            "group-data-[direction=horizontal]:text-end",
            itemProps?.label?.className,
          )}
        >
          {label}
        </legend>
      )}

      <div className="col-start-1 md:col-start-2">
        {children({
          invalid: isInvalid,
          name,
          "aria-describedby": currentDescribedById,
        })}
      </div>

      <small
        id={currentDescribedById}
        {...(hasInvalidContent ? invalidProps : descriptionProps)}
        className={cn(
          "text-sm indent-2 h-5 text-muted-foreground",
          "group-data-invalid:text-destructive",
          "group-data-[direction=horizontal]:col-start-2",
          (hasInvalidContent ? invalidProps : descriptionProps).className,
        )}
        role={hasInvalidContent ? "alert" : undefined}
      >
        {hasInvalidContent ? invalid : description}
      </small>
    </fieldset>
  );
}

Form.Fieldset = FormFieldset;
