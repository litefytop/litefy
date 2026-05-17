import { useState } from "react";
import { Radio } from "@/component";

export default function RadioControlled() {
  const [value, setValue] = useState<string>("option1");

  return (
    <Radio
      label="Controlled Radio Group"
      value={value}
      onValueChange={setValue}
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
