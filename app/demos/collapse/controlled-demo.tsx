"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Collapse } from "@/ui/collapse";

export default function CollapseControlledDemo() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const codeSnippets = [
    {
      title: "State Hook",
      code: `const [state, setState] = useState(0);`,
    },
    {
      title: "Effect Hook",
      code: `useEffect(() => {
  console.log('Mounted');
}, []);`,
    },
  ];

  const handleCopy = (index: number, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-2">
      {codeSnippets.map((snippet, index) => (
        <Collapse
          key={snippet.title}
          className="w-md"
          open={openIndex === index}
          onValueChange={(open) => setOpenIndex(open ? index : null)}
        >
          <Collapse.Header>
            <Collapse.Trigger>{snippet.title}</Collapse.Trigger>
            <Collapse.Action onClick={() => handleCopy(index, snippet.code)}>
              {copiedIndex === index ? (
                <Check className="size-4" />
              ) : (
                <Copy className="size-4" />
              )}
            </Collapse.Action>
          </Collapse.Header>
          <Collapse.Panel className="p-4">
            <pre className="p-4 bg-muted rounded-md overflow-x-auto">
              <code className="text-sm font-mono">{snippet.code}</code>
            </pre>
          </Collapse.Panel>
        </Collapse>
      ))}
    </div>
  );
}
