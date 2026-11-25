import { MultiSelect } from "@/ui/skins";

const options = [
  { label: "Apple", value: "apple", group: "Fruits" },
  { label: "Banana", value: "banana", group: "Fruits" },
  { label: "Carrot", value: "carrot", group: "Vegetables" },
];

export default function Demo() {
  return (
    <div className="flex flex-col items-center">
      <MultiSelect options={options} placeholder="Unavailable" disabled />
    </div>
  );
}
