import { View, ViewProps } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { ColorPalette } from '@/constants/theme/colors';

/**
 * Background-related color keys that make sense for a "view" container.
 * Restricting to these (rather than all ColorPalette keys) prevents
 * accidentally passing a text/border color where a background is expected.
 */
type BackgroundVariant = 'background' | 'surface' | 'surfaceAlt';

export interface ThemedViewProps extends ViewProps {
  /**
   * Which background color to use.
   * - 'background' = main screen background (default)
   * - 'surface' = cards, inputs, elevated content
   * - 'surfaceAlt' = secondary panels (e.g. search bar backgrounds)
   */
  variant?: BackgroundVariant;
}

/**
 * ThemedView
 *
 * Drop-in replacement for React Native's <View>, automatically styled
 * with the correct light/dark background color from our design tokens.
 *
 * Usage:
 *   <ThemedView variant="surface" style={{ padding: 16 }}>...</ThemedView>
 */
export function ThemedView({ variant = 'background', style, ...rest }: ThemedViewProps) {
  const colors: ColorPalette = useThemeColors();

  return (
    <View
      style={[{ backgroundColor: colors[variant] }, style]}
      {...rest}
    />
  );
}