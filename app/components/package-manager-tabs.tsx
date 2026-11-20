import { Check, Copy } from "@/components/icons";
import { useSiteSkin } from "./site-skin";
import { copyText } from "@/lib/clipboard";
import { i18n } from "@/lib/i18n";
import { useParams } from "react-router";
import { useState } from "react";

interface PackageManagerTabsProps {
  command: string;
}

export function PackageManagerTabs({ command }: PackageManagerTabsProps) {
  const { Button } = useSiteSkin();
  const params = useParams<{ lang?: string }>();
  const locale = params.lang || i18n.defaultLanguage;
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = async (text: string, pm: string) => {
    if (!(await copyText(text))) return;
    setCopied(pm);
    setTimeout(() => setCopied(null), 2000);
  };

  const list = [
    { key: "npm", cmd: `npx ${command}` },
    { key: "pnpm", cmd: `pnpm dlx ${command}` },
    { key: "yarn", cmd: `yarn dlx ${command}` },
    { key: "bun", cmd: `bun --bun ${command}` },
  ];

  return (
    <div className="not-typography flex h-full flex-col justify-center gap-2 p-4 font-mono text-sm">
      <ul className="flex flex-col gap-2">
        {list.map((item) => (
          <li
            key={item.key}
            className="flex min-w-0 items-center gap-2 rounded-sm px-2 py-1.5 hover:bg-accent"
          >
            <span className="shrink-0 text-success-fg">$</span>
            <span className="min-w-0 flex-1 break-all">{item.cmd}</span>
            <Button
              type="button"
              data-variant="text"
              className="shrink-0"
              onClick={() => handleCopy(item.cmd, item.key)}
              aria-label={locale === "zh" ? "复制命令" : "Copy command"}
              icon={
                copied === item.key ? (
                  <Check className="size-4 text-success-fg" />
                ) : (
                  <Copy className="size-4 text-surface-fg" />
                )
              }
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
