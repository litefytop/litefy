import { Button, Tooltip } from "@/component";

export default function TooltipBasic() {
  return (
    <div className="flex items-center justify-center h-64 gap-4">
      <Tooltip side="left" content=" This is a left tooltip">
        Left
      </Tooltip>
      <Tooltip side="top" content=" This is a top tooltip">
        <Button variant="primary">Top</Button>
      </Tooltip>
      <Tooltip
        slotProps={{
          trigger: {
            className: `${Button.class.base} ${Button.class.variant.primary}`,
          },
        }}
        side="bottom"
        content=" This is a bottom tooltip"
      >
        Bottom
      </Tooltip>

      <Tooltip side="right" content=" This is a right tooltip">
        Right
      </Tooltip>
    </div>
  );
}
