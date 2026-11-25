import { PreviewCard as PreviewCardHeadless } from "@/ui";
import type { ImageClassNames, PreviewCardProps } from "@/ui";
import { cn, mergeSlots } from "../utils/cn";
import { cardClasses } from "./card";
import { imagePartClasses } from "./image";

const contentSizeClasses = {
  sm: "max-w-[20rem]",
  md: "max-w-[24rem]",
  lg: "max-w-[28rem]",
  xl: "max-w-[32rem]",
};

const rootClasses = cn(
  cardClasses,
  "min-w-0 p-0 data-[floating=true]:w-72 data-[floating=true]:max-w-[min(20rem,calc(100vw_-_1rem))]",
);

const triggerClasses =
  "no-underline underline-offset-4 hover:underline";

const imageClasses: ImageClassNames = {
  root: cn(imagePartClasses.root, "h-40 border-hair border-border shadow-surface"),
  image: "h-full w-full object-cover",
};

const bodyClasses = "p-4";

const titleClasses = "m-0 text-sm leading-5 control-label";

const descriptionClasses = "mt-1 text-xs leading-4 text-foreground";

export function PreviewCard({ size = "md", className, classNames, ...props }: PreviewCardProps & { size?: "sm" | "md" | "lg" | "xl" }) {
  const { root: rootOverride, ...slots } = classNames ?? {};
  return (
    <PreviewCardHeadless
      {...props}
      className={cn(rootClasses, contentSizeClasses[size], className, rootOverride)}
      classNames={{
        ...mergeSlots(
          {
            trigger: triggerClasses,
            body: bodyClasses,
            title: titleClasses,
            description: descriptionClasses,
          },
          slots,
        ),
        image: mergeSlots(imageClasses, classNames?.image),
      }}
    />
  );
}
