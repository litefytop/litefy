"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Banner, type BannerItem } from "@/ui";

const STORAGE_KEY = "litefy:browser-support-dismissed";

export function detectMissingFeatures(): string[] {
  if (typeof window === "undefined") return [];
  if (new URLSearchParams(window.location.search).has("force-unsupported")) {
    return ["Popover API", "CSS Anchor Positioning", "Temporal API"];
  }
  const missing: string[] = [];
  if (!("popover" in HTMLElement.prototype)) missing.push("Popover API");
  if (
    typeof CSS === "undefined" ||
    typeof CSS.supports !== "function" ||
    !CSS.supports("anchor-name: --litefy-check")
  ) {
    missing.push("CSS Anchor Positioning");
  }
  if (typeof Temporal === "undefined") missing.push("Temporal API");
  return missing;
}

export function BrowserSupportNotice() {
  const [missing, setMissing] = React.useState<string[] | null>(null);
  const [dismissed, setDismissed] = React.useState(false);

  React.useEffect(() => {
    setMissing(detectMissingFeatures());
    try {
      setDismissed(window.localStorage.getItem(STORAGE_KEY) === "1");
    } catch {
      // localStorage unavailable (private mode etc.) — show the notice every visit
    }
  }, []);

  if (!missing || missing.length === 0 || dismissed) return null;

  const zh = window.location.pathname.startsWith("/zh");
  const items: BannerItem[] = [
    {
      key: "lead",
      content: (
        <span className="font-semibold">
          {zh
            ? "当前浏览器缺少本站演示所依赖的特性："
            : "Your browser is missing features this site's demos rely on:"}
        </span>
      ),
    },
    ...missing.map((feature) => ({
      key: feature,
      content: (
        <span>
          {zh
            ? `未支持 ${feature} —— 相关演示可能无法工作或定位不准`
            : `${feature} is not supported — interactive demos may not work or may be misplaced`}
        </span>
      ),
    })),
    {
      key: "advice",
      content: (
        <span>
          {zh
            ? "请使用最新版本的 Chrome、Edge、Firefox 或 Safari 访问"
            : "Please use an up-to-date Chrome, Edge, Firefox or Safari"}
        </span>
      ),
    },
  ];

  return (
    <div
      role="alert"
      className="fixed inset-x-0 top-0 z-[100] flex items-center gap-2 border-b bg-muted/95 px-4 py-1.5 backdrop-blur"
    >
      <div className="min-w-0 flex-1">
        <Banner
          items={items}
          speed={18}
          pauseOnHover
          classNames={{ item: "gap-2 px-6 py-1 text-sm whitespace-nowrap" }}
        />
      </div>
      <button
        type="button"
        aria-label={zh ? "关闭提示" : "Dismiss notice"}
        className="shrink-0 rounded p-1 text-muted-foreground transition-colors hover:bg-hover hover:text-foreground cursor-pointer"
        onClick={() => {
          setDismissed(true);
          try {
            window.localStorage.setItem(STORAGE_KEY, "1");
          } catch {
            // ignore — the notice will simply reappear on the next visit
          }
        }}
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
