import { MultiSelect } from "@/ui";

const options = [
  { label: "React", value: "react" },
  { label: "Vue", value: "vue" },
  { label: "Angular", value: "angular" },
  { label: "Svelte", value: "svelte" },
];

export default function MultiSelectBasicDemo() {
  return <MultiSelect options={options} />;
}
