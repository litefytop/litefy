import * as React from "react";
import { Field, type FieldClassNames, type FieldValidateResult } from "./field";

export type InputProps = Omit<React.ComponentProps<"input">, "type" | "className"> & {
  type?: "text" | "email" | "url" | "tel" | "search";
  value?: string;
  className?: string;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  invalid?: boolean;
  label?: React.ReactNode;
  description?: React.ReactNode;
  validate?: (value: string) => FieldValidateResult | Promise<FieldValidateResult>;
  validateTrigger?: "submit" | "change" | "blur";
  fieldClassNames?: FieldClassNames;
  [key: `data-${string}`]: string | number | null | undefined | true;
  classNames?: {
    group?: string;
    leading?: string;
    trailing?: string;
    root?: string;
  };
  styles?: {
    leading?: React.CSSProperties;
    trailing?: React.CSSProperties;
    root?: React.CSSProperties;
  };
};

export type InputLeadingProps = Omit<React.ComponentProps<"span">, "className"> & {
  [key: `data-${string}`]: string | number | null | undefined | true;
  className?: string;
};
export function InputLeading(props: InputLeadingProps) {
  return (
    <span
      {...props}
    />
  );
}
export type InputRootProps = Omit<React.ComponentProps<"input">, "className"> & {
  className?: string;
};
export function InputRoot(props: InputRootProps) {
  const autoId = React.useId();
  const id = props.id ?? autoId;
  return (
    <input
      {...props}
      id={id}
    />
  );
}
export type InputTrailingProps = Omit<React.ComponentProps<"span">, "className"> & {
  [key: `data-${string}`]: string | number | null | undefined | true;
  className?: string;
};
export function InputTrailing(props: InputTrailingProps) {
  return (
    <span
      {...props}
    />
  );
}
export function Input({
  classNames,
  styles,
  leading,
  trailing,
  invalid,
  className,
  style,
  ref,
  "data-border": border,
  label,
  description,
  validate,
  validateTrigger,
  fieldClassNames,
  ...props
}: InputProps) {
  const composeGroup = (field?: { id: string; name: string; describedBy: string | undefined; invalid: boolean }) => (
    <div
      data-invalid={invalid || field?.invalid || props["data-invalid"]}
      data-border={border}
      className={[classNames?.group, className].filter(Boolean).join(" ") || undefined}
      style={style}
    >
      {leading && (
        <InputLeading className={classNames?.leading} style={styles?.leading}>
          {leading}
        </InputLeading>
      )}
      <InputRoot
        {...props}
        ref={ref}
        id={field?.id ?? props.id}
        name={field?.name ?? props.name}
        autoComplete={props.autoComplete ?? (props.type === "email" ? "email" : props.type === "tel" ? "tel" : props.type === "url" ? "url" : props.type === "search" ? "search" : undefined)}
        aria-describedby={field?.describedBy ?? props["aria-describedby"]}
        aria-invalid={invalid || field?.invalid}
        data-invalid={invalid || field?.invalid || undefined}
        className={classNames?.root}
        style={styles?.root}
      />
      {trailing && (
        <InputTrailing className={classNames?.trailing} style={styles?.trailing}>
          {trailing}
        </InputTrailing>
      )}
    </div>
  );
  if (label === undefined && description === undefined && validate === undefined) {
    return composeGroup();
  }
  return (
    <Field
      name={props.name ?? ""}
      label={label}
      description={description}
      required={props.required}
      validate={validate}
      validateTrigger={validateTrigger}
      fieldClassNames={fieldClassNames}
    >
      {(f) => composeGroup({ id: f.id, name: f.name, describedBy: f.describedBy, invalid: f.invalid })}
    </Field>
  );
}
