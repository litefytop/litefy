import { NavBar as NavBarHeadless } from "@/ui";
import type { NavBarProps } from "@/ui";
import { cn, mergeSlots } from "../utils/cn";
import { menuClasses } from "./menu";
import { buttonVariants } from "./button";


const itemClasses = "whitespace-nowrap";

const moreClasses = cn(
  buttonVariants.text,
  "text-sm " +
    "[&>svg]:flex-none [&>svg]:transition-transform [&>svg]:duration-sm " +
    "data-[open]:[&>svg]:rotate-180",
);


const panelClasses =
  cn(menuClasses.root, "w-48 max-h-96 overflow-auto rounded-xl border-frame border-border bg-surface-raised [&>*]>*:w-full [&>*]>*:justify-start");

export function NavBar<T>({ className, classNames, ...props }: NavBarProps<T>) {
  return (
    <NavBarHeadless<T>
      {...props}
      classNames={mergeSlots(
        { root: className, item: itemClasses, more: moreClasses, panel: panelClasses },
        classNames,
      )}
    />
  );
}
