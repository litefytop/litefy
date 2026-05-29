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
        ]}
        placeholder="Clearable combobox"
        clearable
      />
    </div>
  );
}
