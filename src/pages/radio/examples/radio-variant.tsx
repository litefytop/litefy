import { Radio } from "@/component";

export default function RadioVariant() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground mb-2">text (default)</p>
        <Radio.Group defaultValue="a" className="gap-0">
          <Radio value="a" variant="text" className="rounded-l-md rounded-tr-none rounded-br-none border">A</Radio>
          <Radio value="b" variant="text" className="rounded-none border-y">B</Radio>
          <Radio value="c" variant="text" className="rounded-r-md rounded-tl-none rounded-bl-none border">C</Radio>
        </Radio.Group>
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">primary</p>
        <Radio.Group defaultValue="a" className="gap-0">
          <Radio value="a" variant="primary" className="rounded-l-md rounded-tr-none rounded-br-none border">A</Radio>
          <Radio value="b" variant="primary" className="rounded-none border-y">B</Radio>
          <Radio value="c" variant="primary" className="rounded-r-md rounded-tl-none rounded-bl-none border">C</Radio>
        </Radio.Group>
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">secondary</p>
        <Radio.Group defaultValue="a" className="gap-0">
          <Radio value="a" variant="secondary" className="rounded-l-md rounded-tr-none rounded-br-none border">A</Radio>
          <Radio value="b" variant="secondary" className="rounded-none border-y">B</Radio>
          <Radio value="c" variant="secondary" className="rounded-r-md rounded-tl-none rounded-bl-none border">C</Radio>
        </Radio.Group>
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">outlined</p>
        <Radio.Group defaultValue="a" className="gap-0">
          <Radio value="a" variant="outlined" className="rounded-l-md rounded-tr-none rounded-br-none border">A</Radio>
          <Radio value="b" variant="outlined" className="rounded-none border-y">B</Radio>
          <Radio value="c" variant="outlined" className="rounded-r-md rounded-tl-none rounded-bl-none border">C</Radio>
        </Radio.Group>
      </div>
    </div>
  );
}
