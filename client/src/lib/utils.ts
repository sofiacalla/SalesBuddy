/**
 * UI Utility Functions
 * 
 * Helper functions for class name merging and conditional styling.
 * Used primarily with Tailwind CSS and shadcn/ui components.
 */

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
