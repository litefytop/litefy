import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CopyIcon,
  CheckIcon,
  Anchor,
  Title,
  Description,
  Password,
  ShikiCodeBlock,
  Anatomy,
  Button,
  Docs,
} from "@/component";
import { Toaster } from "@/component/ui/toast";
import { t } from "@/pages/config/i18n";
import { getComponentNav } from "@/pages/config/routes";
import { PasswordBasic } from "./examples";

import PasswordBasicRaw from "./examples/password-basic.tsx?raw";
import passwordDoc from "./doc.mdx?raw";
import passwordSrc from "@/component/ui/password.tsx?raw";

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

export default function PasswordPage({ locale = "zh" }: { locale?: string }) {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const lang = t(locale as "zh" | "en");
  const l = lang.password;
  const nav = getComponentNav("/components/password", locale as "zh" | "en");

  const passwordSections = [
    {
      title: l.api.sectionTitles.passwordProps,
      columns: [
        { key: "prop", header: l.api.headers.prop },
        { key: "type", header: l.api.headers.type },
        { key: "default", header: l.api.headers.default },
        { key: "description", header: l.api.headers.description },
      ],
      data: [
        {
          props: "value",
          type: "string",
          default: "-",
          description: l.api.props.value,
        },
        {
          props: "defaultValue",
          type: "string",
          default: "-",
          description: l.api.props.defaultValue,
        },
        {
          props: "onChange",
          type: "(value: string) => void",
          default: "-",
          description: l.api.props.onChange,
        },
        {
          props: "placeholder",
          type: "string",
          default: "-",
          description: l.api.props.placeholder,
        },
        {
          props: "disabled",
          type: "boolean",
          default: "false",
          description: l.api.props.disabled,
        },
        {
          props: "className",
          type: "ClassNameValue",
          default: "-",
          description: l.api.props.className,
        },
        {
          props: "itemProps",
          type: "PasswordItemProps",
          default: "-",
          description: l.api.props.itemProps,
        },
      ],
    },
    {
      title: l.api.sectionTitles.itemPropsConfig,
      columns: [
        { key: "property", header: l.api.headers.property },
        { key: "description", header: l.api.headers.description },
      ],
      data: [
        {
          props: "root",
          description: l.api.itemPropsConfig.root,
        },
        {
          props: "input",
          description: l.api.itemPropsConfig.input,
        },
        {
          props: "toggle",
          description: l.api.itemPropsConfig.toggle,
        },
      ],
    },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(passwordDoc);
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
          <ShikiCodeBlock>{passwordSrc}</ShikiCodeBlock>
        </section>

        <section id="examples" className="">
          <Title as="h2">{lang.examples}</Title>

          <DemoSection
            id="basic"
            title={l.basic.title}
            code={PasswordBasicRaw}
          >
            <PasswordBasic />
          </DemoSection>
        </section>

        <section id="anatomy" className="mt-8 space-y-4">
          <Title as="h2">{lang.anatomy}</Title>
          <Anatomy
            className="h-32"
            parts={[
              { name: "root", label: l.anatomy.root },
              { name: "input", label: l.anatomy.input },
              { name: "toggle", label: l.anatomy.toggle },
            ]}
          >
            <Password
            data-anatomy-name="input"
              placeholder="请输入密码"
              itemProps={{
                root: { "data-anatomy-name": "root" },
                toggle: { "data-anatomy-name": "toggle" },
              }}
            />
          </Anatomy>
        </section>

        <section id="docs" data-anchor-id="docs" className="mt-12 space-y-8">
          <Title as="h2" className="mb-4">
            {lang.docs}
          </Title>
          <Docs sections={passwordSections} />
        </section>
      </div>

      <aside className="hidden xl:block w-64 border-l bg-card fixed top-14 right-0 h-[calc(100vh-3.5rem)] overflow-y-auto p-4">
        <Anchor>
          <Anchor.Section href="#installation" title={lang.installation} />
          <Anchor.Section href="#examples" title={lang.examples}>
            <Anchor.Item href="#basic">{l.basic.title}</Anchor.Item>
          </Anchor.Section>
          <Anchor.Section href="#anatomy" title={lang.anatomy} />
          <Anchor.Section href="#docs" title={lang.docs} />
        </Anchor>
      </aside>
    </div>
  );
}
