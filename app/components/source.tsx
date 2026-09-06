"use client";

import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import { Suspense, useEffect, useState } from "react";
import { type ClassNameValue, cn } from "@/ui";

type SourceType = "component" | "util";

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

const utilGlob = import.meta.glob("../ui/utils/*.ts", {
  query: "?raw",
  import: "default",
});
const utilMap: Record<string, () => Promise<string>> = {};
for (const [path, loader] of Object.entries(utilGlob)) {
  const m = path.match(/\/([^/]+)\.ts$/);
  if (m) utilMap[m[1]] = loader as () => Promise<string>;
}

function getMeta(type: SourceType) {
  return type === "component"
    ? { lang: "tsx", suffix: ".tsx", map: componentMap }
    : { lang: "ts", suffix: ".ts", map: utilMap };
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
