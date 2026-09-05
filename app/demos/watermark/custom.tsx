"use client";

import { useState } from "react";
import { Watermark } from "@/ui";

export default function Demo() {
  const [rotate, setRotate] = useState(-20);

  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <Watermark.Root className="rounded-xl border bg-background p-6">
        <h3 className="text-lg font-semibold">Internal Document</h3>
        <p className="text-muted-foreground mt-2 text-sm">
          Assemble Watermark.Root and Watermark.Canvas to control every canvas
          option. The canvas redraws when props or the container size change.
        </p>
        <Watermark.Canvas
          text="CONFIDENTIAL"
          fontSize={14}
          color="primary"
          rotate={rotate}
          gap={80}
          padding={16}
          opacity={0.15}
        />
      </Watermark.Root>
      <label className="flex items-center gap-3 text-sm">
        <span className="text-muted-foreground">Rotate</span>
        <input
          type="range"
          min={-45}
          max={0}
          value={rotate}
          onChange={(e) => setRotate(Number(e.target.value))}
        />
      </label>
    </div>
  );
}
