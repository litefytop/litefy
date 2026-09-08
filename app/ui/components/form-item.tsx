"use client";
import * as React from "react";
import { type ClassNameValue, cn } from "../utils/cn";
import { Input, type InputProps } from "./input";
import { Textarea, type TextareaProps } from "./text-area";
import { Select, type SelectOption, type SelectOptionGroup, type SelectProps } from "./select";
import { Password, type PasswordProps } from "./password";
import { NumberField, type NumberFieldProps } from "./number-field";
import { FormContext } from "./form";

type ValidationResult =
  | string
  | { message: string; invalid?: boolean }
  | boolean
  | null
  | undefined;

export type FormItemVariant = "input" | "textarea" | "select" | "password" | "number-field";

export interface FormItemBaseProps {
  name: string;
  className?: ClassNameValue;
  label?: React.ReactNode;
  description?: React.ReactNode;
  required?: boolean;
  /**
   * Return a string to mark the control invalid with an error message,
   * or `{ message, invalid: false }` to show the message without styling
   * the control as invalid (e.g. soft "required" errors on empty fields).
   */
  validate?: (value: string) => ValidationResult | Promise<ValidationResult>;
  validateTrigger?: "onChange" | "onBlur";
  disabled?: boolean;
  classNames?: {
    label?: ClassNameValue;
    hint?: ClassNameValue;
  };
}

type FieldElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

export type FormItemProps =
  | (FormItemBaseProps & { variant: "input"; controlProps?: Omit<InputProps, "ref"> })
  | (FormItemBaseProps & { variant: "textarea"; controlProps?: Omit<TextareaProps, "ref"> })
  | (FormItemBaseProps & {
      variant: "select";
      controlProps?: Omit<SelectProps, "ref"> & {
        options: (SelectOption | SelectOptionGroup)[];
      };
    })
  | (FormItemBaseProps & { variant: "password"; controlProps?: Omit<PasswordProps, "ref"> })
  | (FormItemBaseProps & {
      variant: "number-field";
      controlProps?: Omit<NumberFieldProps, "ref">;
    });

export function FormItem(props: FormItemProps) {
  const {
    variant,
    name,
    className,
    label,
    description,
    required,
    validate,
    validateTrigger = "onBlur",
    disabled,
    classNames,
    controlProps = {},
  } = props;

  const { register } = React.useContext(FormContext);
  const id = React.useId();
  const hintId = `${id}-hint`;
  const [error, setError] = React.useState<{ text: string; markInvalid: boolean } | null>(null);
  const errorRef = React.useRef<{ text: string; markInvalid: boolean } | null>(null);
  const elementRef = React.useRef<FieldElement | null>(null);
  const [selectValue, setSelectValue] = React.useState(
    () => (controlProps as { defaultValue?: string }).defaultValue ?? "",
  );

  errorRef.current = error;
  const isInvalid = error?.markInvalid === true;

  const setFieldRef = (el: HTMLElement | null) => {
    const target =
      el &&
      !(
        el instanceof HTMLInputElement ||
        el instanceof HTMLSelectElement ||
        el instanceof HTMLTextAreaElement
      )
        ? el.querySelector<FieldElement>("input, select, textarea")
        : el;
    elementRef.current = target;
    register(name, target);
  };

  const readValue = () => elementRef.current?.value ?? "";

  const applyResult = (result: ValidationResult) => {
    if (result === true || result === null || result === undefined) {
      setError(null);
    } else if (typeof result === "string") {
      setError({ text: result, markInvalid: true });
    } else if (typeof result === "boolean") {
      // false — bare invalid state without a message
      setError({ text: "", markInvalid: true });
    } else {
      setError({ text: result.message, markInvalid: result.invalid !== false });
    }
  };

  const runValidate = (value: string) => {
    if (!validate) return;
    const result = validate(value);
    if (result instanceof Promise) {
      result.then(applyResult);
    } else {
      applyResult(result);
    }
  };

  const handleChange = (value: string) => {
    if (errorRef.current !== null) runValidate(value);
    else if (validateTrigger === "onChange") runValidate(value);
  };

  const handleBlur = () => {
    if (validateTrigger === "onBlur") runValidate(readValue());
  };

  const common = {
    name,
    id,
    disabled,
    required,
    "aria-describedby": error || description ? hintId : undefined,
  };

  let control: React.ReactNode;
  switch (variant) {
    case "input": {
      const { onChange, onBlur, ...rest } = controlProps as InputProps;
      control = (
        <Input
          {...common}
          {...rest}
          invalid={isInvalid}
          ref={setFieldRef}
          defaultValue={(rest as { defaultValue?: string }).defaultValue}
          onChange={(e) => {
            onChange?.(e);
            handleChange((e.target as HTMLInputElement).value);
          }}
          onBlur={(e) => {
            onBlur?.(e);
            handleBlur();
          }}
        />
      );
      break;
    }
    case "textarea": {
      const { onChange, onBlur, ...rest } = controlProps as TextareaProps;
      control = (
        <Textarea
          {...common}
          {...rest}
          invalid={isInvalid}
          ref={setFieldRef}
          onChange={(e) => {
            onChange?.(e);
            handleChange(e.target.value);
          }}
          onBlur={(e) => {
            onBlur?.(e);
            handleBlur();
          }}
        />
      );
      break;
    }
    case "select": {
      const { options = [], defaultValue, onBlur, ...rest } = controlProps as SelectProps;
      control = (
        <>
          <input type="hidden" name={name} value={selectValue} ref={setFieldRef} />
          <Select
            {...(rest as object)}
            id={id}
            disabled={disabled}
            required={required}
            aria-invalid={isInvalid || undefined}
            aria-describedby={error || description ? hintId : undefined}
            options={options}
            defaultValue={defaultValue}
            value={selectValue}
            onValueChange={(v) => {
              setSelectValue(v);
              handleChange(v);
            }}
            onBlur={(e) => {
              onBlur?.(e);
              handleBlur();
            }}
          />
        </>
      );
      break;
    }
    case "password": {
      const { onChange, onBlur, ...rest } = controlProps as PasswordProps;
      control = (
        <Password
          {...common}
          {...rest}
          invalid={isInvalid}
          ref={setFieldRef}
          onChange={(e) => {
            onChange?.(e);
            handleChange((e.target as HTMLInputElement).value);
          }}
          onBlur={(e) => {
            onBlur?.(e);
            handleBlur();
          }}
        />
      );
      break;
    }
    case "number-field": {
      const { onValueChange, onBlur, ...rest } = controlProps as NumberFieldProps;
      const emitChange = onValueChange as ((value?: string | number) => void) | undefined;
      control = (
        <NumberField
          {...(rest as object)}
          {...(common as object)}
          invalid={isInvalid}
          ref={setFieldRef}
          onValueChange={(value) => {
            emitChange?.(value);
            handleChange(String(value ?? ""));
          }}
          onBlur={(e) => {
            onBlur?.(e);
            handleBlur();
          }}
        />
      );
      break;
    }
  }

  return (
    <div
      data-invalid={isInvalid || undefined}
      className={cn("space-y-1", className)}
    >
      {label && (
        <label htmlFor={id} className={cn("block py-1 text-sm font-medium indent-2 select-none", classNames?.label)}>
          {label}
          {required && <span aria-hidden className="text-danger"> *</span>}
        </label>
      )}
      {control}
      <small
        id={hintId}
        role={error ? "alert" : undefined}
        className={cn(
          "block h-5 text-sm indent-2",
          error ? "text-danger" : "text-muted-foreground",
          classNames?.hint,
        )}
      >
        {error?.text ?? description}
      </small>
    </div>
  );
}
