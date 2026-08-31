"use client";

import { Tooltip, TooltipTrigger } from "@/ui";

export default function TooltipBasicDemo() {
  return (
    <div className="flex items-center justify-center gap-8 py-8">
      <Tooltip content="Tooltip content">
        <TooltipTrigger>Hover me</TooltipTrigger>
      </Tooltip>

      <Tooltip content="Another tooltip" delay={300}>
        <TooltipTrigger>Hover me too</TooltipTrigger>
      </Tooltip>
    </div>
  );
}
