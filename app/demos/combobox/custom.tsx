"use client";
import { useState, useRef, useCallback, useEffect, useMemo, useId } from "react";
import { ComboboxRoot, ComboboxInput, ComboboxPopover, ComboboxList, ComboboxOption } from "@/ui";

const options = ["Apple", "Banana", "Orange", "Grape", "Mango", "Peach"];

export default function Demo() {
  const [searchText, setSearchText] = useState("");
  const [highlightValue, setHighlightValue] = useState<string | null>(null);

  const id = useId();
  const anchorName = `--combobox-demo-${id.replace(/[^a-zA-Z0-9_-]/g, "")}`;

  const popoverRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const filtered = useMemo(() => {
    if (!searchText.trim()) return options;
    return options.filter((o) => o.toLowerCase().includes(searchText.toLowerCase()));
  }, [searchText]);

  const openPopover = useCallback(() => {
    popoverRef.current?.showPopover();
  }, []);

  const closePopover = useCallback(() => {
    popoverRef.current?.hidePopover();
    setHighlightValue(null);
  }, []);

  const selectItem = useCallback(
    (opt: string) => {
      setSearchText(opt);
      setHighlightValue(null);
      closePopover();
    },
    [closePopover],
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!popoverRef.current?.matches(":popover-open")) return;
      const target = e.target as HTMLElement;
      if (popoverRef.current?.contains(target)) return;
      closePopover();
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closePopover]);

  useEffect(() => {
    if (!highlightValue || !listRef.current) return;
    const active = listRef.current.querySelector<HTMLElement>(`[data-value="${highlightValue}"]`);
    active?.scrollIntoView({ block: "nearest", behavior: "instant" });
  }, [highlightValue]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      const idx = filtered.findIndex((s) => s === highlightValue);
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          openPopover();
          setHighlightValue(filtered[Math.min(idx + 1, filtered.length - 1)] ?? null);
          break;
        case "ArrowUp": {
          e.preventDefault();
          openPopover();
          const prev = idx - 1;
          setHighlightValue(prev >= 0 ? filtered[prev] : null);
          break;
        }
        case "Enter":
          e.preventDefault();
          if (highlightValue) selectItem(highlightValue);
          break;
        case "Escape":
          e.preventDefault();
          closePopover();
          break;
      }
    },
    [filtered, highlightValue, openPopover, closePopover, selectItem],
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    setHighlightValue(null);
    openPopover();
  };

  return (
    <ComboboxRoot style={{ anchorName }}>
      <ComboboxInput
        value={searchText}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onClick={openPopover}
      />
      <ComboboxPopover
        ref={popoverRef}
        style={{
          margin: "4px 0 0",
          positionAnchor: anchorName,
          positionArea: "bottom span-right",
          justifySelf: "start",
          width: "anchor-size(width)",
          positionTryFallbacks: "flip-block",
        }}
      >
        <ComboboxList
          ref={listRef}
          empty={
            <ComboboxOption className="pointer-events-none text-muted-foreground">
              No data
            </ComboboxOption>
          }
        >
          {filtered.length > 0
            ? filtered.map((opt) => (
                <ComboboxOption
                  key={opt}
                  data-value={opt}
                  aria-selected={opt === highlightValue}
                  onClick={() => selectItem(opt)}
                >
                  {opt}
                </ComboboxOption>
              ))
            : null}
        </ComboboxList>
      </ComboboxPopover>
    </ComboboxRoot>
  );
}
