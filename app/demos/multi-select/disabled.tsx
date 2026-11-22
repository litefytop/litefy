import { MultiSelect } from "@/ui/skins";

const options = [
  { label: "Apple", value: "apple", group: "Fruits" },
  { label: "Banana", value: "banana", group: "Fruits" },
  { label: "Carrot", value: "carrot", group: "Vegetables" },
];

export default function Demo() {
  return <MultiSelect options={options} placeholder="Unavailable" disabled inert className="w-77 min-w-33" />;
}
