import { RadioGroup } from "@/ui/skins";

export default function Demo() {
  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col items-center">
        <RadioGroup
          name="disabled-example"
          label="Choose one"
          defaultValue="group2"
          disabled
          options={[
            { label: "Option 1", value: "group1" },
            { label: "Option 2", value: "group2" },
            { label: "Option 3", value: "group3" },
          ]}
        />
      </div>
    </div>
  );
}
