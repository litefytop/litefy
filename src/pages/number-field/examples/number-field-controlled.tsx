import { useState } from "react";
import { NumberField } from "@/component/ui/number-field";

export function NumberFieldControlled() {
  const [value, setValue] = useState(5);

  return (
    <NumberField
      label="受控模式"
      description={`当前值：${value}`}
      value={value}
      onValueChange={setValue}
    />
  );
}
