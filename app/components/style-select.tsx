"use client";

import * as React from "react";
import { useLocation, useNavigate } from "react-router";
import { DropdownMenu, Select } from "@/ui/skins";
import { Check, SwatchBook } from "@/components/icons";
import { STYLE_TEMPLATES, findStyleTemplateByPath, toStylePath } from "../lib/style-templates";

const LABELS = {
  en: { label: "Style", trigger: "Switch style" },
  zh: { label: "风格", trigger: "切换风格" },
} as const;

export function StyleSelect({ lang, className }: { lang: "zh" | "en"; className?: string }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const current = findStyleTemplateByPath(pathname);
  const options = React.useMemo(
    () => STYLE_TEMPLATES.map((template) => ({ value: template.slug, label: template.name[lang] })),
    [lang],
  );

  return (
    <Select
      options={options}
      value={current.slug}
      aria-label={LABELS[lang].trigger}
      title={LABELS[lang].trigger}
      className={className}
      onValueChange={(slug) => {
        if (slug === current.slug) return;
        const target = STYLE_TEMPLATES.find((template) => template.slug === slug);
        if (!target) return;
        navigateToStyle(pathname, target, navigate);
      }}
    />
  );
}

function navigateToStyle(
  pathname: string,
  target: (typeof STYLE_TEMPLATES)[number],
  navigate: ReturnType<typeof useNavigate>,
) {
  const scrollY = window.scrollY;
  navigate(toStylePath(pathname, target), {
    preventScrollReset: true,
    state: { scrollY },
  });
}

export function StyleMenu({ lang }: { lang: "zh" | "en" }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const current = findStyleTemplateByPath(pathname);
  const items = React.useMemo(
    () =>
      STYLE_TEMPLATES.map((template) => ({
        label: (
          <span className="flex items-center gap-2">
            {template.name[lang]}
            {template.slug === current.slug && <Check className="size-4" aria-hidden />}
          </span>
        ),
        className: template.slug === current.slug ? "font-strong" : undefined,
        onClick: () => {
          if (template.slug === current.slug) return;
          navigateToStyle(pathname, template, navigate);
        },
      })),
    [lang, pathname, current, navigate],
  );

  return (
    <DropdownMenu
      alignX="end"
      aria-label={LABELS[lang].trigger}
      title={LABELS[lang].trigger}
      data-pure-icon
      className="size-control justify-center"
      trigger={<SwatchBook className="size-4" aria-hidden />}
      items={items}
    />
  );
}
