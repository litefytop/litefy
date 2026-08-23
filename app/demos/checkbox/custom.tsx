"use client";

import { useState } from "react";
import { CheckboxIndicator } from "@/ui";
import { Check, Minus } from "lucide-react";

const checkboxClass =
  "flex items-center justify-center  border border-border bg-background aria-checked:bg-primary text-background transition-colors [&_svg]:size-3 [&_svg]:stroke-4";

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
        <CheckboxIndicator
          checked={values.length > 0}
          onCheckedChange={toggleAll}
          className={checkboxClass}
        >
          {indeterminate ? <Minus /> : <Check />}
        </CheckboxIndicator>
        <span>All</span>
      </label>

      <div className="flex flex-col gap-2 pl-4">
        {allValues.map((val) => (
          <label key={val} className="flex items-center gap-2">
            <CheckboxIndicator
              checked={values.includes(val)}
              onCheckedChange={() => toggleItem(val)}
              className={checkboxClass}
            >
              <Check />
            </CheckboxIndicator>

            <span>{val}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
