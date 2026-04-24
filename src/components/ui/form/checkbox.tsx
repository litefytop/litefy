import { ReactNode } from "react";
import { cn } from "@/lib";
import { Field } from "@/components";
import { Checkbox, CheckboxProps } from "@/components";
import { FormField } from "./field";
import {
  useFormContext,
  FieldValues,
  Path,
  RegisterOptions,
} from "react-hook-form";

export type FormCheckboxProps<T extends FieldValues, K extends string> = {
  name: Path<T>;
  label?: string | ReactNode;
  description?: string;
  rules?: RegisterOptions<T>;
} & CheckboxProps<K>;

export function FormCheckbox<T extends FieldValues, K extends string>({
  name,
  label,
  description,
  rules,
  className,
  ...props
}: FormCheckboxProps<T, K>) {
  const {
    register,
    formState: { errors },
  } = useFormContext<T>();

  const error = errors[name]?.message as string | undefined;
  const invalid = !!error;

  return (
    <Field className={cn(FormField.class, "relative", className)}>
      <Field.Label htmlFor={props.id}>{label}</Field.Label>
      <Checkbox {...props} {...register(name, rules)} />
      {description && <Field.Description>{description}</Field.Description>}
      {invalid && <Field.Error >{error}</Field.Error>}
    </Field>
  );
}
