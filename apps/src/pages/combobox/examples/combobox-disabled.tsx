import { Combobox } from "@/component";

export default function ComboboxDisabled() {
  return (
    <div className="space-y-4">
      <Combobox
        options={["Option 1", "Option 2", "Option 3"]}
        disabled
        placeholder="Disabled"
      />
      <Combobox
        options={["Option 1", "Option 2", "Option 3"]}
        invalid
        placeholder="Invalid"
      />
    </div>
  );
}
