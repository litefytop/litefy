"use client";

import { FilterValue } from "@/components";
import * as React from "react";

export type SortOrder = "ascend" | "descend" | null;

export type FilterOption = 
  | { type: "text" | "number" | "date" }
  | { type: "enum"; map: Array<string | { value: string | number; label: string }> };

export type EnumMap = Array<string | { value: string | number; label: string }>;

export type FilterOperator = 
  | "eq"      // 精确匹配 (equal)
  | "like"    // 模糊匹配
  | "ne"      // 不等于
  | "null"    // 空值
  | "notNull" // 非空
  | "ge"      // 大于等于 (greater or equal)
  | "le"      // 小于等于 (less or equal)
  | "gt"      // 大于
  | "lt"      // 小于
  | "range"; // 区间

export type SortOption<T extends Record<string, unknown>> = {
  sortable?: boolean;
  sorter?: (a: T, b: T) => number;
  sortOrder?: SortOrder;
};

export interface SheetColumn<T extends Record<string, unknown>> {
  className?: string;
  style?: React.CSSProperties;
  dataIndex?: keyof T;
  render?: (row: T, rowIndex: number) => React.ReactNode;
  filterOption?: FilterOption;
  sortOption?: SortOption<T>;
  header: React.ReactNode;
}

export type SheetContextProps = {
  filter: Record<string, FilterValue>;
  setFilter: React.Dispatch<React.SetStateAction< Record<string, FilterValue>>>;
  currentOrder: [string | null, SortOrder];
  setCurrentOrder: React.Dispatch<
    React.SetStateAction<[string | null, SortOrder]>
  >;
  current: number;
  setCurrent: React.Dispatch<React.SetStateAction<number>>;
  pageSize: number;
  setPageSize: React.Dispatch<React.SetStateAction<number>>;
  internalRefreshCount: number;
  setInternalRefreshCount: React.Dispatch<React.SetStateAction<number>>;
  externalRefreshCount?: number;
};

export const SheetContext = React.createContext<SheetContextProps | undefined>(
  undefined,
);

export function useSheetContext() {
  const context = React.useContext(SheetContext);
  if (!context) {
    throw new Error("useSheetContext must be used within a SheetProvider");
  }
  return context;
}


