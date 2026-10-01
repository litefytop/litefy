"use client";
import { Popover } from "@/ui";

const triggerClass = { trigger: "litefy-button litefy-button-outline" };

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
      <section>
        <h3 className="text-sm font-medium mb-4">Placement</h3>
        <div className="flex gap-4">
          <Popover
            placement={{ side: "bottom", align: "start" }}
            trigger="align start"
            classNames={triggerClass}
          >
            <ActionList />
          </Popover>
          <Popover trigger="align center" classNames={triggerClass}>
            <ActionList />
          </Popover>
          <Popover
            placement={{ side: "bottom", align: "end" }}
            trigger="align end"
            classNames={triggerClass}
          >
            <ActionList />
          </Popover>
        </div>
      </section>
      <section>
        <h3 className="text-sm font-medium mb-4">Align X (sidebar)</h3>
        <div className="flex gap-4">
          <Popover alignX="start" trigger="alignX start" classNames={triggerClass}>
            <ActionList />
          </Popover>
          <Popover alignX="end" trigger="alignX end" classNames={triggerClass}>
            <ActionList />
          </Popover>
        </div>
      </section>
    </div>
  );
}
