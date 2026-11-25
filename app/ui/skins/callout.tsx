import * as React from "react";
import { icons } from "@/ui";
import type { IconName } from "@/ui";
import { cn } from "../utils/cn";

export interface CalloutProps extends Omit<React.ComponentProps<"div">, "className"> {
  className?: string;
  "data-variant"?: "info" | "success" | "warning" | "danger";
}

const meta: Record<Exclude<NonNullable<CalloutProps["data-variant"]>, undefined>, { name: IconName; label: string }> = {
  info: { name: "circleInfo", label: "Info" },
  success: { name: "circleCheck", label: "Success" },
  warning: { name: "triangleAlert", label: "Warning" },
  danger: { name: "circleAlert", label: "Danger" },
};

const tone = {
  info: { box: "bg-info text-info-fg border-s-4 border-s-info-fg", mark: "text-info-fg" },
  success: { box: "bg-success text-success-fg border-s-4 border-s-success-fg", mark: "text-success-fg" },
  warning: { box: "bg-warning text-warning-fg border-s-4 border-s-warning-fg", mark: "text-warning-fg" },
  danger: { box: "bg-danger text-danger-fg border-s-4 border-s-danger-fg", mark: "text-danger-fg" },
};

const boxClasses =
  "flex w-full min-w-0 items-start gap-x-2 px-3 py-snug rounded-md text-label leading-6 font-label";

const iconClasses = "size-4 shrink-0 mt-1";

const titleClasses = "font-strong";

export function Callout({
  role = "note",
  "data-variant": variant = "info",
  className,
  children,
  ...props
}: CalloutProps) {
  const key = (variant && variant in meta ? variant : "info") as keyof typeof meta;
  const { name, label } = meta[key];
  const Icon = icons[name];
  const tones = tone[key];
  return (
    <div {...props} role={role} data-variant={variant} className={cn(boxClasses, tones.box, className)}>
      <Icon aria-hidden className={cn(iconClasses, tones.mark)} />
      <div className="min-w-0 flex-1">
        <p className={cn(titleClasses, tones.mark)}>{label}</p>
        <div>{children}</div>
      </div>
    </div>
  );
}
