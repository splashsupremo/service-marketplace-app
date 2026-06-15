/**
 * Spacing tokens.
 * 
 * We use a 4px base unit. All spacing values are multiples of 4.
 * This is the same approach used by most professional design systems
 * (Material Design, Tailwind, etc.) because it keeps everything visually
 * aligned to a consistent grid, and makes spacing decisions faster
 * (you choose from ~7 values instead of arbitrary numbers).
 * 
 * Naming convention: xs, sm, md, lg, xl, xxl, xxxl
 */

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;