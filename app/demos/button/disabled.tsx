import { Button } from "@/ui/skins";

export default function Demo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Button disabled>Submit</Button>
      <Button disabled data-variant="outline">Cancel</Button>
      <Button disabled data-variant="text">Learn more</Button>
      <Button disabled data-danger>Delete</Button>
    </div>
  );
}
