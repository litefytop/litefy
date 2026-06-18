import { useState } from "react";
import { Radio } from "@/ui";

export default function RadioControlledDemo() {
  const [selected, setSelected] = useState("option1");

  return (
    <div className="space-y-4">
      <Radio.Group value={selected} onValueChange={setSelected}>
        <Radio value="option1">Option 1</Radio>
        <Radio value="option2">Option 2</Radio>
        <Radio value="option3">Option 3</Radio>
      </Radio.Group>
      <p className="text-sm text-muted-foreground">Selected: {selected}</p>
    </div>
  );
}
