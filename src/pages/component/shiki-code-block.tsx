import { useState, useEffect } from "react";
import { createHighlighter } from "shiki";
import { CodeBlock } from "@/pages/component/code-block";
import { useThemeStore } from "@/components/ui/theme";

const highlighterPromise = createHighlighter({
  themes: ["github-dark", "github-light"],
  langs: ["tsx", "typescript", "javascript", "css", "json", "html", "bash"],
});

interface ShikiCodeBlockProps {
  children?: React.ReactNode;
  title?: string;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function ShikiCodeBlock({
  children,
  title,
  isOpen,
  onToggle,
}: ShikiCodeBlockProps) {
  const code = typeof children === "string" ? children : "";
  const [highlightedCode, setHighlightedCode] = useState("");
  const { colorScheme } = useThemeStore();

  useEffect(() => {
    if (!code) return;

    const theme = colorScheme === "dark" ? "github-dark" : "github-light";

    highlighterPromise.then((highlighter) => {
      const html = highlighter.codeToHtml(code, {
        lang: "tsx",
        theme,
      });
      const wrapped = html.replace(
        "<pre",
        '<pre class="p-4 min-w-full"'
      );
      setHighlightedCode(wrapped);
    });
  }, [code, colorScheme]);

  return (
    <CodeBlock
      title={title}
      isOpen={isOpen}
      onToggle={onToggle}
      code={code}
    >
      {highlightedCode && (
        <div
          className="overflow-x-auto"
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
        />
      )}
    </CodeBlock>
  );
}
