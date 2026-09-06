"use client";
import * as React from "react";

export interface UseComboboxOptions<T> {
  open: boolean;
  items: T[];
  isItemDisabled?: (item: T) => boolean;
  onSelect?: (item: T, index: number) => void;
}

export interface UseComboboxReturn<T> {
  highlightIndex: number | null;
  setHighlightIndex: React.Dispatch<React.SetStateAction<number | null>>;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  reset: () => void;
}

export function useCombobox<T>({
  open,
  items,
  isItemDisabled,
  onSelect,
}: UseComboboxOptions<T>): UseComboboxReturn<T> {
  const [highlightIndex, setHighlightIndex] = React.useState<number | null>(null);

  const move = (delta: 1 | -1) => {
    const enabled = items
      .map((item, index) => ({ item, index }))
      .filter(({ item }) => !isItemDisabled?.(item));
    if (enabled.length === 0) return;
    if (highlightIndex === null) {
      setHighlightIndex(enabled[0].index);
      return;
    }
    const pos = enabled.findIndex((entry) => entry.index === highlightIndex);
    const next =
      delta === 1
        ? (enabled[pos + 1] ?? enabled[0])
        : (enabled[pos - 1] ?? enabled[enabled.length - 1]);
    setHighlightIndex(next.index);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || items.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      move(1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      move(-1);
    } else if (e.key === "Enter" && highlightIndex !== null) {
      e.preventDefault();
      const item = items[highlightIndex];
      if (!isItemDisabled?.(item)) onSelect?.(item, highlightIndex);
    }
  };

  const reset = React.useCallback(() => setHighlightIndex(null), []);

  return { highlightIndex, setHighlightIndex, handleKeyDown, reset };
}
