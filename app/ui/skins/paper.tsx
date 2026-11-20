import * as React from "react";
import { cn } from "../utils/cn";

export type PaperFormat = "a5" | "a4" | "letter";

export interface PaperProps extends Omit<React.ComponentProps<"div">, "className"> {
  format?: PaperFormat;
  className?: string;
}

const rootClasses =
  "bg-(--paper-surface) text-(--paper-ink) p-8 rounded-none shadow-surface print:shadow-none";

const formatClasses: Record<PaperFormat, string> = {
  a5: "w-[148mm] min-h-[210mm]",
  a4: "w-[210mm] min-h-[297mm]",
  letter: "w-[8.5in] min-h-[11in]",
};

export function Paper({ format = "a4", className, ...props }: PaperProps) {
  return <div {...props} data-format={format} className={cn(rootClasses, formatClasses[format], className)} />;
}
