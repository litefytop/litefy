"use client";
import * as React from "react";
/**
 * Which of the given document ids are on screen right now.
 *
 * An id is active when its element sits fully inside the viewport; when none does, the one whose
 * top edge is nearest the viewport top carries the reading, so a long block that fills the screen
 * still reports its start. Targets are looked up by id on every pass, so entries may be mounted,
 * reordered or removed without re-registering anything.
 */
export function useScrollSpy(ids: readonly string[]): string[] {
    const [activeIds, setActiveIds] = React.useState<string[]>([]);
    React.useEffect(() => {
        if (ids.length === 0)
            return;
        const readTargets = () => ids
            .map((id) => document.getElementById(id))
            .filter((el): el is HTMLElement => el !== null && el.getBoundingClientRect().height > 0);
        const compute = () => {
            const targets = readTargets();
            if (targets.length === 0) {
                setActiveIds((prev) => prev.length === 0 ? prev : []);
                return;
            }
            const vh = window.innerHeight;
            const active = targets.filter((el) => {
                const rect = el.getBoundingClientRect();
                return rect.top >= 0 && rect.bottom <= vh;
            });
            if (active.length === 0) {
                let closest = null;
                let min = Number.MAX_VALUE;
                for (const el of targets) {
                    const d = Math.abs(el.getBoundingClientRect().top);
                    if (d < min) {
                        closest = el;
                        min = d;
                    }
                }
                setActiveIds((prev) => {
                    const next = closest ? [closest.id] : [];
                    return prev.length === next.length && prev[0] === next[0] ? prev : next;
                });
                return;
            }
            setActiveIds((prev) => {
                const next = active.map((el) => el.id);
                return prev.length === next.length && prev.every((v, i) => v === next[i]) ? prev : next;
            });
        };
        compute();
        window.addEventListener("scroll", compute, { passive: true, capture: true });
        window.addEventListener("resize", compute);
        const mounted = new ResizeObserver(compute);
        mounted.observe(document.body);
        return () => {
            window.removeEventListener("scroll", compute, { capture: true });
            window.removeEventListener("resize", compute);
            mounted.disconnect();
        };
    }, [ids]);
    return activeIds;
}
