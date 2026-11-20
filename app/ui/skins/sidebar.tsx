import { Sidebar as SidebarHeadless } from "@/ui";
import type { SidebarProps } from "@/ui";
import { cn } from "../utils/cn";


const rootClasses =
  "flex flex-col h-full overflow-hidden bg-surface data-[open=false]:hidden";

export function Sidebar({ className, ...props }: SidebarProps) {
  return <SidebarHeadless {...props} className={cn(rootClasses, className)} />;
}
