"use client";

import * as React from "react";

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

const featureReasons: Record<string, { en: string; zh: string }> = {
  "Popover API": {
    en: "Popover API — floating panels (menus, selects, pickers)",
    zh: "Popover API —— 弹出面板(菜单、下拉、拾取器)",
  },
  "CSS Anchor Positioning": {
    en: "CSS Anchor Positioning — panel positioning",
    zh: "CSS Anchor Positioning —— 面板定位",
  },
  "Temporal API": {
    en: "Temporal API — date handling",
    zh: "Temporal API —— 日期处理",
  },
};

function UnsupportedScreen({ missing }: { missing: string[] }) {
  const zh = window.location.pathname.startsWith("/zh");
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-16 text-foreground">
      <div className="flex w-full max-w-md flex-col items-center gap-4 text-center">
        <span className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
          {zh ? "浏览器不支持" : "Browser not supported"}
        </span>
        <h1 className="text-3xl font-bold">
          {zh ? "当前浏览器无法查看本站" : "This browser can't view this site"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {zh
            ? "本站的组件演示依赖以下现代浏览器特性，当前浏览器缺少它们，页面已停止渲染："
            : "The demos on this site rely on the following modern browser features, which are missing here. Rendering has been stopped:"}
        </p>
        <ul className="flex w-full flex-col gap-2 rounded-lg border p-4 text-left text-sm">
          {missing.map((feature) => (
            <li key={feature}>
              {zh ? featureReasons[feature]?.zh ?? feature : featureReasons[feature]?.en ?? feature}
            </li>
          ))}
        </ul>
        <p className="text-sm text-muted-foreground">
          {zh
            ? "请使用最新版的 Chrome、Edge、Firefox 或 Safari 访问。"
            : "Please visit with the latest Chrome, Edge, Firefox, or Safari."}
        </p>
      </div>
    </main>
  );
}

export function BrowserSupportGate({ children }: { children: React.ReactNode }) {
  const [missing] = React.useState(() =>
    typeof window === "undefined" ? [] : detectMissingFeatures(),
  );

  if (typeof window !== "undefined" && missing.length > 0) {
    return <UnsupportedScreen missing={missing} />;
  }
  return <>{children}</>;
}
