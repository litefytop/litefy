"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { List, Picker, useCombobox } from "@/ui";

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

  const filtered = text.trim()
    ? countries.filter((country) => country.toLowerCase().includes(text.toLowerCase()))
    : countries;

  const { highlightIndex, setHighlightIndex, handleKeyDown, reset } = useCombobox({
    open,
    items: filtered,
    onSelect: (item) => {
      setText(item);
      setOpen(false);
      reset();
    },
  });

  return (
    <Picker
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset();
      }}
      value={text}
      onValueChange={(next) => {
        setText(next);
        reset();
      }}
      placeholder="Select a country"
      trailing={<ChevronDown />}
      onKeyDown={handleKeyDown}
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
          onSelect={(item) => {
            setText(item);
            setOpen(false);
            reset();
          }}
          className="max-h-64"
        />
      </div>
    </Picker>
  );
}
