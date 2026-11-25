import * as React from "react";
import { Form as FormHeadless, FormSubmit as FormSubmitHeadless, FormContext } from "@/ui";
import { cn } from "../utils/cn";
import { buttonVariants } from "./button";

type FormSubmitProps = React.ComponentProps<typeof FormSubmitHeadless>;

const formSizeClasses = {
  sm: "max-w-[20rem]",
  md: "max-w-[24rem]",
  lg: "max-w-[28rem]",
  xl: "max-w-[32rem]",
};

const formClasses = "w-full min-w-0";

const formSubmitClassesByState = (disabled: boolean | undefined) =>
  disabled ? buttonVariants.disabled : buttonVariants.primary;

export function FormSubmit({ className, children, ...props }: FormSubmitProps) {
  const { isPending } = React.useContext(FormContext);
  const disabled = isPending || props.disabled;
  return <FormSubmitHeadless {...props} className={cn(formSubmitClassesByState(disabled), children === null || children === undefined ? "pure-icon" : undefined, className)}>{children}</FormSubmitHeadless>;
}

export function Form({ size = "lg", className, ...props }: React.ComponentProps<typeof FormHeadless>) {
  return <FormHeadless {...props} size={size} className={cn(formClasses, formSizeClasses[size], className)} />;
}
