import * as React from "react";
import { Button } from "./button";
import { Loader2 } from "./icons";
import { useSpin } from "../utils/use-spin";
type FormElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
type FormValue = string | number | string[] | number[] | null;
type Setter = (value: FormValue) => void;
type Entry = {
    elements: FormElement[];
    setter?: Setter;
};
export type FieldApi = {
    validate: (value: string) => Promise<{ ok: boolean; message: string; markInvalid: boolean }>;
    setError: (error: { text: string; markInvalid: boolean } | null) => void;
};
type FormContextType = {
    isPending: boolean;
    register: (name: string, element: FormElement | null, setter?: Setter) => void;
    unregister: (name: string) => void;
    registerField: (name: string, api: FieldApi) => void;
    unregisterField: (name: string) => void;
    formValues: Record<string, FormValue>;
    setFormValues: React.Dispatch<React.SetStateAction<Record<string, FormValue>>>;
};
const FormContext = React.createContext<FormContextType>({
    isPending: false,
    register: () => { },
    unregister: () => { },
    registerField: () => { },
    unregisterField: () => { },
    formValues: {},
    setFormValues: () => { },
});
export type FormValues = Record<string, string | string[]>;
function writeNativeValue(el: FormElement, value: string) {
    const proto = el instanceof HTMLTextAreaElement
        ? HTMLTextAreaElement.prototype
        : el instanceof HTMLSelectElement
            ? HTMLSelectElement.prototype
            : HTMLInputElement.prototype;
    const setter = Object.getOwnPropertyDescriptor(proto, "value")?.set;
    if (setter)
        setter.call(el, value);
    else
        el.value = value;
}
const processFormData = (formData: FormData): FormValues => {
    const result: FormValues = {};
    for (const [key, value] of formData.entries()) {
        if (typeof value !== "string")
            continue;
        if (key in result) {
            const prev = result[key];
            result[key] = Array.isArray(prev) ? [...prev, value] : [prev, value];
        }
        else {
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
type FormProps = Omit<React.ComponentProps<"form">, "action" | "onSubmit" | "ref"> & {
    onSubmit: (values: FormValues) => Promise<boolean>;
    autoReset?: boolean;
    onReset?: () => void;
    ref?: React.Ref<FormRef>;
};
export function Form({ children, onSubmit, className, ref: externalRef, autoReset = true, onReset, ...props }: FormProps) {
    const internalRef = React.useRef<HTMLFormElement>(null);
    const elementsRef = React.useRef<Map<string, Entry>>(new Map());
    const fieldsRef = React.useRef<Map<string, FieldApi>>(new Map());
    const [formValues, setFormValues] = React.useState<Record<string, FormValue>>({});
    const registerField = React.useCallback((name: string, api: FieldApi) => {
        fieldsRef.current.set(name, api);
    }, []);
    const unregisterField = React.useCallback((name: string) => {
        fieldsRef.current.delete(name);
    }, []);
    const registerElement = React.useCallback((name: string, element: FormElement) => {
        const existing = elementsRef.current.get(name);
        if (!existing) {
            elementsRef.current.set(name, { elements: [element] });
        }
        else if (!existing.elements.includes(element)) {
            existing.elements.push(element);
        }
    }, []);
    const registerSetter = React.useCallback((name: string, setter: Setter) => {
        const existing = elementsRef.current.get(name);
        if (!existing) {
            elementsRef.current.set(name, { elements: [], setter });
        }
        else {
            existing.setter = setter;
        }
    }, []);
    const register = React.useCallback((name: string, element: FormElement | null, setter?: Setter) => {
        if (setter) {
            registerSetter(name, setter);
        }
        else if (element) {
            registerElement(name, element);
        }
    }, [registerElement, registerSetter]);
    const unregister = React.useCallback((name: string) => {
        elementsRef.current.delete(name);
    }, []);
    const setValues = React.useCallback((values: Record<string, FormValue>) => {
        const newState: Record<string, FormValue> = {};
        const entries = Object.entries(values);
        for (const [name, value] of entries) {
            if (Array.isArray(value)) {
                newState[name] = value.map((v) => (typeof v === "string" ? v : String(v)));
            }
            else {
                newState[name] = value;
            }
        }
        setFormValues((prev) => ({ ...prev, ...newState }));
        for (const [name, value] of entries) {
            const entry = elementsRef.current.get(name);
            if (!entry)
                continue;
            if (entry.setter) {
                entry.setter(Array.isArray(value) ? value.map(String) : value);
                continue;
            }
            const els = entry.elements;
            if (Array.isArray(value)) {
                const valSet = new Set(value.map(String));
                els.forEach((el) => {
                    if (el instanceof HTMLInputElement && el.type === "checkbox" && el.checked !== valSet.has(el.value))
                        el.click();
                });
            }
            else {
                const strVal = String(value);
                els.forEach((el) => {
                    if (el instanceof HTMLInputElement && el.type === "radio") {
                        if (el.value === strVal && !el.checked)
                            el.click();
                    }
                    else {
                        const oldValue = el.value;
                        if (oldValue !== strVal) {
                            writeNativeValue(el, strVal);
                            el.dispatchEvent(new Event("input", { bubbles: true }));
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
    const [isPending, startTransition] = React.useTransition();
    const runAction = React.useCallback(async (formData: FormData) => {
        const currentFormValues = formValuesRef.current;
        elementsRef.current.forEach((entry, name) => {
            if (entry.setter && currentFormValues[name] !== undefined) {
                formData.delete(name);
                const val = currentFormValues[name];
                if (Array.isArray(val)) {
                    val.forEach((v) => {
                        formData.append(name, String(v));
                    });
                }
                else {
                    formData.set(name, String(val));
                }
            }
        });
        const values = processFormData(formData);
        let valid = true;
        for (const [fieldName, api] of fieldsRef.current) {
            const raw = values[fieldName];
            const outcome = await api.validate(Array.isArray(raw) ? raw.join(",") : (raw ?? ""));
            api.setError(outcome.ok ? null : { text: outcome.message, markInvalid: outcome.markInvalid });
            if (!outcome.ok) {
                valid = false;
            }
        }
        if (!valid) {
            return;
        }
        try {
            const success = await onSubmit(values);
            if (success && autoReset) {
                reset();
            }
        }
        catch (error) {
            console.error("Form submission error:", error);
        }
    }, [onSubmit, autoReset, reset]);
    const handleSubmit = React.useCallback((event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        startTransition(async () => {
            await runAction(formData);
        });
    }, [runAction]);
    const contextValue = React.useMemo(() => ({ isPending, register, unregister, registerField, unregisterField, formValues, setFormValues }), [isPending, register, unregister, registerField, unregisterField, formValues]);
    return (<FormContext.Provider value={contextValue}>
      <form ref={internalRef} onSubmit={handleSubmit} noValidate className={className} {...props}>
        {children}
      </form>
    </FormContext.Provider>);
}
type FormSubmitProps = React.ComponentProps<"button"> & {
    loadingIcon?: React.ReactNode;
};
export function FormSubmit({ children, className, loadingIcon, ...props }: FormSubmitProps) {
    const { isPending } = React.useContext(FormContext);
    const spinRef = useSpin<SVGSVGElement>(isPending);
    return (<Button type="submit" disabled={isPending} aria-busy={isPending || undefined} status={{ icon: loadingIcon ?? <Loader2 ref={spinRef} />, active: isPending }} className={className} {...props}>
      {children}
    </Button>);
}
export { FormContext };
