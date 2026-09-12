import { Error, Select } from "@/ui";

const options = [
  { label: "United States", value: "us" },
  { label: "United Kingdom", value: "uk" },
  { label: "Canada", value: "ca" },
  { label: "Australia", value: "au" },
];

export default function SelectInvalidDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <Select options={options} placeholder="Select your country..." />
      <Error>Please select your country.</Error>
      <Select options={options} placeholder="Valid selection" defaultValue="us" />
    </div>
  );
}
