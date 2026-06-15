import { View, Pressable, StyleSheet, ViewStyle } from 'react-native';
import { ThemedText } from './ThemedText';
import { useThemeColors } from '@/hooks/useThemeColors';
import { theme } from '@/constants/theme';

export interface SectionHeaderProps {
  /** The section title, e.g. "Featured Providers" */
  title: string;

  /**
   * Label for the right-side action link. Defaults to "See all".
   * Pass null to hide the action link entirely.
   */
  actionLabel?: string | null;

  /** Called when the action link is pressed */
  onActionPress?: () => void;

  /** Optional style override for the outer container */
  style?: ViewStyle;
}

/**
 * SectionHeader
 *
 * Displays a section title on the left and an optional "See all >"
 * action link on the right. Used above every horizontal provider
 * carousel on the Home screen.
 *
 * Usage:
 *   <SectionHeader
 *     title="Featured Providers"
 *     onActionPress={() => router.push('/providers?filter=featured')}
 *   />
 *   <SectionHeader title="Categories" actionLabel={null} />
 */
export function SectionHeader({
  title,
  actionLabel = 'See all',
  onActionPress,
  style,
}: SectionHeaderProps) {
  const colors = useThemeColors();

  return (
    <View style={[styles.container, style]}>
      <ThemedText variant="h3">{title}</ThemedText>

      {actionLabel !== null && onActionPress && (
        <Pressable
          onPress={onActionPress}
          accessibilityRole="button"
          accessibilityLabel={`${actionLabel} ${title}`}
          style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
        >
          <ThemedText
            variant="captionSemibold"
            style={{ color: colors.primary }}
          >
            {actionLabel} →
          </ThemedText>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
});