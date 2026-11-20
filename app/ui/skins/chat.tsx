import { Chat as ChatHeadless } from "@/ui";
import type { ChatProps } from "@/ui";
import { cn, mergeSlots } from "../utils/cn";
import { buttonVariants } from "./button";

const rootClasses = "group/chat flex flex-col gap-y-4";

const listClasses = "m-0 flex list-none flex-col gap-y-4 p-0";

const messageClasses =
  "flex w-full gap-x-3 group/message " +
  "group-data-[align=leftRight]/chat:data-[user=true]:flex-row-reverse";

const mainClasses =
  "flex min-w-0 max-w-full flex-col gap-y-1 items-start " +
  "group-data-[align=leftRight]/chat:data-[user=true]:items-end";

const avatarClasses =
  "mt-0.5 block size-8 shrink-0 overflow-hidden rounded-pill border-hair border-border bg-surface " +
  "object-cover text-center text-sm leading-8 text-surface-fg";

const nameClasses = "text-xs leading-4 text-surface-fg";

const contentClasses =
  "flex max-w-full flex-col gap-y-2 text-left text-sm leading-5 " +
  "group-data-[mode=bubble]/chat:data-[user=true]:rounded-xl group-data-[mode=bubble]/chat:data-[user=true]:rounded-br-sm group-data-[mode=bubble]/chat:data-[user=true]:bg-accent group-data-[mode=bubble]/chat:data-[user=true]:text-accent-fg group-data-[mode=bubble]/chat:data-[user=true]:px-3 group-data-[mode=bubble]/chat:data-[user=true]:py-2 " +
  "group-data-[mode=bubble]/chat:data-[user=false]:rounded-xl group-data-[mode=bubble]/chat:data-[user=false]:rounded-bl-sm group-data-[mode=bubble]/chat:data-[user=false]:bg-surface group-data-[mode=bubble]/chat:data-[user=false]:text-surface-fg group-data-[mode=bubble]/chat:data-[user=false]:px-3 group-data-[mode=bubble]/chat:data-[user=false]:py-2 " +
  "group-data-[mode=noBubble]/chat:text-foreground " +
  "group-data-[mode=userBubble]/chat:data-[user=true]:rounded-xl group-data-[mode=userBubble]/chat:data-[user=true]:rounded-br-sm group-data-[mode=userBubble]/chat:data-[user=true]:bg-accent group-data-[mode=userBubble]/chat:data-[user=true]:text-accent-fg group-data-[mode=userBubble]/chat:data-[user=true]:px-3 group-data-[mode=userBubble]/chat:data-[user=true]:py-2 " +
  "group-data-[mode=userBubble]/chat:data-[user=false]:text-foreground " +
  "data-[status=failed]:text-danger-fg data-[status=cancelled]:text-danger-fg";

const contentItemClasses =
  "min-w-0 " +
  "[&>img]:max-w-64 [&>img]:rounded-lg [&>img]:border-hair [&>img]:border-border " +
  "[&>span]:inline-flex [&>span]:items-center [&>span]:gap-x-1 [&>span]:rounded-md [&>span]:border-hair [&>span]:border-border [&>span]:px-2 [&>span]:py-1 " +
  "[&>p]:m-0";

const typingClasses =
  "flex items-center gap-x-1 py-1 " +
  "[&_[data-typing=true]]:size-1.5 [&_[data-typing=true]]:rounded-pill [&_[data-typing=true]]:bg-current " +
  "[&_[data-typing=true]]:motion-safe:animate-pulse";

const actionsClasses =
  "flex items-center gap-x-1 opacity-0 transition-opacity duration-sm " +
  "group-hover/message:opacity-100 focus-within:opacity-100";

const actionClasses =
  cn(buttonVariants.text,
    "h-control min-h-0 w-control px-0 text-surface-fg " +
    "data-[active=true]:text-primary data-[active=true]:opacity-100");

const hintsClasses = "m-0 flex list-none flex-wrap gap-x-2 gap-y-1 p-0";

const hintClasses =
  cn(buttonVariants.outline, "h-control text-sm");

const skinClassNames = {
  root: rootClasses,
  list: listClasses,
  message: messageClasses,
  main: mainClasses,
  avatar: avatarClasses,
  name: nameClasses,
  content: contentClasses,
  contentItem: contentItemClasses,
  typing: typingClasses,
  actions: actionsClasses,
  action: actionClasses,
  hints: hintsClasses,
  hint: hintClasses,
};

export function Chat({ className, classNames, ...props }: ChatProps) {
  return (
    <ChatHeadless
      {...props}
      className={cn(rootClasses, className)}
      classNames={mergeSlots(skinClassNames, classNames)}
    />
  );
}
