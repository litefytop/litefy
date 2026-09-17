import { Button, Card } from "@/ui";

export default function CardBasicDemo() {
  return (
    <Card className="w-full max-w-sm p-6">
      <h3 className="text-lg font-semibold">Litefy Card</h3>
      <p className="text-muted-foreground mt-2 text-sm">
        A static glassmorphic surface with subtle border and soft shadow.
      </p>
      <div className="mt-4 flex gap-2">
        <Button>Action</Button>
        <Button variant="outline">Cancel</Button>
      </div>
    </Card>
  );
}
