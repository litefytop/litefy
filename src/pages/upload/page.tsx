import { useState } from "react";
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
import {
  UploadBasic,

  UploadMultiple,
  UploadDisabled,
} from "./examples";
import { CheckIcon, CopyIcon, ArrowLeftIcon, ArrowRightIcon } from "lucide-react";

import UploadBasicRaw from "./examples/upload-basic.tsx?raw";
import UploadMultipleRaw from "./examples/upload-multiple.tsx?raw";
import UploadDisabledRaw from "./examples/upload-disabled.tsx?raw";
import uploadSrc from "@/component/ui/upload.tsx?raw";

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

export default function UploadPage({ locale = "zh" }: { locale?: string }) {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const lang = t(locale as "zh" | "en");
  const l = lang["upload"];
  const nav = getComponentNav("/components/upload", locale as "zh" | "en");

  const uploadSections = [
    {
      title: l.api.sectionTitles.uploadProps,

      data: [
        {
          props: "label",
          type: "ReactNode",
          description: l.api.props.label,
        },
        {
          props: "description",
          type: "ReactNode",
          description: l.api.props.description,
        },
        {
          props: "invalid",
          type: "string",
          description: l.api.props.invalid,
        },
        {
          props: "disabled",
          type: "boolean",
          default: "false",
          description: l.api.props.disabled,
        },
        {
          props: "accept",
          type: "string",
          description: l.api.props.accept,
        },
        {
          props: "onChange",
          type: "(e: ChangeEvent<HTMLInputElement>) => void | { invalid?: string }",
          description: l.api.props.onChange,
        },
        {
          props: "slotProps",
          type: "UploadItemProps",
          description: l.api.props.slotProps,
        },
      ],
    },
    {
      title: l.api.sectionTitles.slotPropsConfig,

      data: [
        {
          props: "root",
          type: `React.ComponentProps<"div">`,
          description: l.api.slotPropsConfig.root,
        },
        {
          props: "label",
          type: `React.ComponentProps<"label">`,
          description: l.api.slotPropsConfig.label,
        },
        {
          props: "description",
          type: `React.ComponentProps<"small">`,
          description: l.api.slotPropsConfig.description,
        },
        {
          props: "invalid",
          type: `React.ComponentProps<"small">`,
          description: l.api.slotPropsConfig.invalid,
        },
      ],
    },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(uploadSrc);
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
          <ShikiCodeBlock>{uploadSrc}</ShikiCodeBlock>
        </section>

        <section id="examples" >
          <Title as="h2">{lang.examples}</Title>

          <DemoSection
            id="basic"
            title={l.basic.title}
            code={UploadBasicRaw}
          >
            <UploadBasic />
          </DemoSection>



          <DemoSection
            id="multiple"
            title={l.multiple.title}
            code={UploadMultipleRaw}
          >
            <UploadMultiple />
          </DemoSection>

          <DemoSection
            id="disabled"
            title={l.disabled.title}
            code={UploadDisabledRaw}
          >
            <UploadDisabled />
          </DemoSection>
        </section>


        <section id="docs" className="mt-12 space-y-8">
          <Title as="h2" className="mb-4">
            {lang.docs}
          </Title>
          <APITable sections={uploadSections} />
        </section>
      </div>

      <aside className="hidden xl:block w-64 border-l bg-card fixed top-14 right-0 h-full overflow-y-auto p-4">
        <Anchor>
          <Anchor.Section href="#installation" linkText={lang.installation} />
          <Anchor.Section href="#examples" linkText={lang.examples}>
            <Anchor.Item href="#basic">{l.basic.title}</Anchor.Item>
            <Anchor.Item href="#multiple">{l.multiple.title}</Anchor.Item>
            <Anchor.Item href="#disabled">{l.disabled.title}</Anchor.Item>
          </Anchor.Section>
          <Anchor.Section href="#anatomy" linkText={lang.anatomy} />
          <Anchor.Section href="#docs" linkText={lang.docs}/>
        </Anchor>
      </aside>
    </div>
  );
}
