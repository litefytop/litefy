import { Checkbox } from "@/component";

export default function CheckboxVariant() {
  return (

      <Checkbox.Group defaultValue={["a"]} className="gap-0 w-full items-center justify-center">
        <Checkbox
          value="a"
          variant="toggle"
          indicator={{ hidden: true }}
          className="rounded-l-full rounded-tr-none rounded-br-none"
        >
          toggle A
        </Checkbox>
        <Checkbox
          value="b"
          variant="toggle"
          indicator={{ hidden: true }}
          className="rounded-none"
        >
          toggle B
        </Checkbox>
        <Checkbox
          value="c"
          variant="toggle"
          indicator={{ hidden: true }}
          className="rounded-r-full rounded-tl-none rounded-bl-none"
        >
          toggle C
        </Checkbox>
      </Checkbox.Group>

  );
}
