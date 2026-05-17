import { NumberField } from "@/component/ui/number-field";

export function NumberFieldStep() {
  return (
    <NumberField
      label="步长"
      description="每次增减 0.5"
      step={0.5}
      defaultValue={0}
    />
  );
}
