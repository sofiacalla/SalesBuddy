/**
 * Utility Functions
 * 
 * Common helper functions used throughout the React application.
 */

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Class Name Merger
 * 
 * Combines the functionality of 'clsx' (conditional class names) 
 * and 'tailwind-merge' (resolving conflicting Tailwind classes).
 * 
 * Usage:
 * <div className={cn("base-class", condition && "conditional-class", "p-4 p-2")} />
 * Result: "base-class conditional-class p-2" (p-2 overrides p-4)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
