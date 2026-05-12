import { Checkbox } from "@/component";
import { cn } from "@/lib";

export default function CheckboxVariant() {
  const items = [
    { value: "a", label: "toggle A" },
    { value: "b", label: "toggle B" },
    { value: "c", label: "toggle C" },
  ];

  return (
    <Checkbox.Group
      defaultValue={["a"]}
      className="gap-0 w-full items-center justify-center"
    >
      {items.map((item, index) => (
        <Checkbox
          key={item.value}
          value={item.value}
          variant="toggle"
          indicator={{ hidden: true }}
          className={cn(
            index === 0 && "rounded-l-full rounded-tr-none rounded-br-none",
            index === items.length - 1 &&
              "rounded-r-full rounded-tl-none rounded-bl-none",
            index > 0 && index < items.length - 1 && "rounded-none"
          )}
        >
          {item.label}
        </Checkbox>
      ))}
    </Checkbox.Group>
  );
}
