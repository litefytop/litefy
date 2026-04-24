"use client";

import * as React from "react";
import {
  SortOrder,
  SheetContext,
  SheetContextProps,
} from "./context";
import { FilterValue } from "@/components";

export type SheetPrimitiveProps = {
  children: React.ReactNode;
  current: number;
  setCurrent: React.Dispatch<React.SetStateAction<number>>;
  pageSize: number;
  setPageSize: React.Dispatch<React.SetStateAction<number>>;
  internalRefreshCount: number;
  setInternalRefreshCount: React.Dispatch<React.SetStateAction<number>>;
  externalRefreshCount?: number;
  initialFilter?: Record<string, FilterValue>;
};

export function SheetPrimitive({
  children,
  current,
  setCurrent,
  pageSize,
  setPageSize,
  internalRefreshCount,
  setInternalRefreshCount,
  externalRefreshCount,
  initialFilter={} ,
}: SheetPrimitiveProps) {
  const [filter, setFilter] = React.useState(initialFilter);
  const [currentOrder, setCurrentOrder] = React.useState<
    [string | null, SortOrder]
  >([null, null]);

  const contextValue: SheetContextProps = {
    filter,
    setFilter,
    currentOrder,
    setCurrentOrder,
    current,
    setCurrent,
    pageSize,
    setPageSize,
    internalRefreshCount,
    setInternalRefreshCount,
    externalRefreshCount,
  };

  return (
    <SheetContext.Provider value={contextValue}>
      {children}
    </SheetContext.Provider>
  );
}


