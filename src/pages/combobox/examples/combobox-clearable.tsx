import { Combobox } from "@/component";

export default function ComboboxClearable() {
  return (
    <div className="max-w-sm h-64">
      <Combobox
        options={[
          "China",
          "USA",
          "Japan",
          "Germany",
          "France",
          "United Kingdom",
          "Italy",
          "Spain",
          "Canada",
          "Australia",
        ]}
        placeholder="Select or search country (clearable)..."
        clearable
      />
      <p className="text-xs text-muted-foreground mt-2">
        Options: China, USA, Japan, Germany, France, United Kingdom, Italy,
        Spain, Canada, Australia
      </p>
    </div>
  );
}
