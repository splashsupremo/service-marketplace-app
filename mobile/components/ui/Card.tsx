import { View, Pressable, ViewProps, ViewStyle, StyleProp, StyleSheet, Platform } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { theme } from '@/constants/theme';

export interface CardProps extends ViewProps {
  /**
   * If provided, the card becomes tappable and calls this on press.
   * If omitted, the card renders as a plain (non-interactive) container.
   */
  onPress?: () => void;

  /**
   * Inner padding of the card. Defaults to theme.spacing.lg (16px).
   * Pass 0 for image-heavy cards where content below the image
   * should handle its own padding.
   */
  padding?: number;

  /** Optional style override for the outer container */
  style?: StyleProp<ViewStyle>;
}

/**
 * Card
 *
 * Base container for card-style UI throughout the app
 * (provider cards, category cards, dashboard stat cards, etc.)
 *
 * Usage:
 *   // Non-interactive card
 *   <Card>
 *     <ThemedText>Static content</ThemedText>
 *   </Card>
 *
 *   // Tappable card (e.g. provider card navigating to profile)
 *   <Card onPress={() => router.push(`/providers/${id}`)} padding={0}>
 *     <Image source={{ uri: imageUrl }} style={{ height: 140, borderRadius: theme.radius.lg }} />
 *     <View style={{ padding: theme.spacing.md }}>
 *       <ThemedText variant="h3">{businessName}</ThemedText>
 *     </View>
 *   </Card>
 */
export function Card({ onPress, padding = theme.spacing.lg, style, children, ...rest }: CardProps) {
  const colors = useThemeColors();

  const baseStyle: ViewStyle = {
    backgroundColor: colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding,
    ...styles.shadow,
  };

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        style={({ pressed }) => [
          baseStyle,
          { opacity: pressed ? 0.85 : 1 },
          style,
        ]}
        {...rest}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View style={[baseStyle, style]} {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  shadow: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 6,
    },
    android: {
      elevation: 2,
    },
    default: {},
  }) as ViewStyle,
});