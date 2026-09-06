"use client";

import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import { Suspense, useEffect, useState } from "react";
import { type ClassNameValue, cn } from "@/ui";

interface CssSourceProps {
  name: string;
  className?: ClassNameValue;
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

function CssSourceContent({ name, className }: CssSourceProps) {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const fn = cssMap[name];
        setContent(fn ? await fn() : null);
      } catch (err) {
        console.error(`CssSource load ${name}`, err);
        setContent(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [name]);

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
        Not found: {name}.css
      </div>
    );
  }

  return <DynamicCodeBlock lang="css" code={content} />;
}

export function CssSource({ name, className }: CssSourceProps) {
  return (
    <Suspense
      fallback={
        <div className={cn("bg-muted rounded-lg p-4 text-muted-foreground", className)}>
          Loading source…
        </div>
      }
    >
      <CssSourceContent name={name} className={className} />
    </Suspense>
  );
}
