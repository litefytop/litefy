"use client";
import { Popover } from "@/ui";
import { Button } from "@/ui";

function ActionList() {
  return (
    <div className="flex flex-col">
      {["Item 1", "Item 2", "Item 3"].map((label) => (
        <button
          key={label}
          type="button"
          className="px-2 py-1.5 text-left text-sm font-semibold rounded-sm hover:bg-hover"
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export default function PopoverAlignmentDemo() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h3 className="text-sm font-medium mb-4">Position Area</h3>
        <div className="flex gap-4">
          <Popover
            styles={{ content: { positionArea: "bottom span-right", justifySelf: "start" } }}
            classNames={{ trigger: [Button.class.base, Button.class.variant.primary] }}
            trigger="span-right"
          >
            <ActionList />
          </Popover>
          <Popover
            classNames={{ trigger: [Button.class.base, Button.class.variant.primary] }}
            trigger="bottom span-all"
          >
            <ActionList />
          </Popover>
          <Popover
            styles={{ content: { positionArea: "bottom span-left", justifySelf: "end" } }}
            classNames={{ trigger: [Button.class.base, Button.class.variant.primary] }}
            trigger="span-left"
          >
            <ActionList />
          </Popover>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-4">Align X (sidebar)</h3>
        <div className="flex gap-4">
          <Popover
            alignX="start"
            classNames={{ trigger: [Button.class.base, Button.class.variant.primary] }}
            trigger="alignX start"
          >
            <ActionList />
          </Popover>
          <Popover
            alignX="end"
            classNames={{ trigger: [Button.class.base, Button.class.variant.primary] }}
            trigger="alignX end"
          >
            <ActionList />
          </Popover>
        </div>
      </div>
    </div>
  );
}
