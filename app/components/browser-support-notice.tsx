"use client";

import * as React from "react";
import { stripSchemePrefix } from "@/lib/style-templates";

export function detectMissingFeatures(): string[] {
  if (typeof window === "undefined") return [];
  if (new URLSearchParams(window.location.search).has("force-unsupported")) {
    return ["Popover API"];
  }
  const missing: string[] = [];
  if (!("popover" in HTMLElement.prototype)) missing.push("Popover API");
  return missing;
}

const featureReasons: Record<string, { en: string; zh: string }> = {
  "Popover API": {
    en: "Popover API — floating panels (menus, selects, pickers)",
    zh: "Popover API —— 弹出面板(菜单、下拉、拾取器)",
  },
};

function UnsupportedScreen({ missing }: { missing: string[] }) {
  const zh = stripSchemePrefix(window.location.pathname).startsWith("/zh");
  return (
    <main
      className="flex flex-col items-center justify-center px-4 md:px-6 lg:px-8 py-12 md:py-16 lg:py-20 min-h-screen bg-background text-foreground"
    >
      <div className="flex flex-col items-center gap-4 w-full max-w-112 text-center">
        <span className="m-0 scroll-mt-20 text-foreground text-xs font-medium tracking-widest uppercase">
          {zh ? "浏览器不支持" : "Browser not supported"}
        </span>
        <h1 className="text-3xl font-bold">
          {zh ? "当前浏览器无法查看本站" : "This browser can't view this site"}
        </h1>
        <p className="text-sm text-foreground">
          {zh
            ? "本站的组件演示依赖以下现代浏览器特性，当前浏览器缺少它们，页面已停止渲染："
            : "The demos on this site rely on the following modern browser features, which are missing here. Rendering has been stopped:"}
        </p>
        <ul
          className="flex flex-col gap-2 p-4 w-full rounded-lg border text-left text-sm"
        >
          {missing.map((feature) => (
            <li key={feature}>
              {zh ? featureReasons[feature]?.zh ?? feature : featureReasons[feature]?.en ?? feature}
            </li>
          ))}
        </ul>
        <p className="text-sm text-foreground">
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
  return children;
}
