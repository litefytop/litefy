import { FilterCombobox, type FilterComboboxField } from "@/ui/skins";

const fields: FilterComboboxField[] = [
  {
    name: "status", label: "Status", type: "enum", aliases: ["state"],
    operators: ["is", "isNot", "isEmpty"],
    options: ["Scheduled", "Overdue", "On hold", "In progress", "Completed"].map((value) => ({ label: value, value })),
  },
  {
    name: "quote", label: "Quote", type: "number", aliases: ["amount", "price"],
    operators: ["is", "gt", "gte", "lt", "lte", "between"],
  },
];

export default function Demo() {
  return (
    <FilterCombobox
      fields={fields}
      defaultValue={[{ id: "seed", field: "quote", operator: "between", value: ["1000", "5000"] }]}
      disabled
    />
  );
}
