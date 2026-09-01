"use client";

import { useTheme } from "@/ui";

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
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs text-muted-foreground">Surface (neutral)</span>
        <div className="flex max-w-full flex-wrap justify-center gap-2">
          {SURFACES.map((surface) => (
            <button
              key={surface.value}
              type="button"
              aria-label={surface.value || "default"}
              title={surface.value || "default"}
              onClick={() => theme.setSurface(surface.value)}
              className={
                "size-6 cursor-pointer rounded-full transition-transform hover:scale-110" +
                (theme.surface === surface.value
                  ? " ring-2 ring-ring ring-offset-2 ring-offset-background"
                  : "")
              }
              style={{ backgroundColor: surface.color }}
            />
          ))}
        </div>
      </div>
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs text-muted-foreground">Brand (primary)</span>
        <div className="flex max-w-full flex-wrap justify-center gap-2">
          {BRANDS.map((brand) => (
            <button
              key={brand.value}
              type="button"
              aria-label={brand.value || "default"}
              title={brand.value || "default"}
              onClick={() => theme.setBrand(brand.value)}
              className={
                "size-6 cursor-pointer rounded-full transition-transform hover:scale-110" +
                (theme.brand === brand.value
                  ? " ring-2 ring-ring ring-offset-2 ring-offset-background"
                  : "")
              }
              style={{ backgroundColor: brand.color }}
            />
          ))}
        </div>
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
