import { Combobox as ComboboxHeadless } from "@/ui";
import type { ComboboxProps } from "@/ui";
import { cn } from "../utils/cn";
import { panelPadClass } from "./popover";
import { pickerClasses } from "./picker";
import { listClasses, listViewportClasses } from "./list";


const viewportInPanel = cn(listViewportClasses, "max-h-64 border-0 rounded-[inherit]");

export function Combobox({ className, classNames, ...props }: ComboboxProps) {
  return (
    <ComboboxHeadless
      {...props}
      className={cn(pickerClasses.root, className)}
      classNames={{
        input: cn(pickerClasses.input, classNames?.input),
        trailing: cn(pickerClasses.trailing, classNames?.trailing),
        panel: cn(pickerClasses.content, panelPadClass, classNames?.panel),
        item: cn(listClasses.item, classNames?.item ?? classNames?.list?.item),
        list: { ...listClasses, viewport: viewportInPanel, ...classNames?.list },
      }}
    />
  );
}
