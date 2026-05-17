import { NumberField } from "@/component/ui/number-field";

export function NumberFieldDisabled() {
  return (
    <NumberField
      label="禁用状态"
      description="禁用的数字输入框"
      disabled
      defaultValue={10}
    />
  );
}
