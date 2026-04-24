import { Button } from "@/components";
import { Input } from "@/components";
import { Checkbox } from "@/components";
import { Slider } from "@/components";
import { Textarea } from "@/components";
import { Select } from "@/components";
import { Title } from "@/components";
import { Loading } from "@/components";
import { Empty } from "@/components";
import { Skeleton } from "@/components";
import { Separator } from "@/components";

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

function Home() {
  return (
    <div className="flex flex-col gap-12 max-w-4xl mx-auto py-12 px-6">
      <div>
        <h1 className="text-4xl font-bold">Plain UI</h1>
        <p className="text-lg text-muted-foreground mt-4 max-w-2xl">
          Plain 是一套轻量化、高复用、低侵入的基础UI原子组件，主打简约无过多预设样式，保留原生布局特性，兼顾通用性与定制灵活性。
        </p>
        <p className="text-muted-foreground mt-4">无冗余样式嵌套、体积轻量，支持按需引入与样式覆写，适配移动端/中后台多场景，可快速结合Tailwind、自定义主题扩展，满足业务快速迭代与个性化视觉改造需求。</p>
      </div>

      <Section title="Button 按钮">
        <DemoGrid>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
          <Button loading={{ loading: true }}>Loading</Button>
        </DemoGrid>
      </Section>

      <Section title="Input 输入框">
        <DemoGrid>
          <Input placeholder="Basic input" />
          <Input invalid placeholder="Invalid input" />
          <Input disabled placeholder="Disabled input" />
        </DemoGrid>
      </Section>

      <Section title="Textarea 文本域">
        <Textarea placeholder="Textarea" />
      </Section>

      <Section title="Checkbox 复选框">
        <DemoGrid>
          <Checkbox.Group>
            <Checkbox value="remember">记住我</Checkbox>
            <Checkbox value="checked" disabled>已选中</Checkbox>
            <Checkbox value="disabled" disabled>禁用</Checkbox>
          </Checkbox.Group>
        </DemoGrid>
      </Section>

      <Section title="Slider 滑块">
        <div className="w-64">
          <Slider defaultValue={50} max={100} />
        </div>
      </Section>

      <Section title="Select 选择器">
        <div className="w-64">
          <Select placeholder="Select...">
            <Select.Option label="选项 A" value="a" />
            <Select.Option label="选项 B" value="b" />
            <Select.Option label="选项 C" value="c" />
          </Select>
        </div>
      </Section>

      <Section title="Loading 加载">
        <Loading loading={true}>
          <div>加载内容...</div>
        </Loading>
      </Section>

      <Section title="Empty 空状态">
        <Empty />
      </Section>

      <Section title="Skeleton 骨架屏">
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </Section>

      <Section title="Separator 分割线">
        <DemoGrid>
          <div className="w-32">内容一</div>
          <Separator />
          <div className="w-32">内容二</div>
        </DemoGrid>
      </Section>
    </div>
  );
}

export default Home;
