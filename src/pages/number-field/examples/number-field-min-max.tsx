import { NumberField } from "@/component/ui/number-field";

export function NumberFieldMinMax() {
  return (
    <NumberField
      label="范围限制"
      description="最小值 0，最大值 100"
      min={0}
      max={100}
      defaultValue={50}
    />
  );
}
