import { type ClassNameValue, cn } from "@/lib";

export type UploadProps = Omit<
  React.ComponentProps<"input">,
  "type" | "className"
> & {
  invalid?: boolean;
  className?: ClassNameValue;

  onChange?: (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => undefined | { invalid?: string };
};

export function Upload({
  className,
  invalid,
  disabled,
  ...props
}: UploadProps) {
  return (
    <input
      type="file"
      disabled={disabled}
      data-invalid={invalid ? true : undefined}
      aria-invalid={invalid}
      {...props}
      className={cn(
        "appearance-none outline-none h-9 font-medium text-sm border rounded-md",
        "file:bg-primary file:text-primary-foreground file:h-full  file:rounded-l-md file:px-3",
        "disabled:opacity-50 disabled:pointer-events-none",
        "data-invalid:border-destructive data-invalid:file:bg-destructive",
        className,
      )}
    />
  );
}
