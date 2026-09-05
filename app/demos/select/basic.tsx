import { Select } from "@/ui";

const options = [
  { label: "React", value: "react" },
  { label: "Vue", value: "vue" },
  { label: "Angular", value: "angular" },
  { label: "Svelte", value: "svelte" },
];

export default function SelectBasicDemo() {
  return (
    <Select
      options={options}
      placeholder="Select a framework..."
      defaultValue="react"
    />
  );
}
