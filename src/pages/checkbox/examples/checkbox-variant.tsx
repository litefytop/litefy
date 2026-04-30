import { Checkbox } from "@/components";

export default function CheckboxVariant() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground mb-2">有指示器</p>
        <div className="space-y-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">text</p>
            <Checkbox.Group defaultValue={["a"]} className="gap-0">
              <Checkbox value="a" variant="text" className="rounded-l-md rounded-tr-none rounded-br-none">A</Checkbox>
              <Checkbox value="b" variant="text" className="rounded-none">B</Checkbox>
              <Checkbox value="c" variant="text" className="rounded-r-md rounded-tl-none rounded-bl-none">C</Checkbox>
            </Checkbox.Group>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">primary</p>
            <Checkbox.Group defaultValue={["a"]} className="gap-0">
              <Checkbox value="a" variant="primary" className="rounded-l-md rounded-tr-none rounded-br-none">A</Checkbox>
              <Checkbox value="b" variant="primary" className="rounded-none">B</Checkbox>
              <Checkbox value="c" variant="primary" className="rounded-r-md rounded-tl-none rounded-bl-none">C</Checkbox>
            </Checkbox.Group>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">secondary</p>
            <Checkbox.Group defaultValue={["a"]} className="gap-0">
              <Checkbox value="a" variant="secondary" className="rounded-l-md rounded-tr-none rounded-br-none">A</Checkbox>
              <Checkbox value="b" variant="secondary" className="rounded-none">B</Checkbox>
              <Checkbox value="c" variant="secondary" className="rounded-r-md rounded-tl-none rounded-bl-none">C</Checkbox>
            </Checkbox.Group>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">outlined</p>
            <Checkbox.Group defaultValue={["a"]} className="gap-0">
              <Checkbox value="a" variant="outlined" className="rounded-l-md rounded-tr-none rounded-br-none">A</Checkbox>
              <Checkbox value="b" variant="outlined" className="rounded-none">B</Checkbox>
              <Checkbox value="c" variant="outlined" className="rounded-r-md rounded-tl-none rounded-bl-none">C</Checkbox>
            </Checkbox.Group>
          </div>
        </div>
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">无指示器</p>
        <div className="space-y-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">text</p>
            <Checkbox.Group defaultValue={["a"]} className="gap-0">
              <Checkbox value="a" variant="text" indicator={{ hidden: true }} className="rounded-l-md rounded-tr-none rounded-br-none">A</Checkbox>
              <Checkbox value="b" variant="text" indicator={{ hidden: true }} className="rounded-none">B</Checkbox>
              <Checkbox value="c" variant="text" indicator={{ hidden: true }} className="rounded-r-md rounded-tl-none rounded-bl-none">C</Checkbox>
            </Checkbox.Group>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">primary</p>
            <Checkbox.Group defaultValue={["a"]} className="gap-0">
              <Checkbox value="a" variant="primary" indicator={{ hidden: true }} className="rounded-l-md rounded-tr-none rounded-br-none">A</Checkbox>
              <Checkbox value="b" variant="primary" indicator={{ hidden: true }} className="rounded-none">B</Checkbox>
              <Checkbox value="c" variant="primary" indicator={{ hidden: true }} className="rounded-r-md rounded-tl-none rounded-bl-none">C</Checkbox>
            </Checkbox.Group>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">secondary</p>
            <Checkbox.Group defaultValue={["a"]} className="gap-0">
              <Checkbox value="a" variant="secondary" indicator={{ hidden: true }} className="rounded-l-md rounded-tr-none rounded-br-none">A</Checkbox>
              <Checkbox value="b" variant="secondary" indicator={{ hidden: true }} className="rounded-none">B</Checkbox>
              <Checkbox value="c" variant="secondary" indicator={{ hidden: true }} className="rounded-r-md rounded-tl-none rounded-bl-none">C</Checkbox>
            </Checkbox.Group>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">outlined</p>
            <Checkbox.Group defaultValue={["a"]} className="gap-0">
              <Checkbox value="a" variant="outlined" indicator={{ hidden: true }} className="rounded-l-md rounded-tr-none rounded-br-none">A</Checkbox>
              <Checkbox value="b" variant="outlined" indicator={{ hidden: true }} className="rounded-none">B</Checkbox>
              <Checkbox value="c" variant="outlined" indicator={{ hidden: true }} className="rounded-r-md rounded-tl-none rounded-bl-none">C</Checkbox>
            </Checkbox.Group>
          </div>
        </div>
      </div>
    </div>
  );
}
