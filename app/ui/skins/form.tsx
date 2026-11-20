import * as React from "react";
import { Form as FormHeadless, FormSubmit as FormSubmitHeadless } from "@/ui";
import { cn } from "../utils/cn";
import { buttonVariants } from "./button";

type FormSubmitProps = React.ComponentProps<typeof FormSubmitHeadless>;


export function FormSubmit({ className, ...props }: FormSubmitProps) {
  return <FormSubmitHeadless {...props} className={cn(buttonVariants.primary, className)} />;
}

export function Form(props: React.ComponentProps<typeof FormHeadless>) {
  return <FormHeadless {...props} />;
}
