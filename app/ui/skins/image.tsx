import { Image as ImageHeadless } from "@/ui";
import type { ImageProps } from "@/ui";
import { cn, mergeSlots } from "../utils/cn";


const rootClasses =
  "relative overflow-hidden border-control border-border bg-surface shadow-surface";

const imageClasses =
  "absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-md data-[revealed=true]:opacity-100";

export const imagePartClasses = { root: rootClasses, image: imageClasses };

export function Image({ className, classNames, ...props }: ImageProps) {
  return (
    <ImageHeadless
      {...props}
      className={cn(rootClasses, className)}
      classNames={mergeSlots({ image: imageClasses }, classNames)}
    />
  );
}
