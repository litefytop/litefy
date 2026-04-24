import { FormHTMLAttributes } from "react";
import { FormProvider, SubmitHandler, UseFormReturn } from "react-hook-form";
import { FormSubmit } from "./submit";
import { cn } from "@/lib/utils";

import { toast } from "sonner";
import { FieldSet } from "@/components";
import { FormField } from "./field";

type FormProps<T extends Record<string, unknown>> = Omit<
  FormHTMLAttributes<HTMLFormElement>,
  "onSubmit"
> & {
  form: UseFormReturn<T>;
  onSubmit: SubmitHandler<T>;
  usePromiseToast?: boolean;
  toastMessages?: {
    loading?: string;
    success?: string | ((data: unknown) => string);
    error?: string | ((error: Error) => string);
  };
};

function Form<T extends Record<string, unknown>>({
  form,
  onSubmit,
  toastMessages,
  className,
  ...props
}: FormProps<T>) {
  const handleSubmitWithToast = (data: T) => {
    return toast.promise(Promise.resolve(onSubmit(data)), {
      loading: toastMessages?.loading,
      success: toastMessages?.success,
      error: toastMessages?.error,
    });
  };

  return (
    <FormProvider {...form}>
      <form
        {...props}
        data-slot="form"
        onSubmit={form.handleSubmit(handleSubmitWithToast)}
        noValidate
        className={cn(Form.class, className)}
      >
        {props.children}
      </form>
    </FormProvider>
  );
}

Form.Submit = FormSubmit;
Form.Field = FormField;
Form.FieldSet = FieldSet;

Form.class = "flex w-full flex-col gap-3";
export { Form };
