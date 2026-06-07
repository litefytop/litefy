import { ClassNameValue, cn } from "@/lib";
import { Loader2 } from "lucide-react";

const buttonClass = {
  base: {
    display: "inline-flex items-center justify-center cursor-pointer",
    size: "gap-2 h-9 min-w-8",
    spacing: "px-3 py-0",
    border: "border border-transparent rounded-lg",
    font: "font-sans text-sm text-center",
    hasIcon:
      "[&:has(>svg:only-child)]:p-1 [&:has(>svg:only-child)]:h-8 [&_svg:not([class*='size-'])]:size-4",
  },
  variant: {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    destructive: `bg-destructive text-white 
      hover:bg-destructive/90
      focus-visible:ring-destructive/20`,
    outline: `border-2 border-primary bg-transparent hover:bg-primary hover:text-primary-foreground`,
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

function Button({
  variant = "primary",
  className,
  loadingConfig,
  children,

  ...props
}: ButtonProps) {
  const { loading: isLoading, icon: customLoadingIcon } = loadingConfig || {};

  const loadingIcon = customLoadingIcon || <Loader2 className="animate-spin" />;

  return (
    <button
      {...props}

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
