import * as React from "react";
import {
  ComboboxTrigger,
  ComboboxPopover,
  ComboboxInput,
  ComboboxList,
  ComboboxOption,
} from "@/ui";

export default function Demo() {
  const id = React.useId();
  const popoverId = `popover-${id}`;

  const popoverRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLUListElement>(null);

  const [value, setValue] = React.useState("");
  const [searchText, setSearchText] = React.useState("");
  const [highlightValue, setHighlightValue] = React.useState<string | null>(null);

  const options = ["Apple", "Banana", "Cherry", "Date", "Elderberry"];

  const suggestions = React.useMemo(() => {
    if (!searchText.trim()) return options;
    return options.filter((opt) => opt.toLowerCase().includes(searchText.toLowerCase()));
  }, [options, searchText]);

  const closePopover = React.useCallback(() => {
    popoverRef.current?.hidePopover();
    setHighlightValue(null);
  }, []);

  React.useEffect(() => {
    const el = popoverRef.current;
    if (!el) return;
    const onToggle = (e: ToggleEvent) => {
      if (e.newState === "open") {
        inputRef.current?.focus();
      } else {
        setHighlightValue(null);
      }
    };
    el.addEventListener("toggle", onToggle);
    return () => el.removeEventListener("toggle", onToggle);
  }, []);

  React.useLayoutEffect(() => {
    if (!highlightValue || !listRef.current) return;
    const item = listRef.current.querySelector<HTMLElement>(`[data-value="${highlightValue}"]`);
    if (item) {
      item.scrollIntoView({ block: "nearest", behavior: "instant" });
    }
  }, [highlightValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    setHighlightValue(null);
  };

  const handleSelect = (opt: string) => {
    setValue(opt);
    setSearchText("");
    closePopover();
  };

  const handleScroll = (e: React.UIEvent<HTMLUListElement>) => {
    const el = e.currentTarget;
    const distanceToBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    if (distanceToBottom < 120) {
      // 这里放 loadMore 逻辑
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const currentIdx = suggestions.findIndex((s) => s === highlightValue);
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightValue(suggestions[Math.min(currentIdx + 1, suggestions.length - 1)] ?? null);
        break;
      case "ArrowUp":
        e.preventDefault();
        if (currentIdx <= 0) {
          setHighlightValue(null);
        } else {
          setHighlightValue(suggestions[currentIdx - 1] ?? null);
        }
        break;
      case "Enter":
        e.preventDefault();
        if (highlightValue) handleSelect(highlightValue);
        break;
    }
  };

  const handlePopoverClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      inputRef.current?.focus();
    }
  };

  return (
    <>
      <ComboboxTrigger
        popoverTarget={popoverId}
        className="h-9 px-3 rounded-md border flex items-center justify-between gap-2 w-70"
      >
        {value || "Select fruit..."}
      </ComboboxTrigger>

      <ComboboxPopover
        ref={popoverRef}
        id={popoverId}
        onClick={handlePopoverClick}
        className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-70 rounded-lg border bg-background shadow-lg overflow-hidden p-2"
      >
        <ComboboxInput
          ref={inputRef}
          value={searchText}
          placeholder="Search..."
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="w-full px-3 py-2 text-sm outline-none border-b bg-transparent"
        />

        <ComboboxList
          ref={listRef}
          onScroll={handleScroll}
          className="min-h-48 max-h-64 overflow-auto p-1"
        >
          {suggestions.length === 0 ? (
            <ComboboxOption className="px-3 py-2 text-sm text-muted-foreground pointer-events-none">
              No data
            </ComboboxOption>
          ) : (
            suggestions.map((opt) => (
              <ComboboxOption
                key={opt}
                data-value={opt}
                active={opt === highlightValue}
                onClick={() => handleSelect(opt)}
                className="px-3 py-2 text-sm cursor-pointer hover:bg-muted data-[active=true]:bg-muted rounded-sm"
              >
                {opt}
              </ComboboxOption>
            ))
          )}
        </ComboboxList>
      </ComboboxPopover>
    </>
  );
}
