"use client";

import { Slider } from "@/ui";

export default function SliderBasicDemo() {
  return (
    <div className="flex flex-col gap-4 w-full max-w-sm">
      <Slider defaultValue={50} aria-label="Basic slider" />
      <Slider defaultValue={30} disabled aria-label="Disabled slider" />
    </div>
  );
}
