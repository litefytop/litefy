"use client";

import { useState } from "react";
import { Checkbox } from "@/ui";
import { Check, Minus } from "lucide-react";

export default function Demo() {
  const [values, setValues] = useState(["Controlled"]);
  const allValues = ["Controlled", "Group", "Custom"];
  const allChecked = allValues.every((v) => values.includes(v));
  const indeterminate = !allChecked && values.length > 0;
  return (
    <div className="flex flex-col gap-4">
      <Checkbox
        checked={values.length > 0}
        indicator={indeterminate ? <Minus /> : allChecked ? <Check /> : null}
        onClick={() => {
          setValues(allChecked ? [] : allValues);
        }}
      >
        All
      </Checkbox>
      <Checkbox.Group
        value={values}
        onChange={setValues}
        className="pl-4"
        options={[
          {
            label: "Controlled",
            value: "Controlled",
            indicator: <Check />,
          },
          {
            label: "Group",
            value: "Group",
            indicator: <Check />,
          },
          {
            label: "Custom-Indicator",
            value: "Custom",
            indicator: <Check />,
          },
        ]}
      />
    </div>
  );
}
