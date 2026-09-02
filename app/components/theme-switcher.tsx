"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Popover, useTheme } from "@/ui";
import { cn } from "@/ui";

const SURFACES = [
  { value: "", color: "oklch(87% 0 0)" },
  { value: "olive", color: "oklch(88% 0.011 106.6)" },
  { value: "mist", color: "oklch(87.2% 0.007 219.6)" },
  { value: "mauve", color: "oklch(86.5% 0.012 325.68)" },
  { value: "taupe", color: "oklch(86.8% 0.007 39.5)" },
  { value: "stone", color: "oklch(86.9% 0.005 56.366)" },
  { value: "zinc", color: "oklch(70.5% 0.015 286.067)" },
  { value: "slate", color: "oklch(86.9% 0.022 252.894)" },
  { value: "gray", color: "oklch(87.2% 0.01 258.338)" },
];

const BRANDS = [
  { value: "", color: "oklch(14.5% 0 0)" },
  { value: "cyan", color: "oklch(39.8% 0.07 227.392)" },
  { value: "violet", color: "oklch(43.2% 0.232 292.759)" },
  { value: "teal", color: "oklch(43.7% 0.078 188.216)" },
  { value: "sky", color: "oklch(44.3% 0.11 240.79)" },
  { value: "rose", color: "oklch(45.5% 0.188 13.697)" },
  { value: "purple", color: "oklch(43.8% 0.218 303.724)" },
  { value: "pink", color: "oklch(45.9% 0.187 3.815)" },
  { value: "orange", color: "oklch(40.8% 0.123 38.172)" },
  { value: "lime", color: "oklch(40.5% 0.101 131.063)" },
  { value: "indigo", color: "oklch(45.7% 0.24 277.023)" },
  { value: "fuchsia", color: "oklch(45.2% 0.211 324.591)" },
  { value: "emerald", color: "oklch(43.2% 0.095 166.913)" },
  { value: "amber", color: "oklch(41.4% 0.112 45.904)" },
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
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
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
            "inline-flex size-8 items-center justify-center rounded-full border text-fd-muted-foreground transition-colors hover:text-fd-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
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
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
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
