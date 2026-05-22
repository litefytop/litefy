import { Checkbox } from "@/component";
import { CheckIcon, Square } from "lucide-react";

export default function CheckboxVariant() {
  const items = [
    { value: "a", label: "toggle A", },
    { value: "b", label: "toggle B", },
    { value: "c", label: "toggle C", },
  ];

  return (
    <div className="flex flex-col gap-4">
      <Checkbox
      label="Checkbox Variant"
      options={items}
      defaultValue={["a"]}
      itemProps={{
        options: {
          variant: "toggle",
          indicator: () => null,
        },
        content: {
          className: "gap-0 *:first:rounded-l-full *:last:rounded-r-full",
        },
      }}
    />
    <Checkbox
      label="Custom Indicator"
      options={items}
      defaultValue={["a"]}
      itemProps={{
        options: {
          variant: "checkbox",
          indicator: (checked)=> checked ? <CheckIcon size={16} className="bg-primary text-primary-foreground" /> : <Square size={16} className="text-secondary-foreground" />,
        },
        content: {
          className: "gap-0 *:first:rounded-l-full *:last:rounded-r-full",
        },
      }}
    />
    </div>
  );
}
