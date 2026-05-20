import { useState } from "react";
import { NumberField } from "@/component/ui/number-field";

export function NumberFieldControlled() {
  const [value, setValue] = useState<number | undefined>(5);

  return (
    <NumberField
      label="Controlled Mode"
      description={`Current value: ${value}`}
      value={value}
      onValueChange={setValue}
    />
  );
}
