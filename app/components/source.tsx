"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router";
import registry from "../../packages/cli/registry.json";
import { FileCode, Folder, ChevronLeft } from "@/components/icons";
import { siteDefaultLanguage } from "@/lib/i18n";
import { CodeStage } from "./docs-codeblock";
import { useSiteSkin } from "./site-skin";

interface RegistryEntry {
  type: string;
  url: string;
}

export const UI_ROOT = "app/ui/";

const entries = registry as Record<string, RegistryEntry>;

/* raw 源码是构建期打进包里的静态字符串，缓存后二次进入零闪烁 */
const codeCache = new Map<string, string>();

const rawFiles: Record<string, () => Promise<string>> = {};
for (const glob of [
  import.meta.glob("../ui/components/*.@(tsx|ts)", { query: "?raw", import: "default" }),
  import.meta.glob("../ui/utils/*.@(tsx|ts)", { query: "?raw", import: "default" }),
  import.meta.glob("../ui/skins/*.@(tsx|ts)", { query: "?raw", import: "default" }),
  import.meta.glob("../ui/schemes/*/index.css", { query: "?raw", import: "default" }),
]) {
  for (const [key, load] of Object.entries(glob)) {
    rawFiles[key.replace("../ui/", UI_ROOT)] = load as () => Promise<string>;
  }
}

function registryPath(key: string): string {
  const entry = entries[key];
  if (!entry) return "";
  const at = entry.url.indexOf(`/${UI_ROOT}`);
  return at === -1 ? "" : entry.url.slice(at + 1);
}

function skinPath(dir: string, base: string): string {
  for (const ext of [".tsx", ".ts"]) {
    if (rawFiles[`${dir}${base}${ext}`]) return `${dir}${base}${ext}`;
  }
  return "";
}

function langOf(path: string): string {
  if (path.endsWith(".css")) return "css";
  return path.endsWith(".tsx") ? "tsx" : "ts";
}

interface SourceProps {
  name: string;
  className?: string;
}

interface FileSourceProps {
  paths: string[];
  className?: string;
}

export function FileSource({ paths, className }: FileSourceProps) {
  const { Button, cn } = useSiteSkin();
  const zh = (useParams<{ lang?: string }>().lang ?? siteDefaultLanguage) === "zh";
  const [picked, setPicked] = useState("");
  const [code, setCode] = useState("");
  const codeRef = useRef("");
  const [previewing, setPreviewing] = useState(false);
  const active = paths.includes(picked) ? picked : paths[0] ?? "";

  useEffect(() => {
    if (!active) return;
    const cached = codeCache.get(active);
    if (cached) {
      if (codeRef.current !== cached) {
        codeRef.current = cached;
        setCode(cached);
      }
      return;
    }
    let alive = true;
    if (codeRef.current !== "") {
      codeRef.current = "";
      setCode("");
    }
    rawFiles[active]().then((source) => {
      codeCache.set(active, source);
      if (alive) {
        codeRef.current = source;
        setCode(source);
      }
      return undefined;
    });
    return () => {
      alive = false;
    };
  }, [active]);

  const groups = [
    { label: zh ? "无样式骨架" : "Headless", files: paths.filter((p) => p.includes("/components/") || p.includes("/utils/")) },
    { label: zh ? "皮肤" : "Skin", files: paths.filter((p) => p.includes("/skins/")) },
    { label: zh ? "样式入口" : "Stylesheet", files: paths.filter((p) => p.endsWith(".css")) },
  ].filter((group) => group.files.length > 0);

  const hint = zh ? "加载中…" : "Loading…";

  if (paths.length === 0) {
    return (
      <div className={cn("not-typography p-4 text-sm text-foreground", className)}>
        {zh ? "没有可展示的源码" : "No source to show"}
      </div>
    );
  }

  if (!previewing) {
    return (
      <div className={cn("not-typography flex flex-col", className)}>
        <div className="flex items-center gap-2 border-b border-border p-3">
          <p className="flex items-center gap-2 font-mono text-xs text-foreground">
            <Folder className="size-4" aria-hidden />
            {UI_ROOT}
          </p>
        </div>
        <ul className="flex flex-col gap-3 p-3">
          {groups.map((group) => (
            <li key={group.label} className="flex flex-col gap-1">
              <p className="text-xs font-medium uppercase tracking-widest text-foreground">{group.label}</p>
              <ul className="flex flex-col gap-1">
                {group.files.map((path) => (
                  <li key={path}>
                    <Button
                      type="button"
                      data-variant="text"
                      onClick={() => {
                        setPicked(path);
                        setPreviewing(true);
                      }}
                      className="flex w-full min-w-0 items-center justify-start gap-2 rounded-sm px-2 py-1 text-left font-mono text-xs normal-case"
                    >
                      <FileCode className="size-4 shrink-0" aria-hidden />
                      {path.slice(UI_ROOT.length)}
                    </Button>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className={cn("not-typography flex h-128 flex-col", className)}>
      <div className="flex items-center justify-between gap-2 border-b border-border p-3">
        <p className="flex min-w-0 items-center gap-2 font-mono text-xs text-foreground">
          <FileCode className="size-4 shrink-0" aria-hidden />
          <span className="truncate">{active.slice(UI_ROOT.length)}</span>
        </p>
        <Button
          type="button"
          icon={<ChevronLeft className="size-4" aria-hidden />}
          data-variant="text"
          onClick={() => setPreviewing(false)}
          aria-label={zh ? "返回文件列表" : "Back to file list"}
          className="shrink-0 gap-1 px-2 text-xs"
        >
          {zh ? "返回" : "Back"}
        </Button>
      </div>
      <div className="min-h-0 min-w-0 flex-1 overflow-hidden p-3">
        {code ? (
          <CodeStage lang={langOf(active)} code={code} className="h-full! aspect-auto!" />
        ) : (
          <div className="p-4 text-sm text-foreground">{hint}</div>
        )}
      </div>
    </div>
  );
}

export function Source({ name, className }: SourceProps) {
  const paths = useMemo(() => {
    const fromRegistry = registryPath(name);
    const skin = skinPath(`${UI_ROOT}skins/`, name);
    return [...new Set([fromRegistry, skin])].filter((path) => path && rawFiles[path]);
  }, [name]);
  return <FileSource paths={paths} className={className} />;
}
