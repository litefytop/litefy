import { NumberField } from "@/component/ui/number-field";

export function NumberFieldStep() {
  return (
    <NumberField
      label="Step"
      description="Increment/Decrement by 0.5"
      step={0.5}
      defaultValue={0}
    />
  );
}
