import { Button } from "@/component";
import { PlusIcon, DownloadSimpleIcon, GearIcon, ArrowLeftIcon, TrashIcon } from "@/component";

export default function ButtonWithIcons() {
  return (
    <div className="flex flex-wrap gap-3">
      <Button variant="primary">
        <PlusIcon />
        Add Item
      </Button>

      <Button variant="secondary">
        <DownloadSimpleIcon />
        Download
      </Button>

      <Button variant="outline">
        <GearIcon />
        Settings
      </Button>

      <Button variant="ghost">
        <ArrowLeftIcon />
        Back
      </Button>

      <Button variant="destructive">
        <TrashIcon />
        Delete
      </Button>
    </div>
  );
}
