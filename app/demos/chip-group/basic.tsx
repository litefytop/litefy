"use client";

import { useState } from "react";
import { ChipGroup, Popover, Slider } from "@/ui";
import type { ChipItem } from "@/ui";

const tags: ChipItem[] = [
  { value: "react", label: "React" },
  { value: "typescript", label: "TypeScript" },
  { value: "tailwindcss", label: "Tailwind CSS" },
  { value: "vite", label: "Vite" },
  { value: "next-js", label: "Next.js" },
  { value: "web-components", label: "Web Components" },
  { value: "accessibility", label: "Accessibility" },
  { value: "design-system", label: "Design System" },
  { value: "css", label: "CSS" },
  { value: "performance", label: "Performance" },
];

export default function ChipGroupBasicDemo() {
  const [width, setWidth] = useState(240);

  return (
    <div className="flex w-80 max-w-full flex-col gap-3">
      <div style={{ width }}>
        <ChipGroup
          items={tags}
          className="max-w-full"
          renderMore={(hidden) => (
            <Popover
              trigger={`+${hidden.length}`}
              classNames={{
                trigger:
                  "cursor-pointer rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium whitespace-nowrap transition-colors hover:bg-primary hover:text-primary-foreground",
              }}
            >
              <ul className="flex max-w-60 flex-col">
                {tags.map((item) => (
                  <li
                    key={item.value}
                    className="truncate px-2 py-1.5 text-sm text-muted-foreground"
                  >
                    {item.label}
                  </li>
                ))}
              </ul>
            </Popover>
          )}
        />
      </div>
      <Slider
        min={120}
        max={320}
        step={4}
        value={width}
        onChange={setWidth}
        aria-label="Container width"
      />
      <p className="text-sm text-muted-foreground">Container width: {width}px</p>
    </div>
  );
}
