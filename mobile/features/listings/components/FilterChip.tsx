import { Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ui/ThemedText';
import { useThemeColors } from '@/hooks/useThemeColors';
import { theme } from '@/constants/theme';

export interface FilterChipProps {
  /** Label shown on the chip, e.g. "Lagos" or "Featured" */
  label: string;
  /** Called when the ✕ is tapped, removing this filter */
  onRemove: () => void;
}

/**
 * FilterChip
 *
 * A removable pill showing one active filter on the Listings screen
 * (e.g. "Featured ✕", "Lagos ✕", "Plumbing ✕"). Tapping the ✕ clears
 * just that one filter, leaving others intact.
 *
 * Usage:
 *   <FilterChip label="Lagos" onRemove={() => setStateFilter(null)} />
 */
export function FilterChip({ label, onRemove }: FilterChipProps) {
  const colors = useThemeColors();

  return (
    <Pressable
      onPress={onRemove}
      accessibilityRole="button"
      accessibilityLabel={`Remove ${label} filter`}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: colors.primaryLight,
          borderColor: colors.primary,
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <ThemedText variant="captionSemibold" style={{ color: colors.primary, marginRight: 4 }}>
        {label}
      </ThemedText>
      <Ionicons name="close" size={14} color={colors.primary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.sm + 2,
    paddingVertical: 6,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    marginRight: theme.spacing.sm,
  },
});