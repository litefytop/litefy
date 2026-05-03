import { useState } from "react";
import { Checkbox } from "@/component";

export default function CheckboxControlled() {
  const [checked, setChecked] = useState<string[]>(["option1"]);

  return (
    <div className="space-y-4">
      <Checkbox.Group value={checked} onValueChange={setChecked}>
        <Checkbox value="option1">选项一</Checkbox>
        <Checkbox value="option2">选项二</Checkbox>
        <Checkbox value="option3">选项三</Checkbox>
      </Checkbox.Group>
      <p className="text-sm text-muted-foreground">
        当前选中: {checked.join(", ")}
      </p>
    </div>
  );
}
