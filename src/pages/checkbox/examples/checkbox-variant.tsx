import { Checkbox } from "@/component";
import { CheckIcon, Square } from "lucide-react";

export default function CheckboxVariant() {
  const items = [
    { value: "a", label: "toggle A" },
    { value: "b", label: "toggle B" },
    { value: "c", label: "toggle C" },
  ];

  return (
    <div className="flex flex-col  gap-4">
      <Checkbox
        options={items}
        defaultValue={["a"]}
        className="*:first:rounded-l-full *:last:rounded-r-full"
        itemProps={{
          options: {
            variant: "toggle",
            indicator: () => null,
          },
        }}
      />
      <Checkbox
        options={items}
        defaultValue={["a"]}
        itemProps={{
          options: {
            variant: "checkbox",
            indicator: (checked) =>
              checked ? (
                <CheckIcon
                  size={16}
                  className={`bg-primary text-primary-foreground  ${Checkbox.IndicatorClass}`}
                />
              ) : (
                <Square size={16} className={`text-secondary-foreground  ${Checkbox.IndicatorClass}`} />
              ),
          },
        }}
      />
    </div>
  );
}
