"use client";

import { NumberInput } from "@/ui";

export default function NumberInputDisabledDemo() {
  return (
    <div className="max-w-md">
      <NumberInput disabled placeholder="0.00" aria-label="Disabled price" />
    </div>
  );
}
