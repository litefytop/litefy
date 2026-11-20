import {
  Wizard as WizardHeadless,
  InlineWizard as InlineWizardHeadless,
  type InlineWizardProps,
  type WizardProps,
} from "@/ui";
import { cn, mergeSlots } from "../utils/cn";
import { buttonVariants } from "./button";
import { stepsPartClasses, stepsRootClasses } from "./steps";


const rootClasses = "w-full [&>*+*]:mt-6";

const footerClasses =
  "flex items-center justify-between gap-x-2";

const pagerClasses = "h-[12rem]";

const inlineFooterClasses =
  "mt-3 flex items-center justify-end gap-x-2";

const inlineContentClasses = "text-sm leading-5";

const ownArrowClasses = "[&>svg]:size-4 [&>svg]:flex-none";

const backButtonClasses = cn(buttonVariants.outline, ownArrowClasses);

const nextButtonClasses = cn(buttonVariants.primary, ownArrowClasses);

export function Wizard({
  className,
  classNames,
  stepsClassNames,
  ...props
}: WizardProps) {
  return (
    <WizardHeadless
      {...props}
      className={cn(rootClasses, className)}
      classNames={mergeSlots(
        {
          steps: stepsRootClasses,
          pager: pagerClasses,
          footer: footerClasses,
          button: backButtonClasses,
          primaryButton: nextButtonClasses,
        },
        classNames,
      )}
      stepsClassNames={mergeSlots(stepsPartClasses(), stepsClassNames)}
    />
  );
}

export function InlineWizard({
  className,
  classNames,
  ...props
}: InlineWizardProps) {
  return (
    <InlineWizardHeadless
      {...props}
      className={cn(stepsRootClasses, className)}
      classNames={mergeSlots(
        {
          ...stepsPartClasses(),
          content: inlineContentClasses,
          footer: inlineFooterClasses,
          button: backButtonClasses,
          primaryButton: nextButtonClasses,
        },
        classNames,
      )}
    />
  );
}
