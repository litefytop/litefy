"use client";

import { useState } from "react";
import { NumberField } from "@/ui";

export default function Demo() {
  const [count, setCount] = useState<number | undefined>(1);

  return (
    <div className="flex w-full max-w-md flex-wrap items-center gap-6">
      <NumberField
        positiveInteger
        min={1}
        max={99}
        value={count}
        onValueChange={setCount}
        aria-label="Quantity"
      />
      <NumberField min={0} max={1} step={0.1} defaultValue={0.5} aria-label="Rate" />
      <NumberField defaultValue={7} disabled aria-label="Disabled" />
    </div>
  );
}
