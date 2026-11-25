import { NavBar as NavBarHeadless } from "@/ui";
import type { NavBarProps } from "@/ui";
import { cn, mergeSlots } from "../utils/cn";
import { menuClasses } from "./menu";
import { buttonVariants } from "./button";


const itemClasses = "whitespace-nowrap";

const moreClasses = cn(buttonVariants.text, "group/more");
const chevronClasses =
  "shrink-0 transition-transform duration-sm group-data-[open]/more:rotate-180";


const panelClasses =
  cn(menuClasses.root, "w-48 min-w-0 max-w-[min(20rem,calc(100vw_-_1rem))] max-h-96 overflow-auto rounded-xl border-frame border-border bg-surface-raised text-surface-raised-fg [&>*]>*:w-full [&>*]>*:justify-start");

export function NavBar<T>({ className, classNames, ...props }: NavBarProps<T>) {
  return (
    <NavBarHeadless<T>
      {...props}
      classNames={mergeSlots(
        { root: cn("w-full min-w-0", className), item: itemClasses, more: moreClasses, chevron: chevronClasses, panel: panelClasses },
        classNames,
      )}
    />
  );
}
