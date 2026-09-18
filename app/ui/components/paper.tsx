import { type ClassNameValue, cn } from "../utils/cn";

export type PaperVariant = "a4" | "a5" | "a4-landscape" | "a5-landscape";

const paperClass = {
  base:
    "mx-auto flex w-full h-fit flex-col overflow-y-auto bg-background text-foreground rounded-lg p-[10mm] shadow-base border border-border print:bg-white print:text-black print:shadow-none print:border-0 print:mx-0 print:p-0 print:w-full print:h-fit print:overflow-visible",
  variant: {
    a4: "block w-[210mm] h-[297mm] p-[10mm] overflow-visible break-after-page print:w-[210mm] print:h-[297mm] print:p-[10mm]",
    "a4-landscape":
      "block w-[297mm] h-[210mm] p-[10mm] overflow-visible break-after-page print:w-[297mm] print:h-[210mm] print:p-[10mm]",
    a5: "block w-[148mm] h-[210mm] p-[5mm] overflow-visible break-after-page print:w-[148mm] print:h-[210mm] print:p-[5mm]",
    "a5-landscape":
      "block w-[210mm] h-[148mm] p-[5mm] overflow-visible break-after-page print:w-[210mm] print:h-[148mm] print:p-[5mm]",
  },
};

export type PaperProps = Omit<React.ComponentProps<"div">, "className"> & {
  className?: ClassNameValue;
  variant?: PaperVariant;
};

function Paper({ variant, className, ...props }: PaperProps) {
  return (
    <div
      {...props}
      className={cn(paperClass.base, variant && paperClass.variant[variant], className)}
    />
  );
}

export { Paper };
