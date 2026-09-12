import { Loader2 } from "lucide-react";
import * as React from "react";
import { cn } from "../utils/cn";

type FormElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
type FormValue = string | number | string[] | number[] | null;
type Setter = (value: FormValue) => void;

type Entry = {
  elements: FormElement[];
  setter?: Setter;
};

type FormContextType = {
  isPending: boolean;
  register: (name: string, element: FormElement | null, setter?: Setter) => void;
  unregister: (name: string) => void;
  formValues: Record<string, FormValue>;
  setFormValues: React.Dispatch<React.SetStateAction<Record<string, FormValue>>>;
};

const FormContext = React.createContext<FormContextType>({
  isPending: false,
  register: () => {},
  unregister: () => {},
  formValues: {},
  setFormValues: () => {},
});

export type FormValues = Record<string, string | string[]>;

export interface UseFieldValidityReturn {
  validity: Record<string, string | boolean | null>;
  setFieldError: (name: string, error: string | boolean | null) => void;
  clearFieldError: (name: string) => void;
  clearAll: () => void;
  isValid: boolean;
}

export function useFieldValidity(): UseFieldValidityReturn {
  const [validity, setValidity] = React.useState<Record<string, string | boolean | null>>({});

  const setFieldError = React.useCallback((name: string, error: string | boolean | null) => {
    setValidity((prev) => (prev[name] === error ? prev : { ...prev, [name]: error }));
  }, []);

  const clearFieldError = React.useCallback((name: string) => {
    setValidity((prev) => (name in prev ? { ...prev, [name]: null } : prev));
  }, []);

  const clearAll = React.useCallback(() => setValidity({}), []);

  const isValid = !Object.values(validity).some(Boolean);

  return { validity, setFieldError, clearFieldError, clearAll, isValid };
}
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

export type FormRef = {
  setValues: (values: Record<string, FormValue>) => void;
  reset: () => void;
  submit: () => void;
};

type FormProps = Omit<React.ComponentProps<"form">, "onSubmit" | "ref"> & {
  onSubmit: (values: FormValues) => Promise<boolean>;
  autoReset?: boolean;
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
  const [formValues, setFormValues] = React.useState<Record<string, FormValue>>({});

  const registerElement = React.useCallback((name: string, element: FormElement) => {
    const existing = elementsRef.current.get(name);
    if (!existing) {
      elementsRef.current.set(name, { elements: [element] });
    } else {
      if (!existing.elements.includes(element)) {
        existing.elements.push(element);
      }
    }
  }, []);

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
        newState[name] = value.map((v) => (typeof v === "string" ? v : String(v)));
      } else {
        newState[name] = value;
      }
    }
    setFormValues((prev) => ({ ...prev, ...newState }));

    for (const [name, value] of entries) {
      const entry = elementsRef.current.get(name);
      if (!entry) continue;

      if (entry.setter) {
        entry.setter(Array.isArray(value) ? value.map((v) => String(v)) : value);
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
      <form ref={internalRef} action={formAction} className={className} {...props}>
        {children}
      </form>
    </FormContext.Provider>
  );
}

type FormSubmitProps = React.ComponentProps<"button"> & {
  loadingIcon?: React.ReactNode;
};

function FormSubmit({ children, className, ref, loadingIcon, ...props }: FormSubmitProps) {
  const { isPending } = React.useContext(FormContext);
  const icon = isPending && (loadingIcon ?? <Loader2 className="animate-spin size-4" />);

  return (
    <button
      type="submit"
      disabled={isPending}
      ref={ref}
      className={cn(
        "border border-border cursor-pointer  inline-flex items-center justify-center shrink-0 select-none [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 h-9 min-w-9 px-3 py-1 has-[>svg]:px-2 gap-1 rounded-md",
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

export { FormContext };
