import { ReactNode } from "react";
import { cn } from "@/lib";
import { Field } from "@/components";
import { Textarea, TextareaProps } from "@/components";
import { FormField } from "./field";
import {
  useFormContext,
  FieldValues,
  Path,
  RegisterOptions,
} from "react-hook-form";

export type FormTextareaProps<T extends FieldValues> = {
  name: Path<T>;
  label?: string | ReactNode;
  description?: string;
  rules?: RegisterOptions<T>;
} & TextareaProps;

export function FormTextarea<T extends FieldValues>({
  name,
  label,
  description,
  rules,
  className,
  ...props
}: FormTextareaProps<T>) {
  const {
    register,
    formState: { errors },
  } = useFormContext<T>();

  const error = errors[name]?.message as string | undefined;
  const invalid = !!error;

  return (
    <Field className={cn(FormField.class, "relative", className)}>
      {label && <Field.Label htmlFor={String(name)}>{label}</Field.Label>}
      <Textarea {...props} {...register(name, rules)} />
      {description && <Field.Description>{description}</Field.Description>}
      {invalid && <Field.Error >{error}</Field.Error>}
    </Field>
  );
}
