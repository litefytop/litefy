import { Select } from "@/ui/skins";

const options = [
  { label: "React", value: "react" },
  { label: "Vue", value: "vue" },
  { label: "Angular", value: "angular" },
];

export default function Demo() {
  return (
    <div className="flex flex-col items-center">
      <Select options={options} placeholder="Unavailable" disabled />
    </div>
  );
}
