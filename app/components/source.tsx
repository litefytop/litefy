"use client";

import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import { Suspense, useEffect, useState } from "react";
import { type ClassNameValue, cn } from "@/lib";

type SourceType = "component" | "hook" | "css";

interface SourceProps {
  type: SourceType;
  name: string;
  className?: ClassNameValue;
}

const componentGlob = import.meta.glob("../ui/components/*.tsx", {
  query: "?raw",
  import: "default",
});
const componentMap: Record<string, () => Promise<string>> = {};
for (const [path, loader] of Object.entries(componentGlob)) {
  const m = path.match(/\/([^/]+)\.tsx$/);
  if (m) componentMap[m[1]] = loader as () => Promise<string>;
}

const hookGlob = import.meta.glob("../ui/hooks/*.ts", {
  query: "?raw",
  import: "default",
});
const hookMap: Record<string, () => Promise<string>> = {};
for (const [path, loader] of Object.entries(hookGlob)) {
  const m = path.match(/\/([^/]+)\.ts$/);
  if (m) hookMap[m[1]] = loader as () => Promise<string>;
}

const cssGlob = import.meta.glob("../ui/styles/*.css", {
  query: "?raw",
  import: "default",
});
const cssMap: Record<string, () => Promise<string>> = {};
for (const [path, loader] of Object.entries(cssGlob)) {
  const m = path.match(/\/([^/]+)\.css$/);
  if (m) cssMap[m[1]] = loader as () => Promise<string>;
}

function getMeta(type: SourceType) {
  switch (type) {
    case "component":
      return { lang: "tsx", suffix: ".tsx", map: componentMap };
    case "hook":
      return { lang: "ts", suffix: ".ts", map: hookMap };
    case "css":
      return { lang: "css", suffix: ".css", map: cssMap };
  }
}

function SourceContent({ type, name, className }: SourceProps) {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { map } = getMeta(type);
        const fn = map[name];
        setContent(fn ? await fn() : null);
      } catch (err) {
        console.error(`Source load ${type}:${name}`, err);
        setContent(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [type, name]);

  const { lang, suffix } = getMeta(type);

  if (loading) {
    return (
      <div className={cn("bg-muted rounded-lg p-4 text-muted-foreground", className)}>
        Loading source…
      </div>
    );
  }
  if (!content) {
    return (
      <div className={cn("bg-muted rounded-lg p-4 text-muted-foreground", className)}>
        Not found: {name}{suffix}
      </div>
    );
  }

  return <DynamicCodeBlock lang={lang} code={content} />;
}

export function Source({ type, name, className }: SourceProps) {
  return (
    <Suspense
      fallback={
        <div className={cn("bg-muted rounded-lg p-4 text-muted-foreground", className)}>
          Loading source…
        </div>
      }
    >
      <SourceContent type={type} name={name} className={className} />
    </Suspense>
  );
}
