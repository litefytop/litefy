import { RadioGroup } from "@/ui/skins";

export default function RadioBasicDemo() {
  return (
    <RadioGroup
      name="group-example"
      options={[
        { label: "Option 1", value: "group1" },
        { label: "Option 2", value: "group2" },
        { label: "Option 3", value: "group3" },
      ]}
    />
  );
}
