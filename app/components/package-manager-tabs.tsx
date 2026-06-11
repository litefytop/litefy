import { useState } from "react";
import { CheckIcon, CopyIcon } from "lucide-react";

interface PackageManagerTabsProps {
  command: string;
}

export function PackageManagerTabs({ command }: PackageManagerTabsProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = async (text: string, pm: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(pm);
    setTimeout(() => setCopied(null), 2000);
  };

  const list = [
    { key: "npm", cmd: `npm ${command}` },
    { key: "pnpm", cmd: `pnpm ${command}` },
    { key: "yarn", cmd: `yarn ${command}` },
    { key: "bun", cmd: `bun ${command}` },
  ];

  return (
    <div className="bg-muted rounded-lg p-4 -m-4! text-foreground font-mono">
      <div className="text-muted-foreground text-sm mb-3">Terminal</div>
      <div className="flex flex-col gap-2">
        {list.map((item) => (
          <div key={item.key} className="relative group">
            <div className="pl-4 pr-12 py-2">
              <span className="text-emerald-500 mr-2">$</span>
              {item.cmd}
            </div>
            <button
              onClick={() => handleCopy(item.cmd, item.key)}
              className="absolute top-1/2 right-2 -translate-y-1/2 p-1.5 rounded-md opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity"
              aria-label="Copy command"
            >
              {copied === item.key ? (
                <CheckIcon className="size-4 text-green-500" />
              ) : (
                <CopyIcon className="size-4 text-muted-foreground" />
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
