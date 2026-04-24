import { Separator } from "@/components";
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

function SeparatorDemo() {
  return (
    <div className="flex flex-col gap-12">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Separator</h1>
        <p className="text-muted-foreground mt-2">
          分割线用于分隔内容。
        </p>
      </div>

      <Section title="Basic 基本用法">
        <DemoGrid>
          <div className="w-32">内容一</div>
          <Separator />
          <div className="w-32">内容二</div>
        </DemoGrid>
      </Section>
    </div>
  );
}

export default SeparatorDemo;
