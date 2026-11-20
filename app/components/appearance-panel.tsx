"use client";

import * as React from "react";
import { useLocation } from "react-router";
import { Settings } from "@/components/icons";
import { useMotionPreference, type MotionMode } from "@/ui/utils";
import { useTheme, type ThemeMode } from "@/ui/utils";
import { useSiteSkin } from "./site-skin";
import { PaletteSection } from "./palette-section";
import {
  findStyleTemplateByPath,
} from "../lib/style-templates";

const LABELS = {
  en: {
    trigger: "Appearance and motion",
    appearance: "Appearance",
    palette: "Palette",
    motion: "Motion",
    themes: { system: "System", light: "Light", dark: "Dark" } satisfies Record<ThemeMode, string>,
    motions: { system: "System", reduce: "Reduce", full: "Full" } satisfies Record<MotionMode, string>,
  },
  zh: {
    trigger: "外观与动效",
    appearance: "外观",
    palette: "调色板",
    motion: "动效",
    themes: { system: "跟随系统", light: "浅色", dark: "深色" } satisfies Record<ThemeMode, string>,
    motions: { system: "跟随系统", reduce: "减少动态", full: "完整动态" } satisfies Record<MotionMode, string>,
  },
} as const;

type Lang = keyof typeof LABELS;

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-2 border-t pt-4 first:border-t-0 first:pt-0">
      <h2 className="m-0 text-label font-label tracking-label case-label text-surface-fg">{label}</h2>
      {children}
    </section>
  );
}

function ChoiceGroup<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  const { Button } = useSiteSkin();
  return (
    <div
      role="group"
      aria-label={label}
      className="grid grid-flow-col auto-cols-fr gap-1 rounded-md border bg-quiet p-1"
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <Button
            key={option.value}
            type="button"
            data-variant={active ? "primary" : "text"}
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className="min-h-control min-w-0 rounded-sm px-2"
          >
            {option.label}
          </Button>
        );
      })}
    </div>
  );
}

export function AppearancePanel({
  lang = "en",
  className,
}: {
  lang?: Lang;
  className?: string;
}) {
  const { Popover } = useSiteSkin();
  const { pathname } = useLocation();
  const t = LABELS[lang] ?? LABELS.en;
  const { theme, setTheme } = useTheme();
  const motion = useMotionPreference();
  const current = findStyleTemplateByPath(pathname);
  const [open, setOpen] = React.useState(false);

  const themeOptions = React.useMemo(
    () => (["system", "light", "dark"] as const).map((value) => ({ value, label: t.themes[value] })),
    [t],
  );
  const motionOptions = React.useMemo(
    () => (["system", "reduce", "full"] as const).map((value) => ({ value, label: t.motions[value] })),
    [t],
  );

  return (
    <Popover
      alignX="end"
      open={open}
      onOpenChange={setOpen}
      aria-label={t.trigger}
      title={t.trigger}
      classNames={{
        trigger: `${className} size-control justify-center px-0`,
        content: "w-96 max-w-[calc(100vw-2rem)] max-h-[min(70vh,40rem)] p-4",
      }}
      trigger={<Settings className="size-4" aria-hidden />}
    >
      <div className="flex flex-col gap-4">
        <Section label={t.appearance}>
          <ChoiceGroup
            label={t.appearance}
            value={theme}
            options={themeOptions}
            onChange={setTheme}
          />
        </Section>

        <Section label={t.motion}>
          <ChoiceGroup
            label={t.motion}
            value={motion.mode}
            options={motionOptions}
            onChange={motion.setMode}
          />
        </Section>

        <Section label={t.palette}>
          <PaletteSection palettes={current.palettes} lang={lang} />
        </Section>
      </div>
    </Popover>
  );
}
