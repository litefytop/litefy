import { ReactNode } from "react";
import { cn } from "@/lib";
import { Field } from "@/components";
import { Radio, RadioProps } from "@/components";
import { FormField } from "./field";
import {
  useFormContext,
  FieldValues,
  Path,
  RegisterOptions,
} from "react-hook-form";

export type FormRadioProps<T extends FieldValues,K extends string> = {
  name: Path<T>;
  label?: string | ReactNode;
  description?: string;
  rules?: RegisterOptions<T>;
} & RadioProps<K>;

export function FormRadio<T extends FieldValues,K extends string>({
  name,
  label,
  description,
  rules,
  className,
  ...props
}: FormRadioProps<T,K>) {
  const {
    register,
    formState: { errors },
  } = useFormContext<T>();

  const error = errors[name]?.message as string | undefined;
  const invalid = !!error;

  return (
    <Field className={cn(FormField.class, "relative", className)}>
      {label && <Field.Label htmlFor={String(name)}>{label}</Field.Label>}
      <Radio
        {...props}
        {...register(name, rules)}
      />
      {description && <Field.Description>{description}</Field.Description>}
      {invalid && <Field.Error >{error}</Field.Error>}
    </Field>
  );
}
