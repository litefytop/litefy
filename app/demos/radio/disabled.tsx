"use client";

import { Radio } from "@/ui";

export default function RadioDisabledDemo() {
  return (
    <div className="flex flex-col gap-4">
      <Radio.Group name="disabled-example">
        <Radio value="disabled1">Option 1</Radio>
        <Radio value="disabled2" disabled>
          Disabled Option 2
        </Radio>
        <Radio value="disabled3">Option 3</Radio>
      </Radio.Group>

      <Radio.Group
        disabled
        defaultValue="group-disabled1"
        name="group-disabled-example"
      >
        <Radio value="group-disabled1">Group Option 1</Radio>
        <Radio value="group-disabled2">Group Option 2</Radio>
        <Radio value="group-disabled3">Group Option 3</Radio>
      </Radio.Group>
    </div>
  );
}
