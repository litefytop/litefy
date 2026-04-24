import { ClassNameValue, cn } from "@/lib";
import { Spin } from "./spin";

const buttonClass = {
  base: `cursor-pointer outline-none
  inline-flex items-center justify-center shrink-0 user-select:none
  [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0
  focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]
  disabled:pointer-events-none disabled:opacity-50`,
  variant: {
    primary:
      "bg-primary text-primary-foreground hover:bg-primary/90",
    destructive: `bg-destructive text-white 
      hover:bg-destructive/90
      focus-visible:ring-destructive/20`,
    secondary:
      "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline: `border border-primary bg-transparent 
      hover:bg-accent hover:text-accent-foreground 
      dark:border-foreground/40 dark:text-foreground dark:hover:bg-accent dark:hover:text-accent-foreground`,
    ghost: "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
    link: "text-primary underline-offset-4 hover:underline dark:text-primary-foreground",
    text: "text-primary hover:text-primary/80 dark:text-primary-foreground dark:hover:text-primary-foreground/80"
  },
  direction:{
    horizontal:"h-9 min-w-9 px-3 py-1 has-[>svg]:px-2 gap-1 rounded-md",
    vertical:"flex-col gap-2 px-3 py-1"
  }
};

export type ButtonLoadingConfig = {
  loading?: boolean;
  icon?: React.ReactNode;
};

export type ButtonProps = {
  variant?: keyof typeof buttonClass.variant;
  direction?: keyof typeof buttonClass.direction;
  className?: ClassNameValue;
  loading?: ButtonLoadingConfig;
} & Omit<React.ComponentProps<"button">, "className">;

function Button({
  variant = "primary",
  direction = "horizontal",
  className,
  loading,
  children,
  ...props
}: ButtonProps) {
  const isLoading = loading?.loading;

  const loadingIcon = loading?.icon || (isLoading && <Spin />);

  return (
    <button
      className={cn(
        Button.class.base,
        Button.class.variant[variant],
        Button.class.direction[direction],
        className,
      )}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {loadingIcon}
      {children}
    </button>
  );
}

Button.class = buttonClass;

export { Button };
