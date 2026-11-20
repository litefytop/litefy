"use client";
import { useCallback, useEffect, useRef, useState } from "react";
export type WatermarkColor = "surface" | "surface-fg" | "primary" | "primary-fg" | "secondary" | "secondary-foreground" | "accent" | (string & Record<never, never>);
const COLOR_VAR_MAP: Record<string, string> = {
    surface: "--surface",
    "surface-fg": "--surface-fg",
    primary: "--primary",
    "primary-fg": "--color-primary-fg",
    secondary: "--secondary",
    "secondary-foreground": "--secondary-foreground",
    accent: "--accent",
};
export type WatermarkRootProps = Omit<React.ComponentProps<"div">, "className"> & {
    className?: string;
};
export function WatermarkRoot(props: WatermarkRootProps) {
    return <div {...props}/>;
}
export type WatermarkCanvasProps = Omit<React.ComponentProps<"canvas">, "className" | "ref"> & {
    text: string;
    fontSize?: number;
    color?: WatermarkColor;
    fontFamily?: string;
    rotate?: number;
    gap?: number;
    padding?: number;
    opacity?: number;
    className?: string;
};
export function WatermarkCanvas({ text, fontSize = 16, color = "surface-fg", fontFamily = "sans-serif", rotate = -30, gap = 100, padding = 20, opacity = 0.3, className, ...props }: WatermarkCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [colorScheme, setColorScheme] = useState<"light" | "dark">(() => {
        if (typeof window === "undefined")
            return "light";
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    });
    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const handler = (e: MediaQueryListEvent) => {
            setColorScheme(e.matches ? "dark" : "light");
        };
        mediaQuery.addEventListener("change", handler);
        return () => mediaQuery.removeEventListener("change", handler);
    }, []);
    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        const container = canvas?.parentElement;
        if (!canvas || !container || typeof window === "undefined" || !text)
            return;
        const ctx = canvas.getContext("2d");
        if (!ctx)
            return;
        const rect = container.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        if (width === 0 || height === 0)
            return;
        const ratio = window.devicePixelRatio || 1;
        canvas.width = width * ratio;
        canvas.height = height * ratio;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(ratio, ratio);
        let fillColor: string;
        const isSemantic = COLOR_VAR_MAP[color];
        if (isSemantic) {
            const computedColor = getComputedStyle(document.documentElement)
                .getPropertyValue(isSemantic)
                .trim();
            if (computedColor) {
                fillColor = computedColor;
            }
            else {
                fillColor = colorScheme === "dark" ? "rgba(255, 255, 255, 0.6)" : "rgba(0, 0, 0, 0.6)";
            }
        }
        else {
            fillColor = color;
        }
        ctx.font = `${fontSize}px ${fontFamily}`;
        const rad = (rotate * Math.PI) / 180;
        const textWidth = ctx.measureText(text).width;
        const textHeight = fontSize;
        const cos = Math.abs(Math.cos(rad));
        const sin = Math.abs(Math.sin(rad));
        const rotatedWidth = textWidth * cos + textHeight * sin;
        const rotatedHeight = textWidth * sin + textHeight * cos;
        const unitWidth = rotatedWidth + padding * 2;
        const unitHeight = rotatedHeight + padding * 2;
        const stepX = Math.max(unitWidth, gap);
        const stepY = Math.max(unitHeight, gap);
        const startX = unitWidth / 2;
        const startY = unitHeight / 2;
        ctx.clearRect(0, 0, width, height);
        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.fillStyle = fillColor;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        for (let x = startX; x < width + unitWidth; x += stepX) {
            for (let y = startY; y < height + unitHeight; y += stepY) {
                ctx.save();
                ctx.translate(x, y);
                ctx.rotate(rad);
                ctx.fillText(text, 0, 0);
                ctx.restore();
            }
        }
        ctx.restore();
    }, [text, fontSize, color, fontFamily, rotate, gap, padding, opacity, colorScheme]);
    useEffect(() => {
        draw();
        const canvas = canvasRef.current;
        const container = canvas?.parentElement;
        if (!container)
            return;
        let rafId: number | null = null;
        const handleDraw = () => {
            if (rafId)
                return;
            rafId = requestAnimationFrame(() => {
                draw();
                rafId = null;
            });
        };
        const resizeObserver = new ResizeObserver(() => handleDraw());
        resizeObserver.observe(container);
        const themeObserver = new MutationObserver(() => handleDraw());
        themeObserver.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class", "style"],
        });
        return () => {
            resizeObserver.disconnect();
            themeObserver.disconnect();
            if (rafId)
                cancelAnimationFrame(rafId);
        };
    }, [draw]);
    return (<canvas ref={canvasRef} {...props} style={{ position: "absolute", inset: 0, display: "block", pointerEvents: "none", userSelect: "none", ...props.style }} className={className}/>);
}
export type WatermarkProps = Omit<React.ComponentProps<"div">, "className" | "style"> & {
    text: string;
    fontSize?: number;
    color?: WatermarkColor;
    fontFamily?: string;
    rotate?: number;
    gap?: number;
    padding?: number;
    opacity?: number;
    className?: string;
    style?: React.CSSProperties;
    classNames?: {
        canvas?: string;
    };
    styles?: {
        canvas?: React.CSSProperties;
    };
};
export function Watermark({ text, fontSize, color, fontFamily, rotate, gap, padding, opacity, children, className, style, classNames, styles, ...props }: WatermarkProps) {
    return (<WatermarkRoot {...props} className={className} style={style}>
      {children}
      <WatermarkCanvas text={text} fontSize={fontSize} color={color} fontFamily={fontFamily} rotate={rotate} gap={gap} padding={padding} opacity={opacity} className={classNames?.canvas} style={styles?.canvas}/>
    </WatermarkRoot>);
}
