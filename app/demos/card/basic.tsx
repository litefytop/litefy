import { Card } from "@/ui/skins";

export default function Demo() {
  return (
    <Card>
      <p className="font-strong">Static card</p>
      <p className="text-sm leading-body">
        Rounded corners, a hairline border and a block shadow — no interactive
        states; content goes straight in.
      </p>
    </Card>
  );
}
