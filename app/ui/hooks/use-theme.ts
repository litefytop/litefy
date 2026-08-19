"use client";

import { useSyncExternalStore } from "react";

export type ColorScheme = "light" | "dark" | "system";

interface ThemeState {
  theme: string;
  colorScheme: ColorScheme;
  setTheme: (theme: string) => void;
  setColorScheme: (colorScheme: ColorScheme) => void;
  toggleColorScheme: () => void;
}

const STORAGE_KEY = "theme-storage";
const DEFAULT_THEME = "";
const DEFAULT_COLOR_SCHEME: ColorScheme = "light";

let theme = DEFAULT_THEME;
let colorScheme: ColorScheme = DEFAULT_COLOR_SCHEME;
const themeListeners = new Set<() => void>();
const colorSchemeListeners = new Set<() => void>();

function loadFromStorage() {
  if (typeof window === "undefined") return;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      theme = parsed.theme ?? DEFAULT_THEME;
      colorScheme = parsed.colorScheme ?? DEFAULT_COLOR_SCHEME;
    }
  } catch (e) {
    console.error("Error loading theme from storage:", e);
  }
}

function saveToStorage() {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ theme, colorScheme }));
}

function notifyTheme() {
  themeListeners.forEach((fn) => fn());
}
function notifyColorScheme() {
  colorSchemeListeners.forEach((fn) => fn());
}

function getSystemColorScheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme() {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);
  const mode = colorScheme === "system" ? getSystemColorScheme() : colorScheme;
  root.classList.toggle("dark", mode === "dark");
}

if (typeof window !== "undefined") {
  loadFromStorage();
  applyTheme();

  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const handleSystemChange = () => {
    if (colorScheme === "system") {
      applyTheme();
      notifyColorScheme();
    }
  };
  mediaQuery.addEventListener("change", handleSystemChange);
}

function subscribeTheme(onStoreChange: () => void) {
  themeListeners.add(onStoreChange);
  return () => themeListeners.delete(onStoreChange);
}
function subscribeColorScheme(onStoreChange: () => void) {
  colorSchemeListeners.add(onStoreChange);
  return () => colorSchemeListeners.delete(onStoreChange);
}

function getThemeSnapshot() {
  return theme;
}
function getColorSchemeSnapshot() {
  return colorScheme;
}
function getThemeServerSnapshot() {
  return DEFAULT_THEME;
}
function getColorSchemeServerSnapshot() {
  return DEFAULT_COLOR_SCHEME;
}

export function useTheme(): ThemeState {
  const currentTheme = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    getThemeServerSnapshot,
  );
  const currentColorScheme = useSyncExternalStore(
    subscribeColorScheme,
    getColorSchemeSnapshot,
    getColorSchemeServerSnapshot,
  );

  const setTheme = (newTheme: string) => {
    theme = newTheme;
    saveToStorage();
    applyTheme();
    notifyTheme();
  };

  const setColorScheme = (newScheme: ColorScheme) => {
    colorScheme = newScheme;
    saveToStorage();
    applyTheme();
    notifyColorScheme();
  };

  const toggleColorScheme = () => {
    if (colorScheme === "system") {
      const system = getSystemColorScheme();
      colorScheme = system === "dark" ? "light" : "dark";
    } else {
      colorScheme = colorScheme === "light" ? "dark" : "light";
    }
    saveToStorage();
    applyTheme();
    notifyColorScheme();
  };

  return {
    theme: currentTheme,
    colorScheme: currentColorScheme,
    setTheme,
    setColorScheme,
    toggleColorScheme,
  };
}
