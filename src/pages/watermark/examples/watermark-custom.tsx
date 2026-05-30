import { Watermark,Paper } from "@/component/ui";



export function WatermarkCustom() {
  return (
    <div className="h-64">
      <Watermark
        text="Confidential Document"
        fontSize={24}
        color="rgba(255, 0, 0, 0.5)"
        rotate={-45}
        gap={150}
        opacity={0.5}
      >
        <div className={`${Paper.class.base} ${Paper.class.variant.a5.landscape}`}>
          <p className="text-muted-foreground">Custom watermark style</p>
        </div>
      </Watermark>
    </div>
  );
}
