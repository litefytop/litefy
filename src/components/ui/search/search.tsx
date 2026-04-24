"use client";

import { useState, useMemo } from "react";
import {  Checkbox, Text } from "@/components";
import { cn, ClassNameValue } from "@/lib";
import { SearchInput } from "./input";

const searchclass = {
  base: "w-full",
};

export type SearchProps<T extends string = string> = {
  data?: {
    value: T | number;
    label: string;
  }[];
  value?: T[];
  onValueChange?: (values: T[]) => void;
  placeholder?: string;
  debounceDelay?: number;
  className?: ClassNameValue;
  area?: string;
};

export function Search<T extends string>({
  data=[],
  value = [],
  onValueChange,
  placeholder = "搜索...",
  debounceDelay = 200,
  className,
}: SearchProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    const lowerSearchTerm = searchTerm.toLowerCase();
    return data.filter((item) =>
      item.label.toLowerCase().includes(lowerSearchTerm),
    );
  }, [data, searchTerm]);

  const handleValueChange = (newValues: T[]) => {
    onValueChange?.(newValues);
  };

  return (
    <div className={cn(searchclass.base, className)}>
      <SearchInput
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder={placeholder}
        debounceDelay={debounceDelay}
        className="w-full mb-2"
      />
      {Boolean(data.length) && (
        <div className="max-h-60 overflow-y-auto">
          <Checkbox.Group
            value={value}
            onValueChange={handleValueChange}
            direction="vertical"
          >
            {filteredData.map((item) => (
              <Checkbox
                key={item.value}
                value={String(item.value)}
                className={"w-full gap-5"}
              >
                <Text className="flex-1 text-start">{item.label}</Text>
              </Checkbox>
            ))}
          </Checkbox.Group>
        </div>
      )}
    </div>
  );
}

Search.class = searchclass;
