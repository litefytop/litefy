import { useState, useEffect } from "react";
import { createHighlighter, Highlighter } from "shiki";
import { useTheme } from "@/component";
import { CheckIcon, CopyIcon,ChevronRightIcon } from "lucide-react";


let highlighterInstance: Highlighter | null = null;
let highlighterPromise: Promise<Highlighter> | null = null;

function getHighlighter(): Promise<Highlighter> {
  if (highlighterInstance) {
    return Promise.resolve(highlighterInstance);
  }
  
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ["github-dark", "github-light"],
      langs: ["tsx", "typescript", "javascript", "css", "json", "html", "bash"],
    }).then((highlighter) => {
      highlighterInstance = highlighter;
      return highlighter;
    });
  }
  
  return highlighterPromise;
}

interface CodeBlockProps {
  children?: React.ReactNode;
  title?: string;
  isOpen?: boolean;
  onToggle?: () => void;
  code?: string;
  maxHeight?: number | string;
}

export function CodeBlock({
  children,
  title,
  isOpen,
  onToggle,
  code: codeProp,
  maxHeight = "600px",
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = isOpen !== undefined;
  const isExpanded = isControlled ? isOpen : internalOpen;

  const codeString = codeProp || (typeof children === "string" ? children : "");

  const handleToggle = () => {
    if (onToggle) {
      onToggle();
    } else {
      setInternalOpen(!internalOpen);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(codeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border rounded-lg overflow-hidden mt-4">
      <div
        role="button"
        onClick={handleToggle}
        onKeyDown={(e) => e.key === "Enter" && handleToggle()}
        tabIndex={0}
        className="flex items-center justify-between w-full px-4 py-2 bg-muted/50 hover:bg-muted  cursor-pointer"
      >
        <span className="text-sm text-muted-foreground flex items-center gap-2">
          {isExpanded ? (
            <ChevronRightIcon className="size-4" />
          ) : (
            <ChevronRightIcon className="size-4" />
          )}
          {title || "查看代码"}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleCopy();
          }}
          className="p-1.5 rounded-md hover:bg-muted "
          aria-label="Copy code"
        >
          {copied ? (
            <CheckIcon className="size-4 text-green-500" />
          ) : (
            <CopyIcon className="size-4" />
          )}
        </button>
      </div>
      {isExpanded && (
        <div className="bg-muted/20 border-t">
          {children || (
            <pre 
              className="p-4 text-sm font-mono overflow-auto"
              style={{ maxHeight }}
            >
              <code>{codeString}</code>
            </pre>
          )}
        </div>
      )}
    </div>
  );
}

interface ShikiCodeBlockProps {
  children?: React.ReactNode;
  title?: string;
  isOpen?: boolean;
  onToggle?: () => void;
  maxHeight?: number | string;
}

export function ShikiCodeBlock({
  children,
  title,
  isOpen,
  onToggle,
  maxHeight = "600px",
}: ShikiCodeBlockProps) {
  const code = typeof children === "string" ? children : "";
  const [highlightedCode, setHighlightedCode] = useState("");
  const { colorScheme } = useTheme();

  useEffect(() => {
    if (!code) return;

    const theme = colorScheme === "dark" ? "github-dark" : "github-light";

    getHighlighter().then((highlighter) => {
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
      maxHeight={maxHeight}
    >
      {highlightedCode && (
        <div
          className="overflow-auto"
          style={{ maxHeight }}
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
        />
      )}
    </CodeBlock>
  );
}
