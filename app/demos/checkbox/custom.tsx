"use client";

import { useState } from "react";
import { CheckboxRoot } from "@/ui";
import { Check, Minus } from "lucide-react";

const checkboxClass =
  "flex items-center justify-center size-3 border border-border bg-background aria-checked:bg-primary aria-checked:text-background transition-colors [&_svg]:size-3 [&_svg]:stroke-4";

export default function Demo() {
  const [values, setValues] = useState<string[]>([]);
  const allValues = ["Controlled", "Group", "Custom"];
  const allChecked = allValues.every((v) => values.includes(v));
  const indeterminate = !allChecked && values.length > 0;

  const toggleAll = () => {
    setValues(allChecked ? [] : allValues);
  };

  const toggleItem = (val: string) => {
    setValues((prev) => (prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]));
  };

  return (
    <div className="flex flex-col gap-4">
      <label className="flex items-center gap-2">
        <CheckboxRoot checked={allChecked} onCheckedChange={toggleAll} className={checkboxClass}>
          {indeterminate ? <Minus /> : allChecked ? <Check /> : null}
        </CheckboxRoot>
        <span>All</span>
      </label>

      <div className="flex flex-col gap-2 pl-4">
        {allValues.map((val) => (
          <label key={val} className="flex items-center gap-2">
            <CheckboxRoot
              checked={values.includes(val)}
              onCheckedChange={() => toggleItem(val)}
              className={checkboxClass}
            >
              {values.includes(val) ? <Check /> : null}
            </CheckboxRoot>
            <span>{val}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
