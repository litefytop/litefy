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
  | 0
  | 0n
  | boolean
  | false
  | Record<string, string | string[]>;
type ClassNameArray = ClassNameValue[];
export const twArray = (...classLists: ClassNameValue[]): string[] => {
  let index = 0;
  let argument: ClassNameValue;
  let resolvedValue: string[];
  let array: string[] = [];

  while (index < classLists.length) {
    if ((argument = classLists[index++])) {
      if ((resolvedValue = toValue(argument)) && resolvedValue.length > 0) {
        array = [...array, ...resolvedValue];
      }
    }
  }
  return array;
};

const toValue = (mix: ClassNameValue): string[] => {
  if (!mix) return [];
  if (typeof mix === "string") {
    return mix.split(/\s+/).filter((cls) => cls);
  }
  if (typeof mix === "object") {
    if (Array.isArray(mix)) {
      let array: string[] = [];
      for (let k = 0; k < mix.length; k++) {
        const item = mix[k];
        if (item) {
          const resolved = toValue(item);
          if (resolved.length > 0) {
            array = [...array, ...resolved];
          }
        }
      }
      return array;
    } else {
      const classList: string[] = [];
      Object.entries(mix).forEach((item) => {
        classList.push(...toValue(item[1]));
      });
      return classList;
    }
  }
  return [];
};
