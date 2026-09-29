"use client";

import { Radio } from "@/ui";

export default function RadioDisabledDemo() {
  return (
    <div className="flex flex-col gap-4">
      <Radio name="radio-disabled" value="off" disabled>
        Disabled
      </Radio>
      <Radio name="radio-disabled" value="on" disabled defaultChecked>
        Disabled checked
      </Radio>
    </div>
  );
}
