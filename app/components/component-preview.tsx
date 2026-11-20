"use client";

import { type ComponentType, Suspense, lazy, useEffect, useState } from "react";
import { useParams } from "react-router";
import { siteDefaultLanguage } from "@/lib/i18n";
import { tabsScrollLabels } from "@/lib/shared";
import { CodeStage } from "./docs-codeblock";
import { useSiteSkin } from "./site-skin";

export interface ComponentPreviewProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  className?: string;
  hideCode?: boolean;
  description?: string;
  codeLabel?: string;
}

type DemoLoader = () => Promise<ComponentType>;

const lazyDemos = new Map<DemoLoader, React.LazyExoticComponent<ComponentType>>();

function getLazyDemo(load: DemoLoader) {
  let component = lazyDemos.get(load);
  if (!component) {
    component = lazy(async () => ({ default: await load() }));
    lazyDemos.set(load, component);
  }
  return component;
}

function DemoCode({ load, hint }: { load: () => Promise<string>; hint: string }) {
  const [code, setCode] = useState("");

  useEffect(() => {
    let alive = true;
    load().then((source) => {
      if (alive) setCode(source);
      return undefined;
    });
    return () => {
      alive = false;
    };
  }, [load]);

  if (!code) {
    return <div className="p-4 text-sm text-surface-fg">{hint}</div>;
  }
  return <CodeStage code={code} lang="tsx" />;
}

function PreviewSkeleton() {
  return (
    <div
      className="flex flex-col items-center gap-2 w-full max-w-64"
    >
      <div className="block rounded-md bg-accent motion-safe:animate-pulse h-6 w-2/3" />
      <div className="block rounded-md bg-accent motion-safe:animate-pulse h-2 w-full" />
    </div>
  );
}

function LazyDemo({ Demo }: { Demo: ComponentType }) {
  return <Demo />;
}

export function ComponentPreview({
  name,
  className,
  hideCode = false,
  description,
  codeLabel,
  ...props
}: ComponentPreviewProps) {
  const { Callout, Tabs, demos } = useSiteSkin();
  const params = useParams<{ lang?: string }>();
  const locale = params.lang || siteDefaultLanguage;
  const zh = locale === "zh";
  const [codePicked, setCodePicked] = useState(false);

  const defaultCodeLabel = zh ? "查看源码" : "View Code";
  const displayLabel = codeLabel || defaultCodeLabel;

  const demo = demos[name];

  if (!demo) {
    return (
      <Callout
        role="alert"
        data-variant="danger"
        className={["my-4", className].filter(Boolean).join(" ")}
      >
        Demo &quot;{name}&quot; not found. Make sure the demo is registered.
      </Callout>
    );
  }

  const stage = (
    <div className="flex w-full min-h-64 overflow-auto bg-background p-2 *:m-auto *:max-w-full *:min-w-0 md:h-[round(up,calc(100cqw*9/16),1px)] md:min-h-0">
      <Suspense fallback={<PreviewSkeleton />}>
        <LazyDemo Demo={getLazyDemo(demo.load)} />
      </Suspense>
    </div>
  );

  return (
    <div
      className={["component-preview-container my-4 not-typography w-full @container", className].filter(Boolean).join(" ")}
      data-name={name}
      {...props}
    >
      {description && <p className="mb-2 text-sm text-surface-fg">{description}</p>}

      <figure className="relative w-full overflow-hidden rounded-xl border">
        {hideCode ? (
          stage
        ) : (
          <Tabs
            {...tabsScrollLabels(zh)}
            className="flex-col-reverse"
            panelClassName="min-h-0 overflow-hidden"
            classNames={{ scroller: "justify-center" }}
            defaultValue="preview"
            unmountOnHide={false}
            onValueChange={(value) => {
              if (value === "code") setCodePicked(true);
            }}
            options={[
              {
                label: zh ? "展示" : "Preview",
                value: "preview",
                content: stage,
              },
              {
                label: displayLabel,
                value: "code",
                content: codePicked ? (
                  <DemoCode load={demo.loadCode} hint={zh ? "加载中…" : "Loading…"} />
                ) : null,
              },
            ]}
          />
        )}
      </figure>
    </div>
  );
}
