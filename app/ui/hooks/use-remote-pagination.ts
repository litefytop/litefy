import { useCallback, useRef, useState, useEffect } from "react";

export type RemotePaginationFn = (params: {
  page: number;
  size: number;
  keyword: string;
}) => Promise<{
  list: string[];
  total: number;
}>;

interface UseRemotePaginationOptions {
  fetcher: RemotePaginationFn;
  debounceMs?: number;
  pageSize?: number;
}

export function useRemotePagination({
  fetcher,
  debounceMs = 300,
  pageSize = 20,
}: UseRemotePaginationOptions) {
  const [data, setData] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const fetchingRef = useRef(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  const fetch = useCallback(
    async (keyword: string, nextPage: number, append: boolean) => {
      if (fetchingRef.current) return;
      fetchingRef.current = true;
      setLoading(true);
      try {
        const res = await fetcher({ page: nextPage, size: pageSize, keyword });
        setData((prev) => {
          const nextList = append ? [...prev, ...res.list] : res.list;
          setHasMore(nextList.length < res.total);
          return nextList;
        });
        setPage(nextPage);
      } finally {
        if (mountedRef.current) {
          setLoading(false);
          fetchingRef.current = false;
        }
      }
    },
    [fetcher, pageSize],
  );

  const search = useCallback(
    (keyword: string) => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => {
        fetch(keyword, 1, false);
      }, debounceMs);
    },
    [debounceMs, fetch],
  );

  const loadMore = useCallback(() => {
    fetch("", page + 1, true);
  }, [fetch, page]);

  const reset = useCallback(() => {
    setData([]);
    setPage(1);
    setHasMore(true);
  }, []);

  return {
    data,
    loading,
    page,
    hasMore,
    search,
    loadMore,
    reset,
  };
}
