/**
 * Centralized z-index constants for JDR Coffee
 *
 * This file defines all z-index values used across the application
 * to prevent conflicts and maintain a clear stacking hierarchy.
 *
 * Hierarchy (lowest to highest):
 * 1. Base content (z-index: auto/0)
 * 2. OS Windows (1000-9998)
 * 3. Taskbar (9999)
 * 4. Dropdowns/Modals (10000+)
 */

/**
 * OS Window z-index management
 * Windows start at BASE and increment dynamically
 */
export const Z_INDEX = {
  /** Base layer - regular content */
  BASE: 0,

  /** OS Windows - dynamically managed */
  WINDOW_BASE: 1000,
  WINDOW_MAX: 9998,

  /** Fixed UI elements */
  TASKBAR: 9999,

  /** Overlay elements (always on top) */
  DROPDOWN: 10000,
  POPOVER: 10000,
  TOOLTIP: 10000,
  DIALOG: 10000,
  MODAL: 10000,
  TOAST: 10001,
} as const

/**
 * Helper to create Tailwind z-index classes
 */
export function getZIndexClass(level: keyof typeof Z_INDEX): string {
  return `z-[${Z_INDEX[level]}]`
}

/**
 * Type-safe z-index values for inline styles
 */
export type ZIndexLevel = keyof typeof Z_INDEX
