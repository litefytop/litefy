"use client";

import { useState } from "react";
import { NumberField } from "@/ui/skins";

export default function Demo() {
  const [count, setCount] = useState<number | undefined>(1);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <span className="w-32 text-sm">Quantity · 1–99</span>
        <NumberField
          positiveInteger
          min={1}
          max={99}
          value={count}
          onValueChange={setCount}
          aria-label="Quantity"
        />
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <span className="w-32 text-sm">Rate · 0–1 step 0.1</span>
        <NumberField min={0} max={1} step={0.1} defaultValue={0.5} aria-label="Rate" />
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <span className="w-32 text-sm">Stock · ≤ 999</span>
        <NumberField
          positiveInteger
          thousands
          max={999}
          defaultValue={123}
          aria-label="Stock"
        />
      </div>
    </div>
  );
}