"use client";

import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import { Suspense, useEffect, useState } from "react";
import { type ClassNameValue, cn } from "@/lib";

interface SourceCodeProps {
  component: string;
  className?: ClassNameValue;
}

const modules = import.meta.glob("../components/ui/*.tsx", {
  query: "?raw",
  import: "default",
});
const componentImports: Record<string, () => Promise<string>> = {};

for (const [path, loadFn] of Object.entries(modules)) {
  const match = path.match(/\/([^/]+)\.tsx$/);
  if (match) {
    componentImports[match[1]] = loadFn as () => Promise<string>;
  }
}

function SourceCodeContent({ component, className }: SourceCodeProps) {
  const [sourceCode, setSourceCode] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSource = async () => {
      try {
        const loadFn = componentImports[component];
        if (loadFn) {
          const code = await loadFn();
          setSourceCode(code);
        }
      } catch (error) {
        console.error(`Failed to load source for ${component}:`, error);
      } finally {
        setLoading(false);
      }
    };

    loadSource();
  }, [component]);

  if (loading) {
    return (
      <div
        className={cn(
          "bg-muted rounded-lg p-4 text-muted-foreground",
          className,
        )}
      >
        Loading source code...
      </div>
    );
  }

  if (!sourceCode) {
    return (
      <div
        className={cn(
          "bg-muted rounded-lg p-4 text-muted-foreground",
          className,
        )}
      >
        Source code not found for component: {component}
      </div>
    );
  }

  return (
    <DynamicCodeBlock
      lang="tsx"
      code={sourceCode}
      options={{
        themes: {
          light: "github-light",
          dark: "github-dark",
        },
      }}
    />
  );
}

export function SourceCode({ component, className }: SourceCodeProps) {
  return (
    <Suspense
      fallback={
        <div
          className={cn(
            "bg-muted rounded-lg p-4 text-muted-foreground",
            className,
          )}
        >
          Loading source code...
        </div>
      }
    >
      <SourceCodeContent component={component} className={className} />
    </Suspense>
  );
}
