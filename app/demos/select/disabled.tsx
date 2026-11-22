import { Select } from "@/ui/skins";

const options = [
  { label: "React", value: "react" },
  { label: "Vue", value: "vue" },
  { label: "Angular", value: "angular" },
];

export default function Demo() {
  return <Select options={options} placeholder="Unavailable" disabled inert className="w-77 min-w-33" />;
}
