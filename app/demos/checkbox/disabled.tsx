"use client";

import { Checkbox } from "@/ui";

export default function CheckboxDisabledDemo() {
  return (
    <div className="flex flex-col gap-4">
      <Checkbox disabled>Disabled</Checkbox>
      <Checkbox disabled defaultChecked>
        Disabled checked
      </Checkbox>
    </div>
  );
}
