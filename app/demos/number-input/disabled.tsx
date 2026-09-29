"use client";

import { NumberInput } from "@/ui";

export default function NumberInputDisabledDemo() {
  return (
    <div className="flex max-w-md flex-col gap-4">
      <NumberInput disabled placeholder="0.00" aria-label="Disabled price" />
      <NumberInput
        defaultValue={2026}
        thousands
        prefix="$"
        suffix="USD"
        disabled
        aria-label="Disabled amount in US dollars"
      />
    </div>
  );
}
