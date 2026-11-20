import { Avatar as AvatarHeadless } from "@/ui";
import type { AvatarProps } from "@/ui";
import { cn, mergeSlots } from "../utils/cn";

const rootClasses =
  "size-11 shrink-0 overflow-hidden rounded-disc border-hair border-border bg-surface shadow-base";

const imageClasses = "size-full object-cover";

const fallbackClasses =
  "flex size-full items-center justify-center p-3 text-base tracking-label font-label case-label text-surface-fg";

const skeletonDefaultClasses = "block size-full bg-accent motion-safe:animate-pulse";

const fallbackDefaultClasses = "block size-full bg-accent";

export function Avatar({ className, classNames, skeleton, fallback, ...props }: AvatarProps) {
  return (
    <AvatarHeadless
      {...props}
      className={cn(rootClasses, className)}
      classNames={mergeSlots({ image: imageClasses }, classNames)}
      skeleton={skeleton ?? <span className={skeletonDefaultClasses} />}
      fallback={
        fallback === undefined ? (
          <span className={fallbackDefaultClasses} />
        ) : typeof fallback === "string" ? (
          <span className={fallbackClasses}>{fallback}</span>
        ) : (
          fallback
        )
      }
    />
  );
}
