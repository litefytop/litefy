"use client";
import { Button } from "@/ui";
import { Dropdown } from "@/ui";
export default function DropdownAlignmentDemo() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h3 className="text-sm font-medium mb-4">Position Area</h3>
        <div className="flex gap-4">
          <Dropdown
            styles={{ content: { positionArea: "bottom span-right", justifySelf: "start" } }}
            classNames={{ trigger: [Button.class.base, Button.class.variant.primary] }}
            items={[{ label: "Item 1" }, { label: "Item 2" }, { label: "Item 3" }]}
          >
            span-right
          </Dropdown>
          <Dropdown
            classNames={{ trigger: [Button.class.base, Button.class.variant.primary] }}
            items={[{ label: "Item 1" }, { label: "Item 2" }, { label: "Item 3" }]}
          >
            bottom span-all
          </Dropdown>
          <Dropdown
            styles={{ content: { positionArea: "bottom span-left", justifySelf: "end" } }}
            classNames={{ trigger: [Button.class.base, Button.class.variant.primary] }}
            items={[{ label: "Item 1" }, { label: "Item 2" }, { label: "Item 3" }]}
          >
            span-left
          </Dropdown>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-4">Align X (sidebar)</h3>
        <div className="flex gap-4">
          <Dropdown
            alignX="start"
            classNames={{ trigger: [Button.class.base, Button.class.variant.primary] }}
            items={[{ label: "Item 1" }, { label: "Item 2" }, { label: "Item 3" }]}
          >
            alignX start
          </Dropdown>
          <Dropdown
            alignX="end"
            classNames={{ trigger: [Button.class.base, Button.class.variant.primary] }}
            items={[{ label: "Item 1" }, { label: "Item 2" }, { label: "Item 3" }]}
          >
            alignX end
          </Dropdown>
        </div>
      </div>
    </div>
  );
}
