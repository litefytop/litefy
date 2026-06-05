import { useRef } from "react";
import { Sidebar, Button } from "@/component";
import { SidebarHandle } from "@/component/ui/sidebar";
import { PanelLeftIcon } from "lucide-react";

export default function SidebarBasic() {
  const sidebarRef = useRef<SidebarHandle | null>(null);

  return (
    <div className="flex h-64 border rounded-lg overflow-hidden">
      <Sidebar
        ref={sidebarRef}
        className="w-48 bg-muted/30 p-4"
        defaultOpen={true}
      >
        <div className="space-y-2">
          <div className="font-medium">Navigation</div>
          <div className="text-sm text-muted-foreground">Home</div>
          <div className="text-sm text-muted-foreground">About</div>
          <div className="text-sm text-muted-foreground">Contact</div>
        </div>
      </Sidebar>
      <div className="flex-1 p-4">
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => sidebarRef.current?.toggle()}
            >
              <PanelLeftIcon className="size-4" />
              Toggle
            </Button>
            <Button
              variant="outline"
              onClick={() => sidebarRef.current?.open()}
            >
              Open
            </Button>
            <Button
              variant="outline"
              onClick={() => sidebarRef.current?.close()}
            >
              Close
            </Button>
          </div>
        
        </div>
      </div>
    </div>
  );
}
