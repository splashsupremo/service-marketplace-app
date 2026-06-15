/**
 * Border radius tokens.
 * 
 * Consistent corner rounding across cards, buttons, inputs, and badges
 * is one of the biggest visual "polish" factors in modern app design.
 * We define a small scale here so every rounded element uses one of
 * these values rather than random numbers.
 */

export const radius = {
  none: 0,
  sm: 6,    // Small elements: badges, tags
  md: 10,   // Inputs, buttons
  lg: 16,   // Cards
  xl: 24,   // Large cards, modals, bottom sheets
  full: 9999, // Fully rounded (avatars, pills, circular icons)
} as const;