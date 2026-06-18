"use client";

import { Check } from "lucide-react";
import { useState } from "react";
import { Checkbox } from "@/ui/checkbox";

export default function CheckboxCustomIconDemo() {
  const [checked, setChecked] = useState(false);
  const [groupValue, setGroupValue] = useState<string[]>(["option1"]);

  const customIndicator = (checked: boolean, wrapperClassName?: string) => (
    <span
      data-checked={checked || undefined}
      className={`group  data-checked:bg-primary size-4 border  ${wrapperClassName}`}
    >
      <Check className="size-4 group-data-checked:opacity-100 opacity-0  text-primary-foreground" />
    </span>
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Checkbox
          checked={checked}
          onValueChange={setChecked}
          indicator={customIndicator}
        >
          <span>Custom icon checkbox</span>
        </Checkbox>
      </div>

      <Checkbox.Group value={groupValue} onValueChange={setGroupValue}>
        <Checkbox indicator={customIndicator} value="option1">
          <span>Option 1</span>
        </Checkbox>
        <Checkbox indicator={customIndicator} value="option2">
          <span>Option 2</span>
        </Checkbox>
        <Checkbox indicator={customIndicator} value="option3" disabled>
          <span>Option 3</span>
        </Checkbox>
      </Checkbox.Group>
    </div>
  );
}
