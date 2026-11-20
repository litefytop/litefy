"use client";
import * as React from "react";
import { useMotionPreference } from "../utils/use-motion-preference";

export type AnimatedContentDirection = "up" | "down" | "left" | "right";
export type AnimatedContentDuration = "sm" | "md" | "lg";

export interface AnimatedContentProps extends React.ComponentProps<"div"> {
    direction?: AnimatedContentDirection;
    distance?: number;
    duration?: AnimatedContentDuration;
    delay?: number;
    threshold?: number;
    once?: boolean;
}

function typeName(type: string | React.JSXElementConstructor<unknown>): string {
    if (typeof type === "string") return type;
    const named = type as { displayName?: string; name?: string };
    return named.displayName || named.name || "component";
}

function contentSignature(children: React.ReactNode): string {
    return React.Children.toArray(children)
        .map((child) =>
            React.isValidElement(child) ? `${child.key ?? ""}@${typeName(child.type)}` : String(child),
        )
        .join("|");
}

function exitDurationMs(root: HTMLElement): number {
    const raw = getComputedStyle(root).transitionDuration.split(",")[0].trim();
    const value = Number.parseFloat(raw);
    if (!Number.isFinite(value)) return 0;
    return raw.endsWith("ms") ? value : value * 1000;
}

export function AnimatedContent({
    direction = "up",
    distance = 24,
    duration = "lg",
    delay = 0,
    threshold = 0.1,
    once = true,
    className,
    style,
    children,
    ...props
}: AnimatedContentProps) {
    const [root, setRoot] = React.useState<HTMLDivElement | null>(null);
    const [state, setState] = React.useState<"in" | "out">("out");
    const [displayed, setDisplayed] = React.useState(children);
    const { reduced } = useMotionPreference();

    const signature = contentSignature(children);
    const latestRef = React.useRef(children);
    const signatureRef = React.useRef(signature);
    const stateRef = React.useRef(state);
    const rootRef = React.useRef<HTMLDivElement | null>(null);
    const timerRef = React.useRef(0);
    React.useEffect(() => {
        latestRef.current = children;
        stateRef.current = state;
        rootRef.current = root;
    });

    const swapIn = React.useCallback(() => {
        timerRef.current = 0;
        setDisplayed(latestRef.current);
        setState("in");
    }, []);

    React.useEffect(() => {
        if (signatureRef.current === signature) return;
        signatureRef.current = signature;
        if (reduced) {
            clearTimeout(timerRef.current);
            swapIn();
            return;
        }
        if (stateRef.current === "in" || timerRef.current) {
            setState("out");
            clearTimeout(timerRef.current);
            const ms = rootRef.current ? exitDurationMs(rootRef.current) : 0;
            if (ms <= 0) {
                swapIn();
                return;
            }
            timerRef.current = window.setTimeout(swapIn, ms);
            return;
        }
        setDisplayed(latestRef.current);
    }, [signature, reduced, swapIn]);

    React.useEffect(() => {
        if (!reduced) return;
        clearTimeout(timerRef.current);
        timerRef.current = 0;
        setDisplayed(latestRef.current);
        setState("in");
    }, [reduced]);

    React.useEffect(() => {
        if (!root) return;
        if (reduced || typeof IntersectionObserver === "undefined") {
            if (stateRef.current !== "in") setState("in");
            return;
        }
        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries.some((entry) => entry.isIntersecting);
                if (visible) {
                    setState("in");
                    if (once) observer.disconnect();
                } else if (!once && !timerRef.current) {
                    setState("out");
                }
            },
            { threshold },
        );
        observer.observe(root);
        return () => observer.disconnect();
    }, [root, once, threshold, reduced]);

    React.useEffect(() => () => clearTimeout(timerRef.current), []);

    const mergedStyle = {
        ...style,
        "--animated-content-distance": `${Math.max(distance, 0)}px`,
        transitionDelay: reduced ? "0ms" : `${Math.max(delay, 0)}ms`,
    } as React.CSSProperties;

    return (
        <div
            {...props}
            ref={setRoot}
            className={className}
            style={mergedStyle}
            data-state={state}
            data-direction={direction}
            data-duration={duration}
            inert={state === "out"}
        >
            {displayed}
        </div>
    );
}