import { NumberField } from "@/component/ui/number-field";

export function NumberFieldDisabled() {
  return (
    <NumberField
      label="Disabled State"
      description="A disabled number field"
      disabled
      defaultValue={10}
    />
  );
}
