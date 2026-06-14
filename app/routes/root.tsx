import { redirect } from "react-router";

function getPreferredLanguage(): string {
  if (typeof window === "undefined") {
    return "en";
  }

  try {
    const stored = localStorage.getItem("preferred-language");
    if (stored && ["en", "zh"].includes(stored)) {
      return stored;
    }
  } catch (e) {
    console.error("Error reading preferred language:", e);
  }

  return "en";
}

export async function loader() {
  const lang = getPreferredLanguage();
  return redirect(`/${lang}`);
}

export default function Root() {
  return null;
}
