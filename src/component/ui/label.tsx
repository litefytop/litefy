import { cn, ClassNameValue } from "@/lib";

export type LabelProps = Omit<React.ComponentProps<"label">, "className"> & {
  className?: ClassNameValue;
};

function Label({ className, children, ...props }: LabelProps) {
  return (
    <label 
      className={cn(Label.class, className)} 
      {...props}
    >
      {children}
    </label>
  );
}

Label.class = `text-sm leading-none font-medium select-none`;

export { Label };
