"use client";

import { NumberField } from "@/ui";

export default function NumberFieldInvalidDemo() {
  return (
    <div className="flex flex-col gap-4">
      <NumberField defaultValue={5} invalid />
      <NumberField defaultValue={10} min={0} max={20} invalid />
    </div>
  );
}
