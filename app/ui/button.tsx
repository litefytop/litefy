import { Loader2 } from "lucide-react";
import React from "react";
import { type ClassNameValue, cn } from "@/lib";

const buttonClass = {
  base: "inline-flex items-center justify-center cursor-pointer gap-2 h-8 min-w-8 px-3 py-0 border border-transparent rounded-lg font-sans text-sm text-center data-pure-icon:aspect-square data-pure-icon:px-0 [&_svg:not([class*='size-'])]:size-4",
  variant: {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    destructive:
      "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20",
    outline:
      "border-2 border-primary bg-transparent hover:bg-primary hover:text-primary-foreground",
    text: "text-foreground hover:text-foreground/60",
  },
};

export type ButtonLoadingConfig = {
  loading?: boolean;
  icon?: React.ReactNode;
};

export type ButtonProps = {
  variant?: keyof typeof buttonClass.variant;
  className?: ClassNameValue;
  loadingConfig?: ButtonLoadingConfig;
} & React.ComponentProps<"button">;

function hasTextChild(children: React.ReactNode): boolean {
  if (typeof children === "string" || typeof children === "number") {
    return true;
  }
  if (Array.isArray(children)) {
    return children.some((child) => hasTextChild(child));
  }
  if (React.isValidElement(children)) {
    return hasTextChild(
      (children.props as { children?: React.ReactNode }).children,
    );
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
        Button.class.base,
        Button.class.variant[variant],
        className,
      )}
      disabled={isLoading || props.disabled}
    >
      {isLoading && loadingIcon}
      {children}
    </button>
  );
}

Button.class = buttonClass;

export { Button };
