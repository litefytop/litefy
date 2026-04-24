"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components";
import { cn, ClassNameValue } from "@/lib";

const searchInputclass = {
  base: "w-full",
};

export interface SearchInputProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceDelay?: number;
  className?: ClassNameValue;
  onEnter?: (value: string) => void;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "搜索...",
  debounceDelay = 200,
  className,
  onEnter,
}: SearchInputProps) {
  const [inputValue, setInputValue] = useState(value);
  const [isComposing, setIsComposing] = useState(false);

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = () => {
    setIsComposing(false);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    onChange(inputValue||"");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    if (isComposing) {
      return;
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      onChange(newValue);
    }, debounceDelay);
  };

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <Input
      className={cn(SearchInput.class.base, className)}
      value={inputValue}
      onChange={handleInputChange}
      onCompositionStart={handleCompositionStart}
      onCompositionEnd={handleCompositionEnd}
      onKeyDown={(e) => {
        if (e.key === "Enter" && onEnter) {
          onEnter(inputValue||"");
        }
      }}
      placeholder={placeholder}
    />
  );
}

SearchInput.class = searchInputclass;
