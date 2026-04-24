import { ClassNameValue, cn } from "@/lib/utils";

const inputclass = {
  default: `appearance-none bg-background  
    h-8 px-2 py-1 text-sm rounded-md
    shadow-xs outline-none border-input border
    disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 
    focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] 
    aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive 
    placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground
    w-full`,
  plain: `appearance-none bg-transparent outline-none w-full
    disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 
    placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground`,
};

export type InputProps = Omit<React.ComponentProps<"input">, "className"> & {
  invalid?: boolean;
  className?: ClassNameValue;
  variant?: keyof typeof inputclass;
};

function Input({
  className,
  variant = "default",
  invalid,
  ...props
}: InputProps) {
  return (
    <input
      data-slot="input"
      className={cn(inputclass[variant], className)}
      autoComplete="off"
      {...props}
      aria-invalid={invalid}
    />
  );
}

Input.class = inputclass;

export { Input };
