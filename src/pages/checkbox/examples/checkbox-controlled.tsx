import { useState } from "react";
import { Checkbox } from "@/component";

export default function CheckboxControlled() {
  const [checked, setChecked] = useState<string[]>(["option1"]);

  return (
    <div className="space-y-4">
      <Checkbox.Group value={checked} onValueChange={setChecked}>
        <Checkbox value="option1">Option 1</Checkbox>
        <Checkbox value="option2">Option 2</Checkbox>
        <Checkbox value="option3">Option 3</Checkbox>
      </Checkbox.Group>
      <p className="text-sm text-muted-foreground">
        Currently selected: {checked.join(", ")}
      </p>
    </div>
  );
}
