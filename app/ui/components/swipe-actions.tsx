import * as React from "react";
import { ArrowLeft, ArrowRight } from "./icons";
import { useMotionPreference } from "../utils/use-motion-preference";

const HYST = 10;
const FLICK = 110;
const DECEL = 0.998;
const VMAX = 1500;
let warnedOverflow = false;

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const rubber = (o: number, dim: number, c: number) => (o * dim * c) / (dim + c * Math.abs(o));
const unrubber = (y: number, dim: number, c: number) => (y * dim) / (c * Math.max(1, dim - Math.abs(y)));
const project = (v: number) => ((v / 1000) * DECEL) / (1 - DECEL);
const velocityOf = (hist: [number, number][]) => {
    if (hist.length < 2)
        return 0;
    const a = hist[0];
    const b = hist.at(-1)!;
    return ((b[1] - a[1]) / Math.max(1, b[0] - a[0])) * 1000;
};
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

type Channel = "x" | "spread" | "landed";
type SpringOpts = { duration: number; bounce?: number; velocity?: number };

export interface SwipeActionConfig {
    id?: string;
    label: string;
    icon?: React.ReactNode;
    onSelect?: () => void;
    dismiss?: boolean;
}
export type SwipeActionTone = "primary" | "info" | "success" | "warning";

export interface SwipeActionsClassNames {
    root?: string;
    row?: string;
    rail?: string;
    action?: string | ((tone: SwipeActionTone) => string | undefined);
    actionContent?: string;
    block?: string;
    commit?: string;
    surface?: string;
    hint?: string;
    toggle?: string;
    live?: string;
}
export interface SwipeActionsProps extends React.ComponentProps<"div"> {
    primary?: SwipeActionConfig;
    info?: SwipeActionConfig;
    success?: SwipeActionConfig;
    warning?: SwipeActionConfig;
    danger?: SwipeActionConfig;
    direction?: "left" | "right";
    height?: number;
    actionWidth?: number;
    snapBounce?: number;
    resistance?: number;
    collapseMs?: number;
    commitAt?: number;
    fullSwipe?: boolean;
    disabled?: boolean;
    enter?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    onAction?: (action: SwipeActionConfig) => void;
    onCommit?: (action: SwipeActionConfig) => void;
    closeOnAction?: boolean;
    haptic?: boolean;
    label?: string;
    toggleLabel?: string;
    classNames?: SwipeActionsClassNames;
}

type Grip = {
    id: number;
    x0: number;
    y0: number;
    grab: number | null;
    moved: boolean;
    hist: [number, number][];
    touch: boolean;
};

export function SwipeActions({ primary, info, success, warning, danger, direction = "left", height = 64, actionWidth = 80, snapBounce = 0.2, resistance = 0.55, collapseMs = 200, commitAt = 0.6, fullSwipe = true, disabled = false, enter = false, open: openProp, onOpenChange, onAction, onCommit, closeOnAction = true, haptic = true, label = "List item", toggleLabel, className, style, children, classNames, onKeyDown, ref: consumerRef, ...props }: SwipeActionsProps) {
    const { reduced } = useMotionPreference();
    const s = direction === "left" ? -1 : 1;
    const A = actionWidth;
    const secondarySlots = [
        { tone: "primary", action: primary },
        { tone: "info", action: info },
        { tone: "success", action: success },
        { tone: "warning", action: warning },
    ].filter((slot): slot is { tone: SwipeActionTone; action: SwipeActionConfig } => !!slot.action);
    const n = secondarySlots.length + (danger ? 1 : 0);
    const D = n * A;
    const c = clamp(resistance, 0.05, 1);
    const [openState, setOpenState] = React.useState(false);
    const [phase, setPhase] = React.useState<"idle" | "entering" | "committing" | "collapsing">(() => (enter ? "entering" : "idle"));
    const [say, setSay] = React.useState("");
    const open = !disabled && (openProp ?? openState);
    const railId = `${React.useId()}-rail`;

    const rootRef = React.useRef<HTMLDivElement>(null);
    const surfaceRef = React.useRef<HTMLDivElement>(null);
    const railRef = React.useRef<HTMLDivElement>(null);
    const blockRef = React.useRef<HTMLDivElement>(null);
    const glyphRef = React.useRef<HTMLButtonElement>(null);
    const w = React.useRef(360);
    const grip = React.useRef<Grip | null>(null);
    const unwatch = React.useRef<(() => void) | null>(null);
    const heading = React.useRef<number | null>(null);
    const foldTimer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    const x = React.useRef(0);
    const spread = React.useRef(0);
    const landed = React.useRef(0);
    const rafs = React.useRef<Record<Channel, number | null>>({ x: null, spread: null, landed: null });
    const reducedRef = React.useRef(reduced);
    React.useEffect(() => {
        reducedRef.current = reduced;
    });

    const exposedOf = () => s * x.current;
    const commitPoint = () => Math.max(commitAt * w.current, D + A / 2);
    const canCommit = () => fullSwipe && !!danger && commitPoint() <= w.current;
    const setRefs = (el: HTMLDivElement | null) => {
        rootRef.current = el;
        if (typeof consumerRef === "function")
            consumerRef(el);
        else if (consumerRef)
            consumerRef.current = el;
    };

    const applyTransforms = React.useCallback(() => {
        const exposed = s * x.current;
        if (surfaceRef.current)
            surfaceRef.current.style.transform = `translateX(${x.current}px)`;
        if (railRef.current)
            railRef.current.style.transform = `translateX(${-s * Math.max(0, D - exposed)}px)`;
        const shift = spread.current * Math.max(0, exposed - A);
        if (blockRef.current)
            blockRef.current.style.transform = `translateX(${s * shift}px)`;
        if (glyphRef.current)
            glyphRef.current.style.transform = `translateX(${-s * landed.current * (shift - (w.current - A) / 2)}px)`;
    }, [s, D, A]);

    const stopChannel = React.useCallback((key: Channel) => {
        const id = rafs.current[key];
        if (id !== null) {
            cancelAnimationFrame(id);
            rafs.current[key] = null;
        }
    }, []);
    const stopAll = React.useCallback(() => {
        stopChannel("x");
        stopChannel("spread");
        stopChannel("landed");
    }, [stopChannel]);
    const tween = (key: Channel, set: (v: number) => void, from: number, to: number, done?: () => void) => {
        stopChannel(key);
        const t0 = performance.now();
        const step = (now: number) => {
            const t = clamp((now - t0) / 200, 0, 1);
            set(from + (to - from) * easeOut(t));
            if (t < 1) {
                rafs.current[key] = requestAnimationFrame(step);
            }
            else {
                rafs.current[key] = null;
                done?.();
            }
        };
        rafs.current[key] = requestAnimationFrame(step);
    };
    const springChannel = (key: Channel, set: (v: number) => void, get: () => number, target: number, opts: SpringOpts, done?: () => void) => {
        stopChannel(key);
        const zeta = Math.max(0.1, 1 - clamp(opts.bounce ?? 0, 0, 1) * 1.2);
        const k = Math.pow((2 * Math.PI) / opts.duration, 2);
        const damp = 2 * zeta * Math.sqrt(k);
        let v = clamp(opts.velocity ?? 0, -VMAX, VMAX);
        let pos = get();
        let last = performance.now();
        const step = (now: number) => {
            const dt = Math.min((now - last) / 1000, 1 / 30);
            last = now;
            v += (k * (target - pos) - damp * v) * dt;
            pos += v * dt;
            set(pos);
            if (Math.abs(target - pos) < 0.5 && Math.abs(v) < 5) {
                set(target);
                rafs.current[key] = null;
                done?.();
                return;
            }
            rafs.current[key] = requestAnimationFrame(step);
        };
        rafs.current[key] = requestAnimationFrame(step);
    };
    const animate = (key: Channel, set: (v: number) => void, get: () => number, target: number, opts: SpringOpts, useSpring: boolean, done?: () => void) => {
        if (useSpring && !reducedRef.current)
            springChannel(key, set, get, target, opts, done);
        else
            tween(key, set, get(), target, done);
    };
    const setX = (v: number) => {
        x.current = v;
        applyTransforms();
    };
    const setSpreadValue = (v: number) => {
        spread.current = v;
        applyTransforms();
    };
    const setLandedValue = (v: number) => {
        landed.current = v;
        applyTransforms();
    };
    const settle = (target: number, v = 0) => {
        heading.current = target;
        const flick = Math.abs(v) >= FLICK;
        animate("x", setX, () => x.current, s * target, { duration: flick ? 0.4 : 0.3, bounce: flick ? snapBounce : 0, velocity: s * v }, true);
    };
    const setSpread = (on: boolean) => {
        if ((spread.current === 1) === on)
            return;
        animate("spread", setSpreadValue, () => spread.current, on ? 1 : 0, { duration: 0.3 }, true);
        if (on && danger) {
            setSay(`Release to ${danger.label}`);
            if (haptic && grip.current?.touch)
                navigator.vibrate?.(8);
        }
    };
    const setOpenAndNotify = (next: boolean) => {
        if (disabled && next) return;
        if (next === open)
            return;
        setOpenState(next);
        onOpenChange?.(next);
    };
    const commit = (action: SwipeActionConfig, viaKey: boolean, v = 0) => {
        if (disabled) return;
        const leap = action === danger;
        const fold = () => {
            setPhase("collapsing");
            foldTimer.current = setTimeout(() => {
                onCommit?.(action);
                action.onSelect?.();
            }, collapseMs);
        };
        setPhase("committing");
        setSay(action.label);
        setOpenAndNotify(false);
        if (viaKey) {
            if (leap && !reducedRef.current) {
                spread.current = 1;
                landed.current = 1;
                applyTransforms();
            }
            setX(s * w.current);
            fold();
            return;
        }
        if (leap) {
            animate("spread", setSpreadValue, () => spread.current, 1, { duration: 0.3 }, true);
            animate("landed", setLandedValue, () => landed.current, 1, { duration: 0.3 }, true);
        }
        animate("x", setX, () => x.current, s * w.current, { duration: 0.3, velocity: s * v }, true, fold);
    };

    React.useLayoutEffect(() => {
        const el = rootRef.current;
        if (!el)
            return;
        w.current = el.offsetWidth || w.current;
        if (process.env.NODE_ENV !== "production" && !warnedOverflow && n > 0 && n * A > w.current) {
            warnedOverflow = true;
            console.warn("[swipe-actions] drawer width (" + n + " × " + A + "px) exceeds the row width (" + w.current + "px) — trailing actions can never be revealed. Keep at most five semantic actions (primary/info/success/warning/danger).");
        }
        const observer = new ResizeObserver((entries) => {
            const width = entries[0]?.contentRect.width;
            if (width)
                w.current = width;
        });
        observer.observe(el);
        applyTransforms();
        return () => observer.disconnect();
    }, [applyTransforms, A, n]);
    React.useLayoutEffect(() => {
        if (!enter)
            return;
        const id = requestAnimationFrame(() => setPhase("idle"));
        return () => cancelAnimationFrame(id);
    }, [enter]);
    React.useEffect(() => () => {
        clearTimeout(foldTimer.current);
        unwatch.current?.();
        stopAll();
    }, [stopAll]);
    React.useEffect(() => {
        applyTransforms();
    }, [applyTransforms]);
    React.useEffect(() => {
        if (openProp === undefined || grip.current || phase !== "idle")
            return;
        const target = open ? D : 0;
        if (heading.current === target)
            return;
        if (Math.abs(exposedOf() - target) > 0.5)
            settle(target);
    });

    const map = (raw: number) => {
        const W = w.current;
        if (raw < 0)
            return rubber(raw, W, c);
        if (raw <= D)
            return raw;
        if (!canCommit())
            return D + rubber(raw - D, W, c);
        const C = commitPoint();
        const knee = D + (C - D) / c;
        return raw <= knee ? D + c * (raw - D) : C + rubber(raw - knee, W, c);
    };
    const inv = (ex: number) => {
        const W = w.current;
        if (ex < 0)
            return unrubber(ex, W, c);
        if (ex <= D)
            return ex;
        if (!canCommit())
            return D + unrubber(ex - D, W, c);
        const C = commitPoint();
        const knee = D + (C - D) / c;
        return ex <= C ? D + (ex - D) / c : knee + unrubber(ex - C, W, c);
    };

    const down = (e: React.PointerEvent<HTMLDivElement>) => {
        if (disabled || n === 0 || phase !== "idle" || grip.current || e.button !== 0)
            return;
        stopAll();
        heading.current = null;
        grip.current = {
            id: e.pointerId,
            x0: e.clientX,
            y0: e.clientY,
            grab: null,
            moved: false,
            hist: [],
            touch: e.pointerType === "touch",
        };
        try {
            surfaceRef.current?.setPointerCapture(e.pointerId);
        }
        catch { }
        unwatch.current?.();
        const onMove = (ev: PointerEvent) => {
            if (ev.isTrusted)
                moveRef.current?.(ev);
        };
        const onUp = (ev: PointerEvent) => {
            if (ev.isTrusted)
                upRef.current?.(ev);
        };
        window.addEventListener("pointermove", onMove);
        window.addEventListener("pointerup", onUp);
        window.addEventListener("pointercancel", onUp);
        unwatch.current = () => {
            window.removeEventListener("pointermove", onMove);
            window.removeEventListener("pointerup", onUp);
            window.removeEventListener("pointercancel", onUp);
        };
    };
    const move = (e: PointerEvent) => {
        const g = grip.current;
        if (!g || g.id !== e.pointerId)
            return;
        if (g.grab === null) {
            const dx = e.clientX - g.x0;
            const dy = e.clientY - g.y0;
            if (Math.abs(dx) < HYST || Math.abs(dx) < Math.abs(dy))
                return;
            g.grab = s * (g.x0 + Math.sign(dx) * HYST) - inv(exposedOf());
            g.moved = true;
            window.getSelection()?.removeAllRanges();
            if (rootRef.current)
                rootRef.current.dataset.dragging = "";
        }
        const ex = map(s * e.clientX - g.grab);
        x.current = s * ex;
        g.hist.push([performance.now(), ex]);
        if (g.hist.length > 4)
            g.hist.shift();
        applyTransforms();
        setSpread(canCommit() && ex >= commitPoint());
    };
    const up = (e: PointerEvent) => {
        const g = grip.current;
        if (!g || g.id !== e.pointerId)
            return;
        grip.current = null;
        unwatch.current?.();
        unwatch.current = null;
        delete rootRef.current?.dataset.dragging;
        try {
            surfaceRef.current?.releasePointerCapture(e.pointerId);
        }
        catch { }
        const ex = exposedOf();
        const v = velocityOf(g.hist);
        if (!g.moved) {
            if (open) {
                setOpenAndNotify(false);
                settle(0);
                return;
            }
            const target = e.target;
            const interactive = target instanceof Element && target.closest("a, button, input, select, textarea, label, [role='button']");
            if (!interactive && phase === "idle") {
                // 点按展开走滑动动画（教学点：先看见滑出再学会拖）；键盘仍走 openNow 直开
                heading.current = D;
                setOpenAndNotify(true);
                setSay(`${n} actions revealed`);
                settle(D);
            }
            return;
        }
        if (danger && canCommit() && ex >= commitPoint()) {
            commit(danger, false, v);
            return;
        }
        const target = Math.abs(v) >= FLICK ? (v > 0 ? D : 0) : ex + project(v) > D / 2 ? D : 0;
        setSpread(false);
        setOpenAndNotify(target === D);
        settle(target, v);
    };
    const moveRef = React.useRef<(e: PointerEvent) => void>(move);
    const upRef = React.useRef<(e: PointerEvent) => void>(up);
    React.useEffect(() => {
        moveRef.current = move;
        upRef.current = up;
    });

    const act = (action: SwipeActionConfig, e: React.MouseEvent<HTMLButtonElement>) => {
        if (disabled || phase !== "idle")
            return;
        onAction?.(action);
        if (action === danger || action.dismiss) {
            commit(action, e.detail === 0);
            return;
        }
        action.onSelect?.();
        if (!closeOnAction)
            return;
        setOpenAndNotify(false);
        if (e.detail === 0) {
            heading.current = 0;
            setX(0);
        }
        else
            settle(0);
    };
    const openNow = () => {
        heading.current = D;
        stopChannel("x");
        setX(s * D);
        setOpenAndNotify(true);
        setSay(`${n} actions revealed`);
    };
    const closeNow = () => {
        heading.current = 0;
        stopChannel("x");
        setX(0);
        setOpenAndNotify(false);
    };
    const onToggleKey = (e: React.KeyboardEvent<HTMLButtonElement>) => {
        if (disabled || phase !== "idle" || n === 0)
            return;
        const openKey = s < 0 ? "ArrowLeft" : "ArrowRight";
        const closeKey = s < 0 ? "ArrowRight" : "ArrowLeft";
        const toggle = e.key === "Enter" || e.key === " ";
        if (e.key === openKey || (toggle && !open)) {
            e.preventDefault();
            openNow();
        }
        else if (e.key === closeKey || e.key === "Escape" || (toggle && open)) {
            e.preventDefault();
            closeNow();
        }
        else if ((e.key === "Delete" || e.key === "Backspace") && open && danger && canCommit()) {
            e.preventDefault();
            commit(danger, true);
        }
    };
    const onToggleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (e.detail !== 0 || disabled || phase !== "idle" || n === 0)
            return;
        if (open)
            closeNow();
        else
            openNow();
    };

    const geometryVars = {
        "--swipe-h": `${height}px`,
        "--swipe-a": `${actionWidth}px`,
        "--swipe-collapse": `${collapseMs}ms`,
    } as React.CSSProperties;
    const collapsed = phase === "collapsing" || phase === "entering";
    const actionClassName = (tone: SwipeActionTone) =>
        typeof classNames?.action === "function" ? classNames.action(tone) : classNames?.action;
    return (<div {...props} ref={setRefs} role="group" aria-label={label} data-direction={direction} data-open={open || undefined} data-phase={phase} data-collapsed={collapsed || undefined} data-disabled={disabled || undefined} aria-disabled={disabled || undefined} onKeyDown={onKeyDown} className={[classNames?.root, className].filter(Boolean).join(" ") || undefined} style={{ ...geometryVars, ...style }}>
      <div className={classNames?.row}>
        <div id={railId} ref={railRef} className={classNames?.rail} inert={!open || undefined} aria-hidden={!open || undefined}>
          {secondarySlots.map(({ tone, action }, i) => (<button key={action.id ?? tone} type="button" disabled={disabled} data-tone={tone} className={actionClassName(tone)} onClick={(e) => act(action, e)} style={s < 0 ? { right: (i + 1) * A } : { left: (i + 1) * A }}>
              <span className={classNames?.actionContent}>
                {action.icon ? <span aria-hidden="true">{action.icon}</span> : null}
                <span>{action.label}</span>
              </span>
            </button>))}
          {danger ? (<div ref={blockRef} className={classNames?.block}>
              <button ref={glyphRef} type="button" disabled={disabled} data-tone="danger" className={classNames?.commit} onClick={(e) => act(danger, e)}>
                <span className={classNames?.actionContent}>
                  {danger.icon ? <span aria-hidden="true">{danger.icon}</span> : null}
                  <span>{danger.label}</span>
                </span>
              </button>
            </div>) : null}
        </div>
        <div ref={surfaceRef} className={classNames?.surface} onPointerDown={down}>
          {children}
          <span aria-hidden="true" className={classNames?.hint} data-hidden={open || disabled || undefined}>
            {s < 0 ? <ArrowLeft /> : <ArrowRight />}
          </span>
          <button type="button" disabled={disabled} className={classNames?.toggle} tabIndex={disabled ? -1 : 0} aria-expanded={open} aria-controls={railId} aria-keyshortcuts={s < 0 ? "ArrowLeft" : "ArrowRight"} onKeyDown={onToggleKey} onClick={onToggleClick}>
            {toggleLabel ?? `${n} ${n === 1 ? "action" : "actions"}`}
          </button>
        </div>
      </div>
      <span aria-live="polite" className={classNames?.live}>{say}</span>
    </div>);
}
