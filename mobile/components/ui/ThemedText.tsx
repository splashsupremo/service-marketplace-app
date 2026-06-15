import { Text, TextProps, TextStyle } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { theme } from '@/constants/theme';
import { ColorPalette } from '@/constants/theme/colors';

/**
 * Available typography variants — must match keys in constants/theme/typography.ts
 */
type TypographyVariant = keyof typeof theme.typography;

/**
 * Available semantic color keys — must match keys in our ColorPalette type.
 * We restrict this to color keys whose values are strings (all of ours are),
 * so any palette key works (e.g. 'text', 'textSecondary', 'primary', 'error').
 */
type ColorKey = keyof ColorPalette;

export interface ThemedTextProps extends TextProps {
  /**
   * Typography style to apply (font size, weight, line height).
   * Defaults to 'body'.
   */
  variant?: TypographyVariant;

  /**
   * Semantic color key from the active palette.
   * Defaults to 'text' (primary text color).
   */
  color?: ColorKey;
}

/**
 * ThemedText
 *
 * Drop-in replacement for React Native's <Text>, automatically styled
 * using our design tokens (typography + theme-aware colors).
 *
 * Usage:
 *   <ThemedText variant="h1">Welcome</ThemedText>
 *   <ThemedText variant="caption" color="textMuted">Updated 2h ago</ThemedText>
 *   <ThemedText color="error">Something went wrong</ThemedText>
 */
export function ThemedText({
  variant = 'body',
  color = 'text',
  style,
  ...rest
}: ThemedTextProps) {
  const colors = useThemeColors();

  const typographyStyle = theme.typography[variant] as TextStyle;

  return (
    <Text
      style={[
        typographyStyle,
        { color: colors[color] },
        style, // custom overrides applied last, so they win
      ]}
      {...rest}
    />
  );
}