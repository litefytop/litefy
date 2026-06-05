import { PaperProvider, Paper } from "@/component/ui/paper";

export default function PaperVariants() {
  return (
    <div className="space-y-8 h-screen">
      <div>
        <h3 className="text-lg font-semibold mb-2">A4 Portrait</h3>
        <PaperProvider>
          <Paper variant="a4" orientation="portrait">
            <div className="flex flex-col items-center justify-center h-full">
              <h1 className="text-2xl font-bold">A4 Portrait</h1>
              <p className="text-muted-foreground mt-2">210mm × 297mm</p>
            </div>
          </Paper>
        </PaperProvider>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">A4 Landscape</h3>
        <PaperProvider>
          <Paper variant="a4" orientation="landscape">
            <div className="flex flex-col items-center justify-center h-full">
              <h1 className="text-2xl font-bold">A4 Landscape</h1>
              <p className="text-muted-foreground mt-2">297mm × 210mm</p>
            </div>
          </Paper>
        </PaperProvider>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">A5 Portrait</h3>
        <PaperProvider>
          <Paper variant="a5" orientation="portrait">
            <div className="flex flex-col items-center justify-center h-full">
              <h1 className="text-2xl font-bold">A5 Portrait</h1>
              <p className="text-muted-foreground mt-2">148mm × 210mm</p>
            </div>
          </Paper>
        </PaperProvider>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">A5 Landscape</h3>
        <PaperProvider>
          <Paper variant="a5" orientation="landscape">
            <div className="flex flex-col items-center justify-center h-full">
              <h1 className="text-2xl font-bold">A5 Landscape</h1>
              <p className="text-muted-foreground mt-2">210mm × 148mm</p>
            </div>
          </Paper>
        </PaperProvider>
      </div>
    </div>
  );
}
