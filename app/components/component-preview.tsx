"use client";

import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useMemo, useState } from "react";
import { useParams } from "react-router";
import { demos } from "@/demos";
import { cn } from "@/lib";
import { i18n } from "@/lib/i18n";

export interface ComponentPreviewProps
  extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  className?: string;
  title?: string;
  hideCode?: boolean;
  description?: string;
  defaultExpanded?: boolean;
  codeLabel?: string;
}

export function ComponentPreview({
  name,
  className,
  title,
  hideCode = false,
  description,
  defaultExpanded = false,
  codeLabel,
  ...props
}: ComponentPreviewProps) {
  const [isCodeExpanded, setIsCodeExpanded] = useState(defaultExpanded);
  const params = useParams<{ lang?: string }>();
  const locale = params.lang || i18n.defaultLanguage;

  const defaultCodeLabel = locale === "zh" ? "查看源码" : "View Code";
  const displayLabel = codeLabel || defaultCodeLabel;

  const demo = useMemo(() => demos[name], [name]);

  if (!demo) {
    return (
      <div
        className={cn(
          "my-4 rounded-md border border-red-200 bg-red-50 p-4",
          className,
        )}
      >
        <p className="text-sm text-red-600">
          Demo "{name}" not found. Make sure the demo is registered.
        </p>
      </div>
    );
  }

  const Component = demo.component;

  return (
    <div
      className={cn(
        "component-preview-container group relative my-4 w-full",
        className,
      )}
      data-name={name}
      {...props}
    >
      {description && (
        <p className="text-muted-foreground mb-2 text-sm">{description}</p>
      )}

      <div className="overflow-hidden rounded-xl border">
        <div
          className={cn(
            "preview not-prose relative min-h-151 w-full overflow-hidden border-separator p-4 sm:p-10",
            "flex items-center justify-center",
          )}
        >
          <div className="flex w-full items-center justify-center">
            <Component />
          </div>
        </div>

        {!hideCode && (
          <>
            <button
              type="button"
              onClick={() => setIsCodeExpanded(!isCodeExpanded)}
              className="flex w-full items-center justify-between border-t border-separator bg-fd-muted/50 px-4 py-3 text-sm font-medium transition-colors hover:bg-fd-muted/70"
            >
              <span className="flex items-center gap-2">
                {isCodeExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
                {displayLabel}
              </span>
            </button>

            {isCodeExpanded && (
              <div className="code-section relative border-t border-separator bg-transparent">
                <DynamicCodeBlock lang="tsx" code={demo.code} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
