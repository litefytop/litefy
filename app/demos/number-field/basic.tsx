"use client";

import { NumberField } from "@/ui";

export default function Demo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <NumberField defaultValue={2026} thousands prefix="$" suffix="USD" />
      <NumberField defaultValue={5} min={0} max={100} step={5} thousands />
      <NumberField defaultValue={3.14} step={0.01} thousands placeholder="0.00" />
      <NumberField defaultValue={5} positiveInteger indicator={false} />
    </div>
  );
}
