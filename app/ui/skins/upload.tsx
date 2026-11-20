import { Upload as UploadHeadless } from "@/ui";
import type { UploadProps } from "@/ui";
import { cn, mergeSlots } from "../utils/cn";


const rootClasses = "relative";

const dropzoneClasses =
  "flex flex-col items-center justify-center gap-x-1.5 py-8 px-6 text-center text-sm leading-5 cursor-pointer rounded-md border-dashed border-frame border-border bg-background shadow-frame " +
  "not-data-[disabled=true]:hover:bg-accent " +
  "focus-visible:focus-ring " +
  "data-[dragging=true]:bg-accent " +
  "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50";

const hiddenInputClasses =
  "absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap [clip-path:inset(50%)]";

const labelClasses = "text-sm leading-5 font-label tracking-label case-label";

const hintClasses = "text-xs leading-body font-field text-surface-fg";

export function Upload({ className, classNames, ...props }: UploadProps) {
  return (
    <UploadHeadless
      {...props}
      className={cn(rootClasses, className)}
      classNames={mergeSlots(
        {
          dropzone: dropzoneClasses,
          hiddenInput: hiddenInputClasses,
          label: labelClasses,
          hint: hintClasses,
        },
        classNames,
      )}
    />
  );
}
