"use client";
import { Slider as SliderHeadless } from "@/ui";
import type { SliderProps } from "@/ui";
import { cn, mergeSlots } from "../utils/cn";

export type SliderVariant = "default" | "cell";

const rootClasses = "relative max-w-full data-[orientation=horizontal]:min-w-[min(100%,--spacing(32))]";

const defaultRootClasses = "flex items-center gap-3 data-[orientation=vertical]:flex-col-reverse";

const cellRootClasses = "flex w-fit max-w-full items-center gap-4 data-[orientation=vertical]:flex-col-reverse";

const textSlots = {
    label: "shrink-0 whitespace-nowrap text-xs text-foreground",
    value:
        "pointer-events-none shrink-0 whitespace-nowrap text-xs tabular-nums text-foreground",
    bubble: "hidden",
};

const defaultSlots = {
    ...textSlots,
    track:
        "relative touch-none select-none rounded-pill bg-surface " +
        "data-[orientation=horizontal]:h-1 data-[orientation=horizontal]:w-112 data-[orientation=horizontal]:grow data-[orientation=horizontal]:min-w-0 data-[orientation=horizontal]:max-w-112 " +
        "data-[orientation=vertical]:w-1 data-[orientation=vertical]:h-64 data-[orientation=vertical]:shrink-0",
    fill: "absolute rounded-pill bg-primary",
    thumb:
        "absolute block size-[1.5rem] rounded-pill touch-none cursor-grab active:cursor-grabbing " +
        "border-frame border-border bg-background shadow-base motion-frame " +
        "active:bg-accent focus-visible:focus-ring thumb-hit",
};

const cellSlots = {
    ...textSlots,
    track:
        "relative touch-none select-none rounded-sm bg-surface " +
        "data-[orientation=horizontal]:h-control data-[orientation=horizontal]:w-112 data-[orientation=horizontal]:grow data-[orientation=horizontal]:min-w-0 data-[orientation=horizontal]:max-w-112 " +
        "data-[orientation=vertical]:w-control data-[orientation=vertical]:h-64 data-[orientation=vertical]:shrink-0",
    fill: "absolute rounded-sm bg-primary",
    thumb:
        "absolute block touch-none rounded-pill outline-none cursor-grab active:cursor-grabbing motion-frame " +
        "data-[orientation=horizontal]:h-control data-[orientation=horizontal]:w-[1.5rem] " +
        "data-[orientation=vertical]:w-control data-[orientation=vertical]:h-[1.5rem]",
};

export function Slider({ orientation, className, classNames, ...props }: SliderProps & { "data-variant"?: SliderVariant }) {
    const variant: SliderVariant = props["data-variant"] === "cell" ? "cell" : "default";
    const slots = variant === "cell" ? cellSlots : defaultSlots;
    const rootVariantClasses = variant === "cell" ? cellRootClasses : defaultRootClasses;
    return (
        <SliderHeadless
            {...props}
            orientation={orientation}
            className={cn(rootClasses, rootVariantClasses, className)}
            classNames={mergeSlots(slots, classNames)}
        />
    );
}
