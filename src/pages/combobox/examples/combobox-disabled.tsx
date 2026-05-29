import { Combobox } from "@/component";

export default function ComboboxDisabled() {
  return (
    <div className="max-w-sm space-y-4">
      <Combobox
        options={["China", "USA", "Japan"]}
        placeholder="Disabled combobox"
        disabled
      />
      <Combobox
        options={["China", "USA", "Japan"]}
        placeholder="Invalid combobox"
        invalid
      />
    </div>
  );
}
