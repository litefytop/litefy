"use client";

import { Slider } from "@/ui";

export default function SliderInvalidDemo() {
  return (
    <div className="flex flex-col gap-4 w-full max-w-sm">
      <Slider defaultValue={80} invalid aria-label="Invalid slider" />
      <Slider defaultValue={20} aria-label="Valid slider" />
    </div>
  );
}
