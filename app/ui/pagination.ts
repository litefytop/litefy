"use client";

import * as React from "react";

export type UsePaginationOptions = {
  base?: number;
  total: number | (() => number);
  loop?: boolean;
  onChange?: (page: number) => void;
};

export function usePagination({
  base = 0,
  total,
  loop = false,
  onChange,
}: UsePaginationOptions) {
  const getTotal = React.useCallback(() => {
    return typeof total === "function" ? total() : total;
  }, [total]);

  const toInternal = React.useCallback((page: number) => page - base, [base]);
  const toExternal = React.useCallback((idx: number) => idx + base, [base]);

  const normalize = React.useCallback(
    (rawIdx: number): number => {
      const totalCount = getTotal();
      if (totalCount <= 0) return 0;
      if (loop) {
        return ((rawIdx % totalCount) + totalCount) % totalCount;
      }
      return Math.min(totalCount - 1, Math.max(0, rawIdx));
    },
    [getTotal, loop],
  );

  const initInternal = normalize(toInternal(base));
  const [indexInternal, setIndexRaw] = React.useState(initInternal);

  const emit = React.useCallback(
    (idx: number) => onChange?.(toExternal(idx)),
    [onChange, toExternal],
  );

  const setIndex = React.useCallback(
    (page: number | ((prevPage: number) => number)) => {
      setIndexRaw((prevIdx) => {
        let targetPage: number;
        if (typeof page === "function") {
          targetPage = page(toExternal(prevIdx));
        } else {
          targetPage = page;
        }
        const nextIdx = normalize(toInternal(targetPage));
        if (nextIdx !== prevIdx) emit(nextIdx);
        return nextIdx;
      });
    },
    [normalize, toInternal, toExternal, emit],
  );

  const goTo = React.useCallback((page: number) => setIndex(page), [setIndex]);
  const next = React.useCallback(() => setIndex((p) => p + 1), [setIndex]);
  const previous = React.useCallback(() => setIndex((p) => p - 1), [setIndex]);
  const toFirst = React.useCallback(() => setIndex(base), [setIndex, base]);
  const toEnd = React.useCallback(() => {
    const totalCount = getTotal();
    setIndex(base + totalCount - 1);
  }, [setIndex, base, getTotal]);

  const totalCount = getTotal();
  const isFirst = !loop && totalCount > 0 && indexInternal === 0;
  const isEnd = !loop && totalCount > 0 && indexInternal === totalCount - 1;

  React.useEffect(() => {
    setIndexRaw((prevIdx) => {
      const normalized = normalize(prevIdx);
      if (normalized !== prevIdx) emit(normalized);
      return normalized;
    });
  }, [normalize, emit]);

  return {
    index: toExternal(indexInternal),
    total: totalCount,
    setIndex,
    goTo,
    next,
    previous,
    isFirst,
    isEnd,
    toFirst,
    toEnd,
  };
}
