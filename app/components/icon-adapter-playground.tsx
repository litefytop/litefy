"use client";

import * as React from "react";
import { useParams } from "react-router";
import * as defaultIcons from "@/ui/components/icons";
import * as tablerAdapter from "../../packages/cli/adapters/icons-tabler";
import * as phosphorAdapter from "../../packages/cli/adapters/icons-phosphor";
import { Button } from "@/ui/skins";
import { copyText } from "../lib/clipboard";

type IconSet = typeof defaultIcons;

const sets: Record<"lucide" | "tabler" | "phosphor", IconSet> = {
  lucide: defaultIcons,
  tabler: tablerAdapter as unknown as IconSet,
  phosphor: phosphorAdapter as unknown as IconSet,
};

const contractOrder = Object.keys(defaultIcons.icons);

const labels = {
  zh: {
    title: "适配器验证",
    desc: (n: number) =>
      `网格展示契约清单全部字形（${n} 项 = 骨架消费面，数量各适配器必须一致），卡片内显示映射后的源库名，点击卡片复制名字——切换适配器即可逐卡核对映射差异。`,
    copied: "已复制",
    lucide: "lucide（默认）",
    tabler: "tabler",
    phosphor: "phosphor",
  },
  en: {
    title: "Adapter check",
    desc: (n: number) =>
      `The grid lists every glyph in the contract surface (${n} — the skeleton's own consumption surface, identical count across adapters); each card shows the mapped source-library name, and clicking a card copies it — flip the adapter to check the mapping card by card.`,
    copied: "Copied!",
    lucide: "lucide (default)",
    tabler: "tabler",
    phosphor: "phosphor",
  },
} as const;

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
  const [mode, setMode] = React.useState<"lucide" | "tabler" | "phosphor">("lucide");
  const [copied, setCopied] = React.useState<string | null>(null);
  const copiedTimer = React.useRef<ReturnType<typeof setTimeout>>(undefined);
  const g = sets[mode];
  React.useEffect(() => () => clearTimeout(copiedTimer.current), []);

  const copyLabel = async (label: string) => {
    if (!(await copyText(label))) return;
    clearTimeout(copiedTimer.current);
    setCopied(label);
    copiedTimer.current = setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="not-typography mt-6 flex flex-col gap-4">
      <p className="m-0 text-sm text-foreground">{t.desc(contractOrder.length)}</p>
      <div className="flex items-center gap-2" role="group" aria-label={t.title}>
        {(["lucide", "tabler", "phosphor"] as const).map((key) => (
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
        className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3"
        aria-label={t.title}
        data-adapter={mode}
      >
        {glyphEntries(g).map(([name, Icon]) => {
          const label = (g.sourceNames as Record<string, string>)[name] ?? name;
          return (
            <button
              key={name}
              type="button"
              onClick={() => copyLabel(label)}
              className="flex min-w-0 items-center gap-2 rounded-sm border border-border bg-background px-3 py-2 text-start"
            >
              <Icon className="size-5 shrink-0" aria-hidden />
              <span className="font-mono text-sm text-foreground">
                {copied === label ? t.copied : label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
