import { HomeShell } from "@/components/docs-shell";
import { type LinksFunction, useParams } from "react-router";
import globalHref from "../global.css?url";
import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Copy } from "@/components/icons";
import { copyText } from "@/lib/clipboard";
import { SiteSkinProvider, useSiteSkin } from "@/components/site-skin";
import { siteSkin } from "@/components/site-skin-bundle";
import {
  blend,
  contrastRatio,
  resolveColor,
  toHex,
  toRgbString,
  type RGBA,
} from "@/lib/color";
import { siteUrl } from "@/lib/shared";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: globalHref },
];

const LABELS = {
  en: {
    title: "Color Tools",
    heading: "Color Tools",
    sub: "Alpha compositing and WCAG contrast over plain colors — browse the active scheme's tokens below.",
    effective: "Effective color",
    foreground: "Foreground color",
    base: "Base color",
    alpha: "Alpha",
    fillContrast: "Fill into contrast checker",
    contrast: "Contrast checker",
    text: "Text color",
    background: "Background color",
    ratio: "Ratio",
    aaNormal: "AA body",
    aaaNormal: "AAA body",
    aaLarge: "AA large",
    aaaLarge: "AAA large",
    ui: "UI components",
    need3: "≥ 3.0",
    need45: "≥ 4.5",
    need7: "≥ 7.0",
    invalid: "Unparseable color",
    copied: "Copied",
    effNote: "alpha composited over the base color",
    preview: "Sample text preview",
    tokens: "Scheme tokens",
    tokensNote: "Click a chip to copy the token's raw value",
  },
  zh: {
    title: "颜色工具",
    heading: "颜色工具",
    sub: "透明度合成与 WCAG 对比度——纯颜色计算；方案令牌取色见下方令牌模块。",
    effective: "实际颜色",
    foreground: "前景色",
    base: "背景色",
    alpha: "透明度",
    fillContrast: "填入对比度检查",
    contrast: "对比度检查",
    text: "文字色",
    background: "背景色",
    ratio: "比值",
    aaNormal: "AA 正文",
    aaaNormal: "AAA 正文",
    aaLarge: "AA 大字",
    aaaLarge: "AAA 大字",
    ui: "UI 组件",
    need3: "≥ 3.0",
    need45: "≥ 4.5",
    need7: "≥ 7.0",
    invalid: "无法解析的颜色",
    copied: "已复制",
    effNote: "透明度已对背景色合成",
    preview: "示例文字预览",
    tokens: "方案令牌",
    tokensNote: "点击芯片复制令牌原值",
  },
} as const;

const TOKEN_NAMES = [
  "background",
  "foreground",
  "surface",
  "surface-fg",
  "accent",
  "accent-fg",
  "border",
  "primary",
  "primary-fg",
  "primary-accent",
  "danger",
  "danger-fg",
  "danger-accent",
  "info",
  "info-fg",
  "info-accent",
  "success",
  "success-fg",
  "success-accent",
  "warning",
  "warning-fg",
  "warning-accent",
] as const;

export function meta({ params }: { params: { lang?: string } }) {
  const lang = params.lang === "zh" ? "zh" : "en";
  const t = LABELS[lang];
  return [
    { title: `${t.title} - Litefy UI` },
    { name: "description", content: t.sub },
    { name: "robots", content: "index, follow" },
    { rel: "canonical", href: `${siteUrl}/${lang}/tools/color` },
  ];
}

function Swatch({ color, className }: { color: RGBA | null; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={"shrink-0 size-10 rounded-md border " + (className ?? "")}
      style={color ? { backgroundColor: toRgbString(color) } : undefined}
    />
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const { Input } = useSiteSkin();
  const parsed =
    typeof document === "undefined" ? null : resolveColor(value);
  const pickerHex = parsed ? toHex({ ...parsed, a: 1 }) : "#000000";
  return (
    <label className="flex flex-col flex-1 gap-1" style={{ minWidth: 0 }}>
      <span className="text-xs font-medium text-surface-fg">{label}</span>
      <span className="flex items-center gap-2">
        <input
          type="color"
          value={pickerHex}
          onChange={(e) => onChange(e.target.value)}
          aria-label={label}
          className="size-10 shrink-0 cursor-pointer rounded-md border border-border bg-transparent p-0.5"
        />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="font-mono text-sm"
        />
      </span>
    </label>
  );
}

function TokenChip({ name, raw, copiedLabel }: { name: string; raw: string; copiedLabel: string }) {
  const { Button } = useSiteSkin();
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  return (
    <Button
      data-variant="outline"
      disabled={!raw}
      icon={
        <span
          className="size-6 shrink-0 rounded-sm border border-border"
          style={{ backgroundColor: `var(--${name})` }}
        />
      }
      status={{
        icon: (
          <span
            aria-hidden="true"
            className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-success text-success-fg"
          >
            <Check />
          </span>
        ),
        active: copied,
      }}
      onClick={() => {
        if (!raw) return;
        void copyText(raw).then((ok) => {
          if (!ok) return;
          setCopied(true);
          window.clearTimeout(timer.current);
          timer.current = window.setTimeout(() => setCopied(false), 3000);
          return undefined;
        });
      }}
    >
      <span className="font-mono font-medium">{name}</span>
      <span className="max-w-[11rem] truncate font-mono" title={raw}>
        {raw || "—"}
      </span>
      <span role="status" className="sr-only">
        {copied ? copiedLabel : ""}
      </span>
    </Button>
  );
}

export default function ColorToolsRoute() {
  return (
    <SiteSkinProvider skin={siteSkin}>
      <ColorTools />
    </SiteSkinProvider>
  );
}

function ColorTools() {
  const { Button, Card, NumberInput, Slider } = useSiteSkin();
  const params = useParams<{ lang: string }>();
  const lang = params.lang === "zh" ? "zh" : "en";
  const t = LABELS[lang];

  const [mounted, setMounted] = useState(false);
  const mountedRef = useRef(false);
  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;
    setMounted(true);
  }, []);

  const [fg, setFg] = useState("#b91c1c");
  const [base, setBase] = useState("#ffffff");
  const [alphaPct, setAlphaPct] = useState(15);

  const [txt, setTxt] = useState("#b91c1c");
  const [bgc, setBgc] = useState("#fee2e2");

  const [hexCopied, setHexCopied] = useState(false);
  const hexTimer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(hexTimer.current), []);

  const flashHex = (text: string) => {
    if (!text) return;
    void copyText(text).then((ok) => {
      if (!ok) return;
      setHexCopied(true);
      window.clearTimeout(hexTimer.current);
      hexTimer.current = window.setTimeout(() => setHexCopied(false), 3000);
      return undefined;
    });
  };

  const tokenChips = useMemo(() => {
    if (!mounted) return [];
    const rootStyle = getComputedStyle(document.documentElement);
    return TOKEN_NAMES.map((name) => ({
      name,
      raw: rootStyle.getPropertyValue(`--${name}`).trim(),
    }));
  }, [mounted]);

  const computed = useMemo(() => {
    if (!mounted) return null;
    const fgC = resolveColor(fg);
    const baseC = resolveColor(base);
    const composite =
      fgC && baseC ? blend({ ...fgC, a: Math.min(1, Math.max(0, alphaPct / 100)) }, baseC) : null;
    const txtRaw = resolveColor(txt);
    const bgRaw = resolveColor(bgc);
    const pageBg = resolveColor("#ffffff");
    const txtEff = txtRaw && pageBg ? blend(txtRaw, pageBg) : null;
    const bgEff = bgRaw && pageBg ? blend(bgRaw, pageBg) : null;
    const ratio = txtEff && bgEff ? contrastRatio(txtEff, bgEff) : null;
    return { fgC, baseC, composite, txtRaw, bgRaw, txtEff, bgEff, ratio, pageBg };
  }, [mounted, fg, base, alphaPct, txt, bgc]);

  const ratio = computed?.ratio ?? null;
  const badge = (label: string, need: number, pass: boolean) => (
    <span key={label} className={`inline-flex h-[1.25rem] items-center gap-1 rounded-sm px-2 text-xs leading-4 font-medium whitespace-nowrap ${pass ? "bg-success text-success-fg" : "bg-danger text-danger-fg"}`}>
      {label} {need} {pass ? "✓" : "✗"}
    </span>
  );

  return (
    <HomeShell locale={lang}>
      <section className="flex flex-col gap-6 px-4 md:px-6 lg:px-8 mx-auto w-full max-w-288 py-8">
        <header className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold">{t.heading}</h1>
          <p className="text-sm text-surface-fg">{t.sub}</p>
        </header>

        <div className="grid gap-6 lg:grid-cols-2 items-start">
          <Card classNames={{ inner: "flex flex-col gap-6 p-4 @xl:p-6 @4xl:p-8" }}>
            <div className="flex items-baseline justify-between gap-2">
              <h2 className="text-lg font-semibold">{t.effective}</h2>
              <span className="text-xs text-surface-fg">{t.effNote}</span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <ColorField label={t.foreground} value={fg} onChange={setFg} />
              <ColorField label={t.base} value={base} onChange={setBase} />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-surface-fg">{t.alpha} %</span>
              <div className="flex items-center gap-3">
                <NumberInput
                  value={alphaPct}
                  onValueChange={(v?: number | string) => setAlphaPct(Number(v ?? 0))}
                  min={0}
                  max={100}
                  step={5}
                  className="w-24 shrink-0"
                />
                <Slider
                  min={0}
                  max={100}
                  step={5}
                  value={alphaPct}
                  onChange={setAlphaPct}
                  orientation="horizontal"
                  hideValue
                  className="flex-1"
                  aria-label={t.alpha}
                />
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-lg border bg-surface">
              <Swatch color={computed?.composite ?? null} className="size-14" />
              <div className="flex flex-col gap-1" style={{ minWidth: 0 }}>
                <span className="font-mono text-sm font-medium truncate">
                  {computed?.composite ? toHex(computed.composite) : t.invalid}
                </span>
                <span className="truncate font-mono text-xs text-surface-fg">
                  {computed?.composite ? toRgbString(computed.composite) : "—"}
                </span>
              </div>
              <div className="flex shrink-0 ms-auto gap-2">
                <Button
                  data-variant="outline"
                  icon={<Copy aria-hidden />}
                  status={{ icon: <Check className="rounded-full bg-success text-success-fg p-0.5" />, active: hexCopied }}
                  disabled={!computed?.composite}
                  onClick={() => {
                    if (computed?.composite) flashHex(toHex(computed.composite));
                  }}
                >
                  HEX
                  <span role="status" className="sr-only">
                    {hexCopied ? t.copied : ""}
                  </span>
                </Button>
                <Button
                  data-variant="outline"
                  disabled={!computed?.composite}
                  onClick={() => {
                    if (computed?.composite) setBgc(toRgbString(computed.composite));
                  }}
                >
                  {t.fillContrast}
                </Button>
              </div>
            </div>
          </Card>

          <Card classNames={{ inner: "flex flex-col gap-6 p-4 @xl:p-6 @4xl:p-8" }}>
            <h2 className="text-lg font-semibold">{t.contrast}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <ColorField label={t.text} value={txt} onChange={setTxt} />
              <ColorField label={t.background} value={bgc} onChange={setBgc} />
            </div>
            <div
              className="flex items-center gap-4 p-4 rounded-lg border border-border"
              style={{
                backgroundColor: computed?.bgEff ? toRgbString(computed.bgEff) : undefined,
                color: computed?.txtEff ? toRgbString(computed.txtEff) : undefined,
              }}
            >
              <span className="text-3xl font-bold leading-none">Aa</span>
              <span className="text-sm truncate">{t.preview}</span>
              <div className="flex flex-col ms-auto text-end">
                <span className="text-xs opacity-70">{t.ratio}</span>
                <span className="font-mono text-2xl font-semibold">
                  {ratio === null ? "—" : ratio.toFixed(2)}
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {badge(t.aaNormal, 4.5, (ratio ?? 0) >= 4.5)}
              {badge(t.aaaNormal, 7, (ratio ?? 0) >= 7)}
              {badge(t.aaLarge, 3, (ratio ?? 0) >= 3)}
              {badge(t.aaaLarge, 4.5, (ratio ?? 0) >= 4.5)}
              {badge(t.ui, 3, (ratio ?? 0) >= 3)}
            </div>
          </Card>
        </div>

        <Card classNames={{ inner: "flex flex-col gap-6 p-4 @xl:p-6 @4xl:p-8" }}>
          <div className="flex items-baseline justify-between gap-2">
            <h2 className="text-lg font-semibold">{t.tokens}</h2>
            <span className="text-xs text-surface-fg">{t.tokensNote}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {tokenChips.map(({ name, raw }) => (
              <TokenChip key={name} name={name} raw={raw} copiedLabel={t.copied} />
            ))}
          </div>
        </Card>
      </section>
    </HomeShell>
  );
}
