"use client";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/ui/skins";

export default function TooltipBasicDemo() {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
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
