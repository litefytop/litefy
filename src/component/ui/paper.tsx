"use client";

import { cn, ClassNameValue } from "@/lib";

import { useRef, useCallback } from "react";
import { createContext, useContext, RefObject } from "react";

export interface PaperContextType {
  pageIndexRef: RefObject<number>;
  registerPage: () => number;
  totalPages?: number;
  contentRef: RefObject<HTMLDivElement | null>;
}

const PaperContext = createContext<PaperContextType | null>(null);

export function usePaper() {
  return useContext(PaperContext);
}

export type PaperProviderProps = React.ComponentProps<"div"> & {
  children: React.ReactNode;
  totalPages?: number;
};

export function PaperProvider({ children, totalPages, ...props }: PaperProviderProps) {
  const pageIndexRef = useRef(0);
  const contentRef = useRef<HTMLDivElement>(null);

  const registerPage = useCallback(() => {
    const currentPage = pageIndexRef.current;
    pageIndexRef.current += 1;
    return currentPage;
  }, []);

  return (
    <PaperContext.Provider value={{ pageIndexRef, registerPage, totalPages, contentRef }}>
      <div {...props} ref={contentRef}>
        {children}
      </div>
    </PaperContext.Provider>
  );
}

const paperclass = {
  base: "mx-auto print:bg-white shadow-lg border-t print:shadow-none print:border-0 print:mx-0 print:p-0 bg-card text-card-foreground",
  variant: {
    a4: {
      portrait:
        "w-[210mm] h-[297mm] p-[10mm] page-break-after print:w-[210mm] print:h-[297mm] print:p-[10mm]",
      landscape:
        "w-[297mm] h-[210mm] p-[10mm] page-break-after print:w-[297mm] print:h-[210mm] print:p-[10mm]",
    },
    a5: {
      portrait:
        "w-[148mm] h-[210mm] p-[5mm] page-break-after print:w-[148mm] print:h-[210mm] print:p-[5mm]",
      landscape:
        "w-[210mm] h-[148mm] p-[5mm] page-break-after print:w-[210mm] print:h-[148mm] print:p-[5mm]",
    },
    scroll: {
      portrait:
        "w-full h-fit flex flex-col overflow-y-auto p-[10mm] print:w-full print:h-fit print:overflow-visible print:p-[10mm]",
      landscape:
        "h-full w-fit flex flex-col overflow-x-auto p-[10mm] print:h-full print:w-fit print:overflow-visible print:p-[10mm]",
    },
  },
};

type PaperVariant = keyof typeof paperclass.variant;
type PaperOrientation = "portrait" | "landscape";

export type PaperProps = React.ComponentProps<"div"> & {
  children: React.ReactNode;
  className?: ClassNameValue;
  variant?: PaperVariant;
  orientation?: PaperOrientation;
  countable?: boolean;
};

function Paper({
  children,
  className,
  variant = "scroll",
  orientation = "portrait",
  countable = true,
  ...props
}: PaperProps) {
  const context = usePaper();
  let pageIndex: number | undefined;

  if (countable && context) {
    pageIndex = context.registerPage();
  }

  return (
    <div
      {...props}
      className={cn(
        paperclass.base,
        paperclass.variant[variant][orientation],
        className,
      )}
      data-page-index={pageIndex}
      data-total-pages={context?.totalPages}
    >
      {children}
    </div>
  );
}

Paper.class = paperclass;

export { Paper };
