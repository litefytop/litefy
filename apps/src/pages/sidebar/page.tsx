import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Anchor,
  Title,
  Description,
  ShikiCodeBlock,
  Button,
  APITable,
} from "@/component";
import { Toaster } from "@/component/ui/toast";
import { t } from "@/pages/config/i18n";
import { getComponentNav } from "@/pages/config/routes";
import { SidebarBasic } from "./examples";
import {
  CheckIcon,
  CopyIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "lucide-react";

import SidebarBasicRaw from "./examples/sidebar-basic.tsx?raw";
import sidebarDoc from "@/docs/sidebar.md?raw";
import sidebarSrc from "@/component/ui/sidebar.tsx?raw";

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
    <section id={id} className="space-y-4 py-4">
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

export default function SidebarPage({ locale = "zh" }: { locale?: string }) {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const lang = t(locale as "zh" | "en");
  const l = lang.sidebar;
  const nav = getComponentNav("/components/sidebar", locale as "zh" | "en");

  const sidebarSections = [
    {
      title: l.api.sectionTitles.sidebarProps,
      data: [
        {
          props: "defaultOpen",
          type: "boolean",
          default: "true",
          description: l.api.props.defaultOpen,
        },
        {
          props: "className",
          type: "ClassNameValue",
          description: lang.common.className,
        },
        {
          props: "children",
          type: "ReactNode",
          description: l.api.props.children,
        },
        {
          props: "ref",
          type: "Ref<SidebarHandle>",
          description: l.api.props.ref,
        },
      ],
    },
    {
      title: l.api.sectionTitles.sidebarHandle,
      data: [
        {
          props: "toggle",
          type: "() => void",
          description: l.api.handle.toggle,
        },
        {
          props: "open",
          type: "() => void",
          description: l.api.handle.open,
        },
        {
          props: "close",
          type: "() => void",
          description: l.api.handle.close,
        },
        {
          props: "isOpen",
          type: "boolean",
          description: l.api.handle.isOpen,
        },
      ],
    },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(sidebarDoc);
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
              <Button variant="ghost" onClick={handlePrev} disabled={!nav.prev} iconOnly>
                <ArrowLeftIcon className="size-4" />
              </Button>
              <Button variant="ghost" onClick={handleNext} disabled={!nav.next} iconOnly>
                <ArrowRightIcon className="size-4" />
              </Button>
            </div>
          </div>
          <Description>{l.description}</Description>
        </header>

        <section className="mb-8">
          <Title as="h2" id="installation" className="mb-4">
            {lang.installation}
          </Title>
          <ShikiCodeBlock>{sidebarSrc}</ShikiCodeBlock>
        </section>

        <section>
          <Title as="h2" id="examples">{lang.examples}</Title>

          <DemoSection
            id="basic"
            title={l.basic.title}
            code={SidebarBasicRaw}
          >
            <SidebarBasic />
          </DemoSection>
        </section>

        <section className="mt-12 space-y-8">
          <Title as="h2" id="api" className="mb-4">
            {lang.api}
          </Title>
          <APITable sections={sidebarSections} />
        </section>
        
        <footer className="py-8 border-t mt-8">
          <div className="flex justify-between">
            <Button
              variant="ghost"
              onClick={handlePrev}
              disabled={!nav.prev}
              className={nav.prev ? "" : "invisible"}
            >
              <ArrowLeftIcon className="size-4 mr-2" />
              {nav.prev?.title}
            </Button>
            <Button
              variant="ghost"
              onClick={handleNext}
              disabled={!nav.next}
              className={nav.next ? "" : "invisible"}
            >
              {nav.next?.title}
              <ArrowRightIcon className="size-4 ml-2" />
            </Button>
          </div>
        </footer>
      </div>

      <aside className="hidden xl:block w-64 border-l bg-card fixed top-14 right-0 h-full overflow-y-auto p-4">
        <Anchor>
          <Anchor.Section href="#installation" linkText={lang.installation} />
          <Anchor.Section href="#examples" linkText={lang.examples}>
            <Anchor.Item href="#basic">{l.basic.title}</Anchor.Item>
          </Anchor.Section>
          <Anchor.Section href="#api" linkText={lang.api} />
        </Anchor>
      </aside>
    </div>
  );
}
