import { Combobox } from "@/component";

export default function ComboboxBasic() {
  return (
    <div className="max-w-sm">
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
        placeholder="Select or search country..."
      />
      <p className="text-xs text-muted-foreground mt-2">
        Options: China, USA, Japan, Germany, France, United Kingdom, Italy,
        Spain, Canada, Australia
      </p>
    </div>
  );
}
