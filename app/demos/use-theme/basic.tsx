"use client";

import { Button, useTheme } from "@/ui";

export default function UseThemeBasicDemo() {
  const theme = useTheme();

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      <p className="text-sm text-muted-foreground">
        Current theme: <span className="font-medium text-foreground">{theme.theme}</span>
      </p>
      <div className="flex gap-2">
        {(["light", "dark", "system"] as const).map((mode) => (
          <Button
            key={mode}
            variant={theme.theme === mode ? "primary" : "outline"}
            onClick={() => theme.setTheme(mode)}
            className="capitalize"
          >
            {mode}
          </Button>
        ))}
        <Button variant="text" onClick={() => theme.toggleTheme()}>
          Toggle
        </Button>
      </div>
    </div>
  );
}
