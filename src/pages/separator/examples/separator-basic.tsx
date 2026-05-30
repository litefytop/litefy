import { Separator } from "@/component";

export default function SeparatorBasic() {
  return (
    <div className="w-full space-y-4">
      <div>
        <h3 className="text-lg font-medium">Section 1</h3>
        <p className="text-muted-foreground">Content for section 1 goes here.</p>
      </div>
      <Separator />
      <div>
        <h3 className="text-lg font-medium">Section 2</h3>
        <p className="text-muted-foreground">Content for section 2 goes here.</p>
      </div>
      <Separator />
      <div>
        <h3 className="text-lg font-medium">Section 3</h3>
        <p className="text-muted-foreground">Content for section 3 goes here.</p>
      </div>
    </div>
  );
}
