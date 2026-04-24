import { Textarea } from "@/components";
import { Title } from "@/components";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <Title>{title}</Title>
      <div className="border rounded-lg p-6 space-y-6">{children}</div>
    </section>
  );
}

function TextareaDemo() {
  return (
    <div className="flex flex-col gap-12">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Textarea</h1>
        <p className="text-muted-foreground mt-2">
          文本域用于输入多行文本。
        </p>
      </div>

      <Section title="Basic 基本用法">
        <Textarea placeholder="Textarea" />
      </Section>
    </div>
  );
}

export default TextareaDemo;
