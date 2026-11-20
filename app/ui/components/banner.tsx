"use client";
import * as React from "react";
import { X } from "./icons";
import { useMotionPreference } from "../utils/use-motion-preference";
export interface BannerEntry {
    key?: string | number;
    content: React.ReactNode;
}
export interface BannerViewportProps extends Omit<React.ComponentProps<"div">, "className"> {
    className?: string;
}
export function BannerViewport(props: BannerViewportProps) {
    return (<div aria-roledescription="marquee" {...props}/>);
}
export interface BannerTrackProps extends Omit<React.ComponentProps<"div">, "className"> {
    className?: string;
    duration?: number;
    direction?: "left" | "right";
    playing?: boolean;
}
export function BannerTrack({ duration = 30, direction = "left", playing = true, className, ...props }: BannerTrackProps) {
    const trackRef = React.useRef<HTMLDivElement>(null);
    const playingRef = React.useRef(playing);
    React.useEffect(() => {
        playingRef.current = playing;
    });
    const reducedMotion = useMotionPreference().reduced;
    React.useEffect(() => {
        const el = trackRef.current;
        if (!el)
            return;
        const from = direction === "left" ? "translateX(0)" : "translateX(-50%)";
        const to = direction === "left" ? "translateX(-50%)" : "translateX(0)";
        const anim = el.animate([{ transform: from }, { transform: to }], {
            duration: Math.max(1, duration) * 1000,
            iterations: Infinity,
            easing: "linear",
        });
        if (!playingRef.current || reducedMotion)
            anim.pause();
        return () => anim.cancel();
    }, [duration, direction, reducedMotion]);
    React.useEffect(() => {
        const anim = trackRef.current?.getAnimations()[0];
        if (!anim)
            return;
        if (playing && !reducedMotion)
            anim.play();
        else
            anim.pause();
    }, [playing, reducedMotion]);
    return <div {...props} ref={trackRef} className={className}/>;
}
export interface BannerItemProps extends Omit<React.ComponentProps<"span">, "className"> {
    className?: string;
}
export function BannerItem(props: BannerItemProps) {
    return <span {...props}/>;
}
export interface BannerCloseProps extends Omit<React.ComponentProps<"button">, "className"> {
    className?: string;
}
export function BannerClose(props: BannerCloseProps) {
    return (<button type="button" {...props}/>);
}
export interface BannerProps extends Omit<React.ComponentProps<"div">, "children" | "className"> {
    items: BannerEntry[];
    speed?: number;
    direction?: "left" | "right";
    pauseOnHover?: boolean;
    playing?: boolean;
    closable?: boolean;
    onClose?: () => void;
    closeLabel?: string;
    className?: string;
    classNames?: {
        viewport?: string;
        track?: string;
        item?: string;
        close?: string;
    };
    styles?: {
        viewport?: React.CSSProperties;
        track?: React.CSSProperties;
        item?: React.CSSProperties;
        close?: React.CSSProperties;
    };
}
export function Banner({ items, speed = 30, direction = "left", pauseOnHover = true, playing = true, closable = false, onClose, closeLabel = "Close", className, style, classNames, styles, onMouseEnter, onMouseLeave, ...props }: BannerProps) {
    const viewportRef = React.useRef<HTMLDivElement>(null);
    const setRef = React.useRef<HTMLDivElement>(null);
    const [hovering, setHovering] = React.useState(false);
    const [onScreen, setOnScreen] = React.useState(true);
    const [stretch, setStretch] = React.useState(0);
    const stretchRef = React.useRef(0);
    const itemsRef = React.useRef(items);
    React.useEffect(() => {
        const viewport = viewportRef.current;
        if (!viewport)
            return;
        const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting));
        observer.observe(viewport);
        return () => observer.disconnect();
    }, []);
    React.useEffect(() => {
        itemsRef.current = items;
        const viewport = viewportRef.current;
        const set = setRef.current;
        if (!viewport || !set)
            return;
        const measure = () => {
            const width = set.getBoundingClientRect().width;
            if (width <= 0)
                return;
            const natural = width - stretchRef.current;
            const need = viewport.clientWidth - natural;
            const next = Math.max(need, 0);
            stretchRef.current = next;
            setStretch(next);
        };
        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(set);
        observer.observe(viewport);
        return () => observer.disconnect();
    }, [items]);
    const trailing = items.length > 0 ? stretch / items.length : 0;
    const sets = Array.from({ length: 2 }, (_, setIndex) => (<div key={setIndex} ref={setIndex === 0 ? setRef : undefined} aria-hidden={setIndex > 0 || undefined}>
      {items.map((item, itemIndex) => (<BannerItem key={item.key ?? itemIndex} className={classNames?.item} style={{ marginRight: trailing, ...styles?.item }}>
          {item.content}
        </BannerItem>))}
    </div>));
    return (<div {...props} className={className} style={style} onMouseEnter={(e) => {
            onMouseEnter?.(e);
            if (pauseOnHover)
                setHovering(true);
        }} onMouseLeave={(e) => {
            onMouseLeave?.(e);
            if (pauseOnHover)
                setHovering(false);
        }}>
      <BannerViewport ref={viewportRef} className={classNames?.viewport} style={styles?.viewport}>
        <BannerTrack duration={speed} direction={direction} playing={playing && !hovering && onScreen} className={classNames?.track} style={styles?.track}>
          {sets}
        </BannerTrack>
      </BannerViewport>
      {closable && (<BannerClose className={classNames?.close} style={styles?.close} aria-label={closeLabel} onClick={onClose}>
          <X aria-hidden/>
        </BannerClose>)}
    </div>);
}
