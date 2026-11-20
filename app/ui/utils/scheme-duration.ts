export function getSchemeDurationMs(el: Element, token: string): number {
    const raw = getComputedStyle(el).getPropertyValue(token).trim();
    const value = Number.parseFloat(raw);
    if (Number.isNaN(value))
        return 0;
    return raw.endsWith("ms") ? value : raw.endsWith("s") ? value * 1000 : value;
}

export function getTransitionDurationMs(el: Element): number {
    const property = getComputedStyle(el).transitionDuration;
    let max = 0;
    for (const entry of property.split(",")) {
        const value = Number.parseFloat(entry);
        if (Number.isNaN(value))
            continue;
        const ms = entry.trim().endsWith("ms") ? value : value * 1000;
        if (ms > max)
            max = ms;
    }
    return max;
}
