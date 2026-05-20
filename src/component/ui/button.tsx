import { ClassNameValue, cn } from "@/lib";
import { Loader2 } from "lucide-react";

const buttonClass = {
  base: "h-9 min-w-9 px-2 py-1 gap-1 whitespace-nowrap rounded-full cursor-pointer inline-flex items-center justify-center shrink-0 select-none [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50",
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
} & React.ComponentProps<"button">;

function Button({
  variant = "primary",
  className,
  loadingConfig,
  children,
  ...props
}: ButtonProps) {
  const { loading: isLoading, icon: customLoadingIcon } = loadingConfig || {};

  const loadingIcon = customLoadingIcon || (
    <Loader2 className="animate-spin" />
  );

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
