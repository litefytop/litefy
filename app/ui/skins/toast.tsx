import { Toaster as ToasterHeadless, type ToastItemProps } from "@/ui";
import { cn, mergeSlots } from "../utils/cn";



const viewportClasses =
  "pointer-events-none fixed top-4 left-1/2 z-100 m-0 flex w-full max-w-112 -translate-x-1/2 " +
  "flex-col items-center gap-1 overflow-visible bg-transparent border-0 px-4";

const toastBaseClasses =
  "group/toast pointer-events-auto relative isolate flex w-fit max-w-full cursor-pointer items-center gap-x-3 overflow-hidden";
const toastFaceClasses =
  "rounded-xl border-frame border-border bg-info py-2 px-3 text-info-fg shadow-hint";
const toastLayerClasses =
  "before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] " +
  "before:content-[''] before:bg-background";
const toastTypeClasses =
  "data-[type=success]:bg-success data-[type=success]:text-success-fg " +
  "data-[type=error]:bg-danger data-[type=error]:text-danger-fg " +
  "data-[type=warning]:bg-warning data-[type=warning]:text-warning-fg";

const rootClasses = cn(toastBaseClasses, toastFaceClasses, toastLayerClasses, toastTypeClasses);

const iconClasses = "shrink-0 self-center";

const contentClasses = "flex min-w-0 flex-col group-has-[button]/toast:pr-5";
const titleClasses = "max-w-full truncate font-medium";
const descriptionClasses = "mt-1 hidden max-w-full truncate text-sm leading-5 group-data-[tapped]/toast:block";

const closeBaseClasses =
  "absolute top-1/2 right-2 shrink-0 -translate-y-1/2 cursor-pointer rounded-sm p-1 opacity-0";
const closeRevealClasses =
  "transition-opacity duration-sm group-hover/toast:opacity-100 group-data-[tapped]/toast:opacity-100";
const closeFaceClasses =
  "after:absolute after:inset-[calc(50%-var(--height-control)/2)] after:content-['']";

const closeClasses = cn(closeBaseClasses, closeRevealClasses, closeFaceClasses);

const skinClassNames = {
  root: rootClasses,
  icon: iconClasses,
  content: contentClasses,
  title: titleClasses,
  description: descriptionClasses,
  close: closeClasses,
};

function withSkin(options: ToastItemProps): ToastItemProps {
  return { ...options, classNames: mergeSlots(skinClassNames, options.classNames) };
}

export const Toaster = Object.assign(
  function Toaster({ className, ...props }: Parameters<typeof ToasterHeadless>[0]) {
    return <ToasterHeadless {...props} className={cn(viewportClasses, className)} />;
  },
  {
    success: (options: ToastItemProps) => ToasterHeadless.success(withSkin(options)),
    error: (options: ToastItemProps) => ToasterHeadless.error(withSkin(options)),
    warning: (options: ToastItemProps) => ToasterHeadless.warning(withSkin(options)),
    info: (options: ToastItemProps) => ToasterHeadless.info(withSkin(options)),
    promise: ((fn, data) =>
      ToasterHeadless.promise(fn, {
        ...data,
        classNames: mergeSlots(skinClassNames, data.classNames),
      })) as typeof ToasterHeadless.promise,
    dismiss: ToasterHeadless.dismiss,
  },
);
