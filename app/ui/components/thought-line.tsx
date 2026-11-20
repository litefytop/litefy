"use client";
import * as React from "react";
import { Check, ChevronDown, Sparkle } from "./icons";
import { LatticeLoader, type LatticeLoaderClassNames } from "./lattice-loader";

export type ThoughtLineGlyph = "sparkle" | "lattice" | "dot" | "none" | React.ReactNode;

export interface ThoughtLineClassNames {
    line?: string;
    glyph?: string;
    body?: string;
    label?: string;
    lattice?: string;
    timer?: string;
    chevron?: string;
    steps?: string;
    step?: string;
    stepMarker?: string;
    stepsShell?: string;
}

export interface ThoughtLineProps extends Omit<React.ComponentProps<"div">, "className"> {
    working?: boolean;
    label?: string;
    doneLabel?: string;
    glyph?: ThoughtLineGlyph;
    latticeClassNames?: LatticeLoaderClassNames;
    steps?: string[];
    collapsible?: boolean;
    collapseOnSettle?: boolean;
    settleAfter?: number;
    elapsed?: number;
    showTimer?: boolean;
    renderLabel?: (text: string, working: boolean) => React.ReactNode;
    onSettle?: (seconds: number) => void;
    className?: string;
    classNames?: ThoughtLineClassNames;
}

function Glyph({ glyph, working, className, latticeClassName, latticeClassNames }: { glyph: ThoughtLineGlyph; working: boolean; className?: string; latticeClassName?: string; latticeClassNames?: LatticeLoaderClassNames }) {
    if (glyph === "none") return null;
    if (glyph === "dot") return <span className={className} aria-hidden="true" />;
    if (glyph === "sparkle") return <Sparkle className={className} aria-hidden="true" />;
    if (glyph === "lattice") {
        return (
            <LatticeLoader
                status={working ? "working" : "done"}
                label=""
                doneLabel=""
                errorLabel=""
                showTimer={false}
                aria-hidden="true"
                className={latticeClassName}
                classNames={latticeClassNames}
            />
        );
    }
    return glyph;
}

export function ThoughtLine({
    working = true,
    label = "Thinking…",
    doneLabel = "",
    glyph = "lattice",
    latticeClassNames,
    steps,
    collapsible = true,
    collapseOnSettle = true,
    settleAfter = 0,
    elapsed,
    showTimer = true,
    renderLabel,
    onSettle,
    className,
    classNames,
    ...props
}: ThoughtLineProps) {
    const [autoSettled, setAutoSettled] = React.useState(false);
    const [seconds, setSeconds] = React.useState(0);
    const [open, setOpen] = React.useState(true);
    const autoSettledRef = React.useRef(false);
    const openRef = React.useRef(true);
    const settled = !working || autoSettled;
    const hasSteps = Boolean(steps?.length);
    const listId = React.useId();

    React.useEffect(() => {
        if (!working) return;
        if (autoSettledRef.current) {
            autoSettledRef.current = false;
            setAutoSettled(false);
        }
        if (openRef.current) return;
        openRef.current = true;
        setOpen(true);
    }, [working]);

    React.useEffect(() => {
        if (!working || settleAfter <= 0) return;
        const id = window.setTimeout(() => {
            autoSettledRef.current = true;
            setAutoSettled(true);
        }, settleAfter * 1000);
        return () => window.clearTimeout(id);
    }, [working, settleAfter]);

    const live = elapsed ?? seconds;
    const secondsRef = React.useRef(0);
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

    const settledRef = React.useRef(settled);
    React.useEffect(() => {
        if (settledRef.current === settled) return;
        settledRef.current = settled;
        if (settled) {
            if (collapseOnSettle && openRef.current) {
                openRef.current = false;
                setOpen(false);
            }
            onSettle?.(live);
        }
    }, [settled, collapseOnSettle, live, onSettle]);

    const workingText = renderLabel ? renderLabel(label, true) : label;
    const doneText = doneLabel || (showTimer ? "Thought for" : "Done thinking");
    const settledText = renderLabel ? renderLabel(doneText, false) : doneText;

    const interactive = collapsible && hasSteps;
    const Line = interactive ? "button" : "div";
    const lineProps = interactive
        ? { type: "button" as const, "aria-expanded": open, "aria-controls": listId }
        : {};

    return (
        <div
            {...props}
            data-working={settled ? "false" : "true"}
            data-collapsible={interactive ? "true" : "false"}
            data-open={open ? "true" : "false"}
            className={className}
        >
            <Line {...lineProps} className={classNames?.line} onClick={interactive ? () => {
                const next = !openRef.current;
                openRef.current = next;
                setOpen(next);
            } : undefined}>
                <Glyph glyph={glyph} working={!settled} className={classNames?.glyph} latticeClassName={classNames?.lattice} latticeClassNames={latticeClassNames} />
                <span className={classNames?.body}>
                    <span aria-live="polite" className={classNames?.label}>{workingText}</span>
                    {settledText}
                    {showTimer && <span className={classNames?.timer}>{live.toFixed(1)}s</span>}
                </span>
                {interactive && <ChevronDown className={classNames?.chevron} aria-hidden="true" />}
            </Line>
            {steps && steps.length > 0 && (
                <ul id={listId} data-open={open ? "true" : "false"} className={classNames?.steps}>
                    <div className={classNames?.stepsShell}>
                        {steps.map((step, i) => {
                            const current = !settled && i === steps.length - 1;
                            return (
                                <li key={step} data-current={current ? "true" : "false"} className={classNames?.step}>
                                    {current ? (
                                        <span data-current="true" className={classNames?.stepMarker} aria-hidden="true" />
                                    ) : (
                                        <Check data-current="false" className={classNames?.stepMarker} aria-hidden="true" />
                                    )}
                                    <span>{step}</span>
                                </li>
                            );
                        })}
                    </div>
                </ul>
            )}
        </div>
    );
}
