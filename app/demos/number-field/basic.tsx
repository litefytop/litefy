"use client";

import { useState } from "react";
import { NumberField } from "@/ui";

export default function Demo() {
  const [count, setCount] = useState<number | undefined>(1);

  return (
    <div className="flex w-full max-w-md flex-wrap items-start gap-6">
      <div className="flex flex-col gap-1">
        <span className="text-xs text-muted-foreground">Quantity · 1–99</span>
        <NumberField
          positiveInteger
          min={1}
          max={99}
          value={count}
          onValueChange={setCount}
          aria-label="Quantity"
        />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-xs text-muted-foreground">Rate · 0–1, step 0.1</span>
        <NumberField min={0} max={1} step={0.1} defaultValue={0.5} aria-label="Rate" />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-xs text-muted-foreground">Embedded · no border</span>
        <NumberField
          variant="embedded"
          positiveInteger
          min={1}
          max={5}
          defaultValue={1}
          aria-label="Embedded quantity"
        />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-xs text-muted-foreground">Disabled</span>
        <NumberField defaultValue={7} disabled aria-label="Disabled" />
      </div>
    </div>
  );
}
