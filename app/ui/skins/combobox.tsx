import { Combobox as ComboboxHeadless } from "@/ui";
import type { ComboboxProps } from "@/ui";
import { cn } from "../utils/cn";
import { panelPadClass } from "./popover";
import { pickerClasses } from "./picker";
import { fieldGroupClasses } from "./input";
import { listClasses, listViewportClasses } from "./list";

const rootClasses = cn(fieldGroupClasses, "relative cursor-text");

const inputClasses =
  "min-w-0 grow basis-0 self-stretch border-0 bg-transparent p-0 outline-none " +
  "font-field text-sm text-foreground placeholder:text-surface-fg " +
  "data-[trailing=true]:pr-9";

const leadingClasses = "inline-flex w-control shrink-0 self-stretch items-center justify-center";

const trailingClasses =
  "pointer-events-none absolute inset-y-0 right-0 inline-flex w-control items-center justify-center";

const viewportInPanel = cn(listViewportClasses, "max-h-64 border-0");

export function Combobox({ className, classNames, ...props }: ComboboxProps) {
  return (
    <ComboboxHeadless
      {...props}
      className={cn(rootClasses, className)}
      classNames={{
        leading: cn(leadingClasses, classNames?.leading),
        input: cn(inputClasses, classNames?.input),
        trailing: cn(trailingClasses, classNames?.trailing),
        panel: cn(pickerClasses.content, panelPadClass, classNames?.panel),
        item: cn(listClasses.item, classNames?.item ?? classNames?.list?.item),
        list: { ...listClasses, viewport: viewportInPanel, ...classNames?.list },
      }}
    />
  );
}
