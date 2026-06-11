"use client";

import { useState, useEffect, Suspense } from "react";
import { type ClassNameValue, cn } from "@/lib";
import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";

interface SourceCodeProps {
  /** 组件名称，用于选择对应的源码 */
  component: "accordion";
  className?: ClassNameValue;
}

const componentImports: Record<string, () => Promise<string>> = {
  accordion: () => import("@/components/ui/accordion.tsx?raw").then((m) => m.default),
};

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
      <div className={cn("bg-muted rounded-lg p-4 text-muted-foreground", className)}>
        Loading source code...
      </div>
    );
  }

  if (!sourceCode) {
    return (
      <div className={cn("bg-muted rounded-lg p-4 text-muted-foreground", className)}>
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
    <Suspense fallback={
      <div className={cn("bg-muted rounded-lg p-4 text-muted-foreground", className)}>
        Loading source code...
      </div>
    }>
      <SourceCodeContent component={component} className={className} />
    </Suspense>
  );
}
