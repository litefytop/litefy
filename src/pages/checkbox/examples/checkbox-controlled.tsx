import { useState } from "react";
import { Checkbox } from "@/component";

export default function CheckboxControlled() {
  const [checked, setChecked] = useState<string[]>(["option1"]);

  return (
    <Checkbox
      label="Controlled Checkbox"
      value={checked}
      onValueChange={setChecked}
      options={[
        {
          value: "option1",
          label: "Option 1",
        },
        {
          value: "option2",
          label: "Option 2",
        },
        {
          value: "option3",
          label: "Option 3",
        },
      ]}
    />
  );
}
