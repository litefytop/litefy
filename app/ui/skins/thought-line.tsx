import { ThoughtLine as ThoughtLineHeadless } from "@/ui";
import type { ThoughtLineProps } from "@/ui";
import { cn, mergeSlots } from "../utils/cn";
import { latticeLoaderClasses, latticeLoaderRootClasses } from "./lattice-loader";

const rootClasses =
  "group/thought flex flex-col items-start gap-y-1 text-sm leading-5 font-field text-foreground";

const lineClasses =
  "flex w-fit items-center gap-x-2 text-left " +
  "group-data-[collapsible=true]/thought:cursor-pointer focus-visible:focus-ring";

const glyphClasses =
  "size-4 shrink-0 text-foreground motion-safe:group-data-[working=true]/thought:animate-pulse";

const bodyClasses = "grid min-w-0 items-center gap-x-2";

const labelClasses =
  "col-start-1 row-start-1 block min-w-0 whitespace-nowrap transition-[opacity,filter] duration-sm ease-frame " +
  "motion-safe:group-data-[working=true]/thought:animate-pulse " +
  "group-data-[working=false]/thought:pointer-events-none group-data-[working=false]/thought:opacity-0 " +
  "group-data-[working=false]/thought:blur-xs";

const doneClasses =
  "col-start-1 row-start-1 flex items-center whitespace-nowrap opacity-0 " +
  "transition-[opacity,filter] duration-sm ease-frame " +
  "group-data-[working=false]/thought:pointer-events-auto group-data-[working=false]/thought:opacity-100 " +
  "group-data-[working=true]/thought:blur-xs";

const timerClasses = "col-start-2 row-start-1 shrink-0 font-mono text-xs leading-4 text-surface-fg tabular-nums";

const chevronClasses =
  "size-4 shrink-0 text-surface-fg transition-transform duration-sm ease-frame " +
  "group-data-[open=true]/thought:rotate-180";

const stepsClasses =
  "grid pl-6 transition-[grid-template-rows] duration-md ease-frame " +
  "data-[open=false]:grid-rows-[0fr] data-[open=true]:grid-rows-[1fr]";

const stepsShellClasses = "min-h-0 overflow-hidden";

const stepClasses =
  "flex items-center gap-x-2 py-0.5 text-sm leading-5 text-surface-fg " +
  "data-[current=true]:text-foreground";

const stepMarkerClasses =
  "size-3.5 shrink-0 " +
  "data-[current=true]:size-1.5 data-[current=true]:rounded-pill data-[current=true]:bg-current";

const skinClassNames = {
  line: lineClasses,
  glyph: glyphClasses,
  body: bodyClasses,
  label: labelClasses,
  lattice: cn(latticeLoaderRootClasses, "shrink-0"),
  timer: timerClasses,
  chevron: chevronClasses,
  steps: stepsClasses,
  stepsShell: stepsShellClasses,
  step: stepClasses,
  stepMarker: stepMarkerClasses,
};

export function ThoughtLine({ className, classNames, latticeClassNames, renderLabel, ...props }: ThoughtLineProps) {
  return (
    <ThoughtLineHeadless
      {...props}
      className={cn(rootClasses, className)}
      renderLabel={
        renderLabel ??
        ((text, working) => (working ? text : <span className={doneClasses}>{text}</span>))
      }
      classNames={mergeSlots(skinClassNames, classNames)}
      latticeClassNames={mergeSlots(latticeLoaderClasses, latticeClassNames)}
    />
  );
}
