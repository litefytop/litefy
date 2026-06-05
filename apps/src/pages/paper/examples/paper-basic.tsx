import { PaperProvider, Paper } from "@/component/ui/paper";

export default function PaperBasic() {
  return (
    <PaperProvider>
      <Paper>
        <div className="flex flex-col items-center justify-center h-full">
          <h1 className="text-2xl font-bold mb-4">Basic Paper</h1>
          <p className="text-muted-foreground text-center max-w-md">
            This is a basic paper component with default scroll variant and portrait orientation.
          </p>
          <p className="text-muted-foreground text-center max-w-md mt-2">
            You can add any content here and it will be formatted for printing.
          </p>
        </div>
      </Paper>
    </PaperProvider>
  );
}
