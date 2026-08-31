"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { List, Picker } from "@/ui";

const countries = [
  "China",
  "United States",
  "Japan",
  "Germany",
  "France",
  "United Kingdom",
  "Canada",
  "Australia",
  "Italy",
  "Brazil",
];

export default function Demo() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [highlightIndex, setHighlightIndex] = useState<number | null>(null);

  const filtered = text.trim()
    ? countries.filter((country) => country.toLowerCase().includes(text.toLowerCase()))
    : countries;

  const handleSelect = (item: string) => {
    setText(item);
    setHighlightIndex(null);
    setOpen(false);
  };

  return (
    <Picker
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setHighlightIndex(null);
      }}
      value={text}
      onValueChange={(text) => {
        setText(text);
        setHighlightIndex(null);
      }}
      placeholder="Select a country"
      trailing={<ChevronDown />}
      onKeyDown={(e) => {
        if (!open) return;
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setHighlightIndex(
            highlightIndex === null || highlightIndex >= filtered.length - 1
              ? 0
              : highlightIndex + 1,
          );
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          setHighlightIndex(
            highlightIndex === null || highlightIndex <= 0
              ? filtered.length - 1
              : highlightIndex - 1,
          );
        } else if (e.key === "Enter" && highlightIndex !== null) {
          e.preventDefault();
          handleSelect(filtered[highlightIndex]);
        }
      }}
    >
      <div className="p-1">
        <List
          highlightIndex={highlightIndex}
          onHighlightChange={setHighlightIndex}
          items={filtered}
          renderItem={(item) => item}
          getKey={(item) => item}
          empty={
            <div className="pointer-events-none px-3 py-2 text-sm text-muted-foreground">
              No data
            </div>
          }
          onSelect={handleSelect}
          className="max-h-64"
        />
      </div>
    </Picker>
  );
}
