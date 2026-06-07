import { Button } from "@/component";
import {
  PlusIcon,
  ArrowLeftIcon,
  DownloadIcon,
  SettingsIcon,
  TrashIcon,
} from "lucide-react";

export default function ButtonWithIcons() {
  return (
    <div className="flex flex-wrap gap-3">
      <Button variant="primary">
        <PlusIcon />
        Add Item
      </Button>

      <Button variant="secondary">
        <DownloadIcon />
        Download
      </Button>

      <Button variant="outline">
        <SettingsIcon />
        Settings
      </Button>

      <Button variant="text">
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
