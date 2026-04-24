
import { cn, ClassNameValue } from "@/lib";
import { ReactNode, useMemo } from "react";


export type WatermarkProps = {
  text: string;
  fontSize?: number;
  rotate?: number;
  gap?: number;
  opacity?: number;
  className?: ClassNameValue;
  children: ReactNode;
};

function Watermark({
  text,
  fontSize = 16,
  rotate = -30,
  gap = 100,
  opacity = 0.3,
  className,
  children,
}: WatermarkProps) {
  const watermarkStyle = useMemo(() => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    
    if (!ctx) {
      return {};
    }
    const ratio = window.devicePixelRatio || 1;
    const canvasWidth = `${gap * 2}`;
    const canvasHeight = `${gap * 2}`;
    
    canvas.width = Number(canvasWidth) * ratio;
    canvas.height = Number(canvasHeight) * ratio;
    canvas.style.width = canvasWidth;
    canvas.style.height = canvasHeight;

    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotate * Math.PI) / 180);
    
    ctx.font = `${fontSize * ratio}px sans-serif`;
    ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, 0, 0);

    const backgroundImage = canvas.toDataURL();

    return {
      backgroundImage: `url(${backgroundImage})`,
      backgroundRepeat: "repeat",
      backgroundPosition: "center",
    };
  }, [text, fontSize, rotate, gap, opacity]);

  return (
    <div data-slot="watermark" className={cn("relative", className)}>
      <div
        data-slot="watermark-overlay"
        className="absolute inset-0 pointer-events-none z-10"
        style={watermarkStyle}
      />
      <div data-slot="watermark-content">{children}</div>
    </div>
  );
}

export { Watermark };
