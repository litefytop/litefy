"use client";

import { useLocation } from "react-router";
import { FileText } from "@/components/icons";
import { useSiteSkin } from "./site-skin";
import { STYLE_TEMPLATES, stripSchemePrefix } from "@/lib/style-templates";

export function DesignDocs() {
  const { cn } = useSiteSkin();
  const zh = stripSchemePrefix(useLocation().pathname).startsWith("/zh");

  return (
    <ul className={cn("not-typography flex flex-col gap-2 not-prose")}>
      {STYLE_TEMPLATES.map((tpl) => {
        const href = `https://cdn.jsdelivr.net/gh/litefytop/litefy@main/app/ui/schemes/${tpl.slug}/design.md`;
        return (
          <li key={tpl.slug} className="flex flex-wrap items-center gap-2 text-sm">
            <FileText className="size-4 shrink-0 text-surface-fg" aria-hidden />
            <span className="font-medium">{zh ? tpl.name.zh : tpl.name.en}</span>
            <span className="text-surface-fg">{zh ? tpl.desc.zh : tpl.desc.en}</span>
            <span className="flex items-center gap-3">
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-[0.1em]"
              >
                {zh ? "预览" : "Preview"}
              </a>
              <a href={href} download className="text-primary underline underline-offset-[0.1em]">
                {zh ? "下载" : "Download"}
              </a>
            </span>
          </li>
        );
      })}
    </ul>
  );
}
