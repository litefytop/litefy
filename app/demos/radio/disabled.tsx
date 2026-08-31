"use client";

import { Radio } from "@/ui";

export default function RadioDisabledDemo() {
  return (
    <div className="flex flex-col gap-4">
      <Radio.Group
        name="disabled-example"
        options={[
          { label: "Option 1", value: "disabled1" },
          { label: "Disabled Option 2", value: "disabled2", disabled: true },
          { label: "Option 3", value: "disabled3" },
        ]}
      />

      <Radio.Group
        disabled
        defaultValue="group-disabled1"
        name="group-disabled-example"
        options={[
          { label: "Group Option 1", value: "group-disabled1" },
          { label: "Group Option 2", value: "group-disabled2" },
          { label: "Group Option 3", value: "group-disabled3" },
        ]}
      />
    </div>
  );
}
