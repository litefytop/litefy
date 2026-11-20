"use client";

import * as React from "react";

export type MotionMode = "system" | "reduce" | "full";

interface MotionSnapshot {
    mode: MotionMode;
    systemReduced: boolean;
}

interface MotionState extends MotionSnapshot {
    reduced: boolean;
    setMode: (mode: MotionMode) => void;
}

const STORAGE_KEY = "motion-preference-storage";
const QUERY = "(prefers-reduced-motion: reduce)";
const DEFAULT_MODE: MotionMode = "system";
const SERVER_SNAPSHOT: MotionSnapshot = { mode: DEFAULT_MODE, systemReduced: true };

let mode: MotionMode = DEFAULT_MODE;
let systemReduced = true;
let snapshot: MotionSnapshot = SERVER_SNAPSHOT;
const listeners = new Set<() => void>();

function resolveReduced(nextMode: MotionMode, system: boolean) {
    if (nextMode === "reduce")
        return true;
    if (nextMode === "full")
        return false;
    return system;
}

function commit() {
    snapshot = { mode, systemReduced };
    listeners.forEach((listener) => listener());
}

function applyMode() {
    if (typeof document === "undefined")
        return;
    document.documentElement.dataset.motion = mode;
}

function loadFromStorage() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored)
            return;
        const parsed = JSON.parse(stored) as { mode?: MotionMode };
        if (parsed.mode === "system" || parsed.mode === "reduce" || parsed.mode === "full")
            mode = parsed.mode;
    }
    catch {
        /* Storage can be unavailable; the default mode is still a valid state. */
    }
}

function saveToStorage() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ mode }));
    }
    catch {
        /* Storage can be unavailable; the in-memory mode still applies. */
    }
}

if (typeof window !== "undefined") {
    loadFromStorage();
    systemReduced = window.matchMedia(QUERY).matches;
    snapshot = { mode, systemReduced };
    applyMode();
    window.matchMedia(QUERY).addEventListener("change", (event) => {
        systemReduced = event.matches;
        commit();
    });
}

function subscribe(onStoreChange: () => void) {
    listeners.add(onStoreChange);
    return () => listeners.delete(onStoreChange);
}

function getSnapshot() {
    return snapshot;
}

function getServerSnapshot() {
    return SERVER_SNAPSHOT;
}

function setMode(nextMode: MotionMode) {
    mode = nextMode;
    saveToStorage();
    applyMode();
    commit();
}

export function useMotionPreference(): MotionState {
    const current = React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
    return React.useMemo(
        () => ({
            ...current,
            reduced: resolveReduced(current.mode, current.systemReduced),
            setMode,
        }),
        [current],
    );
}
