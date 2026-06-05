"use client";

import { cn, ClassNameValue } from "@/lib";
import {
  useRef,
  useCallback,
  useState,
  useEffect,
  createContext,
  useContext,
  useMemo,
} from "react";

interface PaperContextType {
  register: () => number;
  unregister: () => void;
  totalPages: number;
}

const PaperContext = createContext<PaperContextType | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export function usePaper() {
  const ctx = useContext(PaperContext);
  if (!ctx) throw new Error("usePaper must be used within PaperProvider");
  return ctx;
}

export type PaperProviderProps = React.ComponentProps<"div"> & {
  onTotalPagesChange?: (totalPages: number) => void;
};

export function PaperProvider({ children, onTotalPagesChange, ...props }: PaperProviderProps) {
  const countRef = useRef(0);
  const [totalPages, setTotalPages] = useState(0);

  const register = useCallback(() => {
    const idx = countRef.current;
    countRef.current += 1;
    return idx;
  }, []);

  const unregister = useCallback(() => {
    countRef.current -= 1;
  }, []);

  useEffect(() => {
    const val = countRef.current;
    setTotalPages(val);
    onTotalPagesChange?.(val);
  }, [onTotalPagesChange]);

  const contextValue = useMemo(() => ({
    register,
    unregister,
    totalPages
  }), [register, unregister, totalPages]);

  return (
    <PaperContext.Provider value={contextValue}>
      <div {...props}>{children}</div>
    </PaperContext.Provider>
  );
}

const paperclass = {
  base: "mx-auto print:bg-white shadow-lg border-t print:shadow-none print:border-0 print:mx-0 print:p-0 bg-card text-card-foreground",
  variant: {
    a4: {
      portrait: "w-[210mm] h-[297mm] p-[10mm] page-break-after print:w-[210mm] print:h-[297mm] print:p-[10mm]",
      landscape: "w-[297mm] h-[210mm] p-[10mm] page-break-after print:w-[297mm] print:h-[297mm] print:p-[10mm]",
    },
    a5: {
      portrait: "w-[148mm] h-[210mm] p-[5mm] page-break-after print:w-[148mm] print:h-[210mm] print:p-[5mm]",
      landscape: "w-[210mm] h-[148mm] p-[5mm] page-break-after print:w-[210mm] print:h-[148mm] print:p-[5mm]",
    },
    scroll: {
      portrait: "w-full h-fit flex flex-col overflow-y-auto p-[10mm] print:w-full print:h-fit print:overflow-visible print:p-[10mm]",
      landscape: "h-full w-fit flex flex-col overflow-x-auto p-[10mm] print:h-full print:w-fit print:overflow-visible print:p-[10mm]",
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
};

function Paper({
  children,
  className,
  variant = "scroll",
  orientation = "portrait",
  ...props
}: PaperProps) {
  const { register, unregister } = usePaper();
  const isMounted = useRef(false);

  useEffect(() => {
    if (isMounted.current) return;
    isMounted.current = true;
    register();

    return () => {
      unregister();
      isMounted.current = false;
    };
  }, [register, unregister]);

  return (
    <div
      {...props}
      className={cn(
        paperclass.base,
        paperclass.variant[variant][orientation],
        className
      )}
    >
      {children}
    </div>
  );
}

Paper.class = paperclass;
export { Paper };
