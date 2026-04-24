import { SidebarTrigger } from "./trigger";
import { ClassNameValue, cn } from "@/lib";

export type SidebarProps = Omit<React.ComponentProps<"aside">, "className"> & {
  className?: ClassNameValue;
};

function Sidebar({ children, className, ...props }: SidebarProps) {
  return (
    <aside
      {...props}
      className={cn(className)}
    >
      {children}
    </aside>
  );
}



Sidebar.Trigger = SidebarTrigger;

export { Sidebar };
