import { useState } from "react";
import { NumberField } from "@/component/ui/number-field";

export function NumberFieldControlled() {
  const [value, setValue] = useState<string | undefined>("5");

  return (
    <div>
      <NumberField value={value} onChange={(e) => setValue(e.target.value)} />
      <p>当前值: {value}</p>
    </div>
  );
}
