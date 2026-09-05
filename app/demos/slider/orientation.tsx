"use client";

import { Slider } from "@/ui";

export default function SliderOrientationDemo() {
  return (
    <div className="flex items-center gap-16 py-2">
      <Slider defaultValue={50} aria-label="Horizontal slider" />
      <div className="flex h-40 items-center justify-center">
        <Slider defaultValue={50} orientation="vertical" aria-label="Vertical slider" />
      </div>
    </div>
  );
}
