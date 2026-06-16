import { Pressable, ActivityIndicator, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { theme } from '@/constants/theme';
import { ThemedText } from './ThemedText';

type ButtonVariant = 'primary' | 'secondary' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  /** Text label shown inside the button */
  label: string;

  /** Called when the button is pressed (not called if disabled or loading) */
  onPress: () => void;

  /** Visual style of the button. Defaults to 'primary'. */
  variant?: ButtonVariant;

  /** Size of the button (affects padding and font size). Defaults to 'md'. */
  size?: ButtonSize;

  /** Shows a spinner instead of the label, and blocks presses. Defaults to false. */
  loading?: boolean;

  /** Disables the button (reduced opacity, blocks presses). Defaults to false. */
  disabled?: boolean;

  /** If true, button stretches to fill its container's width. Defaults to false. */
  fullWidth?: boolean;

  /** Optional style override for the outer container */
  style?: StyleProp<ViewStyle>;
}

/**
 * Padding and font size per size variant.
 * Defined outside the component so it's not recreated on every render.
 */
const SIZE_STYLES: Record<ButtonSize, { paddingVertical: number; paddingHorizontal: number; fontSize: number }> = {
  sm: { paddingVertical: theme.spacing.xs, paddingHorizontal: theme.spacing.md, fontSize: 13 },
  md: { paddingVertical: theme.spacing.sm + 2, paddingHorizontal: theme.spacing.lg, fontSize: 15 },
  lg: { paddingVertical: theme.spacing.md, paddingHorizontal: theme.spacing.xl, fontSize: 16 },
};

/**
 * Button
 *
 * Primary interactive component for all actions in the app.
 *
 * Usage:
 *   <Button label="Sign Up" onPress={handleSignUp} />
 *   <Button label="Cancel" variant="secondary" onPress={handleCancel} />
 *   <Button label="View Profile" variant="outline" size="sm" onPress={handleView} />
 *   <Button label="Send Message" loading={isSending} onPress={handleSend} fullWidth />
 */
export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
}: ButtonProps) {
  const colors = useThemeColors();
  const sizeStyle = SIZE_STYLES[size];
  const isDisabled = disabled || loading;

  // Resolve background, border, and text colors based on variant.
  let backgroundColor = 'transparent';
  let borderColor = 'transparent';
  let textColor = colors.text;

  if (variant === 'primary') {
    backgroundColor = colors.primary;
    textColor = colors.textInverse;
  } else if (variant === 'secondary') {
    backgroundColor = colors.surfaceAlt;
    textColor = colors.primary;
  } else if (variant === 'outline') {
    backgroundColor = 'transparent';
    borderColor = colors.primary;
    textColor = colors.primary;
  }

  return (
    <Pressable
      onPress={isDisabled ? undefined : onPress}
      disabled={isDisabled}
      // accessibilityRole + state help screen readers announce button purpose and disabled state
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor,
          borderColor,
          borderWidth: variant === 'outline' ? 1 : 0,
          paddingVertical: sizeStyle.paddingVertical,
          paddingHorizontal: sizeStyle.paddingHorizontal,
          borderRadius: theme.radius.md,
          opacity: isDisabled ? 0.5 : pressed ? 0.8 : 1,
          width: fullWidth ? '100%' : undefined,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <ThemedText
          style={{ color: textColor, fontSize: sizeStyle.fontSize, fontWeight: '600' }}
        >
          {label}
        </ThemedText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
});