import { Combobox as ComboboxHeadless } from "@/ui";
import type { ComboboxProps } from "@/ui";
import { cn } from "../utils/cn";
import { pickerClasses } from "./picker";
import { fieldGroupClasses, fieldGroupDisabledClasses } from "./input";
import { listClasses, listViewportClasses } from "./list";

const rootLayoutClasses = "relative";

const inputLayoutClasses =
  "min-w-0 grow basis-0 self-stretch border-0 bg-transparent p-0 outline-none " +
  "font-field text-sm data-[trailing=true]:pr-9";

const inputClasses = cn(
  inputLayoutClasses,
  "text-foreground placeholder:text-foreground",
);

const inputDisabledClasses = cn(
  inputLayoutClasses,
  "cursor-not-allowed text-disabled-fg placeholder:text-disabled-fg",
);

const leadingClasses = "inline-flex w-control shrink-0 self-stretch items-center justify-center";

const trailingClasses =
  "pointer-events-none absolute inset-y-0 right-0 inline-flex w-control items-center justify-center";

const viewportInPanel = cn(listViewportClasses, "max-h-64 border-0");

const rootClasses = cn(fieldGroupClasses, rootLayoutClasses);
const rootDisabledClasses = cn(fieldGroupDisabledClasses, rootLayoutClasses);
const rootClassesByState = (disabled: boolean | undefined) =>
  disabled ? rootDisabledClasses : rootClasses;
const inputClassesByState = (disabled: boolean | undefined) =>
  disabled ? inputDisabledClasses : inputClasses;

export function Combobox({ className, classNames, disabled, ...props }: ComboboxProps) {
  return (
    <ComboboxHeadless
      {...props}
      disabled={disabled}
      className={cn(rootClassesByState(disabled), className)}
      classNames={{
        leading: cn(leadingClasses, classNames?.leading),
        input: cn(inputClassesByState(disabled), classNames?.input),
        trailing: cn(trailingClasses, classNames?.trailing),
        panel: cn(pickerClasses.content, classNames?.panel),
        item: cn(listClasses.item, classNames?.item ?? classNames?.list?.item),
        list: { ...listClasses, viewport: viewportInPanel, ...classNames?.list },
      }}
    />
  );
}
