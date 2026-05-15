import { Radio } from "@/component";

export default function RadioDisabled() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground mb-2">Group Disabled</p>
        <Radio.Group
          disabled
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
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Item Disabled</p>
        <Radio.Group
          options={[
            {
              value: "apple",
              label: "Apple",
            },
            {
              value: "banana",
              label: "Banana",
              disabled: true,
            },
            {
              value: "orange",
              label: "Orange",
            },
          ]}
        />
      </div>
    </div>
  );
}
