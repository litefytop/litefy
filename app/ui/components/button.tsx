import { Loader2 } from "lucide-react";
import React from "react";
import { type ClassNameValue, cn } from "..";

const buttonClass = {
  base: "cursor-pointer inline-flex items-center justify-center gap-2 h-8 min-w-8 px-3 rounded-lg text-sm text-center disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-1 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-outline  [&_svg:not([class*='size-'])]:size-4",
  variant: {
    primary: "bg-primary text-primary-foreground hover:bg-primary-accent",
    danger: "bg-danger/20 text-danger hover:bg-danger-accent",
    outline: "border border-border hover:bg-primary hover:text-primary-foreground",
    text: "hover:text-muted-foreground",
  },
};

export type ButtonLoadingConfig = {
  loading?: boolean;
  icon?: React.ReactNode;
};

export interface ButtonProps extends Omit<React.ComponentProps<"button">, "className"> {
  variant?: keyof typeof buttonClass.variant;
  className?: ClassNameValue;
  loadingConfig?: ButtonLoadingConfig;
}

function hasTextChild(children: React.ReactNode): boolean {
  if (typeof children === "string" || typeof children === "number") {
    return true;
  }
  if (Array.isArray(children)) {
    return children.some((child) => hasTextChild(child));
  }
  if (React.isValidElement(children)) {
    return hasTextChild((children.props as { children?: React.ReactNode }).children);
  }
  return false;
}

function isIconOnly(children: React.ReactNode): boolean {
  const count = React.Children.count(children);
  if (count !== 1) return false;
  return !hasTextChild(children);
}

function Button({
  variant = "primary",
  className,
  loadingConfig,
  children,
  ...props
}: ButtonProps) {
  const { loading: isLoading, icon: customLoadingIcon } = loadingConfig || {};
  const loadingIcon = customLoadingIcon || <Loader2 className="animate-spin" />;
  const isPureIcon = !isLoading && isIconOnly(children);

  return (
    <button
      {...props}
      aria-busy={isLoading}
      data-pure-icon={isPureIcon || undefined}
      className={cn(
        Button.className.base,
        Button.className.variant[variant],
        "data-pure-icon:aspect-square data-pure-icon:px-0",
        className,
      )}
      disabled={isLoading || props.disabled}
    >
      {isLoading && loadingIcon}
      {children}
    </button>
  );
}

Button.className = buttonClass;

export { Button };
