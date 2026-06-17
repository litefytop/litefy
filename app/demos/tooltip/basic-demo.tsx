"use client";

import { Tooltip } from "@/ui/tooltip";

export default function TooltipBasicDemo() {
  return (
    <div className="flex items-center justify-center gap-8 py-8">
      <Tooltip>
        <Tooltip.Trigger>Hover me</Tooltip.Trigger>
        <Tooltip.Content>Tooltip content</Tooltip.Content>
      </Tooltip>

      <Tooltip>
        <Tooltip.Trigger>Click me</Tooltip.Trigger>
        <Tooltip.Content>Another tooltip</Tooltip.Content>
      </Tooltip>
    </div>
  );
}
