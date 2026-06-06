import { Empty, Button } from "@/component";

export default function EmptyCustom() {
  return (
    <div className="h-64 border rounded-lg">
      <Empty>
        <div className="flex flex-col items-center gap-4">
          <div className="text-4xl">📦</div>
          <div className="text-center">
            <p className="text-lg font-medium">No Content</p>
            <p className="text-sm text-muted-foreground">
              There's nothing here yet. Go explore other pages!
            </p>
          </div>
          <Button variant="primary">Back to Home</Button>
        </div>
      </Empty>
    </div>
  );
}
