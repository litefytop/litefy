import React from "react";
import { createRoot } from "react-dom/client";
import "../../../app/ui/styles/index.css";

declare global {
  interface Window {
    __commits: { phase: string; actualDuration: number; commitTime: number; nInteractions: number }[];
  }
}

const demos = import.meta.glob<{ default: React.ComponentType }>("../../../app/demos/**/*.tsx");

async function start() {
  const name = new URLSearchParams(location.search).get("demo");
  const rootEl = document.getElementById("root");
  if (!rootEl) return;
  if (!name) {
    rootEl.textContent = "NO DEMO";
    return;
  }
  const loader = demos[`../../../app/demos/${name}.tsx`];
  if (!loader) {
    rootEl.textContent = "DEMO NOT FOUND: " + name;
    return;
  }
  try {
    const Comp = (await loader()).default;
    const root = createRoot(rootEl);
    root.render(
      <React.Profiler
        id="demo"
        onRender={(_id, phase, actualDuration, _base, _start, commitTime) => {
          window.__commits.push({
            phase,
            actualDuration: Math.round(actualDuration * 100) / 100,
            commitTime: Math.round(commitTime),
            nInteractions: 0,
          });
        }}
      >
        <Comp />
      </React.Profiler>,
    );
  } catch (e) {
    rootEl.textContent = "MOUNT ERROR: " + String(e).slice(0, 300);
  }
}

window.__commits = [];
start();
