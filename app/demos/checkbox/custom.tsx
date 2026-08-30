"use client";
import { useState } from "react";
import { CheckboxLabel, CheckboxRoot, CheckboxIndicator } from "@/ui";
import { Check, Minus } from "lucide-react";

const ALL_VALUES = ["Controlled", "Group", "Custom"];

export default function Demo() {
  const [values, setValues] = useState<string[]>([]);
  const allChecked = ALL_VALUES.every((v) => values.includes(v));
  const indeterminate = !allChecked && values.length > 0;

  const toggleAll = () => setValues(allChecked ? [] : ALL_VALUES);
  const toggleItem = (val: string) =>
    setValues((prev) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val],
    );

  return (
    <div className="flex flex-col gap-4">
      <CheckboxLabel>
        <CheckboxRoot checked={values.length > 0} onChange={toggleAll} />
        <CheckboxIndicator checked={values.length > 0}>
          {indeterminate ? <Minus /> : <Check />}
        </CheckboxIndicator>
        <span>All</span>
      </CheckboxLabel>
      <div className="flex flex-col gap-2 pl-4">
        {ALL_VALUES.map((val) => (
          <CheckboxLabel key={val}>
            <CheckboxRoot
              checked={values.includes(val)}
              onChange={() => toggleItem(val)}
            />
            <CheckboxIndicator checked={values.includes(val)}>
              <Check />
            </CheckboxIndicator>
            <span>{val}</span>
          </CheckboxLabel>
        ))}
      </div>
    </div>
  );
}
