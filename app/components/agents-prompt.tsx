"use client";

import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { Check, Copy } from "@/components/icons";
import { CodeSurface, DocsCodeBlock } from "@/components/docs-codeblock";
import { useSiteSkin } from "./site-skin";
import { copyText } from "@/lib/clipboard";
import { stripSchemePrefix } from "@/lib/style-templates";

function promptOf(zh: boolean): string {
  return zh
    ? `你将通过 Litefy UI 的机器可读文档工作，消费规则如下：
- 文档结构读 /zh/llms.txt；组件 props、行为与示例读 /zh/llms-full.txt。
- 项目未接皮肤（纯 headless）：忽略一切 design.md；纯样式组件（无 headless 版）不可用。
- 项目使用皮肤（minimal / neo-brutalist / neon-gradient / flat-minimal）：附加读取 https://cdn.jsdelivr.net/gh/litefytop/litefy@main/app/ui/schemes/<方案名>/design.md，视觉 token 与类名以它为准。
- 生成契约：组合 Litefy 组件而非手写 HTML + Tailwind；只用语义 Token（bg-background、text-primary…）；复合成品与低层零件二选一，不得混用。`
    : `You will work with Litefy UI through its machine-readable docs. Consumption rules:
- Read /en/llms.txt for the doc map; /en/llms-full.txt for component props, behavior and examples.
- Headless project (no skin installed): ignore every design.md; style-only components (no headless version) are unavailable.
- Skinned project (minimal / neo-brutalist / neon-gradient / flat-minimal): additionally read https://cdn.jsdelivr.net/gh/litefytop/litefy@main/app/ui/schemes/<scheme>/design.md; visual tokens and class names follow it.
- Generation contract: compose Litefy components instead of hand-written HTML + Tailwind; use semantic tokens only; pick either composite components or low-level parts, never both.`;
}

export function AgentPrompt() {
  const { Button } = useSiteSkin();
  const zh = stripSchemePrefix(useLocation().pathname).startsWith("/zh");
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");
  const prompt = promptOf(zh);

  useEffect(() => {
    if (status !== "copied") return;
    const timer = setTimeout(() => setStatus("idle"), 2000);
    return () => clearTimeout(timer);
  }, [status]);

  const copy = async () => {
    setStatus(await copyText(prompt) ? "copied" : "error");
  };

  return (
    <div className="flex flex-col gap-3">
      <CodeSurface code={prompt}>
        <DocsCodeBlock code={prompt} lang="markdown" className="skill-command" />
      </CodeSurface>
      <div className="flex items-center gap-3">
        <Button type="button" data-variant="outline" className="self-start" onClick={copy}>
          {status === "copied" ? <Check aria-hidden /> : <Copy aria-hidden />}
          {zh ? "复制 prompt" : "Copy prompt"}
        </Button>
        {status === "copied" && (
          <p role="status" className="m-0 text-surface-fg text-base leading-6">
            {zh ? "已复制。" : "Copied."}
          </p>
        )}
        {status === "error" && (
          <p role="alert" className="m-0 text-surface-fg text-base leading-6">
            {zh ? "复制失败，请手动选择文本复制。" : "Copy failed. Select the text manually."}
          </p>
        )}
      </div>
    </div>
  );
}
