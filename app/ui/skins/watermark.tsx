import { Watermark as WatermarkHeadless } from "@/ui";
import type { WatermarkProps } from "@/ui";
import { cn } from "../utils/cn";


const rootClasses = "relative overflow-hidden";

export function Watermark({ className, ...props }: WatermarkProps) {
  return <WatermarkHeadless {...props} className={cn(rootClasses, className)} />;
}
