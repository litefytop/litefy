"use client";

import  { useState, useEffect } from "react";

export type ColorScheme = "light" | "dark" | "system";

interface ThemeState {
  theme: string;
  colorScheme: ColorScheme;
  setTheme: (theme: string) => void;
  setColorScheme: (colorScheme: ColorScheme) => void;
  toggleColorScheme: () => void;
}

const STORAGE_KEY = "theme-storage";

let theme = "blue";
let colorScheme: ColorScheme = "light";
const themeListeners = new Set<() => void>();
const colorSchemeListeners = new Set<() => void>();

function loadFromStorage(): void {
  if (typeof window === "undefined") return;
 
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      theme = parsed.theme || "blue";
      colorScheme = parsed.colorScheme || "light";
    }

}

function saveToStorage(): void {
  if (typeof window === "undefined") return;

    localStorage.setItem(STORAGE_KEY, JSON.stringify({ theme, colorScheme }));

}

function notifyTheme(): void {
  themeListeners.forEach((fn) => fn());
}

function notifyColorScheme(): void {
  colorSchemeListeners.forEach((fn) => fn());
}

function getSystemColorScheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(): void {
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);
  
  const effectiveColorScheme = colorScheme === "system" ? getSystemColorScheme() : colorScheme;
  
  if (effectiveColorScheme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

loadFromStorage();
applyTheme();

if (typeof window !== "undefined") {
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  mediaQuery.addEventListener("change", () => {
    if (colorScheme === "system") {
      applyTheme();
      notifyColorScheme();
    }
  });
}

export function useTheme(): ThemeState {
  const [themeState, setThemeState] = useState(theme);
  const [colorSchemeState, setColorSchemeState] = useState(colorScheme);

  useEffect(() => {
    const updateTheme = () => setThemeState(theme);
    const updateColorScheme = () => setColorSchemeState(colorScheme);

    themeListeners.add(updateTheme);
    colorSchemeListeners.add(updateColorScheme);

    return () => {
      themeListeners.delete(updateTheme);
      colorSchemeListeners.delete(updateColorScheme);
    };
  }, []);

  return {
    theme: themeState,
    colorScheme: colorSchemeState,
    setTheme: (newTheme: string) => {
      theme = newTheme;
      saveToStorage();
      applyTheme();
      notifyTheme();
    },
    setColorScheme: (newColorScheme: ColorScheme) => {
      colorScheme = newColorScheme;
      saveToStorage();
      applyTheme();
      notifyColorScheme();
    },
    toggleColorScheme: () => {
      colorScheme = colorScheme === "light" ? "dark" : "light";
      saveToStorage();
      applyTheme();
      notifyColorScheme();
    },
  };
}
