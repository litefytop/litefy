import { Upload as UploadHeadless } from "@/ui";
import type { UploadProps } from "@/ui";
import { cn, mergeSlots } from "../utils/cn";


const rootClasses = "relative w-full min-w-0 max-w-[20rem]";

const dropzoneBaseClasses =
  "flex flex-col items-center justify-center py-8 px-6 text-center text-sm leading-5";
const dropzoneFaceClasses =
  "rounded-md border-frame border-border shadow-frame";

const dropzoneClasses = cn(
  dropzoneBaseClasses,
  dropzoneFaceClasses,
  "cursor-pointer bg-surface-raised text-surface-raised-fg focus-visible:focus-ring " +
  "[&:is(:hover,[data-dragging])]:bg-accent [&:is(:hover,[data-dragging])]:text-accent-fg",
);

const dropzoneDisabledClasses = cn(
  dropzoneBaseClasses,
  dropzoneFaceClasses,
  "cursor-not-allowed bg-disabled text-disabled-fg",
);

const hiddenInputClasses =
  "absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap [clip-path:inset(50%)]";
const hiddenInputDisabledClasses = cn(hiddenInputClasses, "cursor-not-allowed");

const labelClasses = "text-sm leading-5 control-label";

const hintClasses = "text-xs leading-body font-field text-foreground";
const hintDisabledClasses = "text-xs leading-body font-field text-disabled-fg";

export function Upload({ className, classNames, disabled, ...props }: UploadProps) {
  return (
    <UploadHeadless
      {...props}
      disabled={disabled}
      className={cn(rootClasses, className)}
      classNames={mergeSlots(
        {
          dropzone: disabled ? dropzoneDisabledClasses : dropzoneClasses,
          hiddenInput: disabled ? hiddenInputDisabledClasses : hiddenInputClasses,
          label: labelClasses,
          hint: disabled ? hintDisabledClasses : hintClasses,
        },
        classNames,
      )}
    />
  );
}
