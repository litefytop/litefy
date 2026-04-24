"use client";

import * as React from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ColorScheme = "light" | "dark";

interface ThemeState {
  theme: string;
  colorScheme: ColorScheme;
  setTheme: (theme: string) => void;
  setColorScheme: (colorScheme: ColorScheme) => void;
  toggleColorScheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "blue",
      colorScheme: "light",
      setTheme: (theme) => set({ theme }),
      setColorScheme: (colorScheme) => set({ colorScheme }),
      toggleColorScheme: () => set((state) => ({ 
        colorScheme: state.colorScheme === "light" ? "dark" : "light" 
      })),
    }),
    {
      name: "theme-storage",
    }
  )
);

export function useTheme() {
  const { theme, colorScheme, setTheme, setColorScheme, toggleColorScheme } = useThemeStore();

  React.useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
    
    if (colorScheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme, colorScheme]);

  return { theme, colorScheme, setTheme, setColorScheme, toggleColorScheme };
}
