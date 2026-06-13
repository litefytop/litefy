import { createTailwindMerge } from "./create-tailwind-merge";
import { getDefaultConfig } from "./default-config";
import type { ClassNameValue } from "./tw-array";

export type { ClassNameValue };

/**
 * Custom Tailwind CSS class name utility that merges conflicting Tailwind class
 * with enhanced type support and object handling.
 *
 * This implementation extends the standard tailwind-merge functionality with:
 * - Enhanced type safety for class name values
 * - Support for object mapping (Record<string, string | string[]>)
 * - Automatic filtering of nullish values, booleans, and zero values
 *
 * Key differences from traditional clsx/twMerge combination:
 * - Traditional: Accepts Record<string, boolean> for conditional class
 * - HIS custom: Accepts Record<string, string | string[]> for key-value mapping
 *
 * @param {...ClassNameValue} classLists - Multiple class name values to merge
 * @returns {string} Merged Tailwind CSS class string
 *
 * @example
 * // Basic string usage
 * cn('text-red-500', 'font-bold')
 *
 * // Array usage
 * cn(['text-red-500', 'font-bold'])
 *
 * // Object mapping usage (HIS custom feature)
 * cn({ variant: 'primary', size: 'md' })
 *
 * // Mixed usage
 * cn('base-class', ['flex', 'items-center'], { variant: 'primary' }, null)
 *
 * // With Button component styles
 * cn(Button.class, Button.variantsclass.primary, Button.sizeclass.md)
 */
export const cn = createTailwindMerge(getDefaultConfig);
