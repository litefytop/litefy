"use client";

import * as React from "react";
import { cn, type ClassNameValue } from "@/lib";

export type FieldProps = {
  className?: ClassNameValue;
  children?: React.ReactNode;
} & React.ComponentProps<"div">;

export function Field({ className, children, ...props }: FieldProps) {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      {children}
    </div>
  );
}

Field.Label = function FieldLabel({
  className,
  children,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)} {...props}>
      {children}
    </label>
  );
};

Field.Description = function FieldDescription({
  className,
  children,
  ...props
}: React.ComponentProps<"small">) {
  return (
    <small className={cn("text-sm text-muted-foreground", className)} {...props}>
      {children}
    </small>
  );
};

Field.Error = function FieldError({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  if (!children) return null;
  return (
    <div className={cn("text-sm font-medium text-destructive", className)} {...props}>
      {children}
    </div>
  );
};

export type FieldSetProps = {
  className?: ClassNameValue;
  children?: React.ReactNode;
  legend?: string;
} & React.FieldsetHTMLAttributes<HTMLFieldSetElement>;

export function FieldSet({ className, children, legend, ...props }: FieldSetProps) {
  return (
    <fieldset className={cn("space-y-2", className)} {...props}>
      {legend && <legend className="text-sm font-medium leading-none">{legend}</legend>}
      {children}
    </fieldset>
  );
}
