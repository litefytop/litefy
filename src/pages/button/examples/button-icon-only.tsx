import { Button } from "@/component";
import { PlusIcon, ArrowLeftIcon, TrashIcon, DownloadIcon, SettingsIcon } from "lucide-react";

export default function ButtonIconOnly() {
  return (
    <div className="flex flex-wrap gap-3">
      <Button variant="primary" aria-label="Add">
        <PlusIcon />
      </Button>
      <Button variant="secondary" aria-label="Download">
        <DownloadIcon />
      </Button>
      <Button variant="outline" aria-label="Settings">
        <SettingsIcon />
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
