import { Select } from "@/component";

const options = [
  { label: "Option 1", value: "1" },
  { label: "Option 2", value: "2" },
  { label: "Option 3", value: "3" },
];

export default function SelectDisabled() {
  return (
    <div className="w-64 space-y-4">
      <Select
        options={options}
        placeholder="Disabled"
        disabled
      />
      <Select
        options={options}
        placeholder="With value disabled"
        value="1"
        disabled
      />
    </div>
  );
}
