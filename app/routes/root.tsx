import { redirect } from "react-router";
import type { Route } from "./+types/root";

function getPreferredLanguage(): string {
  if (typeof window === "undefined") {
    return "en";
  }

  try {
    const stored = localStorage.getItem("preferred-language");
    if (stored && ["en", "zh"].includes(stored)) {
      return stored;
    }
  } catch (e) {}

  return "en";
}

export async function loader({}: Route.LoaderArgs) {
  const lang = getPreferredLanguage();
  return redirect(`/${lang}`);
}

export default function Root() {
  return null;
}
