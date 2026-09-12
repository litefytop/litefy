"use client";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/ui";

export default function TooltipBasicDemo() {
  return (
    <div className="flex items-center justify-center gap-8 py-8">
      <Tooltip>
        <TooltipTrigger>Hover me</TooltipTrigger>
        <TooltipContent>Tooltip content</TooltipContent>
      </Tooltip>

      <Tooltip delay={300}>
        <TooltipTrigger>Hover me too</TooltipTrigger>
        <TooltipContent>Another tooltip</TooltipContent>
      </Tooltip>
    </div>
  );
}
