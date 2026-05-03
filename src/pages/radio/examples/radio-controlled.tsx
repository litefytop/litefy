import { useState } from "react";
import { Radio } from "@/component";

export default function RadioControlled() {
  const [value, setValue] = useState<string>("option1");

  return (
    <div className="space-y-4">
      <Radio.Group value={value} onValueChange={setValue}>
        <Radio value="option1">Option 1</Radio>
        <Radio value="option2">Option 2</Radio>
        <Radio value="option3">Option 3</Radio>
      </Radio.Group>
      <p className="text-sm text-muted-foreground">
        Current: {value}
      </p>
    </div>
  );
}
