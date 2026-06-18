"use client";

import { Checkbox } from "@/ui/checkbox";

export default function CheckboxDisabledDemo() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Checkbox disabled>
          <span>Disabled checkbox</span>
        </Checkbox>
      </div>

      <Checkbox.Group disabled defaultValue={["apple"]}>
        <Checkbox value="apple">Apple</Checkbox>
        <Checkbox value="banana">Banana</Checkbox>
        <Checkbox value="orange">Orange</Checkbox>
      </Checkbox.Group>
    </div>
  );
}
