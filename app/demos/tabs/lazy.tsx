"use client";

import { lazy, Suspense } from "react";
import { Tabs } from "@/ui";

const LazySettingsPanel = lazy(() => import("./lazy-panel"));

export default function TabsLazyDemo() {
  return (
    <Tabs
      defaultValue="profile"
      options={[
        { value: "profile", label: "Profile", content: "Profile content" },
        {
          value: "settings",
          label: "Settings",
          content: (
            <Suspense fallback={null}>
              <LazySettingsPanel />
            </Suspense>
          ),
        },
      ]}
    />
  );
}
