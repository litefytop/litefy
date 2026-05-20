import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Anchor,
  Title,
  Description,
  ShikiCodeBlock,
  Button,
  Docs,
} from "@/component";
import { Toaster } from "@/component/ui/toast";
import { t } from "@/pages";
import { getComponentNav } from "@/pages/config/routes";
import { CheckIcon, CopyIcon, ArrowLeftIcon, ArrowRightIcon } from "lucide-react";

import { DialogBasic } from "./examples";

import BasicRaw from "./examples/dialog-basic.tsx?raw";
import componentDoc from "./doc.mdx?raw";
import componentSrc from "@/component/ui/dialog.tsx?raw";

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
    <section id={id} data-anchor-id={id} className="space-y-4 py-4">
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

export default function DialogPage({ locale = "zh" }: { locale?: string }) {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const lang = t(locale as "zh" | "en");
  const l = lang.dialog;
  const nav = getComponentNav("/components/dialog", locale as "zh" | "en");

  const handleCopy = () => {
    navigator.clipboard.writeText(componentDoc);
    setCopied(true);
    Toaster.success({ title: lang.common.copySuccess });
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrev = () => {
    if (nav.prev) navigate(`/${locale}${nav.prev.href}`);
  };

  const handleNext = () => {
    if (nav.next) navigate(`/${locale}${nav.next.href}`);
  };

  const sections = [
    {
      title: l.api.sectionTitles.dialogProps,

      data: [
        {
          props: "className",
          type: "ClassNameValue",
          description: lang.common.className,
        },
      ],
    },
  ];

  return (
    <div className="flex">
      <div className="flex-1 w-full">
        <header className="pb-4 mb-4 border-b space-y-3">
          <div className="flex items-center justify-between">
            <Title as="h1">{l.title}</Title>
            <div className="flex items-center gap-2">
              <Button onClick={handleCopy} variant="ghost">
                {copied ? (
                  <CheckIcon className="size-4 text-green-500 mr-1" />
                ) : (
                  <CopyIcon className="size-4 mr-1" />
                )}
                {lang.common.copyDocs}
              </Button>
              <Button variant="ghost" onClick={handlePrev} disabled={!nav.prev}>
                <ArrowLeftIcon className="size-4" />
              </Button>
              <Button variant="ghost" onClick={handleNext} disabled={!nav.next}>
                <ArrowRightIcon className="size-4" />
              </Button>
            </div>
          </div>
          <Description>{l.description}</Description>
        </header>

        <section id="installation" className="mb-8 scroll-mt-20">
          <Title as="h2" className="mb-4">
            {lang.installation}
          </Title>
          <ShikiCodeBlock>{componentSrc}</ShikiCodeBlock>
        </section>

        <section id="examples" className="">
          <Title as="h2">{lang.examples}</Title>

          <DemoSection
            id="basic"
            title={l.basic.title}
            code={BasicRaw}
          >
            <DialogBasic />
          </DemoSection>
        </section>

        <section id="docs" data-anchor-id="docs" className="mt-12 space-y-8">
          <Title as="h2" className="mb-4">
            {lang.docs}
          </Title>
          <Docs sections={sections} />
        </section>
      </div>

      <aside className="hidden xl:block w-64 border-l bg-card fixed top-14 right-0 h-full overflow-y-auto p-4">
        <Anchor>
          <Anchor.Section href="#installation" linkText={lang.installation} />
          <Anchor.Section href="#examples" linkText={lang.examples}>
            <Anchor.Item href="#basic">{l.basic.title}</Anchor.Item>
          </Anchor.Section>
          <Anchor.Section href="#docs" linkText={lang.docs} />
        </Anchor>
      </aside>
    </div>
  );
}
