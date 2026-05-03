import { useSidebarStore } from "./store";
import { Button, ButtonProps, PanelLeft } from "@/component";

export function SidebarTrigger({ onClick, ...props }: ButtonProps) {
  const { toggle } = useSidebarStore();

  return (
    <Button
      onClick={(
        event: React.MouseEvent<HTMLAnchorElement, MouseEvent> &
          React.MouseEvent<HTMLButtonElement, MouseEvent>,
      ) => {
        onClick?.(event);
        toggle();
      }}
      {...props}
    >
      <PanelLeft />
    </Button>
  );
}
