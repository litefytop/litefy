"use client";

import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import { useMemo } from "react";
import { useParams } from "react-router";
import { demos } from "@/demos";
import { cn, Collapse } from "@/ui";
import { i18n } from "@/lib/i18n";

export interface ComponentPreviewProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  className?: string;
  hideCode?: boolean;
  description?: string;
  codeLabel?: string;
}

export function ComponentPreview({
  name,
  className,
  hideCode = false,
  description,
  codeLabel,
  ...props
}: ComponentPreviewProps) {
  const params = useParams<{ lang?: string }>();
  const locale = params.lang || i18n.defaultLanguage;

  const defaultCodeLabel = locale === "zh" ? "查看源码" : "View Code";
  const displayLabel = codeLabel || defaultCodeLabel;

  const demo = useMemo(() => demos[name], [name]);

  if (!demo) {
    return (
      <div className={cn("my-4 rounded-md border border-red-200 bg-red-50 p-4", className)}>
        <p className="text-sm text-red-600">
          Demo "{name}" not found. Make sure the demo is registered.
        </p>
      </div>
    );
  }

  const Component = demo.component;

  return (
    <div
      className={cn("component-preview-container group relative my-4 w-full", className)}
      data-name={name}
      {...props}
    >
      {description && <p className="text-muted-foreground mb-2 text-sm">{description}</p>}

      <div className="overflow-hidden rounded-xl border">
        <div
          className={cn(
            "preview not-prose relative min-h-151 w-full overflow-hidden border-separator bg-muted/50 p-4 sm:p-10",
            "flex items-center justify-center",
          )}
        >
          <div className="flex w-full items-center justify-center">
            <Component />
          </div>
        </div>

        {!hideCode && (
          <>
            <Collapse
              label={displayLabel}
              classNames={{
                root: "border",
                trigger: "text-md font-medium",
              }}
            >
              <div className="code-section relative border-t border-separator bg-transparent">
                <DynamicCodeBlock lang="tsx" code={demo.code} />
              </div>
            </Collapse>
          </>
        )}
      </div>
    </div>
  );
}
