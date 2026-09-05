import { useState } from "react";
import { Radio } from "@/ui";

export default function RadioControlledDemo() {
  const [selected, setSelected] = useState("option1");

  return (
    <div className="space-y-4">
      <Radio.Group
        value={selected}
        onValueChange={setSelected}
        options={[
          { label: "Option 1", value: "option1" },
          { label: "Option 2", value: "option2" },
          { label: "Option 3", value: "option3" },
        ]}
      />
      <p className="text-sm text-muted-foreground">Selected: {selected}</p>
    </div>
  );
}
