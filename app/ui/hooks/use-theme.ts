"use client";

import { useSyncExternalStore } from "react";

export type ThemeMode = "light" | "dark" | "system";

interface ThemeState {
  brand: string;
  theme: ThemeMode;
  setBrand: (brand: string) => void;
  setTheme: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const STORAGE_KEY = "theme-storage";
const DEFAULT_BRAND = "";
const DEFAULT_THEME: ThemeMode = "light";

let brand = DEFAULT_BRAND;
let theme: ThemeMode = DEFAULT_THEME;

const brandListeners = new Set<() => void>();
const themeListeners = new Set<() => void>();

function loadFromStorage() {
  if (typeof window === "undefined") return;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      brand = parsed.brand ?? DEFAULT_BRAND;
      theme = parsed.theme ?? DEFAULT_THEME;
    }
  } catch (e) {
    console.error("Error loading theme from storage:", e);
  }
}

function saveToStorage() {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ brand, theme }));
}

function notifyBrand() {
  brandListeners.forEach((fn) => fn());
}

function notifyTheme() {
  themeListeners.forEach((fn) => fn());
}

function getSystemColorScheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme() {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.setAttribute("data-brand", brand);
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
      notifyTheme();
    }
  };
  mediaQuery.addEventListener("change", handleSystemChange);
}

function subscribeBrand(onStoreChange: () => void) {
  brandListeners.add(onStoreChange);
  return () => brandListeners.delete(onStoreChange);
}

function subscribeTheme(onStoreChange: () => void) {
  themeListeners.add(onStoreChange);
  return () => themeListeners.delete(onStoreChange);
}

function getBrandSnapshot() {
  return brand;
}

function getThemeSnapshot() {
  return theme;
}

function getBrandServerSnapshot() {
  return DEFAULT_BRAND;
}

function getThemeServerSnapshot() {
  return DEFAULT_THEME;
}

export function useTheme(): ThemeState {
  const currentBrand = useSyncExternalStore(
    subscribeBrand,
    getBrandSnapshot,
    getBrandServerSnapshot,
  );
  const currentTheme = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    getThemeServerSnapshot,
  );

  const setBrand = (newBrand: string) => {
    brand = newBrand;
    saveToStorage();
    applyTheme();
    notifyBrand();
  };

  const setTheme = (newMode: ThemeMode) => {
    theme = newMode;
    saveToStorage();
    applyTheme();
    notifyTheme();
  };

  const toggleTheme = () => {
    if (theme === "system") {
      const system = getSystemColorScheme();
      theme = system === "dark" ? "light" : "dark";
    } else {
      theme = theme === "light" ? "dark" : "light";
    }
    saveToStorage();
    applyTheme();
    notifyTheme();
  };

  return {
    brand: currentBrand,
    theme: currentTheme,
    setBrand,
    setTheme,
    toggleTheme,
  };
}
