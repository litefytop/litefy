import { LatticeLoader as LatticeLoaderHeadless } from "@/ui";
import type { LatticeLoaderProps } from "@/ui";
import { cn, mergeSlots } from "../utils/cn";

const rootClasses =
  "group/lattice inline-flex items-center gap-x-3 text-sm leading-5 font-field text-foreground";

const latticeClasses = "relative inline-grid gap-1";

export const latticeLoaderRootClasses = rootClasses;

const cellClasses =
  "size-1.5 rounded-pill bg-surface transition-[background-color] duration-sm ease-frame " +
  "group-data-[shape=square]/lattice:rounded-none " +
  "motion-safe:group-data-[status=working]/lattice:animate-lattice " +
  "group-data-[status=done]/lattice:bg-background group-data-[status=error]/lattice:bg-background " +
  "data-[hole=true]:invisible";

const markClasses =
  "pointer-events-none absolute inset-0 m-auto size-5 opacity-0 " +
  "transition-[opacity,filter] duration-sm ease-frame " +
  "group-data-[status=done]/lattice:text-success-fg group-data-[status=error]/lattice:text-danger-fg " +
  "group-data-[status=done]/lattice:opacity-100 group-data-[status=error]/lattice:opacity-100 " +
  "group-data-[status=working]/lattice:blur-xs";

const timerClasses = "shrink-0 font-mono text-xs leading-4 text-surface-fg tabular-nums";

const skinClassNames = {
  lattice: latticeClasses,
  cell: cellClasses,
  mark: markClasses,
  timer: timerClasses,
};

export const latticeLoaderClasses = skinClassNames;

const labelClasses = "min-w-0 whitespace-nowrap";

type VerbNode = LatticeLoaderProps["label"];

const wrapVerb = (text: VerbNode, fallback: string): VerbNode =>
  text === undefined
    ? <span className={labelClasses}>{fallback}</span>
    : typeof text === "string"
      ? text
        ? <span className={labelClasses}>{text}</span>
        : text
      : text;

export function LatticeLoader({ className, classNames, label, doneLabel, errorLabel, ...props }: LatticeLoaderProps) {
  return (
    <LatticeLoaderHeadless
      {...props}
      className={cn(rootClasses, className)}
      label={wrapVerb(label, "Thinking")}
      doneLabel={wrapVerb(doneLabel, "Done in")}
      errorLabel={wrapVerb(errorLabel, "Failed after")}
      classNames={mergeSlots(skinClassNames, classNames)}
    />
  );
}
