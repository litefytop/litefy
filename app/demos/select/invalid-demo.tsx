import { Select } from "@/ui";

const options = [
  { label: "United States", value: "us" },
  { label: "United Kingdom", value: "uk" },
  { label: "Canada", value: "ca" },
  { label: "Australia", value: "au" },
];

export default function SelectInvalidDemo() {
  return (
    <div className="flex flex-col gap-4">
      <Select
        options={options}
        placeholder="Select your country..."
        invalid
      />
      <Select
        options={options}
        placeholder="Valid selection"
        defaultValue="us"
      />
    </div>
  );
}
