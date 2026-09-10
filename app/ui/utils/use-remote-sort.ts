"use client";

import * as React from "react";

export type RemoteSortDirection = "asc" | "desc";

export type RemoteSortState<K extends string = string> = {
  key: K;
  direction: RemoteSortDirection;
} | null;

export interface UseRemoteSortOptions<K extends string = string> {
  
  sortableKeys: readonly K[];
  
  onSortChange?: (sort: { key: K; direction: RemoteSortDirection }) => void;
  
  debounceMs?: number;
  
  cycle?: "asc-desc" | "asc-only";
  initialSort?: RemoteSortState<K>;
}

export interface UseRemoteSortReturn<K extends string = string> {
  sort: RemoteSortState<K>;
  
  toggleSort: (key: K) => void;
  setSort: (sort: RemoteSortState<K>) => void;
  clearSort: () => void;
  
  queryParams: { sortKey?: K; sortOrder?: RemoteSortDirection };
  
  queryString: string;
}

export function useRemoteSort<K extends string = string>(
  options: UseRemoteSortOptions<K>,
): UseRemoteSortReturn<K> {
  const { sortableKeys, onSortChange, debounceMs = 0, cycle = "asc-desc", initialSort = null } =
    options;

  const [sort, setSortState] = React.useState<RemoteSortState<K>>(initialSort);
  const timerRef = React.useRef<number | null>(null);
  const latestRef = React.useRef(sort);
  latestRef.current = sort;

  React.useEffect(() => {
    if (!onSortChange) return;
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      if (latestRef.current) {
        onSortChange(latestRef.current as { key: K; direction: RemoteSortDirection });
      }
    }, debounceMs);
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
    
  }, [sort?.key, sort?.direction, debounceMs]);

  const setSort = React.useCallback((next: RemoteSortState<K>) => {
    setSortState(next);
  }, []);

  const clearSort = React.useCallback(() => setSortState(null), []);

  const toggleSort = React.useCallback(
    (key: K) => {
      if (!sortableKeys.includes(key)) return;
      setSortState((prev) => {
        if (prev?.key !== key) return { key, direction: "asc" };
        if (cycle === "asc-only") return prev.direction === "asc" ? null : { key, direction: "asc" };
        if (prev.direction === "asc") return { key, direction: "desc" };
        return null;
      });
    },
    [sortableKeys, cycle],
  );

  const queryParams = sort ? { sortKey: sort.key, sortOrder: sort.direction } : {};
  const queryString = sort
    ? `sortKey=${encodeURIComponent(sort.key)}&sortOrder=${sort.direction}`
    : "";

  return { sort, toggleSort, setSort, clearSort, queryParams, queryString };
}
