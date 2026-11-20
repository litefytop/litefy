"use client";
import { useSyncExternalStore } from "react";
export type ThemeMode = "light" | "dark" | "system";
interface ThemeState {
    theme: ThemeMode;
    setTheme: (mode: ThemeMode) => void;
    toggleTheme: () => void;
}
const STORAGE_KEY = "theme-storage";
const DEFAULT_THEME: ThemeMode = "light";
let theme: ThemeMode = DEFAULT_THEME;
const listeners = new Set<() => void>();
function loadFromStorage() {
    if (typeof window === "undefined")
        return;
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            theme = parsed.theme ?? DEFAULT_THEME;
        }
    }
    catch (e) {
        console.error("Error loading theme from storage:", e);
    }
}
function saveToStorage() {
    if (typeof window === "undefined")
        return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ theme }));
}
function notify() {
    listeners.forEach((fn) => fn());
}
function getSystemColorScheme(): "light" | "dark" {
    if (typeof window === "undefined")
        return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
function applyTheme() {
    if (typeof document === "undefined")
        return;
    const root = document.documentElement;
    const mode = theme === "system" ? getSystemColorScheme() : theme;
    root.classList.toggle("dark", mode === "dark");
    root.style.colorScheme = mode;
}
if (typeof window !== "undefined") {
    loadFromStorage();
    applyTheme();
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemChange = () => {
        if (theme === "system") {
            applyTheme();
            notify();
        }
    };
    mediaQuery.addEventListener("change", handleSystemChange);
}
function subscribe(onStoreChange: () => void) {
    listeners.add(onStoreChange);
    return () => listeners.delete(onStoreChange);
}
function getThemeSnapshot() {
    return theme;
}
function getThemeServerSnapshot() {
    return DEFAULT_THEME;
}
export function useTheme(): ThemeState {
    const currentTheme = useSyncExternalStore(subscribe, getThemeSnapshot, getThemeServerSnapshot);
    const setTheme = (newMode: ThemeMode) => {
        theme = newMode;
        saveToStorage();
        applyTheme();
        notify();
    };
    const toggleTheme = () => {
        if (theme === "system") {
            const system = getSystemColorScheme();
            theme = system === "dark" ? "light" : "dark";
        }
        else {
            theme = theme === "light" ? "dark" : "light";
        }
        saveToStorage();
        applyTheme();
        notify();
    };
    return {
        theme: currentTheme,
        setTheme,
        toggleTheme,
    };
}
