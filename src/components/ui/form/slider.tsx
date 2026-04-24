import { ReactNode } from "react";
import { cn } from "@/lib";
import { Field } from "@/components";
import { Slider, SliderProps } from "@/components";
import { FormField } from "./field";
import {
  useFormContext,
  FieldValues,
  Path,
  RegisterOptions,
} from "react-hook-form";

export type FormSliderProps<T extends FieldValues> = {
  name: Path<T>;
  label?: string | ReactNode;
  description?: string;
  rules?: RegisterOptions<T>;
} & SliderProps;

export function FormSlider<T extends FieldValues>({
  name,
  label,
  description,
  rules,
  className,
  ...props
}: FormSliderProps<T>) {
  const {
    register,
    formState: { errors },
  } = useFormContext<T>();

  const error = errors[name]?.message as string | undefined;
  const invalid = !!error;

  return (
    <Field className={cn(FormField.class, "relative", className)}>
      {label && <Field.Label htmlFor={String(name)}>{label}</Field.Label>}
      <Slider {...props} {...register(name, rules)} />
      {description && <Field.Description>{description}</Field.Description>}
      {invalid && <Field.Error >{error}</Field.Error>}
    </Field>
  );
}
