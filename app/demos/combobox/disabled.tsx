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
  return (
    <div className="flex flex-col items-center">
      <Combobox options={countries} defaultValue="China" disabled placeholder="Select a country" />
    </div>
  );
}
