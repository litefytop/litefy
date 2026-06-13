"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

export default function CheckboxBasicDemo() {
  const [checked, setChecked] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Checkbox checked={checked} onValueChange={setChecked}>
          <span>Remember me</span>
        </Checkbox>
      </div>

      <Checkbox.Group defaultValue={["apple", "banana"]}>
        <Checkbox value="apple">Apple</Checkbox>
        <Checkbox value="banana">Banana</Checkbox>
        <Checkbox value="orange">Orange</Checkbox>
      </Checkbox.Group>
    </div>
  );
}
