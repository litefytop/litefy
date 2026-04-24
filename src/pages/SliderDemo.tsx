import { Slider } from "@/components";
import { Title } from "@/components";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <Title>{title}</Title>
      <div className="border rounded-lg p-6 space-y-6">{children}</div>
    </section>
  );
}

function SliderDemo() {
  return (
    <div className="flex flex-col gap-12">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Slider</h1>
        <p className="text-muted-foreground mt-2">
          滑块用于在范围内选择数值。
        </p>
      </div>

      <Section title="Basic 基本用法">
        <div className="w-64">
          <Slider defaultValue={50} max={100} />
        </div>
      </Section>
    </div>
  );
}

export default SliderDemo;
