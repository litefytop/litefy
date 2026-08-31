"use client";

import { useTheme } from "@/ui";

export default function UseThemeBasicDemo() {
  const theme = useTheme();

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      <p className="text-sm text-muted-foreground">
        Current theme: <span className="font-medium text-foreground">{theme.theme}</span>
      </p>
      <div className="flex gap-2">
        {(["light", "dark", "system"] as const).map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => theme.setTheme(mode)}
            className={
              "rounded-md border px-3 py-1.5 text-sm capitalize hover:bg-accent" +
              (theme.theme === mode ? " bg-primary text-primary-foreground" : "")
            }
          >
            {mode}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={theme.toggleTheme}
        className="rounded-md border px-3 py-1.5 text-sm hover:bg-accent"
      >
        Toggle light / dark
      </button>
    </div>
  );
}
