"use client";
import * as React from "react";
import { Copy, RotateCcw, ThumbsDown, ThumbsUp } from "./icons";

export type ChatMessageStatus =
    | "queued" | "in_progress" | "incomplete"
    | "completed" | "failed" | "cancelled";

export type ChatContentItem = {
    type: string;
    text?: string;
    image_url?: string;
    file_url?: string;
    filename?: string;
    size?: string;
    summary?: { type?: string; text?: string }[];
    name?: string;
    arguments?: string;
    [key: string]: unknown;
};

export interface ChatMessage {
    id: string | number;
    role: string;
    content?: string | ChatContentItem[];
    status?: ChatMessageStatus;
}

export interface ChatRoleMeta {
    name?: string;
    avatar?: string;
}

export type ChatRoleConfig = Record<string, ChatRoleMeta>;

export interface ChatClassNames {
    root?: string;
    list?: string;
    message?: string;
    main?: string;
    avatar?: string;
    name?: string;
    content?: string;
    contentItem?: string;
    actions?: string;
    action?: string;
    hints?: string;
    hint?: string;
    typing?: string;
}

export interface ChatProps extends Omit<React.ComponentProps<"div">, "className"> {
    chats: ChatMessage[];
    roleConfig?: ChatRoleConfig;
    align?: "leftRight" | "leftAlign";
    mode?: "bubble" | "noBubble" | "userBubble";
    hints?: string[];
    onHintClick?: (hint: string) => void;
    onMessageCopy?: (message: ChatMessage) => void;
    onMessageGoodFeedback?: (message: ChatMessage) => void;
    onMessageBadFeedback?: (message: ChatMessage) => void;
    onMessageReset?: (message: ChatMessage) => void;
    renderMessageContent?: (message: ChatMessage) => React.ReactNode;
    className?: string;
    classNames?: ChatClassNames;
}

const LOADING_STATUSES = new Set(["queued", "in_progress", "incomplete"]);

function messageText(message: ChatMessage): string {
    if (typeof message.content === "string") return message.content;
    if (!Array.isArray(message.content)) return "";
    return message.content
        .map((item) => {
            if (typeof item.text === "string") return item.text;
            const summary = item.summary?.map((part) => part.text ?? "").join("");
            return summary ?? "";
        })
        .filter(Boolean)
        .join("\n");
}

function ContentItem({ item }: { item: ChatContentItem }) {
    if (item.image_url) {
        return <img src={item.image_url} alt={typeof item.filename === "string" ? item.filename : ""} />;
    }
    if (item.filename || item.file_url) {
        return <span>{item.filename ?? item.file_url}</span>;
    }
    if (Array.isArray(item.summary)) {
        return <p>{item.summary.map((part) => part.text ?? "").join("")}</p>;
    }
    if (item.name) {
        return <span>{item.name}{item.arguments ? ` ${item.arguments}` : ""}</span>;
    }
    return <p>{typeof item.text === "string" ? item.text : ""}</p>;
}

function Typing({ className }: { className?: string }) {
    return (
        <span className={className} aria-label="…">
            {[0, 150, 300].map((delay) => (
                <span
                    key={delay}
                    data-typing="true"
                    style={{ animationDelay: `${delay}ms` }}
                />
            ))}
        </span>
    );
}

const EMPTY_META: ChatRoleMeta = {};
const EMPTY_ROLE_CONFIG: ChatRoleConfig = {};

interface ChatRowProps {
    message: ChatMessage;
    meta: ChatRoleMeta;
    classNames?: ChatClassNames;
    feedbackKind?: "good" | "bad";
    renderMessageContent?: (message: ChatMessage) => React.ReactNode;
    onCopy: (message: ChatMessage) => void;
    onFeedback: (message: ChatMessage, kind: "good" | "bad") => void;
    onReset?: (message: ChatMessage) => void;
}

const ROW_CLASS_KEYS: (keyof ChatClassNames)[] = [
    "message", "avatar", "main", "name", "content", "contentItem", "actions", "action", "typing",
];

function sameRowProps(prev: ChatRowProps, next: ChatRowProps): boolean {
    if (prev.message !== next.message ||
        prev.meta !== next.meta ||
        prev.feedbackKind !== next.feedbackKind ||
        prev.renderMessageContent !== next.renderMessageContent ||
        prev.onCopy !== next.onCopy ||
        prev.onFeedback !== next.onFeedback ||
        prev.onReset !== next.onReset)
        return false;
    const a = prev.classNames;
    const b = next.classNames;
    if (a === b)
        return true;
    if (!a || !b)
        return false;
    return ROW_CLASS_KEYS.every((key) => a[key] === b[key]);
}

const ChatRow = React.memo(function ChatRow({
    message,
    meta,
    classNames,
    feedbackKind,
    renderMessageContent,
    onCopy,
    onFeedback,
    onReset,
}: ChatRowProps) {
    const isUser = message.role === "user";
    const waiting = LOADING_STATUSES.has(message.status ?? "completed") &&
        (message.content === undefined || message.content === "");
    const showActions = !isUser && (message.status ?? "completed") === "completed";
    const initial = (meta.name ?? message.role).charAt(0).toUpperCase();
    const renderContent = () => {
        if (renderMessageContent) return renderMessageContent(message);
        if (typeof message.content === "string") return message.content;
        if (!Array.isArray(message.content)) return null;
        return message.content.map((item) => (
            <div key={JSON.stringify(item)} className={classNames?.contentItem}>
                <ContentItem item={item} />
            </div>
        ));
    };
    return (
        <li
            data-role={message.role}
            data-user={isUser ? "true" : "false"}
            data-status={message.status ?? "completed"}
            className={classNames?.message}
        >
            {meta.avatar ? (
                <img src={meta.avatar} alt="" className={classNames?.avatar} />
            ) : (
                <span aria-hidden="true" className={classNames?.avatar}>{initial}</span>
            )}
            <div className={classNames?.main}>
                <span className={classNames?.name}>{meta.name ?? message.role}</span>
                <div className={classNames?.content}>
                    {waiting ? <Typing className={classNames?.typing} /> : renderContent()}
                </div>
                {showActions && (
                    <div className={classNames?.actions}>
                        <button
                            type="button"
                            aria-label="Copy"
                            className={classNames?.action}
                            onClick={() => onCopy(message)}
                        >
                            <Copy aria-hidden="true" />
                        </button>
                        <button
                            type="button"
                            aria-label="Good response"
                            aria-pressed={feedbackKind === "good"}
                            data-active={feedbackKind === "good" ? "true" : "false"}
                            className={classNames?.action}
                            onClick={() => onFeedback(message, "good")}
                        >
                            <ThumbsUp aria-hidden="true" />
                        </button>
                        <button
                            type="button"
                            aria-label="Bad response"
                            aria-pressed={feedbackKind === "bad"}
                            data-active={feedbackKind === "bad" ? "true" : "false"}
                            className={classNames?.action}
                            onClick={() => onFeedback(message, "bad")}
                        >
                            <ThumbsDown aria-hidden="true" />
                        </button>
                        {onReset && (
                            <button
                                type="button"
                                aria-label="Regenerate"
                                className={classNames?.action}
                                onClick={() => onReset(message)}
                            >
                                <RotateCcw aria-hidden="true" />
                            </button>
                        )}
                    </div>
                )}
            </div>
        </li>
    );
}, sameRowProps);

export function Chat({
    chats,
    roleConfig = EMPTY_ROLE_CONFIG,
    align = "leftRight",
    mode = "bubble",
    hints,
    onHintClick,
    onMessageCopy,
    onMessageGoodFeedback,
    onMessageBadFeedback,
    onMessageReset,
    renderMessageContent,
    className,
    classNames,
    ...props
}: ChatProps) {
    const [feedback, setFeedback] = React.useState<Map<string | number, "good" | "bad">>(() => new Map());
    const callbacksRef = React.useRef({ onMessageCopy, onMessageGoodFeedback, onMessageBadFeedback, onMessageReset });
    React.useEffect(() => {
        callbacksRef.current = { onMessageCopy, onMessageGoodFeedback, onMessageBadFeedback, onMessageReset };
    });

    const copyMessage = React.useCallback(async (message: ChatMessage) => {
        await navigator.clipboard.writeText(messageText(message)).catch(() => {});
        callbacksRef.current.onMessageCopy?.(message);
    }, []);

    const handleFeedback = React.useCallback((message: ChatMessage, kind: "good" | "bad") => {
        const key = String(message.id);
        setFeedback((current) => {
            const next = new Map(current);
            if (next.get(key) === kind) next.delete(key);
            else next.set(key, kind);
            return next;
        });
        if (kind === "good") callbacksRef.current.onMessageGoodFeedback?.(message);
        else callbacksRef.current.onMessageBadFeedback?.(message);
    }, []);

    const handleReset = React.useCallback((message: ChatMessage) => {
        callbacksRef.current.onMessageReset?.(message);
    }, []);

    return (
        <div {...props} data-align={align} data-mode={mode} className={className}>
            <ul role="log" aria-live="polite" className={classNames?.list}>
                {chats.map((message) => (
                    <ChatRow
                        key={message.id}
                        message={message}
                        meta={roleConfig[message.role] ?? EMPTY_META}
                        classNames={classNames}
                        feedbackKind={feedback.get(String(message.id))}
                        renderMessageContent={renderMessageContent}
                        onCopy={copyMessage}
                        onFeedback={handleFeedback}
                        onReset={onMessageReset ? handleReset : undefined}
                    />
                ))}
            </ul>
            {hints && hints.length > 0 && (
                <ul className={classNames?.hints}>
                    {hints.map((hint) => (
                        <li key={hint}>
                            <button
                                type="button"
                                className={classNames?.hint}
                                onClick={() => onHintClick?.(hint)}
                            >
                                {hint}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
