export function loadStored(key: string): string {
  if (typeof window === "undefined") return "";
  try {
    return JSON.parse(localStorage.getItem(key) ?? '""') ?? "";
  } catch {
    return "";
  }
}

export function applyAttr(attr: string, value: string) {
  if (typeof document === "undefined") return;
  if (value) document.documentElement.setAttribute(attr, value);
  else document.documentElement.removeAttribute(attr);
}
