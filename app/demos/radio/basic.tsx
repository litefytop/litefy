import { Radio } from "@/ui";

export default function RadioBasicDemo() {
  return (
    <Radio.Group
      name="group-example"
      options={[
        { label: "Option 1", value: "group1" },
        { label: "Option 2", value: "group2" },
        { label: "Option 3", value: "group3" },
      ]}
    />
  );
}
