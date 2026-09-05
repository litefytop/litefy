"use client";

import { useRef } from "react";
import { TooltipContent, TooltipTrigger } from "@/ui";

export default function TooltipImperativeDemo() {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex flex-col items-center gap-4 py-8">
      <TooltipTrigger popoverId="imperative-tip" anchorName="--imperative-tip">
        Hover Trigger
      </TooltipTrigger>
      <TooltipContent
        id="imperative-tip"
        anchorName="--imperative-tip"
        ref={contentRef}
      >
        Imperatively controlled tooltip
      </TooltipContent>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => contentRef.current?.showPopover()}
          className="px-4 py-2 text-sm border rounded hover:bg-primary-accent"
        >
          Open
        </button>
        <button
          type="button"
          onClick={() => contentRef.current?.hidePopover()}
          className="px-4 py-2 text-sm border rounded hover:bg-primary-accent"
        >
          Close
        </button>
      </div>
    </div>
  );
}
