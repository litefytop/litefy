"use client";

import { NumberInput } from "@/ui/skins";

export default function Demo() {
  return (
    <div className="flex w-full flex-col gap-3 items-center">
      <NumberInput defaultValue={2026} max={999999} thousands prefix="$" suffix="USD" aria-label="Amount in US dollars" />
      <NumberInput defaultValue={5} min={0} max={100} step={5} thousands aria-label="Quantity" />
      <NumberInput defaultValue={3.14} step={0.01} thousands placeholder="0.00" aria-label="Price" />
      <NumberInput defaultValue={5} positiveInteger indicator={false} aria-label="Count" />
    </div>
  );
}
