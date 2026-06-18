"use client";

import { Tooltip } from "@/ui/tooltip";

export default function TooltipSideDemo() {
  return (
    <div className="flex flex-col items-center gap-8 py-8">
      <Tooltip side="top">
        <Tooltip.Trigger>Top</Tooltip.Trigger>
        <Tooltip.Content>Tooltip on top</Tooltip.Content>
      </Tooltip>

      <div className="flex items-center gap-8">
        <Tooltip side="left">
          <Tooltip.Trigger>Left</Tooltip.Trigger>
          <Tooltip.Content>Tooltip on left</Tooltip.Content>
        </Tooltip>

        <Tooltip side="right">
          <Tooltip.Trigger>Right</Tooltip.Trigger>
          <Tooltip.Content>Tooltip on right</Tooltip.Content>
        </Tooltip>
      </div>

      <Tooltip side="bottom">
        <Tooltip.Trigger>Bottom</Tooltip.Trigger>
        <Tooltip.Content>Tooltip on bottom</Tooltip.Content>
      </Tooltip>
    </div>
  );
}
