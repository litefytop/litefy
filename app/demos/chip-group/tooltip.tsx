"use client";

import { ChipGroup, Tooltip } from "@/ui";
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

export default function ChipGroupTooltipDemo() {
  return (
    <ChipGroup
      items={tags}
      className="max-w-xs"
      renderMore={(hidden) =>
        hidden.length > 0 && (
          <Tooltip
            content={
              <span className="flex max-w-60 flex-wrap gap-1">
                {hidden.map((item) => (
                  <span
                    key={item.value}
                    className="rounded-full bg-muted px-2 py-0.5 text-xs whitespace-nowrap"
                  >
                    {item.label}
                  </span>
                ))}
              </span>
            }
          >
            <button
              type="button"
              className="shrink-0 cursor-pointer rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium whitespace-nowrap"
            >
              +{hidden.length}
            </button>
          </Tooltip>
        )
      }
    />
  );
}
