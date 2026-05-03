import { Button } from "@/component";
import { PlusIcon, DownloadSimpleIcon, GearIcon, ArrowLeftIcon, TrashIcon } from "@/component";

export default function ButtonIconOnly() {
  return (
    <div className="flex flex-wrap gap-3">
      <Button variant="primary" aria-label="Add">
        <PlusIcon />
      </Button>
      <Button variant="secondary" aria-label="Download">
        <DownloadSimpleIcon />
      </Button>
      <Button variant="outline" aria-label="Settings">
        <GearIcon />
      </Button>
      <Button variant="ghost" aria-label="Back">
        <ArrowLeftIcon />
      </Button>
      <Button variant="destructive" aria-label="Delete">
        <TrashIcon />
      </Button>
    </div>
  );
}
