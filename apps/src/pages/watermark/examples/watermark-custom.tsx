import { Watermark,Paper } from "@/component/ui";



export function WatermarkCustom() {
  return (
    <div className="h-64">
      <Watermark
        text="Confidential Document"
        fontSize={24}
        rotate={-45}
        gap={150}
        padding={20}
        opacity={0.5}
        color="primary"
      >
        <div className={`${Paper.class.base} ${Paper.class.variant.a5.landscape}`}>
          <p className="text-muted-foreground">Custom watermark style</p>
        </div>
      </Watermark>
    </div>
  );
}
