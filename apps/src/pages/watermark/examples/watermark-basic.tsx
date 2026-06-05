import { Watermark, Paper } from "@/component/ui";

export function WatermarkBasic() {
  return (
    <div className="h-64">
      <Watermark text="Confidential">
        <div className={`${Paper.class.base} ${Paper.class.variant.a5.landscape}`}>
          <p className="text-muted-foreground">Content with watermark</p>
        </div>
      </Watermark>
    </div>
  );
}
