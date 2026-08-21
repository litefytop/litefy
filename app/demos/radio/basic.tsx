import { Radio } from "@/ui";

export default function RadioBasicDemo() {
  return (
    <Radio.Group name="group-example">
      <Radio value="group1"> Option 1</Radio>
      <Radio value="group2"> Option 2</Radio>
      <Radio value="group3"> Option 3</Radio>
    </Radio.Group>
  );
}
