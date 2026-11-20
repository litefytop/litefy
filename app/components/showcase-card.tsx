"use client";

import { ArrowUpRight } from "@/components/icons";
import { CardLink } from "./card-link";
import { useSiteSkin } from "./site-skin";
import type { StyleTemplate } from "../lib/style-templates";
import minimalThumb from "../assets/showcase/minimal.webp";
import neoThumb from "../assets/showcase/neo-brutalist.webp";
import clinicalThumb from "../assets/showcase/clinical.webp";
import neonThumb from "../assets/showcase/neon-gradient.webp";

const THUMBS: Record<string, string> = {
  minimal: minimalThumb,
  "neo-brutalist": neoThumb,
  clinical: clinicalThumb,
  "neon-gradient": neonThumb,
};

const content = {
  en: { open: "Open full showcase" },
  zh: { open: "进入全屏示例" },
} as const;

export function ShowcaseCard({
  lang = "en",
  template,
}: {
  lang?: "zh" | "en";
  template: StyleTemplate;
}) {
  const { Image, chipClasses } = useSiteSkin();
  const zh = lang === "zh";
  const t = content[lang] ?? content.en;
  const tpl = template;

  return (
    <CardLink
      to={`${tpl.pathPrefix}/${lang}/showcase/${tpl.slug}`}
      className="group flex flex-col gap-3"
    >
      <Image
        src={THUMBS[tpl.slug]}
        alt={zh ? `${tpl.name.zh}方案预览` : `${tpl.name.en} style preview`}
        className="aspect-[2/1]"
      />
      <span className="flex items-baseline gap-2">
        <span className="text-base font-medium">{zh ? tpl.name.zh : tpl.name.en}</span>
        {zh && <span className="text-sm text-surface-fg">{tpl.name.en}</span>}
      </span>
      <span className="line-clamp-3 min-h-[3lh] text-sm text-surface-fg">
        {zh ? tpl.desc.zh : tpl.desc.en}
      </span>
      <span className="flex gap-2">
        {(zh ? tpl.tags.zh : tpl.tags.en).map((tag) => (
          <span key={tag} className={chipClasses}>
            {tag}
          </span>
        ))}
      </span>
      <span className="flex items-center gap-1 text-sm font-medium text-primary">
        {t.open}
        <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </span>
    </CardLink>
  );
}
