"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Popover, useTheme } from "@/ui";
import { cn } from "@/ui";

const labels = {
  en: {
    toggle: "Toggle theme",
    theme: "Theme",
    light: "Light",
    dark: "Dark",
    system: "System",
  },
  zh: {
    toggle: "切换主题",
    theme: "主题",
    light: "浅色",
    dark: "深色",
    system: "跟随系统",
  },
};

type Lang = keyof typeof labels;

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
            "inline-flex size-8 items-center justify-center rounded-full border text-muted-foreground transition-colors hover:text-foreground",
        }}
        trigger={
          <>
            {isDark ? <Moon className="size-4" /> : <Sun className="size-4" />}
            <span className="sr-only">{t.toggle}</span>
          </>
        }
      >
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-muted-foreground">{t.theme}</span>
          <ul className="flex gap-1 rounded-lg border p-1">
            {modes.map((mode) => (
              <li key={mode.value} className="flex flex-1">
                <button
                  type="button"
                  onClick={() => theme.setTheme(mode.value)}
                  aria-label={mode.label}
                  title={mode.label}
                  className={cn(
                    "flex w-full items-center justify-center gap-1.5 rounded-md p-1.5 text-xs whitespace-nowrap text-muted-foreground hover:bg-muted",
                    theme.theme === mode.value && "bg-muted text-foreground",
                  )}
                >
                  <mode.icon className="size-4" />
                  {mode.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </Popover>
    </div>
  );
}
