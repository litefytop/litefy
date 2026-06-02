import { Combobox } from "@/component";

export default function ComboboxDisabled() {
  return (
    <div className="max-w-sm space-y-4">
      <Combobox
        options={[
          "China",
          "USA",
          "Japan",
          "Germany",
          "France",
        ]}
        placeholder="Disabled combobox"
        disabled
      />
      <Combobox
        options={[
          "China",
          "USA",
          "Japan",
          "Germany",
          "France",
        ]}
        placeholder="Invalid combobox"
        invalid
      />
      <p className="text-xs text-muted-foreground mt-2">
        Options: China, USA, Japan, Germany, France
      </p>
    </div>
  );
}
