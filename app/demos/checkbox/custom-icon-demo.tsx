"use client";

import { Check } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

export default function CheckboxCustomIconDemo() {
  const customIndicator = (checked: boolean) => (
    <div
      data-checked={checked || undefined}
      className={`group size-4 rounded border-2 flex items-center justify-center transition-colors 
           data-checked:bg-primary data-checked:border-primary data-checked:text-primary-foreground
           bg-transparent border-border
      `}
    >
       <Check className="size-4 group-data-checked:block hidden stroke-3" />
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Checkbox indicator={customIndicator} >
          <span>Custom icon checkbox</span>
        </Checkbox>
      </div>

      <Checkbox.Group defaultValue={["option1"]}>
        <Checkbox
          indicator={customIndicator}
          value="option1"
          >
          <span>Option 1</span>
        </Checkbox>
        <Checkbox
          indicator={customIndicator}
          value="option2"
          >
          <span>Option 2</span>
        </Checkbox>
        <Checkbox
          indicator={customIndicator}
          value="option3"
          disabled
        >
          <span>Option 3</span>
        </Checkbox>
      </Checkbox.Group>
    </div>
  );
}
