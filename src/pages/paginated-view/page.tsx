import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Title,
  Description,
  ShikiCodeBlock,
  Button,
  Docs,
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

import { PaginatedViewBasic, PaginatedViewPerformance } from "./examples/index";
import PaginatedViewBasicRaw from "./examples/paginated-view-basic.tsx?raw";
import PaginatedViewPerformanceRaw from "./examples/paginated-view-performance.tsx?raw";
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
          props: "itemProps.root",
          type: "DivProps",
          default: "-",
          description: l.api.props.itemPropsRoot,
        },
        {
          props: "itemProps.slide",
          type: "DivProps",
          default: "-",
          description: l.api.props.itemPropsSlide,
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

        <section id="installation" className="mb-8 scroll-mt-20">
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

          <DemoSection
            id="performance"
            title={l.performance.title}
            code={PaginatedViewPerformanceRaw}
          >
            <PaginatedViewPerformance />
          </DemoSection>
        </section>

        <Docs sections={paginatedViewSections} />
      </div>
    </div>
  );
}
