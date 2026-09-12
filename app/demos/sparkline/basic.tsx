"use client";

import { Sparkline } from "@/ui";

const trend = [12, 18, 15, 22, 19, 26, 24, 31, 28, 35, 33, 40];
const dip = [30, 28, 29, 24, 22, 25, 21, 18, 20, 16];
const flat = [20, 20, 20, 20, 20, 20];

export default function SparklineBasicDemo() {
  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="flex flex-col gap-1">
        <span className="text-xs text-muted-foreground">line</span>
        <Sparkline data={trend} className="h-10 w-full text-primary" />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-xs text-muted-foreground">area</span>
        <Sparkline data={trend} variant="area" smooth className="h-10 w-full text-primary" />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-xs text-muted-foreground">bar</span>
        <Sparkline data={dip} variant="bar" className="h-10 w-full text-danger" />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-xs text-muted-foreground">flat</span>
        <Sparkline data={flat} className="h-10 w-full text-muted-foreground" />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-xs text-muted-foreground">success</span>
        <Sparkline data={trend} variant="area" smooth className="h-10 w-full text-success" />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-xs text-muted-foreground">warning</span>
        <Sparkline data={dip} variant="bar" className="h-10 w-full text-warning" />
      </div>
    </div>
  );
}
