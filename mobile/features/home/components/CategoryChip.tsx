import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ui/ThemedText';
import { useThemeColors } from '@/hooks/useThemeColors';
import { theme } from '@/constants/theme';

export interface CategoryChipProps {
  /** Category label, e.g. "Plumbing" */
  label: string;

  /** Ionicons icon name, e.g. "water-outline" */
  icon: string;

  /** Whether this category is currently selected/active */
  isSelected?: boolean;

  /** Called when this chip is tapped */
  onPress: () => void;
}

/**
 * CategoryChip
 *
 * A pressable pill/chip showing a category icon and label.
 * Used in the horizontal categories row on the Home screen.
 *
 * Selected state: filled primary background + white text/icon.
 * Unselected state: surface background + primary icon + body text.
 *
 * Usage:
 *   <CategoryChip
 *     label="Plumbing"
 *     icon="water-outline"
 *     isSelected={selectedCategory === 'Plumbing'}
 *     onPress={() => setSelectedCategory('Plumbing')}
 *   />
 */
export function CategoryChip({
  label,
  icon,
  isSelected = false,
  onPress,
}: CategoryChipProps) {
  const colors = useThemeColors();

  const backgroundColor = isSelected ? colors.primary : colors.surface;
  const iconColor = isSelected ? colors.textInverse : colors.primary;
  const textColor = isSelected ? colors.textInverse : colors.text;
  const borderColor = isSelected ? colors.primary : colors.border;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${label} category`}
      accessibilityState={{ selected: isSelected }}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor,
          borderColor,
          opacity: pressed ? 0.8 : 1,
        },
      ]}
    >
      <Ionicons name={icon as any} size={16} color={iconColor} />
      <ThemedText
        variant="captionSemibold"
        style={{ color: textColor, marginLeft: theme.spacing.xs }}
      >
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    marginRight: theme.spacing.sm,
  },
});