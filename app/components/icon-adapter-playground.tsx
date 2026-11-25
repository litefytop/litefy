"use client";

import * as React from "react";
import { useParams } from "react-router";
import * as defaultIcons from "@/ui/components/icons";
import * as tablerAdapter from "../../packages/cli/adapters/icons-tabler";
import { Button } from "@/ui/skins";

type IconSet = typeof defaultIcons;

const sets: Record<"lucide" | "tabler", IconSet> = {
  lucide: defaultIcons,
  tabler: tablerAdapter as unknown as IconSet,
};

const labels = {
  zh: {
    title: "适配器验证",
    desc: "网格展示契约清单全部字形（37 项，数量各适配器必须一致），标签为映射后的源库名——切换适配器即可逐格核对映射差异。",
    lucide: "lucide（默认）",
    tabler: "tabler",
  },
  en: {
    title: "Adapter check",
    desc: "The grid lists every glyph in the contract surface (37 — identical count across adapters); each label shows the mapped source-library name, so flipping the adapter reveals the mapping cell by cell.",
    lucide: "lucide (default)",
    tabler: "tabler",
  },
} as const;

const contractOrder = Object.keys(defaultIcons.icons);

const glyphEntries = (set: IconSet) =>
  contractOrder.map(
    (name) =>
      [
        name,
        (set.icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[name],
      ] as [string, React.ComponentType<{ className?: string }>],
  );

export function IconAdapterPlayground() {
  const { lang } = useParams<{ lang?: string }>();
  const zh = lang === "zh";
  const t = zh ? labels.zh : labels.en;
  const [mode, setMode] = React.useState<"lucide" | "tabler">("lucide");
  const g = sets[mode];

  return (
    <div className="not-typography mt-6 flex flex-col gap-4">
      <p className="m-0 text-sm text-foreground">{t.desc}</p>
      <div className="flex items-center gap-2" role="group" aria-label={t.title}>
        {(["lucide", "tabler"] as const).map((key) => (
          <Button
            key={key}
            type="button"
            data-variant={mode === key ? "primary" : "outline"}
            aria-pressed={mode === key}
            onClick={() => setMode(key)}
          >
            {t[key]}
          </Button>
        ))}
      </div>
      <div
        className="grid grid-cols-3 gap-2 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-9"
        role="list"
        aria-label={t.title}
        data-adapter={mode}
      >
        {glyphEntries(g).map(([name, Icon]) => (
          <div
            key={name}
            role="listitem"
            className="flex flex-col items-center gap-1 rounded-sm border border-border bg-background p-2"
          >
            <Icon className="size-5" aria-hidden />
            <span className="font-mono text-2.5 text-foreground">
              {(g.sourceNames as Record<string, string>)[name] ?? name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
