export const fieldChromeClasses = {
  root: "[&>*+*]:mt-1",
  label: "block ps-2 select-none text-sm control-label",
  required: "text-danger-independent",
  description: "block h-5 ps-2 text-sm leading-body font-field text-foreground",
  error:
    "pointer-events-none absolute inset-0 z-10 flex items-center overflow-hidden px-control-x rounded-md border-frame border-danger-independent " +
    "bg-surface-raised text-sm leading-5 font-field text-danger-independent truncate transition-opacity duration-sm opacity-0 data-[error=true]:opacity-100",
};
