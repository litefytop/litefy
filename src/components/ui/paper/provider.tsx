"use client";

import { useRef, useCallback } from "react";
import { PaperContext } from "./context";

export type PaperProviderProps = React.ComponentProps<"div"> & {
  children: React.ReactNode;
};

export function PaperProvider({ children, ...props }: PaperProviderProps) {
  const pageIndexRef = useRef(0);

  const registerPage = useCallback(() => {
    const currentPage = pageIndexRef.current;
    pageIndexRef.current += 1;
    return currentPage;
  }, []);

  return (
    <PaperContext.Provider value={{ pageIndexRef, registerPage }}>
      <div {...props}>{children}</div>
    </PaperContext.Provider>
  );
}
