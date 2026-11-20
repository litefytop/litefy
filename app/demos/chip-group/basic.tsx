"use client";

import { useState } from "react";
import { ChipGroup, Popover, Slider } from "@/ui/skins";
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
    <div className="flex w-full flex-col items-center gap-3">
      <ChipGroup
        style={{ width }}
        items={tags}
        renderMore={(hidden) => hidden.length === 0 ? null : (
          <Popover aria-haspopup="false" trigger={`+${hidden.length}`}>
            <ul aria-label="Hidden tags" className="flex flex-col items-start gap-1 p-2">
              {hidden.map((item) => (
                <li
                  key={item.value}
                  className="inline-flex h-5 items-center gap-1 rounded-sm bg-primary/12 px-2 text-xs leading-4 text-primary whitespace-nowrap"
                >
                  {item.label}
                </li>
              ))}
            </ul>
          </Popover>
        )}
      />
      <Slider
        min={120}
        max={320}
        step={4}
        value={width}
        onChange={setWidth}
        aria-label="Container width"
        className="min-w-33 max-w-44"
      />
    </div>
  );
}
