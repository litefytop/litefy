"use client";

import { useParams } from "react-router";
import { useMotionPreference, useReducedMotion, type MotionMode } from "@/ui/utils";

const MODE_LABELS: Record<"zh" | "en", Record<MotionMode, string>> = {
  zh: { system: "跟随系统", reduce: "减少动态", full: "完整动态" },
  en: { system: "System", reduce: "Reduce", full: "Full" },
};

export function MotionPreferenceStatus() {
  const systemReduced = useReducedMotion();
  const motion = useMotionPreference();
  const { lang } = useParams<{ lang?: string }>();
  const zh = lang === "zh";
  const systemValue = systemReduced ? "reduce" : "no-preference";
  const effective = motion.reduced ? "paused" : "playing";

  return (
    <div role="status" className="flex flex-col gap-1 text-sm">
      <p className="m-0">
        {zh ? "系统偏好：" : "System preference: "}
        <code>{systemValue}</code>
      </p>
      <p className="m-0">
        {zh ? "应用内设置：" : "App setting: "}
        {MODE_LABELS[zh ? "zh" : "en"][motion.mode]}
      </p>
      <p className="m-0">
        {zh ? "实际结果：" : "Result: "}
        <code>{effective}</code>
        {zh
          ? motion.reduced
            ? "，动画类示例会暂停。"
            : "，动画类示例会播放。"
          : motion.reduced
            ? " — animations are paused."
            : " — animations play."}
      </p>
    </div>
  );
}
