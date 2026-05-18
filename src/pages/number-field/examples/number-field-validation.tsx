import { NumberField } from "@/component/ui/number-field";

export function NumberFieldValidation() {
  return (
    <NumberField
      label="Auto Range Validation"
      description="Min: 0, Max: 10"
      min={0}
      max={10}
      defaultValue={5}
    />
  );
}
