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
  "flex max-w-full flex-col gap-y-2 text-left text-sm leading-5";

const contentBubbleUserClasses =
  "rounded-xl rounded-br-sm bg-accent text-accent-fg px-3 py-2";

const contentBubbleAssistantClasses =
  "rounded-xl rounded-bl-sm bg-surface text-surface-fg px-3 py-2";

const contentPlainClasses = "text-foreground";

const contentErrorClasses = "text-danger-fg";

const contentItemBaseClasses = "min-w-0";
const contentItemImageClasses =
  "[&>img]:max-w-64 [&>img]:rounded-lg [&>img]:border-hair [&>img]:border-border";
const contentItemFileClasses =
  "[&>span]:inline-flex [&>span]:items-center [&>span]:gap-x-1 [&>span]:rounded-md [&>span]:border-hair [&>span]:border-border " +
  "[&>span]:px-2 [&>span]:py-1 [&>p]:m-0";

const contentItemClasses = cn(contentItemBaseClasses, contentItemImageClasses, contentItemFileClasses);

const typingClasses = "flex items-center gap-x-1 py-1";

const typingDotClasses =
  "size-1.5 rounded-pill bg-current motion-safe:animate-pulse";

const actionsClasses =
  "flex items-center gap-x-1 opacity-0 transition-opacity duration-sm " +
  "group-hover/message:opacity-100 focus-within:opacity-100";

const actionClasses =
  cn(buttonVariants.text,
    "h-control min-h-0 w-control text-surface-fg " +
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
  contentBubbleUser: contentBubbleUserClasses,
  contentBubbleAssistant: contentBubbleAssistantClasses,
  contentPlain: contentPlainClasses,
  contentError: contentErrorClasses,
  contentItem: contentItemClasses,
  typing: typingClasses,
  typingDot: typingDotClasses,
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
