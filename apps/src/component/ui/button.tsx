import { ClassNameValue, cn } from "@/lib";
import { Loader2 } from "lucide-react";

const buttonClass = {
  base: "h-9 min-w-16 px-3 py-1 gap-1 whitespace-nowrap rounded-md cursor-pointer inline-flex items-center justify-center shrink-0 select-none [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 disabled:pointer-events-none disabled:opacity-50 data-svg-only:aspect-square data-svg-only:min-w-0",
  variant: {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    destructive: `bg-destructive text-white 
      hover:bg-destructive/90
      focus-visible:ring-destructive/20`,
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline: `border-2 border-primary bg-transparent hover:bg-primary hover:text-primary-foreground`,
    ghost: "hover:bg-muted hover:text-muted-foreground",
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
  iconOnly?: boolean;
} & React.ComponentProps<"button">;

function Button({
  variant = "primary",
  className,
  loadingConfig,
  children,
  iconOnly,
  ...props
}: ButtonProps) {
  const { loading: isLoading, icon: customLoadingIcon } = loadingConfig || {};

  const loadingIcon = customLoadingIcon || <Loader2 className="animate-spin" />;

  return (
    <button
      {...props}
      data-svg-only={iconOnly}
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
