/**
 * Typography tokens.
 * 
 * We define a "type scale" — a set of named text styles, each with a
 * specific font size, font weight, and line height. Components reference
 * these by name (e.g., `typography.h1`, `typography.body`) instead of
 * setting font sizes manually, ensuring consistent text hierarchy.
 * 
 * Line heights are set as multipliers close to 1.2-1.5x the font size,
 * which is standard for readability (too tight = cramped, too loose = 
 * disconnected from surrounding text).
 */

export const typography = {
  // Headings
  h1: {
    fontSize: 28,
    fontWeight: '700' as const,
    lineHeight: 36,
  },
  h2: {
    fontSize: 22,
    fontWeight: '700' as const,
    lineHeight: 30,
  },
  h3: {
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: 26,
  },

  // Body text
  bodyLarge: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  body: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  bodySemibold: {
    fontSize: 14,
    fontWeight: '600' as const,
    lineHeight: 20,
  },

  // Small text
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
  captionSemibold: {
    fontSize: 12,
    fontWeight: '600' as const,
    lineHeight: 16,
  },

  // Buttons
  button: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 24,
  },

  // Labels (form inputs, small UI labels)
  label: {
    fontSize: 13,
    fontWeight: '500' as const,
    lineHeight: 18,
  },
} as const;