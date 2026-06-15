import { useColorScheme } from 'react-native';
import { getColors, ColorPalette } from '@/constants/theme';

/**
 * useThemeColors
 * 
 * Returns the color palette matching the device's current light/dark mode.
 * 
 * Usage:
 *   const colors = useThemeColors();
 *   <View style={{ backgroundColor: colors.background }}>
 *     <Text style={{ color: colors.text }}>Hello</Text>
 *   </View>
 * 
 * This hook re-runs automatically whenever the user changes their device's
 * system theme, so any component using it will re-render with the new colors.
 */
export function useThemeColors(): ColorPalette {
  const scheme = useColorScheme(); // 'light' | 'dark' | null
  return getColors(scheme);
}