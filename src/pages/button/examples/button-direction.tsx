import { Button } from "@/component";
import { PlusIcon, CameraIcon } from "@/component";

export default function ButtonDirection() {
  return (
    <div className="flex gap-8">
      <div className="flex flex-col gap-2">
        <span className="text-sm text-muted-foreground">Horizontal</span>
        <Button variant="primary">
          <PlusIcon />
          Add Item
        </Button>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-sm text-muted-foreground">Vertical</span>
        <Button variant="outline" direction="vertical">
          <CameraIcon />
          Take Photo
        </Button>
      </div>
    </div>
  );
}
