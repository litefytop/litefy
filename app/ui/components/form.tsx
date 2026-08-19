import { Loader2 } from "lucide-react";
import * as React from "react";
import { type ClassNameValue, cn } from "@/lib";

type FormElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
type FormValue = string | number | string[] | number[] | null;
type Setter = (value: FormValue) => void;

type Entry = {
  elements: FormElement[];
  setter?: Setter;
};

type FormContextType = {
  isPending: boolean;
  register: (
    name: string,
    element: FormElement | null,
    setter?: Setter,
  ) => void;
  unregister: (name: string) => void;
  formValues: Record<string, FormValue>;
  setFormValues: React.Dispatch<
    React.SetStateAction<Record<string, FormValue>>
  >;
};

const FormContext = React.createContext<FormContextType>({
  isPending: false,
  register: () => {},
  unregister: () => {},
  formValues: {},
  setFormValues: () => {},
});

export type FormValues = Record<string, string | string[]>;

const processFormData = (formData: FormData): FormValues => {
  const result: FormValues = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value !== "string") continue;
    if (key in result) {
      const prev = result[key];
      result[key] = Array.isArray(prev) ? [...prev, value] : [prev, value];
    } else {
      result[key] = value;
    }
  }
  return result;
};

const generateId = (base: string, suffix: string) => `${base}-${suffix}`;

export type FormRef = {
  setValues: (values: Record<string, FormValue>) => void;
  reset: () => void;
  submit: () => void;
};

type FormProps = Omit<React.ComponentProps<"form">, "onSubmit" | "ref"> & {
  onSubmit: (values: FormValues) => Promise<boolean>;
  autoReset?: boolean;
  autoResetOnError?: boolean;
  onReset?: () => void;
  ref?: React.Ref<FormRef>;
};

export function Form({
  children,
  onSubmit,
  className,
  ref: externalRef,
  autoReset = true,
  onReset,
  ...props
}: FormProps) {
  const internalRef = React.useRef<HTMLFormElement>(null);
  const elementsRef = React.useRef<Map<string, Entry>>(new Map());
  const [formValues, setFormValues] = React.useState<Record<string, FormValue>>(
    {},
  );

  const registerElement = React.useCallback(
    (name: string, element: FormElement) => {
      const existing = elementsRef.current.get(name);
      if (!existing) {
        elementsRef.current.set(name, { elements: [element] });
      } else {
        if (!existing.elements.includes(element)) {
          existing.elements.push(element);
        }
      }
    },
    [],
  );

  const registerSetter = React.useCallback((name: string, setter: Setter) => {
    const existing = elementsRef.current.get(name);
    if (!existing) {
      elementsRef.current.set(name, { elements: [], setter });
    } else {
      existing.setter = setter;
    }
  }, []);

  const register = React.useCallback(
    (name: string, element: FormElement | null, setter?: Setter) => {
      if (setter) {
        registerSetter(name, setter);
      } else if (element) {
        registerElement(name, element);
      }
    },
    [registerElement, registerSetter],
  );

  const unregister = React.useCallback((name: string) => {
    elementsRef.current.delete(name);
  }, []);

  const setValues = React.useCallback((values: Record<string, FormValue>) => {
    const newState: Record<string, FormValue> = {};
    const entries = Object.entries(values);

    for (const [name, value] of entries) {
      if (Array.isArray(value)) {
        newState[name] = value.map((v) =>
          typeof v === "string" ? v : String(v),
        );
      } else {
        newState[name] = value;
      }
    }
    setFormValues((prev) => ({ ...prev, ...newState }));

    for (const [name, value] of entries) {
      const entry = elementsRef.current.get(name);
      if (!entry) continue;

      if (entry.setter) {
        entry.setter(
          Array.isArray(value) ? value.map((v) => String(v)) : value,
        );
        continue;
      }

      const els = entry.elements;
      if (Array.isArray(value)) {
        const valSet = new Set(value.map(String));
        els.forEach((el) => {
          if (el instanceof HTMLInputElement && el.type === "checkbox") {
            const shouldCheck = valSet.has(el.value);
            if (el.checked !== shouldCheck) {
              el.checked = shouldCheck;
              el.dispatchEvent(new Event("change", { bubbles: true }));
            }
          }
        });
      } else {
        const strVal = String(value);
        els.forEach((el) => {
          if (el instanceof HTMLInputElement && el.type === "radio") {
            if (el.value === strVal) {
              el.checked = true;
              el.dispatchEvent(new Event("change", { bubbles: true }));
            }
          } else {
            const oldValue = el.value;
            el.value = strVal;
            if (oldValue !== strVal) {
              el.dispatchEvent(new Event("change", { bubbles: true }));
            }
          }
        });
      }
    }
  }, []);

  const reset = React.useCallback(() => {
    internalRef.current?.reset();
    elementsRef.current.forEach((entry) => {
      if (entry.setter) {
        entry.setter(null);
      }
    });
    setFormValues({});
    onReset?.();
  }, [onReset]);

  const submit = React.useCallback(() => {
    internalRef.current?.requestSubmit();
  }, []);

  React.useImperativeHandle(externalRef, () => ({ setValues, reset, submit }), [
    setValues,
    reset,
    submit,
  ]);

  const formValuesRef = React.useRef(formValues);
  React.useEffect(() => {
    formValuesRef.current = formValues;
  }, [formValues]);

  const action = React.useCallback(
    async (prevCount: number, formData: FormData) => {
      const currentFormValues = formValuesRef.current;
      elementsRef.current.forEach((entry, name) => {
        if (entry.setter && currentFormValues[name] !== undefined) {
          formData.delete(name);
          const val = currentFormValues[name];
          if (Array.isArray(val)) {
            val.forEach((v) => {
              formData.append(name, String(v));
            });
          } else {
            formData.set(name, String(val));
          }
        }
      });
      const values = processFormData(formData);
      try {
        const success = await onSubmit(values);
        if (success && autoReset) {
          reset();
        }
        return success ? prevCount + 1 : prevCount;
      } catch (error) {
        console.error("Form submission error:", error);
        return prevCount;
      }
    },
    [onSubmit, autoReset, reset],
  );

  const [, formAction, isPending] = React.useActionState(action, 0);

  const contextValue = React.useMemo(
    () => ({ isPending, register, unregister, formValues, setFormValues }),
    [isPending, register, unregister, formValues],
  );

  return (
    <FormContext.Provider value={contextValue}>
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
  const { isPending } = React.useContext(FormContext);
  const icon =
    isPending && (loadingIcon ?? <Loader2 className="animate-spin size-4" />);

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
      {icon}
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
  onChange?: React.ChangeEventHandler<FormElement>;
  onBlur?: React.FocusEventHandler<HTMLElement>;
  invalid: boolean;
  "aria-describedby"?: string;
};

export type FormFieldProps = Omit<React.ComponentProps<"div">, "children"> & {
  label?: React.ReactNode;
  description?: React.ReactNode;
  invalid?: React.ReactNode;
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
      value: string,
    ) =>
      | string
      | boolean
      | null
      | undefined
      | Promise<string | boolean | null | undefined>;
    trigger?: "onChange" | "onBlur";
    debounceMs?: number;
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
  const { register, unregister } = React.useContext(FormContext);
  const [internalInvalid, setInternalInvalid] = React.useState<
    string | boolean | null | undefined
  >();
  const finalInvalid = externalInvalid ?? internalInvalid;
  const isInvalid = Boolean(finalInvalid);
  const hasInvalidContent = typeof finalInvalid === "string";

  const internalId = React.useId();
  const id = inputId ?? internalId;
  const baseId = React.useId();
  const { id: descId, ...descriptionProps } = slotProps?.description ?? {};
  const { id: invId, ...invalidProps } = slotProps?.invalid ?? {};

  const descriptionId = descId ?? generateId(baseId, "desc");
  const invalidId = invId ?? generateId(baseId, "error");
  const currentDescribedById = hasInvalidContent ? invalidId : descriptionId;

  const inputRef = React.useCallback(
    (el: FormElement | null) => {
      register(name, el);
    },
    [register, name],
  );

  React.useEffect(() => {
    return () => {
      unregister(name);
    };
  }, [unregister, name]);

  const debounceTimer = React.useRef<NodeJS.Timeout | null>(null);

  const runValidation = React.useCallback(
    async (value: string) => {
      if (!validConfig?.validate) return;
      const result = await validConfig.validate(value);
      setInternalInvalid(result);
    },
    [validConfig],
  );

  const onChange = React.useCallback(
    (e: React.ChangeEvent<FormElement>) => {
      const value = e.target.value;
      if (validConfig?.trigger === "onChange" && validConfig.validate) {
        if (validConfig.debounceMs) {
          if (debounceTimer.current) clearTimeout(debounceTimer.current);
          debounceTimer.current = setTimeout(() => {
            runValidation(value);
          }, validConfig.debounceMs);
        } else {
          runValidation(value);
        }
      }
    },
    [validConfig, runValidation],
  );

  const onBlur = React.useCallback(
    (e: React.FocusEvent<FormElement>) => {
      const value = (e.target as FormElement).value;
      if (validConfig?.trigger === "onBlur" && validConfig.validate) {
        runValidation(value);
      }
    },
    [validConfig, runValidation],
  );

  React.useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

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

type FieldsetMode = "single" | "multi";

type FieldsetValue<T extends FieldsetMode> = T extends "multi"
  ? string[]
  : string;

type FieldsetRenderArg<T extends FieldsetMode = "multi"> = Omit<
  FormFieldArg,
  "ref" | "onChange"
> & {
  value: FieldsetValue<T> | undefined;
  onValueChange: (val: FieldsetValue<T>) => void;
  onBlur: React.FocusEventHandler<HTMLElement>;
};

type FormFieldsetProps<T extends FieldsetMode = "multi"> = {
  type?: T;
  name: string;
  legend?: React.ReactNode;
  description?: React.ReactNode;
  invalid?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  children?: (field: FieldsetRenderArg<T>) => React.ReactNode;
  validConfig?: {
    validate?: (
      value: FieldsetValue<T>,
    ) => string | boolean | undefined | Promise<string | boolean | undefined>;
    trigger?: "onChange" | "onBlur";
    debounceMs?: number;
  };
} & Omit<React.ComponentPropsWithoutRef<"fieldset">, "className" | "children">;

function FormFieldset<T extends FieldsetMode = "multi">({
  type = "multi" as T,
  name,
  legend,
  description,
  invalid: externalInvalid,
  disabled,
  className,
  children,
  validConfig,
  ...props
}: FormFieldsetProps<T>) {
  const { register, unregister, formValues, setFormValues } =
    React.useContext(FormContext);
  const [internalInvalid, setInternalInvalid] = React.useState<
    string | boolean | undefined
  >();
  const finalInvalid = externalInvalid ?? internalInvalid;
  const isInvalid = Boolean(finalInvalid);
  const hasInvalidContent = typeof finalInvalid === "string";

  const id = React.useId();
  const descriptionId = generateId(id, "desc");
  const invalidId = generateId(id, "error");
  const describedBy = hasInvalidContent ? invalidId : descriptionId;

  const groupSetter = React.useCallback(
    (value: FieldsetValue<T>) => {
      setFormValues((prev) => ({ ...prev, [name]: value }));
    },
    [name, setFormValues],
  );

  React.useEffect(() => {
    register(name, null, (value: FormValue) => {
      if (type === "multi") {
        const arr = Array.isArray(value) ? value.map(String) : [];
        groupSetter(arr as FieldsetValue<T>);
      } else {
        const str = Array.isArray(value) ? String(value[0]) : String(value);
        groupSetter(str as FieldsetValue<T>);
      }
    });
    return () => {
      unregister(name);
    };
  }, [register, unregister, name, groupSetter, type]);

  const runValidation = React.useCallback(
    async (value: FieldsetValue<T>) => {
      if (!validConfig?.validate) return;
      const result = await validConfig.validate(value);
      setInternalInvalid(result);
    },
    [validConfig],
  );

  const debounceTimer = React.useRef<NodeJS.Timeout | null>(null);

  const onValueChange = React.useCallback(
    (val: FieldsetValue<T>) => {
      groupSetter(val);
      if (validConfig?.trigger === "onChange" && validConfig.validate) {
        if (validConfig.debounceMs) {
          if (debounceTimer.current) clearTimeout(debounceTimer.current);
          debounceTimer.current = setTimeout(() => {
            runValidation(val);
          }, validConfig.debounceMs);
        } else {
          runValidation(val);
        }
      }
    },
    [groupSetter, validConfig, runValidation],
  );

  const onBlur = React.useCallback(
    (_e: React.FocusEvent<HTMLElement>) => {
      if (validConfig?.trigger === "onBlur" && validConfig.validate) {
        const raw = formValues[name];
        const current = (
          type === "multi"
            ? Array.isArray(raw)
              ? raw.map(String)
              : []
            : Array.isArray(raw)
              ? raw[0]
              : raw
        ) as FieldsetValue<T>;
        runValidation(current);
      }
    },
    [validConfig, formValues, name, runValidation, type],
  );

  React.useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  const currentValue: FieldsetValue<T> | undefined =
    type === "multi"
      ? Array.isArray(formValues[name])
        ? (formValues[name].map(String) as FieldsetValue<T>)
        : ([] as unknown as FieldsetValue<T>)
      : (formValues[name] as FieldsetValue<T> | undefined);

  const renderArg = React.useMemo<FieldsetRenderArg<T>>(
    () => ({
      id,
      name,
      value: currentValue,
      onBlur,
      invalid: isInvalid,
      onValueChange,
    }),
    [id, name, currentValue, onBlur, isInvalid, onValueChange],
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
      {children?.(renderArg)}
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

export { FormContext };
