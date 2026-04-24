import { Empty } from "@/components";
import { Title } from "@/components";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <Title>{title}</Title>
      <div className="border rounded-lg p-6 space-y-6">{children}</div>
    </section>
  );
}

function EmptyDemo() {
  return (
    <div className="flex flex-col gap-12">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Empty</h1>
        <p className="text-muted-foreground mt-2">
          空状态组件用于显示没有数据时的占位内容。
        </p>
      </div>

      <Section title="Basic 基本用法">
        <Empty />
      </Section>
    </div>
  );
}

export default EmptyDemo;
