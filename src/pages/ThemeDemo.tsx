"use client";

import { useTheme } from "@/components/ui/theme";
import { Button } from "@/components";

const themeColors: Record<string, string> = {
  zinc: "#71717a",
  slate: "#64748b",
  stone: "#78716c",
  gray: "#6b7280",
  neutral: "#737373",
  red: "#ef4444",
  rose: "#f43f5e",
  orange: "#f97316",
  green: "#22c55e",
  blue: "#3b82f6",
  yellow: "#eab308",
  violet: "#8b5cf6",
};

const themes = [
  { name: "zinc", label: "Zinc" },
  { name: "slate", label: "Slate" },
  { name: "stone", label: "Stone" },
  { name: "gray", label: "Gray" },
  { name: "neutral", label: "Neutral" },
  { name: "red", label: "Red" },
  { name: "rose", label: "Rose" },
  { name: "orange", label: "Orange" },
  { name: "green", label: "Green" },
  { name: "blue", label: "Blue" },
  { name: "yellow", label: "Yellow" },
  { name: "violet", label: "Violet" },
];

export default function ThemeDemo() {
  const { theme, colorScheme, setTheme, toggleColorScheme } = useTheme();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Theme</h1>
        <p className="text-muted-foreground mt-2">
          选择主题颜色和显示模式。
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">主题颜色</h2>
        <div className="border rounded-lg p-6">
          <div className="grid grid-cols-4 gap-4 max-w-md">
            {themes.map((t) => (
              <button
                key={t.name}
                onClick={() => setTheme(t.name)}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                  theme === t.name 
                    ? "border-primary ring-2 ring-primary/20 bg-primary/5" 
                    : "hover:bg-accent"
                }`}
              >
                <span 
                  className="w-5 h-5 rounded-full shrink-0" 
                  style={{ backgroundColor: themeColors[t.name] }} 
                />
                <span className="text-sm">{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">显示模式</h2>
        <div className="border rounded-lg p-6">
          <div className="flex gap-4">
            <button
              onClick={() => colorScheme === "dark" && toggleColorScheme()}
              className={`flex-1 p-4 rounded-lg border transition-all ${
                colorScheme === "light"
                  ? "border-primary ring-2 ring-primary/20 bg-primary/5"
                  : "hover:bg-accent"
              }`}
            >
              <div className="w-full h-20 rounded bg-white border flex items-center justify-center mb-2">
                <div className="w-8 h-8 rounded bg-zinc-200" />
              </div>
              <div className="text-sm font-medium">浅色模式</div>
            </button>
            <button
              onClick={() => colorScheme === "light" && toggleColorScheme()}
              className={`flex-1 p-4 rounded-lg border transition-all ${
                colorScheme === "dark"
                  ? "border-primary ring-2 ring-primary/20 bg-primary/5"
                  : "hover:bg-accent"
              }`}
            >
              <div className="w-full h-20 rounded bg-zinc-900 border flex items-center justify-center mb-2">
                <div className="w-8 h-8 rounded bg-zinc-700" />
              </div>
              <div className="text-sm font-medium">深色模式</div>
            </button>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">预览</h2>
        <div className="border rounded-lg p-6">
          <div className="flex gap-4">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
          </div>
        </div>
      </section>
    </div>
  );
}
