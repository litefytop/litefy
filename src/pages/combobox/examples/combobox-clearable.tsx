import { Combobox } from "@/component";

export default function ComboboxClearable() {
  return (
    <Combobox
      options={["Option 1", "Option 2", "Option 3"]}
      defaultValue="Option 1"
      clearable
    />
  );
}
