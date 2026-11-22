import { Group as GroupHeadless } from "@/ui";
import type { GroupProps } from "@/ui";
import { cn } from "../utils/cn";


const groupBaseClasses =
  "grid w-fit grid-flow-col auto-cols-fr *:min-w-0 *:not-first:not-last:rounded-none";
const groupStartClasses =
  "*:first:not-last:rounded-se-none *:first:not-last:rounded-ee-none";
const groupEndClasses =
  "*:last:not-first:rounded-ss-none *:last:not-first:rounded-es-none";

const rootClasses = cn(groupBaseClasses, groupStartClasses, groupEndClasses);

export function Group({ className, children, ...props }: GroupProps) {
  return (
    <GroupHeadless {...props} className={cn(rootClasses, className)}>
      {children}
    </GroupHeadless>
  );
}
