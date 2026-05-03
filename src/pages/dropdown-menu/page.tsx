import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CopyIcon,
  CheckIcon,
  Anchor,
  Title,
  Description,
  ShikiCodeBlock,
  Anatomy,
  Button,
} from "@/component";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent,
} from "@/component";
import { t } from "@/pages/config/i18n";
import { getComponentNav } from "@/pages/config/routes";

import DropdownMenuBasicRaw from "./examples/dropdown-menu-basic.tsx?raw";
import DropdownMenuAlignRaw from "./examples/dropdown-menu-align.tsx?raw";
import DropdownMenuSideRaw from "./examples/dropdown-menu-side.tsx?raw";
import DropdownMenuBasic from "./examples/dropdown-menu-basic";
import DropdownMenuAlign from "./examples/dropdown-menu-align";
import DropdownMenuSide from "./examples/dropdown-menu-side";
import dropdownMenuSrc from "@/component/ui/dropdown-menu.tsx?raw";
import dropdownMenuDoc from "./doc.mdx?raw";

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

export default function DropdownMenuPage({
  locale = "zh",
}: {
  locale?: string;
}) {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const lang = t(locale as "zh" | "en");
  const nav = getComponentNav("/components/dropdown-menu", locale as "zh" | "en");

  const handleCopy = () => {
    navigator.clipboard.writeText(dropdownMenuSrc);
    setCopied(true);
    toast.success(lang.common.copySuccess);
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
            <Title as="h1">{lang["dropdown-menu"].title}</Title>
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
          <Description>{lang["dropdown-menu"].description}</Description>
        </header>

        <section id="installation" className="mb-8 scroll-mt-20">
          <Title as="h2" className="mb-4">
            {lang.installation}
          </Title>
          <ShikiCodeBlock>{dropdownMenuSrc}</ShikiCodeBlock>
        </section>

        <section id="examples" className="scroll-mt-20">
          <Title as="h2">{lang.examples}</Title>

          <DemoSection
            id="basic"
            title={lang["dropdown-menu"].basic.title}
            code={DropdownMenuBasicRaw}
          >
            <DropdownMenuBasic />
          </DemoSection>

          <DemoSection
            id="align"
            title={lang["dropdown-menu"].align.title}
            code={DropdownMenuAlignRaw}
          >
            <DropdownMenuAlign />
          </DemoSection>

          <DemoSection
            id="side"
            title={lang["dropdown-menu"].side.title}
            code={DropdownMenuSideRaw}
          >
            <DropdownMenuSide />
          </DemoSection>
        </section>

        <section id="anatomy" className="mt-8 space-y-4 scroll-mt-20">
          <Title as="h2">{lang.anatomy}</Title>
          <Anatomy
            className="h-32"
            parts={[
              { name: "root", label: lang["dropdown-menu"].anatomy.root },
              {
                name: "trigger",
                label: lang["dropdown-menu"].anatomy.trigger,
              },
              {
                name: "content",
                label: lang["dropdown-menu"].anatomy.content,
              },
            ]}
          >
            <DropdownMenu data-anatomy-name="root">
              <DropdownMenuTrigger data-anatomy-name="trigger" variant="ghost">
                打开菜单
              </DropdownMenuTrigger>
              <DropdownMenuContent data-anatomy-name="content" popover="manual">
                <DropdownMenuItem>选项</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
              {dropdownMenuDoc}
            </ReactMarkdown>
          </section>
        </section>
      </div>

      <aside className="hidden xl:block w-64 border-l bg-card fixed top-14 right-0 h-[calc(100vh-3.5rem)] overflow-y-auto p-4">
        <Anchor>
          <Anchor.Section href="#installation" title={lang.installation} />
          <Anchor.Section href="#examples" title={lang.examples}>
            <Anchor.Item href="#basic">
              {lang["dropdown-menu"].basic.title}
            </Anchor.Item>
            <Anchor.Item href="#align">
              {lang["dropdown-menu"].align.title}
            </Anchor.Item>
          </Anchor.Section>
          <Anchor.Section href="#anatomy" title={lang.anatomy} />
          <Anchor.Section href="#docs" title={lang.docs} />
        </Anchor>
      </aside>
    </div>
  );
}
