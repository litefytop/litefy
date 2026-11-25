"use client";
import * as React from "react";
import { FormContext } from "./form";
export type FieldValidateResult = string | { message: string; invalid?: boolean } | boolean | null | undefined;
export interface FieldClassNames {
    root?: string;
    label?: string;
    required?: string;
    description?: string;
    error?: string;
}
export interface FieldStyles {
    label?: React.CSSProperties;
    description?: React.CSSProperties;
    error?: React.CSSProperties;
}
export type FieldRenderInfo = {
    id: string;
    name: string;
    hintId: string;
    alertId: string;
    invalid: boolean;
    describedBy: string | undefined;
};
export interface FieldProps {
    name: string;
    label?: React.ReactNode;
    description?: React.ReactNode;
    required?: boolean;
    validate?: (value: string) => FieldValidateResult | Promise<FieldValidateResult>;
    validateTrigger?: "submit" | "change" | "blur";
    id?: string;
    fieldClassNames?: FieldClassNames;
    fieldStyles?: FieldStyles;
    className?: string;
    children: (field: FieldRenderInfo) => React.ReactNode;
}
type FieldError = { text: string; markInvalid: boolean } | null;
const normalize = (result: FieldValidateResult): { ok: boolean; message: string; markInvalid: boolean } => {
    if (result === true || result === null || result === undefined) {
        return { ok: true, message: "", markInvalid: false };
    }
    if (typeof result === "string") {
        return { ok: false, message: result, markInvalid: true };
    }
    if (typeof result === "boolean") {
        return { ok: false, message: "", markInvalid: true };
    }
    return { ok: false, message: result.message, markInvalid: result.invalid !== false };
};
export function Field({ name, label, description, required, validate, validateTrigger = "submit", id: idProp, fieldClassNames, fieldStyles, children }: FieldProps) {
    const { register, registerField, unregisterField } = React.useContext(FormContext);
    const autoId = React.useId();
    const id = idProp ?? autoId;
    const hintId = `${id}-hint`;
    const alertId = `${id}-alert`;
    const shellRef = React.useRef<HTMLDivElement | null>(null);
    const valueRef = React.useRef<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null>(null);
    const [error, setError] = React.useState<FieldError>(null);
    const errorRef = React.useRef<FieldError>(null);
    const [focused, setFocused] = React.useState(false);
    const validateRef = React.useRef(validate);
    React.useEffect(() => {
        validateRef.current = validate;
        errorRef.current = error;
    });
    const isInvalid = error?.markInvalid === true;
    const showError = isInvalid && !!error?.text && !focused;
    const applyResult = (result: FieldValidateResult) => {
        const outcome = normalize(result);
        setError(outcome.ok ? null : { text: outcome.message, markInvalid: outcome.markInvalid });
    };
    const runValidate = (value: string) => {
        const current = validateRef.current;
        if (!current)
            return;
        const result = current(value);
        if (result instanceof Promise) {
            result.then(applyResult);
        }
        else {
            applyResult(result);
        }
    };
    const readValue = () => valueRef.current?.value ?? "";
    const setShellRef = (node: HTMLDivElement | null) => {
        shellRef.current = node;
        const target = node?.querySelector<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>("input, select, textarea") ?? null;
        valueRef.current = target;
        register(name, target);
    };
    React.useEffect(() => {
        const current = validateRef.current;
        if (!current)
            return;
        const api = {
            validate: async (value: string) => normalize(await current(value)),
            setError: (next: FieldError) => setError(next),
        };
        registerField(name, api);
        return () => unregisterField(name);
    }, [name, registerField, unregisterField]);
    const handleValueEvent = () => {
        if (validateTrigger === "change" || errorRef.current !== null) {
            runValidate(readValue());
        }
    };
    const handleValueEventRef = React.useRef(handleValueEvent);
    React.useEffect(() => {
        handleValueEventRef.current = handleValueEvent;
    });
    React.useEffect(() => {
        const shell = shellRef.current;
        if (!shell)
            return;
        const onEvent = () => handleValueEventRef.current();
        shell.addEventListener("input", onEvent);
        shell.addEventListener("change", onEvent);
        return () => {
            shell.removeEventListener("input", onEvent);
            shell.removeEventListener("change", onEvent);
        };
    }, []);
    const handleBlurCapture = () => {
        setFocused(false);
        if (validateTrigger === "blur") {
            runValidate(readValue());
        }
    };
    const describedBy = error ? alertId : description ? hintId : undefined;
    const info: FieldRenderInfo = { id, name, hintId, alertId, invalid: isInvalid, describedBy };
    return (<div data-invalid={isInvalid || undefined} className={fieldClassNames?.root}>
      {label && (<label htmlFor={id} className={fieldClassNames?.label} style={fieldStyles?.label}>
          {label}
          {required && <span className={fieldClassNames?.required} aria-hidden> *</span>}
        </label>)}
      <div ref={setShellRef} className="relative" onFocusCapture={() => setFocused(true)} onBlurCapture={handleBlurCapture}>
        {children(info)}
        {error && error.text && (<div role="alert" id={alertId} aria-hidden={!showError || undefined} data-error={showError || undefined} className={fieldClassNames?.error} style={fieldStyles?.error}>
            <span data-error={showError || undefined} className="inline-block transition-transform duration-sm ease-frame -translate-y-full data-[error=true]:translate-y-0">{error.text}</span>
          </div>)}
      </div>
      {description && (<small id={hintId} className={fieldClassNames?.description} style={fieldStyles?.description} aria-live="polite">
          {description}
        </small>)}
    </div>);
}
