import { CardButton } from "@/ui/skins";

export default function Demo() {
  return (
    <CardButton>
      <p className="font-strong">Clickable card</p>
      <p className="mt-1 text-sm leading-body">The whole card is a button — hover lifts, press flattens, focus ring built in.</p>
    </CardButton>
  );
}
