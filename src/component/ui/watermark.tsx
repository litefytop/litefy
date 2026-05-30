import { cn, ClassNameValue } from "@/lib";
import { ReactNode, useMemo } from "react";

export type WatermarkProps = {
  text: string;
  fontSize?: number;
  color?: string;
  fontFamily?: string;
  rotate?: number;
  gap?: number;
  opacity?: number;
  zIndex?: number;
  className?: ClassNameValue;
  children: ReactNode;
};

function Watermark({
  text,
  fontSize = 16,
  color = "rgba(0, 0, 0, 0.3)",
  fontFamily = "sans-serif",
  rotate = -30,
  gap = 100,
  opacity = 0.3,
  zIndex = 10,
  className,
  children,
}: WatermarkProps) {
  const watermarkStyle = useMemo(() => {
    if (typeof window === "undefined" || !text) {
      return {};
    }

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return {};

    const ratio = window.devicePixelRatio || 1;
    const canvasWidth = gap * ratio;
    const canvasHeight = gap * ratio;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    canvas.style.width = `${gap}px`;
    canvas.style.height = `${gap}px`;

    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotate * Math.PI) / 180);

    ctx.font = `${fontSize * ratio}px ${fontFamily}`;

    let fillColor = color;
    if (!color.includes("rgba") && !color.includes("hsla") && opacity !== 1) {
      fillColor = `rgba(0, 0, 0, ${opacity})`;
    }
    ctx.fillStyle = fillColor;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, 0, 0);

    return {
      backgroundImage: `url(${canvas.toDataURL()})`,
      backgroundRepeat: "repeat",
      backgroundPosition: "center",
    };
  }, [text, fontSize, color, fontFamily, rotate, gap, opacity]);

  if (!watermarkStyle.backgroundImage) {
    return <>{children}</>;
  }

  return (
    <div className={cn("relative", className)}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ ...watermarkStyle, zIndex }}
      />
      {children}
    </div>
  );
}

export { Watermark };
