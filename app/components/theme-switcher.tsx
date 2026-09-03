"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Popover, useTheme } from "@/ui";
import { cn } from "@/ui";

const SURFACES = [
  { value: "", color: "oklch(55.6% 0 none)" },
  { value: "olive", color: "oklch(58% 0.031 107.3)" },
  { value: "mist", color: "oklch(56% 0.021 213.5)" },
  { value: "mauve", color: "oklch(54.2% 0.034 322.5)" },
  { value: "taupe", color: "oklch(54.7% 0.021 43.1)" },
  { value: "stone", color: "oklch(55.3% 0.013 58.071)" },
  { value: "zinc", color: "oklch(55.2% 0.016 285.938)" },
  { value: "slate", color: "oklch(55.4% 0.046 257.417)" },
  { value: "gray", color: "oklch(55.1% 0.027 264.364)" },
];

const BRANDS = [
  { value: "", color: "oklch(55.6% 0 none)" },
  { value: "cyan", color: "oklch(70.6% 0.137 204)" },
  { value: "violet", color: "oklch(60.6% 0.25 292.717)" },
  { value: "teal", color: "oklch(70.4% 0.14 182.503)" },
  { value: "sky", color: "oklch(68.5% 0.135 217)" },
  { value: "rose", color: "oklch(64.5% 0.246 16.439)" },
  { value: "purple", color: "oklch(62.7% 0.265 303.9)" },
  { value: "pink", color: "oklch(65.6% 0.241 354.308)" },
  { value: "orange", color: "oklch(70.5% 0.213 47.604)" },
  { value: "lime", color: "oklch(76.8% 0.233 130.85)" },
  { value: "indigo", color: "oklch(58.5% 0.233 277.117)" },
  { value: "fuchsia", color: "oklch(66.7% 0.295 322.15)" },
  { value: "emerald", color: "oklch(69.6% 0.17 162.48)" },
  { value: "amber", color: "oklch(76.9% 0.188 70.08)" },
];
const labels = {
  en: {
    toggle: "Toggle theme",
    theme: "Theme",
    surface: "Surface",
    brand: "Brand",
    light: "Light",
    dark: "Dark",
    system: "System",
    default: "Default",
  },
  zh: {
    toggle: "切换主题",
    theme: "主题",
    surface: "Surface",
    brand: "Brand",
    light: "浅色",
    dark: "深色",
    system: "跟随系统",
    default: "默认",
  },
};

type Lang = keyof typeof labels;

function DotButton({
  color,
  label,
  active,
  onClick,
}: {
  color: string;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "size-5 cursor-pointer rounded-full transition-transform hover:scale-110",
        active && "ring-2 ring-ring ring-offset-2 ring-offset-background",
      )}
      style={{ backgroundColor: color }}
    />
  );
}

export function ThemeSwitcher({ lang = "en", className }: { lang?: Lang; className?: string }) {
  const theme = useTheme();
  const t = labels[lang] ?? labels.en;
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const sync = () => setIsDark(document.documentElement.classList.contains("dark"));
    sync();
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", sync);
    return () => mediaQuery.removeEventListener("change", sync);
  }, [theme.theme]);

  const modes = [
    { value: "light", icon: Sun, label: t.light },
    { value: "dark", icon: Moon, label: t.dark },
    { value: "system", icon: Monitor, label: t.system },
  ] as const;

  return (
    <div className={cn("inline-flex", className)}>
      <Popover
        alignX="end"
        classNames={{
          content: "w-64 p-3",
          trigger:
            "inline-flex size-8 items-center justify-center rounded-full border text-fd-muted-foreground transition-colors hover:text-fd-foreground",
        }}
        trigger={
          <>
            {isDark ? <Moon className="size-4" /> : <Sun className="size-4" />}
            <span className="sr-only">{t.toggle}</span>
          </>
        }
      >
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-muted-foreground">{t.theme}</span>
            <div className="flex gap-1 rounded-lg border p-1">
              {modes.map((mode) => (
                <button
                  key={mode.value}
                  type="button"
                  onClick={() => theme.setTheme(mode.value)}
                  aria-label={mode.label}
                  title={mode.label}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-1.5 rounded-md p-1.5 text-xs whitespace-nowrap text-muted-foreground hover:bg-muted",
                    theme.theme === mode.value && "bg-muted text-foreground",
                  )}
                >
                  <mode.icon className="size-4" />
                  {mode.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-muted-foreground">{t.surface}</span>
            <div className="flex flex-wrap gap-1.5">
              {SURFACES.map((surface) => (
                <DotButton
                  key={surface.value}
                  color={surface.color}
                  label={surface.value || t.default}
                  active={theme.surface === surface.value}
                  onClick={() => theme.setSurface(surface.value)}
                />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-muted-foreground">{t.brand}</span>
            <div className="flex flex-wrap gap-1.5">
              {BRANDS.map((brand) => (
                <DotButton
                  key={brand.value}
                  color={brand.color}
                  label={brand.value || t.default}
                  active={theme.brand === brand.value}
                  onClick={() => theme.setBrand(brand.value)}
                />
              ))}
            </div>
          </div>
        </div>
      </Popover>
    </div>
  );
}
