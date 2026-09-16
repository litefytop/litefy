import { Loader2 } from "lucide-react";
import React from "react";
import { type ClassNameValue, cn } from "../utils/cn";

const buttonClass = {
  base: "cursor-pointer inline-flex items-center justify-center gap-2 h-8 min-w-8 px-3 rounded-md text-sm text-center shadow-base focus-visible:outline-1 focus-visible:outline-outline focus-visible:ring-3 focus-visible:ring-ring/50 active:shadow-[inset_0_2px_4px_0_var(--accent)] [&_svg:not([class*='size-'])]:size-4",
  variant: {
    primary: "bg-primary text-primary-foreground hover:bg-primary-accent",
    danger:
      "bg-danger/15 hover:bg-danger/20 text-danger border hover:border-danger/20 focus-visible:outline-danger focus-visible:ring-danger/50",
    outline: "border border-border hover:bg-hover",
    text: "hover:text-muted-foreground/75 shadow-none",
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

function isIconOnly(children: React.ReactNode): boolean {
  const arr = React.Children.toArray(children);
  return arr.length === 1 && React.isValidElement(arr[0]);
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
