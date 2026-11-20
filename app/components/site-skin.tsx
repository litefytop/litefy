"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { siteSkin } from "./site-skin-bundle";

export type SiteSkin = typeof siteSkin;

const SiteSkinContext = createContext<SiteSkin | null>(null);

export function SiteSkinProvider({ skin, children }: { skin: SiteSkin; children: ReactNode }) {
  return <SiteSkinContext.Provider value={skin}>{children}</SiteSkinContext.Provider>;
}

export function useSiteSkin(): SiteSkin {
  const skin = useContext(SiteSkinContext);
  if (!skin) throw new Error("useSiteSkin: this route renders chrome with no SiteSkinProvider above it");
  return skin;
}
