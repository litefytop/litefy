import { Combobox } from "@/ui/skins";

const countries = [
  "China",
  "United States",
  "Japan",
  "Germany",
  "France",
  "United Kingdom",
  "Canada",
  "Australia",
  "Italy",
  "Brazil",
];

export default function Demo() {
  return <Combobox options={countries} defaultValue="China" disabled placeholder="Select a country" className="w-77 min-w-33" />;
}
