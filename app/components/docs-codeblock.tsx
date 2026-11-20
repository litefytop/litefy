"use client";
import { Check, Copy } from "@/components/icons";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { useSiteSkin } from "./site-skin";
import { siteDefaultLanguage } from "@/lib/i18n";
import { copyText } from "@/lib/clipboard";
import { codeToHtml } from "shiki";

export function DocsCodeBlock({
  code,
  lang,
  className,
}: {
  code: string;
  lang: string;
  className?: string;
}) {
  const [html, setHtml] = useState("");

  useEffect(() => {
    let cancelled = false;
    codeToHtml(code, {
      lang: lang || "text",
      themes: { light: "github-light", dark: "github-dark" },
      defaultColor: false,
    })
      .then((out) => {
        if (!cancelled) setHtml(out);
        return undefined;
      })
      .catch(() => {
        codeToHtml(code, {
          lang: "text",
          themes: { light: "github-light", dark: "github-dark" },
          defaultColor: false,
        })
          .then((out) => {
            if (!cancelled) setHtml(out);
            return undefined;
          })
          .catch(() => {});
      });
    return () => {
      cancelled = true;
    };
  }, [code, lang]);

  if (!html) {
    return (
      <pre className={className}>
        <code>{code}</code>
      </pre>
    );
  }
  return <div className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

export function CodeCopyButton({ code }: { code: string }) {
  const { Button } = useSiteSkin();
  const params = useParams<{ lang?: string }>();
  const locale = params.lang || siteDefaultLanguage;
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    if (await copyText(code)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <span className="absolute top-1 right-1 bg-background">
      <Button
        data-variant="text"
        onClick={copy}
        aria-label={locale === "zh" ? "复制代码" : "Copy code"}
        icon={
          copied ? (
            <Check className="size-4 text-success-fg" aria-hidden />
          ) : (
            <Copy className="size-4" aria-hidden />
          )
        }
      />
    </span>
  );
}

export function CodeSurface({ code, children }: { code: string; children: React.ReactNode }) {
  return (
    <div className="relative not-typography min-h-[calc(var(--height-control)+var(--spacing)*2)]">
      {children}
      <CodeCopyButton code={code} />
    </div>
  );
}

export function CodeStage({
  code,
  lang,
  className,
}: {
  code: string;
  lang: string;
  className?: string;
}) {
  return (
    <div className={["relative", "code-stage", className].filter(Boolean).join(" ")}>
      <div className="code-stage-scroll">
        <DocsCodeBlock lang={lang} code={code} />
      </div>
      <CodeCopyButton code={code} />
    </div>
  );
}
