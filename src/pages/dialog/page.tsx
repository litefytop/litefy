import React from "react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CopyIcon,
  CheckIcon,
  Anchor,
  Title,
  Description,
  ShikiCodeBlock,
  Button,
  Docs,
  Toaster
} from "@/component";
import { t } from "@/pages";

import BasicRaw from "./examples/dialog-basic.tsx?raw";
import WithTriggerRaw from "./examples/dialog-with-trigger.tsx?raw";
import WithCloseRaw from "./examples/dialog-with-close.tsx?raw";
import componentDoc from "./doc.mdx?raw";
import componentSrc from "@/component/ui/dialog.tsx?raw";

import { DialogBasic, DialogWithTrigger, DialogWithClose } from "./examples";

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
      className="space-y-4 py-4"
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

export default function DialogPage({ locale = "zh" }: { locale?: string }) {
  const lang = t(locale as "zh" | "en");
  const l = lang.dialog;
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(componentDoc);
    setCopied(true);
    Toaster.success({ title: lang.common.copySuccess });
    setTimeout(() => setCopied(false), 2000);
  };

  const sections = [
    {
      title: l.api.sectionTitles.dialogProps,

      data: [
        {
          props: "children",
          type: "React.ReactNode",
          
          description: l.api.props.children,
        },
      ],
    },
    {
      title: l.api.sectionTitles.contentProps,

      data: [

        {
          props: "children",
          type: "React.ReactNode",
          
          description: l.api.props.children,
        },
        {
          props: "showCloseButton",
          type: "boolean",
          default: "true",
          description: l.api.props.showCloseButton,
        },
      ],
    },
    {
      title: l.api.sectionTitles.triggerProps,

      data: [

        {
          props: "children",
          type: "React.ReactNode",
          
          description: l.api.props.children,
        },
      ],
    },
    {
      title: l.api.sectionTitles.closeProps,

      data: [

        {
          props: "children",
          type: "React.ReactNode",
          
          description: l.api.props.children,
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
              <Button variant="ghost">
                <ArrowLeftIcon className="size-4" />
              </Button>
              <Button variant="ghost">
                <ArrowRightIcon className="size-4" />
              </Button>
            </div>
          </div>
          <Description>{l.description}</Description>
        </header>

        <section id="installation" className="mb-8 scroll-mt-30">
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

          <DemoSection
            id="with-trigger"
            title={l.withTrigger.title}
            code={WithTriggerRaw}
          >
            <DialogWithTrigger />
          </DemoSection>

          <DemoSection
            id="with-close"
            title={l.withClose.title}
            code={WithCloseRaw}
          >
            <DialogWithClose />
          </DemoSection>
        </section>


        <section id="docs" data-anchor-id="docs" className="mt-12 space-y-8">
          <Title as="h2" className="mb-4">
            {lang.docs}
          </Title>
          <Docs sections={sections} />
        </section>
      </div>

      <aside className="hidden xl:block w-64 border-l bg-card fixed top-14 right-0 h-[calc(100vh-3.5rem)] overflow-y-auto p-4">
        <Anchor>
          <Anchor.Section href="#installation" linkText={lang.installation} />
          <Anchor.Section href="#examples" linkText={lang.examples}>
            <Anchor.Item href="#basic">{l.basic.title}</Anchor.Item>
            <Anchor.Item href="#with-trigger">{l.withTrigger.title}</Anchor.Item>
            <Anchor.Item href="#with-close">{l.withClose.title}</Anchor.Item>
          </Anchor.Section>
          <Anchor.Section href="#docs" linkText={lang.docs} />
        </Anchor>
      </aside>
    </div>
  );
}
