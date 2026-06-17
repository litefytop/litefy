"use client";

import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";
import {
  createContext,
  useActionState,
  useCallback,
  useContext,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { type ClassNameValue, cn } from "@/lib";

type FormElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
type ElementEntry = FormElement | FormElement[];

type FormContextType = {
  isPending: boolean;
  register: (name: string, element: FormElement | null) => void;
};

const FormContext = createContext<FormContextType>({
  isPending: false,
  register: () => {},
});

export type FormRef = {
  setValues: (
    values: Record<string, string | number | (string | number)[]>,
  ) => void;
  reset: () => void;
  submit: () => void;
};

type FormProps = Omit<React.ComponentProps<"form">, "onSubmit" | "ref"> & {
  onSubmit: (formData: FormData) => Promise<boolean>;
  autoReset?: boolean;
  ref?: React.Ref<FormRef>;
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
  const elementsRef = useRef<Map<string, ElementEntry>>(new Map());

  const register = useCallback((name: string, element: FormElement | null) => {
    if (!element) {
      elementsRef.current.delete(name);
      return;
    }
    const existing = elementsRef.current.get(name);
    if (!existing) {
      elementsRef.current.set(name, element);
    } else if (Array.isArray(existing)) {
      if (!existing.includes(element)) {
        existing.push(element);
      }
    } else {
      if (existing !== element) {
        elementsRef.current.set(name, [existing, element]);
      }
    }
  }, []);

  const setValues = useCallback(
    (values: Record<string, string | number | (string | number)[]>) => {
      const setSingle = (el: FormElement, val: string | number) => {
        const oldValue = el.value;
        el.value = String(val);
        if (oldValue !== String(val)) {
          el.dispatchEvent(new Event("change", { bubbles: true }));
        }
      };

      const setGroup = (els: FormElement[], vals: (string | number)[]) => {
        const valSet = new Set(vals.map(String));
        els.forEach((el) => {
          if (el instanceof HTMLInputElement && el.type === "checkbox") {
            const shouldCheck = valSet.has(el.value);
            if (el.checked !== shouldCheck) {
              el.checked = shouldCheck;
              el.dispatchEvent(new Event("change", { bubbles: true }));
            }
          } else {
            console.warn(
              "Group setValue only supports checkbox inputs currently",
            );
          }
        });
      };

      Object.entries(values).forEach(([name, value]) => {
        const entry = elementsRef.current.get(name);
        if (!entry) return;

        if (Array.isArray(entry)) {
          if (Array.isArray(value)) {
            setGroup(entry, value);
          } else {
            console.warn(
              `Field "${name}" is a group, but setValues received a single value.`,
            );
          }
        } else {
          if (Array.isArray(value)) {
            console.warn(
              `Field "${name}" is singular, but setValues received an array.`,
            );
          } else {
            setSingle(entry, value);
          }
        }
      });
    },
    [],
  );

  const reset = useCallback(() => {
    internalRef.current?.reset();
  }, []);

  const submit = useCallback(() => {
    internalRef.current?.requestSubmit();
  }, []);

  useImperativeHandle(externalRef, () => ({ setValues, reset, submit }), [
    setValues,
    reset,
    submit,
  ]);

  const action = async (prevCount: number, formData: FormData) => {
    const success = await onSubmit(formData);
    return success ? prevCount + 1 : prevCount;
  };
  const [count, formAction, isPending] = useActionState(action, 0);

  useEffect(() => {
    if (count > 0 && autoReset) {
      reset();
    }
  }, [count, autoReset, reset]);

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

type HTMLAttrs<T> = T & {
  [key: `data-${string}`]: string | number | null | undefined | true;
  className?: ClassNameValue;
};

type FormFieldArg = {
  id: string;
  name: string;
  ref: (el: FormElement | null) => void;
  onChange: (e: React.ChangeEvent<FormElement>) => void;
  onBlur: (e: React.FocusEvent<FormElement>) => void;
  invalid: boolean;
  "aria-describedby"?: string;
};

export type FormFieldProps = Omit<React.ComponentProps<"div">, "children"> & {
  label?: ReactNode;
  description?: ReactNode;
  invalid?: ReactNode;
  disabled?: boolean;
  direction?: "vertical" | "horizontal";
  slotProps?: {
    label?: HTMLAttrs<React.ComponentProps<"label">>;
    invalid?: HTMLAttrs<React.ComponentProps<"small">>;
    description?: HTMLAttrs<React.ComponentProps<"small">>;
  };
  inputId?: string;
  name: string;
  children?: (field: FormFieldArg) => React.ReactNode;
  validConfig?: {
    validate?: (
      event: React.ChangeEvent<FormElement>,
    ) => string | boolean | null | undefined;
    trigger?: "onChange" | "onBlur";
  };
};

function FormField({
  className,
  label,
  name,
  description,
  invalid: externalInvalid,
  direction = "vertical",
  slotProps,
  disabled,
  children,
  validConfig,
  inputId,
  ...props
}: FormFieldProps) {
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
  const { id: descId, ...descriptionProps } = slotProps?.description ?? {};
  const { id: invId, ...invalidProps } = slotProps?.invalid ?? {};

  const descriptionId = descId ?? `${baseId}-desc`;
  const invalidId = invId ?? `${baseId}-error`;
  const currentDescribedById = hasInvalidContent ? invalidId : descriptionId;

  const inputRef = useCallback(
    (el: FormElement | null) => {
      register(name, el);
    },
    [register, name],
  );

  const onChange = useCallback(
    (e: React.ChangeEvent<FormElement>) => {
      if (validConfig?.trigger === "onChange") {
        const invalid = validConfig?.validate?.(e);
        setInternalInvalid(invalid);
      }
    },
    [validConfig],
  );

  const onBlur = useCallback(
    (e: React.FocusEvent<FormElement>) => {
      if (validConfig?.trigger === "onBlur") {
        const invalid = validConfig?.validate?.(e);
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
          {...slotProps?.label}
          htmlFor={id}
          className={cn(
            "text-sm font-medium leading-none indent-2 py-1 select-none min-w-16",
            "group-data-[direction=horizontal]:text-end",
            slotProps?.label?.className,
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

type FormFieldsetProps = {
  name: string;
  legend?: ReactNode;
  description?: ReactNode;
  invalid?: ReactNode;
  disabled?: boolean;
  className?: string;
  children?: (field: FormFieldArg) => React.ReactNode;
  validConfig?: {
    validate?: (
      event: React.ChangeEvent<FormElement>,
    ) => string | boolean | null | undefined;
    trigger?: "onChange" | "onBlur";
  };
} & Omit<React.ComponentPropsWithoutRef<"fieldset">, "className">;

function FormFieldset({
  name,
  legend,
  description,
  invalid: externalInvalid,
  disabled,
  className,
  children,
  validConfig,
  ...props
}: FormFieldsetProps) {
  const { register } = useContext(FormContext);
  const [internalInvalid, setInternalInvalid] = useState<
    string | boolean | null | undefined
  >();
  const finalInvalid = externalInvalid ?? internalInvalid;
  const isInvalid = Boolean(finalInvalid);
  const hasInvalidContent = typeof finalInvalid === "string";

  const id = useId();
  const descriptionId = `${id}-desc`;
  const invalidId = `${id}-error`;
  const describedBy = hasInvalidContent ? invalidId : descriptionId;
  const inputRef = useCallback(
    (el: FormElement | null) => {
      register(name, el);
    },
    [register, name],
  );
  const onChange = useCallback(
    (e: React.ChangeEvent<FormElement>) => {
      if (validConfig?.trigger === "onChange") {
        const invalid = validConfig?.validate?.(e);
        setInternalInvalid(invalid);
      }
    },
    [validConfig],
  );

  const onBlur = useCallback(
    (e: React.FocusEvent<FormElement>) => {
      if (validConfig?.trigger === "onBlur") {
        const invalid = validConfig?.validate?.(e);
        setInternalInvalid(invalid);
      }
    },
    [validConfig],
  );
  return (
    <fieldset
      {...props}
      disabled={disabled}
      aria-invalid={isInvalid}
      aria-describedby={describedBy}
      className={cn("space-y-1", className)}
    >
      {legend && <legend>{legend}</legend>}
      {children?.({
        id,
        name,
        ref: inputRef,
        onChange,
        onBlur,
        invalid: isInvalid,
      })}
      <small
        id={describedBy}
        className={cn(
          "text-sm text-muted-foreground",
          isInvalid && "text-destructive",
        )}
        role={hasInvalidContent ? "alert" : undefined}
      >
        {hasInvalidContent ? finalInvalid : description}
      </small>
    </fieldset>
  );
}

Form.Fieldset = FormFieldset;
