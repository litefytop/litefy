import { ClassNameValue, cn } from "@/lib";

export type InputGroupProps = Omit<React.ComponentProps<"div">, "className"> & {
  className?: ClassNameValue;
};

function InputGroup({ className, children, ...props }: InputGroupProps) {
  return (
    <div
      role="group"
      className={cn(InputGroup.class, className)}
      {...props}
    >
      {children}
    </div>
  );
}

InputGroup.class = `border-input bg-background flex w-full items-center rounded-md border shadow-xs outline-none
  [&>svg]:mx-2 [&>input]:w-full [&>*:not(input)]:shrink-0`;


export { InputGroup };
