import { PreviewCard as PreviewCardHeadless } from "@/ui";
import type { ImageClassNames, PreviewCardProps } from "@/ui";
import { cn, mergeSlots } from "../utils/cn";
import { cardClasses } from "./card";
import { imagePartClasses } from "./image";


const rootClasses = cn(
  cardClasses,
  "p-0 data-[floating=true]:w-72 not-data-[floating=true]:max-w-96",
);


const triggerClasses =
  "no-underline underline-offset-4 hover:underline";

const imageClasses: ImageClassNames = {
  root: cn(imagePartClasses.root, "h-[10rem] border-hair border-border shadow-surface"),
  image: "h-full w-full object-cover",
};

const bodyClasses = "p-4";

const titleClasses = "m-0 text-sm leading-5 font-label tracking-label case-label";

const descriptionClasses = "mt-1 text-xs leading-4 text-surface-fg";

export function PreviewCard({ classNames, ...props }: PreviewCardProps) {
  return (
    <PreviewCardHeadless
      {...props}
      classNames={{
        ...mergeSlots(
          {
            root: rootClasses,
            trigger: triggerClasses,
            body: bodyClasses,
            title: titleClasses,
            description: descriptionClasses,
          },
          classNames,
        ),
        image: mergeSlots(imageClasses, classNames?.image),
      }}
    />
  );
}
