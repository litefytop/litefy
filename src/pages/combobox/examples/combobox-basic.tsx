import { Combobox } from "@/component";

export default function ComboboxBasic() {
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
        ]}
        placeholder="Select your country..."
      />
    </div>
  );
}
