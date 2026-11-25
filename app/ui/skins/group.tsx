import { Group as GroupHeadless } from "@/ui";
import type { GroupProps } from "@/ui";
import { cn } from "../utils/cn";


const rootClasses =
  "grid w-fit grid-flow-col auto-cols-fr *:min-w-0 group-seam";

export function Group({ className, children, ...props }: GroupProps) {
  return (
    <GroupHeadless {...props} className={cn(rootClasses, className)}>
      {children}
    </GroupHeadless>
  );
}
