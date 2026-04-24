import { useMemo } from "react";
import { SheetColumn } from "./context";

type MapOption = { value: string; label: string } | string;

export function useColumn<T extends Record<string, unknown>>(
  data: T[],
  colsDef: SheetColumn<T>[],
) {
  const dataIndexHash = useMemo(() => {
    const hash = new Map<string, Set<string>>();


    colsDef.forEach((col) => {
      const uniqueValues = new Set<string>();
      data.forEach((row) => {
        if (col.dataIndex) {
          const value = row[col.dataIndex];
          
          if (value !== undefined && value !== null) {
            uniqueValues.add(String(value));
          }
          hash.set(col.dataIndex as string, uniqueValues);
        }
      });
    });

    return hash;
  }, [data, colsDef]);

  const getColumnData = (
    dataIndex: string,
    map?: MapOption[],
  ): { value: string | number; label: string }[] => {
    if (map) {
      return map.map((item) => {
        if (typeof item === "string") {
          return { value: item, label: item };
        }
        return { value: item.value, label: item.label };
      });
    }
    const uniqueValues = dataIndexHash.get(dataIndex);

    if (!uniqueValues) return [];
    return Array.from(uniqueValues).map((value) => ({ value, label: value }));
  };

  return { getColumnData };
}
