import { Button } from "@/component";
import { PlusIcon, ArrowLeftIcon, TrashIcon, DownloadIcon, SettingsIcon } from "lucide-react";

export default function ButtonIconOnly() {
  return (
    <div className="flex flex-wrap gap-3">
      <Button variant="primary" aria-label="Add" iconOnly>
        <PlusIcon />
      </Button>
      <Button variant="secondary" aria-label="Download" iconOnly>
        <DownloadIcon />
      </Button>
      <Button variant="outline" aria-label="Settings" iconOnly>
        <SettingsIcon />
      </Button>
      <Button variant="ghost" aria-label="Back" iconOnly>
        <ArrowLeftIcon />
      </Button>
      <Button variant="destructive" aria-label="Delete" iconOnly>
        <TrashIcon />
      </Button>
    </div>
  );
}
