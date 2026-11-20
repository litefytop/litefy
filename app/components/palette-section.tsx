"use client";
import * as React from "react";
import { SwatchPicker } from "@/ui/skins";
import { applyAttr, loadStored } from "@/lib/ramp-attrs";
import type { PaletteConfig } from "../lib/style-templates";

function useRamp(cfg: PaletteConfig): [string, (v: string) => void] {
  const [value, setValue] = React.useState("");
  const valueRef = React.useRef("");
  React.useEffect(() => {
    const stored = loadStored(cfg.storageKey);
    if (valueRef.current !== stored) {
      valueRef.current = stored;
      setValue(stored);
    }
    applyAttr(cfg.attr, stored);
  }, [cfg.storageKey, cfg.attr]);
  const update = React.useCallback(
    (next: string) => {
      valueRef.current = next;
      setValue(next);
      localStorage.setItem(cfg.storageKey, JSON.stringify(next));
      applyAttr(cfg.attr, next);
    },
    [cfg.storageKey, cfg.attr],
  );
  return [value, update];
}

function SwatchRow({
  cfg,
  lang,
}: {
  cfg: PaletteConfig;
  lang: "en" | "zh";
}) {
  const [active, setActive] = useRamp(cfg);
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium text-surface-fg">{cfg.label[lang]}</span>

      <SwatchPicker
        aria-label={cfg.label[lang]}
        options={cfg.options.map((o) => ({
          value: o.name,
          label: o.label,
          color: o.swatch ?? `var(${cfg.dotVar})`,
          attrs: o.name === "default" ? { [cfg.attr]: "default" } : undefined,
        }))}
        value={active === "" ? "default" : active}
        onValueChange={(value) => setActive(value === "default" ? "" : value)}
      />
    </div>
  );
}

const LIVE_TOKENS = ["--primary", "--background", "--success-fg", "--info-fg", "--warning-fg", "--danger-fg"] as const;

const LIVE_LABELS = {
  en: { colors: "Colors", fixed: "Fixed palette" },
  zh: { colors: "颜色", fixed: "固定色板" },
} as const;

function LiveSwatches({ lang }: { lang: "en" | "zh" }) {
  const t = LIVE_LABELS[lang];
  const [dots, setDots] = React.useState<{ token: string; color: string }[]>([]);
  React.useEffect(() => {
    const read = () => {
      const cs = getComputedStyle(document.documentElement);
      setDots(LIVE_TOKENS.map((tk) => ({ token: tk, color: cs.getPropertyValue(tk).trim() })));
    };
    read();
    const mo = new MutationObserver(read);
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-brand", "data-surface"],
    });
    return () => mo.disconnect();
  }, []);
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium text-surface-fg">
        {t.colors} · {t.fixed}
      </span>
      <div className="flex gap-1" aria-hidden="true">
        {dots.map(({ token, color }) => (
          <span
            key={token}
            className="size-4 rounded-pill border"
            style={color ? { backgroundColor: color } : undefined}
          />
        ))}
      </div>
    </div>
  );
}

export function PaletteSection({
  palettes,
  lang,
}: {
  palettes: PaletteConfig[];
  lang: "en" | "zh";
}) {
  if (palettes.length === 0) return <LiveSwatches lang={lang} />;
  return (
    <div className="flex flex-col gap-3">
      {palettes.map((cfg) => (
        <SwatchRow key={cfg.storageKey} cfg={cfg} lang={lang}
        />
      ))}
    </div>
  );
}
