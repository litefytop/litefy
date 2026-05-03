import { createContext, useContext, RefObject } from "react";

export interface PaperContextType {
  pageIndexRef: RefObject<number>;
  registerPage: () => number;
}

export const PaperContext = createContext<PaperContextType | null>(null);

export function usePaperContext() {
  return useContext(PaperContext);
}
