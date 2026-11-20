import { Group as GroupHeadless } from "@/ui";
import type { GroupProps } from "@/ui";
import { cn } from "../utils/cn";


const rootClasses =
  "grid w-fit grid-flow-col auto-cols-fr *:min-w-0 " +
  "*:not-first:not-last:rounded-none " +
  "*:first:not-last:rounded-se-none *:first:not-last:rounded-ee-none " +
  "*:last:not-first:rounded-ss-none *:last:not-first:rounded-es-none";

export function Group({ className, children, ...props }: GroupProps) {
  return (
    <GroupHeadless {...props} className={cn(rootClasses, className)}>
      {children}
    </GroupHeadless>
  );
}
