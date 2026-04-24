import { Input } from "@/components";
import { Title } from "@/components";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <Title>{title}</Title>
      <div className="border rounded-lg p-6 space-y-6">{children}</div>
    </section>
  );
}

function DemoGrid({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap gap-4 items-center">{children}</div>;
}

function InputDemo() {
  return (
    <div className="flex flex-col gap-12">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Input</h1>
        <p className="text-muted-foreground mt-2">
          输入框用于接收用户输入的文本内容。
        </p>
      </div>

      <Section title="Basic 基本用法">
        <DemoGrid>
          <Input placeholder="Basic input" />
        </DemoGrid>
      </Section>

      <Section title="States 状态">
        <DemoGrid>
          <Input placeholder="Default" />
          <Input invalid placeholder="Invalid" />
          <Input disabled placeholder="Disabled" />
        </DemoGrid>
      </Section>
    </div>
  );
}

export default InputDemo;
