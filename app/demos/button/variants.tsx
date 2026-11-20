import { Button } from "@/ui/skins";

export default function Demo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Button>Submit</Button>
      <Button data-variant="outline">Cancel</Button>
      <Button data-variant="text">Learn more</Button>
      <Button data-danger>Delete</Button>
    </div>
  );
}
