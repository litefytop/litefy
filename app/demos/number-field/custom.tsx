"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { NumberDecrement, NumberGroup, NumberIncrement } from "@/ui";

export default function Demo() {
  const [value, setValue] = useState(5);
  const clamp = (n: number) => Math.min(10, Math.max(0, n));

  return (
    <NumberGroup>
      <NumberDecrement disabled={value <= 0} onClick={() => setValue(clamp(value - 1))}>
        <Minus className="size-4" />
      </NumberDecrement>
      <input
        role="spinbutton"
        aria-valuemin={0}
        aria-valuemax={10}
        aria-valuenow={value}
        value={value}
        onChange={(e) => {
          const num = parseInt(e.target.value, 10);
          setValue(Number.isNaN(num) ? 0 : clamp(num));
        }}
        className="h-8 w-full min-w-0 flex-1 border-0 bg-transparent px-2 text-center text-sm"
      />
      <NumberIncrement disabled={value >= 10} onClick={() => setValue(clamp(value + 1))}>
        <Plus className="size-4" />
      </NumberIncrement>
    </NumberGroup>
  );
}
