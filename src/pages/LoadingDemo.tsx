import { Loading } from "@/components";
import { Title } from "@/components";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <Title>{title}</Title>
      <div className="border rounded-lg p-6 space-y-6">{children}</div>
    </section>
  );
}

function LoadingDemo() {
  return (
    <div className="flex flex-col gap-12">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Loading</h1>
        <p className="text-muted-foreground mt-2">
          加载组件用于显示异步加载状态。
        </p>
      </div>

      <Section title="Basic 基本用法">
        <Loading loading={true}>
          <div>加载内容...</div>
        </Loading>
      </Section>
    </div>
  );
}

export default LoadingDemo;
