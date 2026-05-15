import { Radio } from "@/component";

export default function RadioBasic() {
  return (
    <Radio.Group
      label="Basic Radio Group"
      options={[
        {
          value: "apple",
          label: "Apple",
        },
        {
          value: "banana",
          label: "Banana",
        },
        {
          value: "orange",
          label: "Orange",
        },
      ]}
    />
  );
}
