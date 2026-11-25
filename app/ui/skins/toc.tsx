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
  "hidden xl:block sticky top-8 self-start w-56 shrink-0 text-sm leading-5";

const titleClasses = "mb-3 font-strong";

const scrollClasses =
  "relative max-h-[calc(100vh-8rem)] overflow-y-auto border-l-frame border-l-border";

const listClasses = "flex flex-col text-inherit";

const itemClasses =
  "block py-1 ps-3 data-[depth=1]:control-label data-[depth=2]:control-label hover:bg-accent hover:text-accent-fg " +
  "data-[depth=3]:ps-6 data-[depth=4]:ps-9 data-[depth=5]:ps-12 data-[depth=6]:ps-15";

const itemActiveFill =
  "data-active:bg-primary data-active:text-primary-fg data-active:hover:bg-primary-accent";

const itemActiveLine = "data-active:text-foreground";

const itemClassesByVariant = {
  fill: cn(itemClasses, itemActiveFill),
  line: cn(itemClasses, itemActiveLine),
};

const thumbClasses =
  "absolute -left-px top-0 h-full w-0.5 rounded-sm bg-primary " +
  "origin-top transition-transform duration-sm ease-frame";

const statusFixedClasses =
  "hidden z-40 top-4 right-4 max-xl:fixed max-xl:flex items-center " +
  "max-w-[min(16rem,100vw-6rem)]";
const statusBoxClasses = "p-2 px-3 rounded-xl border-frame border-border";
const statusFaceClasses =
  "bg-surface-raised text-surface-raised-fg text-xs/4 font-field " +
  "cursor-pointer hover:bg-accent hover:text-accent-fg focus-visible:focus-ring";

const statusClasses = cn(statusFixedClasses, statusBoxClasses, statusFaceClasses);

const chevronClasses =
  "size-4 shrink-0 text-inherit transition-transform duration-sm data-[open=true]:rotate-180";

/* The narrow-screen disclosure: same floating-panel recipe as every other panel in
   this scheme, and it is its own scroller — the list can be longer than the viewport. */
const panelBaseClasses =
  "xl:hidden min-w-32 max-w-[min(--spacing(64),calc(100vw_-_--spacing(8)))] max-h-[min(--spacing(96),60vh)] overflow-auto";
const panelFaceClasses =
  "rounded-xl border-frame border-border p-1 bg-surface-raised text-surface-raised-fg shadow-elevated";

const panelClasses = cn(panelBaseClasses, panelFaceClasses);

const ringClasses = "size-5 shrink-0";

/* The ring's contract: the track is the quiet surface, the arc is the brand — the
   lightness step between them is the reading, in both schemes. */
const ringTrackClasses = "fill-none stroke-surface stroke-1.5";

const ringProgressClasses =
  "fill-none stroke-primary stroke-1.5 " +
  "-rotate-90 origin-center transition-[stroke-dashoffset] duration-sm ease-frame";

const currentClasses = "truncate text-inherit";

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
        { ...skinClassNames, item: itemClassesByVariant[variant] },
        overridableClasses,
      )}
    />
  );
}
