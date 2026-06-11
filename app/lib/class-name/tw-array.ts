/**
 * Enhanced class name value type for custom Tailwind CSS class merging
 * 
 * Key differences from traditional cn functions:
 * - Traditional: Record<string, boolean> (conditional class)
 * - HIS custom: Record<string, string | string[]> (key-value mapping to class names)
 * 
 * @example
 * // Traditional usage (still supported)
 * cn('text-red-500', ['font-bold', 'underline'])
 * 
 * // HIS custom object usage
 * cn({ variant: 'primary', size: 'md' }) // Maps to actual Tailwind class
 */
export type ClassNameValue =
  | ClassNameArray
  | string
  | null
  | undefined
  | boolean
  | Record<string, string | string[]>;
type ClassNameArray = ClassNameValue[];

export const twArray = (...classLists: ClassNameValue[]): string[] => {
  const out: string[] = [];
  for (let i = 0; i < classLists.length; i++) {
    const arg = classLists[i];
    if (arg) toValue(arg, out);
  }
  return out;
};

function toValue(mix: ClassNameValue, out: string[] = []): string[] {
  if (!mix) return out;
  if (typeof mix === "string") {
    out.push(...mix.trim().split(/\s+/));
  } else if (Array.isArray(mix)) {
    for (const item of mix) toValue(item, out);
  } else if (typeof mix === "object") {
    for (const val of Object.values(mix)) toValue(val, out);
  }
  return out;
}
