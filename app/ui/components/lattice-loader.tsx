"use client";
import * as React from "react";
import { Check, X } from "./icons";

export type LatticeStatus = "working" | "done" | "error";
export type LatticeGrid = 3 | 4;
export type LatticePatternName =
    | "arrow" | "dots" | "orbit" | "ripple" | "snake" | "spiral"
    | "sweep" | "spin" | "rain" | "pulse";
export type LatticePattern =
    | LatticePatternName
    | { cells: (number | null)[]; loop?: number; scale?: number };

export interface LatticeLoaderClassNames {
    lattice?: string;
    cell?: string;
    mark?: string;
    timer?: string;
}

export interface LatticeLoaderProps extends Omit<React.ComponentProps<"div">, "className"> {
    status?: LatticeStatus;
    label?: React.ReactNode;
    doneLabel?: React.ReactNode;
    errorLabel?: React.ReactNode;
    pattern?: LatticePattern;
    grid?: LatticeGrid;
    shape?: "square" | "round";
    step?: number;
    showTimer?: boolean;
    elapsed?: number;
    className?: string;
    classNames?: LatticeLoaderClassNames;
}

type PatternMatrix = { cells: (number | null)[]; loop: number };
type ResolvedPattern = { cells: { id: number; delay: number | null }[]; loop: number };

const PATTERNS: Record<LatticePatternName, Partial<Record<LatticeGrid, PatternMatrix>>> = {
    arrow: {
        3: { cells: [2, 3, 4, 0, 1, 2, 2, 3, 4], loop: 5 },
    },
    dots: {
        3: { cells: [0, 1, 0, 1, 0, 1, 0, 1, 0], loop: 2 },
        4: { cells: [0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0], loop: 2 },
    },
    orbit: {
        3: { cells: [0, 1, 2, 7, null, 3, 6, 5, 4], loop: 8 },
        4: {
            cells: [0, 1, 2, 3, 11, null, null, 4, 10, null, null, 5, 9, 8, 7, 6],
            loop: 12,
        },
    },
    ripple: {
        3: { cells: [2, 1, 2, 1, 0, 1, 2, 1, 2], loop: 3 },
        4: { cells: [2, 1, 1, 2, 1, 0, 0, 1, 1, 0, 0, 1, 2, 1, 1, 2], loop: 3 },
    },
    snake: {
        3: { cells: [0, 1, 2, 5, 4, 3, 6, 7, 8], loop: 9 },
        4: {
            cells: [0, 1, 2, 3, 7, 6, 5, 4, 8, 9, 10, 11, 15, 14, 13, 12],
            loop: 16,
        },
    },
    spiral: {
        3: { cells: [0, 1, 2, 5, 8, 7, 6, 3, 4], loop: 9 },
        4: {
            cells: [0, 1, 2, 3, 11, 12, 13, 4, 10, 15, 14, 5, 9, 8, 7, 6],
            loop: 16,
        },
    },
    sweep: {
        3: { cells: [0, 1, 2, 0, 1, 2, 0, 1, 2], loop: 3 },
        4: { cells: [0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3], loop: 4 },
    },
    spin: {
        3: { cells: [0, 1, 2, 1, 2, 0, 2, 0, 1], loop: 3 },
        4: {
            cells: [0, 1, 2, 3, 1, 2, 3, 0, 2, 3, 0, 1, 3, 0, 1, 2],
            loop: 4,
        },
    },
    rain: {
        3: { cells: [0, 1, 2, 1, 2, 3, 2, 3, 4], loop: 5 },
        4: { cells: [0, 1, 2, 3, 1, 2, 3, 4, 2, 3, 4, 5, 3, 4, 5, 6], loop: 7 },
    },
    pulse: {
        3: { cells: [1, 1, 1, 1, 0, 1, 1, 1, 1], loop: 2 },
        4: { cells: [1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1], loop: 2 },
    },
};

function resolvePattern(pattern: LatticePattern, grid: LatticeGrid): ResolvedPattern {
    const withIds = (cells: (number | null)[]) => cells.map((delay, id) => ({ id, delay }));
    if (typeof pattern !== "string") {
        const loop = pattern.loop ?? Math.max(...pattern.cells.filter((c): c is number => c !== null)) + 1;
        const scale = pattern.scale ?? 1;
        return {
            cells: withIds(pattern.cells.map((c) => (c === null ? null : c * scale))),
            loop: Math.max(1, (loop - 1) * scale + 1),
        };
    }
    const matrix = PATTERNS[pattern]?.[grid] ?? PATTERNS.orbit[grid]!;
    return { cells: withIds(matrix.cells), loop: matrix.loop };
}

export function LatticeLoader({
    status = "working",
    label,
    doneLabel,
    errorLabel,
    pattern = "orbit",
    grid = 3,
    shape = "round",
    step = 90,
    showTimer = true,
    elapsed,
    className,
    classNames,
    ...props
}: LatticeLoaderProps) {
    const [seconds, setSeconds] = React.useState(0);
    const secondsRef = React.useRef(0);
    const settled = status !== "working";

    React.useEffect(() => {
        if (settled || elapsed !== undefined) return;
        const started = performance.now();
        if (secondsRef.current !== 0) {
            secondsRef.current = 0;
            setSeconds(0);
        }
        const id = window.setInterval(() => {
            const next = (performance.now() - started) / 1000;
            secondsRef.current = next;
            setSeconds(next);
        }, 100);
        return () => window.clearInterval(id);
    }, [settled, elapsed]);

    const live = elapsed ?? seconds;
    const { cells, loop } = resolvePattern(pattern, grid);
    const loopMs = Math.max(step, 1) * loop;

    const verb = status === "working" ? label : status === "done" ? doneLabel : errorLabel;

    return (
        <div {...props} role="status" data-status={status} data-shape={shape} className={className}>
            <span
                aria-hidden="true"
                className={classNames?.lattice}
                style={{
                    gridTemplateColumns: `repeat(${grid}, minmax(0, 1fr))`,
                    "--lattice-loop": `${loopMs}ms`,
                } as React.CSSProperties}
            >
                {cells.map(({ id, delay }) => (
                    <span
                        key={id}
                        data-hole={delay === null ? "true" : "false"}
                        className={classNames?.cell}
                        style={
                            delay === null
                                ? undefined
                                : ({ "--lattice-cell-delay": `${delay * step - loopMs}ms` } as React.CSSProperties)
                        }
                    />
                ))}
                {status === "done" && <Check data-status={status} className={classNames?.mark} aria-hidden="true" />}
                {status === "error" && <X data-status={status} className={classNames?.mark} aria-hidden="true" />}
            </span>
            {verb}
            {showTimer && <span className={classNames?.timer}>{live.toFixed(1)}s</span>}
        </div>
    );
}
