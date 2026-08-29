"use client";
import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { ComboboxRoot, ComboboxInput, ComboboxPopover, ComboboxList, ComboboxOption } from "@/ui";

const options = ["Apple", "Banana", "Orange", "Grape", "Mango", "Peach"];

export default function Demo() {
  const [searchText, setSearchText] = useState("");
  const [highlightValue, setHighlightValue] = useState<string | null>(null);

  const rootRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    if (!searchText.trim()) return options;
    return options.filter((o) => o.toLowerCase().includes(searchText.toLowerCase()));
  }, [searchText]);

  const onValueChange = useCallback((val: string) => {
    console.log("onValueChange:", val);
  }, []);

  const updatePopoverPosition = useCallback(() => {
    if (!rootRef.current || !popoverRef.current) return;
    if (!popoverRef.current.matches(":popover-open")) return;
    const triggerRect = rootRef.current.getBoundingClientRect();
    popoverRef.current.style.inset = "unset";
    popoverRef.current.style.top = `${triggerRect.bottom + 4}px`;
    popoverRef.current.style.left = `${triggerRect.left}px`;
    popoverRef.current.style.width = `${triggerRect.width}px`;
  }, []);

  const openPopover = useCallback(() => {
    popoverRef.current?.showPopover();
  }, []);

  const closePopover = useCallback(() => {
    popoverRef.current?.hidePopover();
    setHighlightValue(null);
  }, []);

  const selectItem = useCallback(
    (opt: string) => {
      console.log("selectItem:", opt);
      setSearchText(opt);
      setHighlightValue(null);
      closePopover();
      onValueChange(opt);
      inputRef.current?.focus();
    },
    [closePopover, onValueChange],
  );

  useEffect(() => {
    const el = popoverRef.current;
    if (!el) return;
    const onToggle = (e: ToggleEvent) => {
      if (e.newState === "open") {
        updatePopoverPosition();
      } else {
        setHighlightValue(null);
      }
    };
    el.addEventListener("toggle", onToggle);
    return () => el.removeEventListener("toggle", onToggle);
  }, [updatePopoverPosition]);

  useEffect(() => {
    const onResize = () => updatePopoverPosition();
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onResize, true);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize, true);
    };
  }, [updatePopoverPosition]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!popoverRef.current?.matches(":popover-open")) return;
      const target = e.target as HTMLElement;
      if (rootRef.current?.contains(target)) return;
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
        case "ArrowUp":
          e.preventDefault();
          openPopover();
          const prev = idx - 1;
          setHighlightValue(prev >= 0 ? filtered[prev] : null);
          break;
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
    <ComboboxRoot ref={rootRef}>
      <ComboboxInput
        ref={inputRef}
        value={searchText}
        placeholder="typing to search..."
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onClick={openPopover}
        className="h-9 w-full px-3 py-2 border rounded-md outline-none"
      />
      <ComboboxPopover
        ref={popoverRef}
        popover="manual"
        className="border bg-background shadow-lg  rounded-md max-h-64 overflow-auto -top-full"
      >
        <ComboboxList ref={listRef} className="p-1">
          {filtered.length === 0 ? (
            <ComboboxOption className="pointer-events-none px-3 py-2 text-sm text-muted-foreground">
              No data
            </ComboboxOption>
          ) : (
            filtered.map((opt) => (
              <ComboboxOption
                key={opt}
                data-value={opt}
                aria-selected={opt === highlightValue}
                onClick={() => selectItem(opt)}
                className="px-3 py-2 text-sm cursor-pointer hover:bg-hover rounded-sm"
              >
                {opt}
              </ComboboxOption>
            ))
          )}
        </ComboboxList>
      </ComboboxPopover>
    </ComboboxRoot>
  );
}
