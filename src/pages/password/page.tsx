import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CopyIcon, CheckIcon } from "@/components/ui/icons";
import { toast } from "sonner";
import { Anchor, Title, Description, Password } from "@/components";
import { Anatomy } from "@/pages/component/anatomy";
import { ShikiCodeBlock } from "@/pages/component/shiki-code-block";
import { t } from "@/pages/i18n";
import { PasswordBasic } from "./examples";

import PasswordBasicRaw from "./examples/password-basic.tsx?raw";
import passwordDoc from "./doc.mdx?raw";
import passwordSrc from "@/components/ui/password.tsx?raw";



function DemoSection({
  id,
  title,
  children,
  code,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
  code: string;
}) {
  return (
    <section
      id={id}
      data-anchor-id={id}
      className="space-y-4 scroll-mt-20 py-4"
    >
      <div>
        <Title as="h3">{title}</Title>
      </div>
      <div className="border rounded-lg p-6 w-full overflow-x-auto">
        {children}
      </div>
      <ShikiCodeBlock>{code}</ShikiCodeBlock>
    </section>
  );
}

export default function PasswordPage({ locale = "zh" }: { locale?: string }) {
  const lang = t(locale as "zh" | "en");
  const l = lang.password;
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(passwordDoc);
    setCopied(true);
    toast.success(lang.common.copySuccess);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex">
      <div className="flex-1 w-full">
        <header className="pb-4 mb-4 border-b">
          <Title as="h1">{l.title}</Title>
          <Description>{l.description}</Description>
        </header>

        <section id="installation" className="mb-8 scroll-mt-20">
          <Title as="h2" className="mb-4">
            {lang.installation}
          </Title>
          <ShikiCodeBlock>{passwordSrc}</ShikiCodeBlock>
        </section>

        <section id="examples" className="scroll-mt-20">
          <Title as="h2">{lang.examples}</Title>

          <DemoSection
            id="basic"
            title={l.basic.title}
            code={PasswordBasicRaw}
          >
            <PasswordBasic />
          </DemoSection>
        </section>

        <section id="anatomy" className="mt-8 space-y-4 scroll-mt-20">
          <Title as="h2">{lang.anatomy}</Title>
          <Anatomy
            className="h-32"
            parts={[
              { id: "anatomy-root", label: l.anatomy.root },
              { id: "anatomy-input", label: l.anatomy.input },
              { id: "anatomy-toggle", label: l.anatomy.toggle },
            ]}
          >
            <Password
              placeholder="请输入密码"
              id="anatomy-input"
              itemProps={{
                root: { id: "anatomy-root" },
                toggle: { id: "anatomy-toggle" },
              }}
            />
          </Anatomy>
        </section>

        <section
          id="docs"
          data-anchor-id="docs"
          className="mt-12 space-y-4 scroll-mt-20"
        >
          <Title as="h2" className="mb-4">
            {lang.docs}
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-md hover:bg-muted transition-colors"
              aria-label={lang.common.copy}
            >
              {copied ? (
                <CheckIcon className="size-4 text-green-500" />
              ) : (
                <CopyIcon className="size-4" />
              )}
            </button>
          </Title>
          <section
            id="css-classes"
            data-anchor-id="css-classes"
            className="space-y-4 scroll-mt-20 prose dark:prose-invert max-w-none"
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {passwordDoc}
            </ReactMarkdown>
          </section>
        </section>
      </div>

      <aside className="hidden xl:block w-64 border-l bg-card fixed top-14 right-0 h-[calc(100vh-3.5rem)] overflow-y-auto p-4">
        <Anchor>
          <Anchor.Section id="installation" title={lang.installation} />
          <Anchor.Section id="examples" title={lang.examples}>
            <Anchor.Item id="#basic">{l.basic.title}</Anchor.Item>
          </Anchor.Section>
          <Anchor.Section id="anatomy" title={lang.anatomy} />
          <Anchor.Section id="docs" title={lang.docs} />
        </Anchor>
      </aside>
    </div>
  );
}
