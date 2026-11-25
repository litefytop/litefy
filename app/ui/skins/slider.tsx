"use client";
import { Slider as SliderHeadless } from "@/ui";
import type { SliderProps } from "@/ui";
import { cn, mergeStateSlots, type SlotState } from "../utils/cn";

export type SliderVariant = "default" | "cell";

const rootBaseClasses = "relative min-w-0 max-w-full";
const rootHorizontalGuardClasses = "w-full";

const rootVariantClasses: Record<SliderVariant, Record<"horizontal" | "vertical", string>> = {
    default: {
        horizontal: "flex items-center gap-3",
        vertical: "flex flex-col-reverse items-center gap-3",
    },
    cell: {
        horizontal: "flex w-fit max-w-full items-center gap-4",
        vertical: "flex w-fit max-w-full flex-col-reverse items-center gap-4",
    },
};

const cellThumbLayoutClasses =
    "absolute block touch-none rounded-pill outline-none motion-frame";
const cellThumbHorizontalLayoutClasses = cn(cellThumbLayoutClasses, "h-control w-6");
const cellThumbVerticalLayoutClasses = cn(cellThumbLayoutClasses, "w-control h-6");
const cellThumbHorizontalClasses = cn(cellThumbHorizontalLayoutClasses, "cursor-grab active:cursor-grabbing active:bg-accent focus-visible:focus-ring thumb-hit");
const cellThumbVerticalClasses = cn(cellThumbVerticalLayoutClasses, "cursor-grab active:cursor-grabbing active:bg-accent focus-visible:focus-ring thumb-hit");
const cellThumbHorizontalDisabledClasses = cn(cellThumbHorizontalLayoutClasses, "cursor-not-allowed bg-disabled");
const cellThumbVerticalDisabledClasses = cn(cellThumbVerticalLayoutClasses, "cursor-not-allowed bg-disabled");

const labelClasses = "shrink-0 whitespace-nowrap text-xs text-foreground";
const labelDisabledClasses = "shrink-0 whitespace-nowrap text-xs text-disabled-fg";
const valueLayoutClasses = "pointer-events-none shrink-0 whitespace-nowrap text-xs tabular-nums";
const valueClasses = cn(valueLayoutClasses, "text-foreground");
const valueDisabledClasses = cn(valueLayoutClasses, "text-disabled-fg");
const textClassesByState = (normal: string, disabledClasses: string) =>
    ({ disabled }: SlotState) => disabled ? disabledClasses : normal;

const trackBaseClasses = "relative touch-none select-none";
const trackDefaultHorizontalClasses = cn(trackBaseClasses, "rounded-pill bg-surface h-1 w-112 grow min-w-0 max-w-112");
const trackDefaultVerticalClasses = cn(trackBaseClasses, "rounded-pill bg-surface w-1 h-64 shrink-0");
const trackCellHorizontalClasses = cn(trackBaseClasses, "rounded-sm bg-surface h-control w-112 grow min-w-0 max-w-112");
const trackCellVerticalClasses = cn(trackBaseClasses, "rounded-sm bg-surface w-control h-64 shrink-0");

const defaultThumbLayoutClasses =
    "absolute block size-6 rounded-pill touch-none " +
    "border-frame border-border shadow-base motion-frame";
const defaultThumbClasses = cn(
    defaultThumbLayoutClasses,
    "cursor-grab active:cursor-grabbing bg-surface-raised",
    "active:bg-accent focus-visible:focus-ring thumb-hit",
);
const defaultThumbDisabledClasses = cn(
    defaultThumbLayoutClasses,
    "cursor-not-allowed bg-disabled",
);

const trackClassesByState = (normal: string) =>
    ({ disabled }: SlotState) => disabled ? cn(normal, "bg-disabled") : normal;
const fillClassesByState = (normal: string) =>
    ({ disabled }: SlotState) => disabled ? cn(normal, "bg-disabled") : normal;
const thumbClassesByState = (normal: string, disabledClasses: string) =>
    ({ disabled }: SlotState) => disabled ? disabledClasses : normal;

const sliderSlots = (variant: SliderVariant, vertical: boolean) => ({
    label: textClassesByState(labelClasses, labelDisabledClasses),
    value: textClassesByState(valueClasses, valueDisabledClasses),
    bubble: "hidden",
    track: trackClassesByState(variant === "cell"
        ? (vertical ? trackCellVerticalClasses : trackCellHorizontalClasses)
        : (vertical ? trackDefaultVerticalClasses : trackDefaultHorizontalClasses)),
    fill: fillClassesByState(variant === "cell" ? "absolute rounded-sm bg-primary" : "absolute rounded-pill bg-primary"),
    thumb: thumbClassesByState(
        variant === "cell"
            ? (vertical ? cellThumbVerticalClasses : cellThumbHorizontalClasses)
            : defaultThumbClasses,
        variant === "cell"
            ? (vertical ? cellThumbVerticalDisabledClasses : cellThumbHorizontalDisabledClasses)
            : defaultThumbDisabledClasses,
    ),
});

export function Slider({ orientation, className, classNames, disabled, ...props }: SliderProps & { "data-variant"?: SliderVariant }) {
    const variant: SliderVariant = props["data-variant"] === "cell" ? "cell" : "default";
    const vertical = orientation === "vertical";
    return (
        <SliderHeadless
            {...props}
            orientation={orientation}
            disabled={disabled}
            className={cn(rootBaseClasses, !vertical && variant === "default" && rootHorizontalGuardClasses, rootVariantClasses[variant][vertical ? "vertical" : "horizontal"], disabled && "cursor-not-allowed", className)}
            classNames={mergeStateSlots(sliderSlots(variant, vertical), classNames)}
        />
    );
}