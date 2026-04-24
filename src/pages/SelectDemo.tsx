import { Select } from "@/components";
import { Title } from "@/components";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <Title>{title}</Title>
      <div className="border rounded-lg p-6 space-y-6">{children}</div>
    </section>
  );
}

function SelectDemo() {
  return (
    <div className="flex flex-col gap-12">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Select</h1>
        <p className="text-muted-foreground mt-2">
          选择器用于从预定义选项中选择。
        </p>
      </div>

      <Section title="Basic 基本用法">
        <div className="w-64">
          <Select placeholder="Select...">
            <Select.Option label="选项 A" value="a" />
            <Select.Option label="选项 B" value="b" />
            <Select.Option label="选项 C" value="c" />
          </Select>
        </div>
      </Section>
    </div>
  );
}

export default SelectDemo;
