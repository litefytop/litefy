import type { KeyboardEvent } from "react";
export function trapTabKey(e: KeyboardEvent, container: HTMLElement | null): void {
    if (e.key !== "Tab" || !container)
        return;
    const focusable = Array.from(container.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')).filter((el) => el.offsetParent !== null);
    if (focusable.length === 0) {
        e.preventDefault();
        return;
    }
    const doc = container.ownerDocument;
    const first = focusable[0];
    const last = focusable.at(-1)!;
    if (e.shiftKey) {
        if (doc.activeElement === first || !container.contains(doc.activeElement)) {
            e.preventDefault();
            last.focus();
        }
    }
    else if (doc.activeElement === last || !container.contains(doc.activeElement)) {
        e.preventDefault();
        first.focus();
    }
}
