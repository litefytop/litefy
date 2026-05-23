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
import { t } from "@/pages/config/i18n";
import { getComponentNav } from "@/pages/config/routes";
import { CheckIcon, CopyIcon, ArrowLeftIcon, ArrowRightIcon } from "lucide-react";

import { ImageBasic, ImageSkeleton, ImageFailure, ImageProgressive } from "./examples";
import ImageBasicRaw from "./examples/image-basic.tsx?raw";
import ImageSkeletonRaw from "./examples/image-skeleton.tsx?raw";
import ImageFailureRaw from "./examples/image-failure.tsx?raw";
import ImageProgressiveRaw from "./examples/image-progressive.tsx?raw";
import imageDoc from "./doc.mdx?raw";
import imageSrc from "@/component/ui/image.tsx?raw";

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

export default function ImagePage({ locale = "zh" }: { locale?: string }) {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const lang = t(locale as "zh" | "en");
  const l = lang.image;
  const nav = getComponentNav("/components/image", locale as "zh" | "en");

  const imageSections = [
    {
      title: l.api.sectionTitles.imageProps,
      columns: [
        { key: "prop", header: lang.common.prop },
        { key: "type", header: lang.common.type },
        { key: "default", header: lang.common.default },
        { key: "description", header: lang.common.description },
      ],
      data: [
        {
          props: "src",
          type: "string",
          default: "-",
          description: l.api.props.src,
        },
        {
          props: "alt",
          type: "string",
          default: '""',
          description: l.api.props.alt,
        },
        {
          props: "className",
          type: "ClassNameValue",
          default: "-",
          description: l.api.props.className,
        },
        {
          props: "loading",
          type: "ReactNode",
          default: "Skeleton",
          description: l.api.props.loading,
        },
        {
          props: "failure",
          type: "ReactNode",
          default: '"加载失败"',
          description: l.api.props.failure,
        },
      ],
    },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(imageDoc);
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
          <ShikiCodeBlock>{imageSrc}</ShikiCodeBlock>
        </section>

        <section id="examples" className="">
          <Title as="h2">{lang.examples}</Title>

          <DemoSection
            id="basic"
            title={l.basic.title}
            code={ImageBasicRaw}
          >
            <ImageBasic />
          </DemoSection>

          <DemoSection
            id="loading"
            title={l.loading.title}
            code={ImageSkeletonRaw}
          >
            <ImageSkeleton />
          </DemoSection>

          <DemoSection
            id="failure"
            title={l.failure.title}
            code={ImageFailureRaw}
          >
            <ImageFailure />
          </DemoSection>

          <DemoSection
            id="progressive"
            title="渐进式加载"
            code={ImageProgressiveRaw}
          >
            <ImageProgressive />
          </DemoSection>
        </section>

        <section id="docs" data-anchor-id="docs" className="mt-12 space-y-8">
          <Title as="h2" className="mb-4">
            {lang.docs}
          </Title>
          <Docs sections={imageSections} />
        </section>
      </div>

      <aside className="hidden xl:block w-64 border-l bg-card fixed top-14 right-0 h-full overflow-y-auto p-4">
        <Anchor>
          <Anchor.Section href="#installation" linkText={lang.installation} />
          <Anchor.Section href="#examples" linkText={lang.examples}>
            <Anchor.Item href="#basic">{l.basic.title}</Anchor.Item>
            <Anchor.Item href="#loading">{l.loading.title}</Anchor.Item>
            <Anchor.Item href="#failure">{l.failure.title}</Anchor.Item>
            <Anchor.Item href="#progressive">渐进式加载</Anchor.Item>
          </Anchor.Section>
          <Anchor.Section href="#docs" linkText={lang.docs} />
        </Anchor>
      </aside>
    </div>
  );
}
