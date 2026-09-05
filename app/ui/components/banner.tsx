"use client";
import * as React from "react";
import { type ClassNameValue, cn } from "..";

export interface BannerItem {
  key?: string | number;
  content: React.ReactNode;
}

export interface BannerViewportProps
  extends Omit<React.ComponentProps<"div">, "className"> {
  className?: ClassNameValue;
}

export function BannerViewport({ className, ...props }: BannerViewportProps) {
  return (
    <div
      {...props}
      className={cn("w-full overflow-hidden", className)}
      aria-roledescription="marquee"
    />
  );
}

export interface BannerTrackProps
  extends Omit<React.ComponentProps<"div">, "className"> {
  className?: ClassNameValue;
  duration?: number;
  direction?: "left" | "right";
  playing?: boolean;
}

export function BannerTrack({
  duration = 30,
  direction = "left",
  playing = true,
  className,
  ...props
}: BannerTrackProps) {
  const trackRef = React.useRef<HTMLDivElement>(null);
  const playingRef = React.useRef(playing);
  playingRef.current = playing;

  React.useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const from = direction === "left" ? "translateX(0)" : "translateX(-50%)";
    const to = direction === "left" ? "translateX(-50%)" : "translateX(0)";
    const anim = el.animate([{ transform: from }, { transform: to }], {
      duration: Math.max(1, duration) * 1000,
      iterations: Infinity,
      easing: "linear",
    });
    if (!playingRef.current || reduced) anim.pause();
    return () => anim.cancel();
  }, [duration, direction]);

  React.useEffect(() => {
    const anim = trackRef.current?.getAnimations()[0];
    if (!anim) return;
    if (playing) anim.play();
    else anim.pause();
  }, [playing]);

  return (
    <div
      {...props}
      ref={trackRef}
      className={cn("flex w-max items-center", className)}
    />
  );
}

export interface BannerItemProps
  extends Omit<React.ComponentProps<"div">, "className"> {
  className?: ClassNameValue;
}

export function BannerItem({ className, ...props }: BannerItemProps) {
  return <div {...props} className={cn("flex shrink-0 items-center", className)} />;
}

export interface BannerProps
  extends Omit<React.ComponentProps<"div">, "children" | "className"> {
  items: BannerItem[];
  speed?: number;
  direction?: "left" | "right";
  pauseOnHover?: boolean;
  className?: ClassNameValue;
  classNames?: {
    viewport?: ClassNameValue;
    track?: ClassNameValue;
    item?: ClassNameValue;
  };
  styles?: {
    viewport?: React.CSSProperties;
    track?: React.CSSProperties;
    item?: React.CSSProperties;
  };
}

export function Banner({
  items,
  speed = 30,
  direction = "left",
  pauseOnHover = true,
  className,
  classNames,
  styles,
  onMouseEnter,
  onMouseLeave,
  ...props
}: BannerProps) {
  const viewportRef = React.useRef<HTMLDivElement>(null);
  const setRef = React.useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = React.useState(false);
  const [repeat, setRepeat] = React.useState(2);

  React.useEffect(() => {
    const viewport = viewportRef.current;
    const set = setRef.current;
    if (!viewport || !set) return;
    const measure = () => {
      const setWidth = set.getBoundingClientRect().width;
      if (setWidth > 0) {
        setRepeat(Math.max(2, 2 * Math.ceil(viewport.clientWidth / setWidth)));
      }
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, [items]);

  const sets = Array.from({ length: repeat }, (_, setIndex) => (
    <div
      key={setIndex}
      ref={setIndex === 0 ? setRef : undefined}
      aria-hidden={setIndex > 0 || undefined}
      className="flex shrink-0 items-center"
    >
      {items.map((item, itemIndex) => (
        <BannerItem
          key={item.key ?? itemIndex}
          className={classNames?.item}
          style={styles?.item}
        >
          {item.content}
        </BannerItem>
      ))}
    </div>
  ));

  return (
    <BannerViewport
      {...props}
      ref={viewportRef}
      className={cn(className, classNames?.viewport)}
      style={styles?.viewport}
      onMouseEnter={(e) => {
        onMouseEnter?.(e);
        if (pauseOnHover) setHovering(true);
      }}
      onMouseLeave={(e) => {
        onMouseLeave?.(e);
        if (pauseOnHover) setHovering(false);
      }}
    >
      <BannerTrack
        duration={speed}
        direction={direction}
        playing={!hovering}
        className={classNames?.track}
        style={styles?.track}
      >
        {sets}
      </BannerTrack>
    </BannerViewport>
  );
}

Banner.Viewport = BannerViewport;
Banner.Track = BannerTrack;
Banner.Item = BannerItem;
