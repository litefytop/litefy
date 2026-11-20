"use client";
import * as React from "react";
import { useMotionPreference } from "../utils/use-motion-preference";

export type CountUpEasing = "linear" | "out";

export interface CountUpClassNames {
    value?: string;
    final?: string;
}

export interface CountUpProps extends Omit<React.ComponentProps<"span">, "className" | "children"> {
    to: number;
    from?: number;
    duration?: number;
    delay?: number;
    decimals?: number;
    separator?: string;
    decimal?: string;
    prefix?: string;
    suffix?: string;
    easing?: CountUpEasing;
    format?: (value: number) => string;
    className?: string;
    style?: React.CSSProperties;
    classNames?: CountUpClassNames;
}

function formatValue(
    value: number,
    decimals: number,
    separator: string,
    decimal: string,
    prefix: string,
    suffix: string,
) {
    const digits = Math.max(0, Math.trunc(decimals));
    const negative = value < 0;
    const [int, frac] = Math.abs(value).toFixed(digits).split(".");
    const grouped = separator ? int.replaceAll(/\B(?=(\d{3})+(?!\d))/gu, separator) : int;
    const body = frac ? `${grouped}${decimal}${frac}` : grouped;
    return `${prefix}${negative ? "-" : ""}${body}${suffix}`;
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export function CountUp({
    to,
    from = 0,
    duration = 2,
    delay = 0,
    decimals = 0,
    separator = ",",
    decimal = ".",
    prefix = "",
    suffix = "",
    easing = "out",
    format,
    className,
    style,
    classNames,
    ...props
}: CountUpProps) {
    const [status, setStatus] = React.useState<"idle" | "playing" | "done">("idle");
    const [root, setRoot] = React.useState<HTMLSpanElement | null>(null);
    const valueRef = React.useRef<HTMLSpanElement>(null);
    const currentRef = React.useRef(from);
    const playedRef = React.useRef(false);
    const frameRef = React.useRef(0);
    const [initialText] = React.useState(() => formatValue(from, decimals, separator, decimal, prefix, suffix));
    const reducedRef = React.useRef(false);
    const { reduced } = useMotionPreference();
    React.useEffect(() => {
        reducedRef.current = reduced;
    });

    const formatRef = React.useRef(format);
    const inputsRef = React.useRef({ decimals, separator, decimal, prefix, suffix });
    React.useEffect(() => {
        formatRef.current = format;
        inputsRef.current = { decimals, separator, decimal, prefix, suffix };
    });

    const render = React.useCallback((value: number) => {
        const fmt = formatRef.current;
        const { decimals: d, separator: s, decimal: p, prefix: pre, suffix: suf } = inputsRef.current;
        if (valueRef.current) valueRef.current.textContent = fmt ? fmt(value) : formatValue(value, d, s, p, pre, suf);
    }, []);

    const finish = React.useCallback(
        (target: number) => {
            playedRef.current = true;
            currentRef.current = target;
            render(target);
            setStatus("done");
        },
        [render],
    );

    const play = React.useCallback(
        (target: number) => {
            cancelAnimationFrame(frameRef.current);
            if (reducedRef.current) {
                finish(target);
                return;
            }
            const seconds = Math.max(duration, 0);
            if (seconds <= 0) {
                finish(target);
                return;
            }
            playedRef.current = true;
            setStatus("playing");
            const startValue = currentRef.current;
            const startedAt = performance.now() + Math.max(delay, 0) * 1000;
            const step = (now: number) => {
                const t = Math.min(Math.max((now - startedAt) / (seconds * 1000), 0), 1);
                const progress = easing === "linear" ? t : easeOutCubic(t);
                const value = startValue + (target - startValue) * progress;
                currentRef.current = value;
                render(value);
                if (t < 1) {
                    frameRef.current = requestAnimationFrame(step);
                } else {
                    setStatus("done");
                }
            };
            frameRef.current = requestAnimationFrame(step);
        },
        [delay, duration, easing, finish, render],
    );

    React.useEffect(() => {
        return () => cancelAnimationFrame(frameRef.current);
    }, []);

    const playRef = React.useRef(play);
    React.useEffect(() => {
        playRef.current = play;
        if (!root) return;
        if (typeof IntersectionObserver === "undefined") {
            playRef.current(to);
            return;
        }
        const observer = new IntersectionObserver(
            (entries) => {
                if (!entries.some((entry) => entry.isIntersecting)) return;
                observer.disconnect();
                if (!playedRef.current) playRef.current(to);
            },
            { rootMargin: "0px" },
        );
        observer.observe(root);
        return () => observer.disconnect();
    }, [root, play, to]);

    React.useEffect(() => {
        if (playedRef.current) {
            play(to);
        } else {
            currentRef.current = from;
            render(from);
        }
    }, [to, from, play, render]);

    return (
        <span {...props} data-status={status} className={className} style={style} ref={setRoot}>
            <span ref={valueRef} aria-hidden="true" className={classNames?.value}>
                {initialText}
            </span>
            <span className={classNames?.final}>{formatValue(to, decimals, separator, decimal, prefix, suffix)}</span>
        </span>
    );
}
