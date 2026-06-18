"use client";

import { NumberField } from "@/ui";

export default function NumberFieldBasicDemo() {
  return (
    <div className="flex flex-col gap-4">
      <NumberField defaultValue={0} />
      <NumberField defaultValue={10} min={0} max={100} />
      <NumberField defaultValue={3.14} step={0.01} />
      <NumberField defaultValue={5} positiveInteger />
    </div>
  );
}
