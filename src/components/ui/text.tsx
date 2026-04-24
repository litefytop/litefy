"use client";

import { cn, ClassNameValue } from "@/lib";
import { useState } from "react";

type TextVariant = "p" | "span" | "strong" | "em" | "small" | "code" | "del" | "ins" | "blockquote";

const textStyles: Record<TextVariant, string> = {
  p: "text-sm leading-7",
  span: "text-sm",
  strong: "font-semibold",
  em: "italic",
  small: "text-sm text-muted-foreground",
  code: "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
  del: "line-through text-muted-foreground",
  ins: "underline text-muted-foreground",
  blockquote: "border-l-2 pl-6 italic text-muted-foreground",
};

const CopyIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="size-3"
  >
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </svg>
);

const CopiedIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="size-3"
  >
    <path d="m12 15 2 2 4-4" />
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </svg>
);

export type TextCopyConfig = {
  copyable?: boolean;
  copyButton?: React.ReactNode;
  copiedButton?: React.ReactNode;
  className?: ClassNameValue;
};

export type TextProps = {
  as?: TextVariant;
  className?: ClassNameValue;
  copy?: TextCopyConfig;
} & React.HTMLAttributes<HTMLElement>;

export function Text({ as: Component = "p", className, copy, children, ...props }: TextProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (typeof children === "string") {
      await navigator.clipboard.writeText(children);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Component {...props} className={cn(textStyles[Component], className)}>
      {children}
      {copy?.copyable && typeof children === "string" && (
        <button
          type="button"
          onClick={handleCopy}
          className={cn("ml-2 text-xs text-muted-foreground hover:text-foreground", copy.className)}
        >
          {copied ? copy.copiedButton ?? <CopiedIcon /> : copy.copyButton ?? <CopyIcon />}
        </button>
      )}
    </Component>
  );
}
