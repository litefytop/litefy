"use client";

import { useRef } from "react";
import { Tooltip } from "@/ui/tooltip";

export default function TooltipImperativeDemo() {
  const contentRef = useRef<HTMLDivElement>(null);

  const handleOpen = () => {
    contentRef.current?.showPopover();
  };

  const handleClose = () => {
    contentRef.current?.hidePopover();
  };

  return (
    <div className="flex flex-col items-center gap-4 py-8">
      <Tooltip>
        <Tooltip.Trigger>Hover Trigger</Tooltip.Trigger>
        <Tooltip.Content ref={contentRef}>
          Imperatively controlled tooltip
        </Tooltip.Content>
      </Tooltip>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleOpen}
          className="px-4 py-2 text-sm border rounded hover:bg-accent"
        >
          Open
        </button>
        <button
          type="button"
          onClick={handleClose}
          className="px-4 py-2 text-sm border rounded hover:bg-accent"
        >
          Close
        </button>
      </div>
    </div>
  );
}
