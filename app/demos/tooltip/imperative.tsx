"use client";

import { useRef } from "react";
import { Button, TooltipContent, TooltipTrigger } from "@/ui";

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
        <Button variant="outline" onClick={() => contentRef.current?.showPopover()}>
          Open
        </Button>
        <Button variant="outline" onClick={() => contentRef.current?.hidePopover()}>
          Close
        </Button>
      </div>
    </div>
  );
}
