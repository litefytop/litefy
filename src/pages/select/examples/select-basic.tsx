import { Select } from "@/component";

const options = [
  { label: "Option 1", value: "1" },
  { label: "Option 2", value: "2" },
  { label: "Extremely long text test:long long long long text", value: "3" },
];

export default function SelectBasic() {
  return (
    <div className="w-64">
      <Select options={options} placeholder="Select an option" />
    </div>
  );
}
