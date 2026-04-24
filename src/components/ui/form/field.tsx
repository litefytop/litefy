import { ReactNode } from "react";
import { cn } from "@/lib";
import { Field } from "@/components";
import {
  useFormContext,
  FieldValues,
  Path,
  UseFormReturn,
  RegisterOptions,
} from "react-hook-form";

const formFieldclass = "relative pb-5 **:data-[slot='error']:absolute **:data-[slot='error']:bottom-0";

export type FormFieldProps<T extends FieldValues> = {
  name: Path<T>;
  label: string | ReactNode;
  description?: string;
  children: (props: {
    field: ReturnType<UseFormReturn<T>["register"]>;
    invalid: boolean;
  }) => ReactNode;
  rules?: RegisterOptions<T>;
} & Omit<React.ComponentProps<typeof Field>, "children">;

export function FormField<T extends FieldValues>({
  name,
  label,
  description,
  children,
  rules = {},
  className,
  ...props
}: FormFieldProps<T>) {
  const {
    register,
    formState: { errors },
  } = useFormContext<T>();

  const error = errors[name]?.message as string | undefined;
  const invalid = !!error;

  return (
    <Field {...props} className={cn(FormField.class, className)}>
      <Field.Label htmlFor={String(name)}>{label}</Field.Label>
      {children({
        field: register(name, rules),
        invalid,
      })}
      {description && <Field.Description>{description}</Field.Description>}
      <Field.Error>{error}</Field.Error>
    </Field>
  );
}
FormField.class = formFieldclass;
