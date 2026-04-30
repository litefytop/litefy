import { useState } from "react";
import { CopyIcon, CheckIcon, CaretDownIcon, CaretRightIcon } from "@/components/ui/icons";

interface CodeBlockProps {
  children?: React.ReactNode;
  title?: string;
  isOpen?: boolean;
  onToggle?: () => void;
  code?: string;
}

export function CodeBlock({
  children,
  title,
  isOpen,
  onToggle,
  code,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = isOpen !== undefined;
  const isExpanded = isControlled ? isOpen : internalOpen;

  const codeString = code || (typeof children === "string" ? children : "");

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
        className="flex items-center justify-between w-full px-4 py-2 bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
      >
        <span className="text-sm text-muted-foreground flex items-center gap-2">
          {isExpanded ? (
            <CaretDownIcon className="size-4" />
          ) : (
            <CaretRightIcon className="size-4" />
          )}
          {title || "查看代码"}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleCopy();
          }}
          className="p-1.5 rounded-md hover:bg-muted transition-colors"
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
            <pre className="p-4 text-sm font-mono overflow-x-auto">
              <code>{codeString}</code>
            </pre>
          )}
        </div>
      )}
    </div>
  );
}
