/**
 * Theme entry point.
 * 
 * This file combines all our design tokens into a single object,
 * and provides a helper to get the correct color palette based on
 * the active color scheme (light/dark).
 * 
 * Usage example:
 *   import { theme, getColors } from '@/constants/theme';
 *   const colors = getColors('dark');
 *   <View style={{ padding: theme.spacing.md, backgroundColor: colors.surface }} />
 */

import { lightColors, darkColors, ColorPalette } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';
import { radius } from './radius';

export type ColorScheme = 'light' | 'dark';

/**
 * Returns the correct color palette for the given scheme.
 * Defaults to light if an invalid/undefined scheme is passed.
 */
export function getColors(scheme: ColorScheme | null | undefined): ColorPalette {
  return scheme === 'dark' ? darkColors : lightColors;
}

export const theme = {
  typography,
  spacing,
  radius,
};

// Re-export individual palettes and types in case they're needed directly
export { lightColors, darkColors };
export type { ColorPalette };