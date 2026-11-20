import { Toc as TocHeadless } from "@/ui";
import type { TocProps } from "@/ui";
import { cn, mergeSlots } from "../utils/cn";

/* The two shapes are both in the DOM; the loaded scheme decides which one shows
   at which width. 80rem is the docs reading column's own break, not a Tailwind stop.
   Every look the two styles disagree on is a role name: the item's indent ladder and
   active pair (the ink style fills the active row, the wash style brands its ink),
   the status pill's voice and focus shadow, and the panel's bounds. The headless
   writes the thumb's `transform` inline (measured offset + scale); the class only
   states where the transform is anchored and how fast it retimes. */
const railClasses =
  "hidden xl:block sticky top-8 self-start w-[14rem] shrink-0 text-sm leading-5";

const titleClasses = "mb-3 font-strong";

const scrollClasses =
  "relative max-h-[calc(100vh-8rem)] overflow-y-auto border-l-frame border-l-border";

const listClasses = "flex flex-col";

const itemClasses =
  "block py-1 ps-3 pe-0 text-surface-fg " +
  "data-[depth=1]:font-label data-[depth=1]:tracking-label data-[depth=1]:case-label " +
  "data-[depth=2]:font-label data-[depth=2]:tracking-label data-[depth=2]:case-label " +
  "hover:bg-accent hover:text-accent-fg " +
  "data-[depth=3]:ps-6 data-[depth=4]:ps-9 data-[depth=5]:ps-12 data-[depth=6]:ps-15";

const itemActiveFill = "data-[active]:bg-primary data-[active]:text-primary-fg";

const itemActiveLine = "data-[active]:text-foreground";

const thumbClasses =
  "absolute -left-px top-0 h-full w-0.5 rounded-sm bg-primary " +
  "origin-top transition-transform duration-sm ease-frame";

const statusClasses =
  "hidden z-40 max-xl:fixed max-xl:top-4 max-xl:right-4 max-xl:inline-flex max-xl:items-center max-xl:gap-2 " +
  "max-xl:max-w-[min(16rem,calc(100vw-6rem))] " +
  "px-3 py-2 rounded-xl border-frame border-border " +
  "bg-surface-raised text-xs leading-4 font-field " +
  "cursor-pointer hover:bg-accent hover:text-accent-fg focus-visible:focus-ring " +
  "[&>span]:truncate [&>span]:text-surface-fg";

const chevronClasses =
  "size-4 shrink-0 text-surface-fg transition-transform duration-sm data-[open=true]:rotate-180";

/* The narrow-screen disclosure: same floating-panel recipe as every other panel in
   this scheme, and it is its own scroller — the list can be longer than the viewport. */
const panelClasses =
  "xl:hidden min-w-[8rem] max-w-[min(16rem,calc(100vw-2rem))] max-h-[min(24rem,60vh)] overflow-auto rounded-xl border-frame border-border p-1 " +
  "bg-surface-raised text-foreground shadow-elevated";

const ringClasses = "size-5 shrink-0";

/* The ring's contract: the track is the quiet surface, the arc is the brand — the
   lightness step between them is the reading, in both schemes. */
const ringTrackClasses = "fill-none stroke-surface stroke-[1.5px]";

const ringProgressClasses =
  "fill-none stroke-primary stroke-[1.5px] " +
  "-rotate-90 origin-center transition-[stroke-dashoffset] duration-sm ease-frame";

const currentClasses = "truncate text-surface-fg";

const skinClassNames = {
  rail: railClasses,
  title: titleClasses,
  scroll: scrollClasses,
  list: listClasses,
  item: itemClasses,
  thumb: thumbClasses,
  status: statusClasses,
  ring: ringClasses,
  ringTrack: ringTrackClasses,
  ringProgress: ringProgressClasses,
  current: currentClasses,
  chevron: chevronClasses,
  panel: panelClasses,
};

export interface TocSkinProps extends TocProps {
  variant?: "fill" | "line";
}

export function Toc({ variant = "fill", classNames, styles, ...props }: TocSkinProps) {
  const overridableClasses = { ...classNames };
  delete overridableClasses.rail;
  delete overridableClasses.status;
  delete overridableClasses.panel;
  const overridableStyles = { ...styles };
  delete overridableStyles.rail;
  delete overridableStyles.status;
  delete overridableStyles.panel;
  return (
    <TocHeadless
      {...props}
      styles={overridableStyles}
      classNames={mergeSlots(
        { ...skinClassNames, item: cn(skinClassNames.item, variant === "line" ? itemActiveLine : itemActiveFill) },
        overridableClasses,
      )}
    />
  );
}
