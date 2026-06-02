import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Title,
  Description,
  ShikiCodeBlock,
  Button,
  APITable,
} from "@/component";
import { Toaster } from "@/component/ui/toast";
import { t } from "@/pages/config/i18n";
import { getComponentNav } from "@/pages/config/routes";
import {
  CheckIcon,
  CopyIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "lucide-react";

import { PaginatedViewBasic } from "./examples/index";
import PaginatedViewBasicRaw from "./examples/paginated-view-basic.tsx?raw";

import paginatedViewDoc from "./doc.mdx?raw";
import paginatedViewSrc from "@/component/ui/paginated-view.tsx?raw";

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

export default function PaginatedViewPage({ locale = "zh" }: { locale?: string }) {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const lang = t(locale as "zh" | "en");
  const l = lang.paginatedView;
  const nav = getComponentNav("/components/paginated-view", locale as "zh" | "en");

  const paginatedViewSections = [
    {
      title: l.api.sectionTitles.paginatedViewProps,
      data: [
        {
          props: "activeIndex",
          type: "number",
          default: "-",
          description: l.api.props.activeIndex,
        },
        {
          props: "performanceThreshold",
          type: "number",
          default: "100",
          description: l.api.props.performanceThreshold,
        },
        {
          props: "className",
          type: "ClassNameValue",
          default: "-",
          description: lang.common.className,
        },
        {
          props: "slotProps.root",
          type: "DivProps",
          default: "-",
          description: l.api.props.slotPropsRoot,
        },
        {
          props: "slotProps.slide",
          type: "DivProps",
          default: "-",
          description: l.api.props.slotPropsSlide,
        },
      ],
    },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(paginatedViewDoc);
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

        <section id="installation" className="mb-8 ">
          <Title as="h2" className="mb-4">
            {lang.installation}
          </Title>
          <ShikiCodeBlock>{paginatedViewSrc}</ShikiCodeBlock>
        </section>

        <section id="examples">
          <Title as="h2">{lang.examples}</Title>

          <DemoSection
            id="basic"
            title={l.basic.title}
            code={PaginatedViewBasicRaw}
          >
            <PaginatedViewBasic />
          </DemoSection>

      
        </section>

        <section id="docs" className="mt-12 space-y-8">
          <Title as="h2" className="mb-4">
            {lang.docs}
          </Title>
          <APITable sections={paginatedViewSections} />
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
    </div>
  );
}
