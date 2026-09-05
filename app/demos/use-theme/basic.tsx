"use client";

import { useTheme } from "@/ui";

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
              "rounded-md border px-3 py-1.5 text-sm capitalize hover:bg-primary-accent" +
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
    </div>
  );
}
