"use client";

import { Button } from "@/ui/skins";
import { useTheme } from "@/ui/utils";

export default function UseThemeBasicDemo() {
  const theme = useTheme();

  return (
    <div className="flex flex-col gap-3 items-center">
      <p>
        Current theme: <span>{theme.theme}</span>
      </p>
      <div className="flex flex-wrap gap-3">
        {(["light", "dark", "system"] as const).map((mode) => (
          <Button key={mode} data-variant="outline" disabled={theme.theme === mode} onClick={() => theme.setTheme(mode)}>
            {mode}
          </Button>
        ))}
        <Button data-variant="outline" onClick={() => theme.toggleTheme()}>Toggle</Button>
      </div>
    </div>
  );
}
