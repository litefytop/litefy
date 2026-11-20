"use client";

import * as React from "react";
import { useLocation } from "react-router";
import { Pager } from "@/ui";
import { ChevronLeft, ChevronRight } from "@/components/icons";
import { stripSchemePrefix, STYLE_TEMPLATES } from "@/lib/style-templates";
import { ShowcaseCard } from "./showcase-card";
import { useSiteSkin } from "./site-skin";

const content = {
  en: { prev: "Previous scheme", next: "Next scheme" },
  zh: { prev: "上一个方案", next: "下一个方案" },
} as const;

export function StyleGallery() {
  const { pathname } = useLocation();
  const lang = stripSchemePrefix(pathname).startsWith("/zh") ? "zh" : "en";
  const { Button } = useSiteSkin();
  const [index, setIndex] = React.useState(0);
  const t = content[lang] ?? content.en;
  const total = STYLE_TEMPLATES.length;

  return (
    <div className="flex flex-col gap-3">
      <Pager index={index} onChange={setIndex} loop>
        {STYLE_TEMPLATES.map((tpl) => (
          <ShowcaseCard key={tpl.slug} lang={lang} template={tpl} />
        ))}
      </Pager>
      <div className="flex items-center justify-center gap-3">
        <Button
          data-variant="text"
          onClick={() => setIndex((i) => (i - 1 + total) % total)}
          aria-label={t.prev}
        >
          <ChevronLeft />
        </Button>
        <span className="text-sm text-surface-fg tabular-nums">
          {index + 1} / {total}
        </span>
        <Button
          data-variant="text"
          onClick={() => setIndex((i) => (i + 1) % total)}
          aria-label={t.next}
        >
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}
