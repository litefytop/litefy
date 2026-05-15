import { Checkbox } from "@/component";

export default function CheckboxVariant() {
  const items = [
    { value: "a", label: "toggle A", indicator: { hidden: true } },
    { value: "b", label: "toggle B", indicator: { hidden: true } },
    { value: "c", label: "toggle C", indicator: { hidden: true } },
  ];

  return (
    <Checkbox
      label="Checkbox Variant"
      options={items}
      defaultValue={["a"]}
      className="gap-0 *:first:rounded-l-full *:last:rounded-r-full "
      itemProps={{
        options: {
          variant: "toggle",
        },
      }}
    />
  );
}
