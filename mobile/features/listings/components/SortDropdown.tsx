import { useState } from 'react';
import { View, Pressable, Modal, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ui/ThemedText';
import { useThemeColors } from '@/hooks/useThemeColors';
import { theme } from '@/constants/theme';

export type SortOption = 'rating' | 'newest' | 'reviews';

const SORT_LABELS: Record<SortOption, string> = {
  rating: 'Highest Rated',
  newest: 'Newest',
  reviews: 'Most Reviews',
};

export interface SortDropdownProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

/**
 * SortDropdown
 *
 * Compact button showing the current sort order. Tapping it opens a
 * small dropdown menu (positioned via a transparent Modal, anchored
 * near the top-right where the button lives) with the 3 sort options.
 *
 * Usage:
 *   <SortDropdown value={sortOption} onChange={setSortOption} />
 */
export function SortDropdown({ value, onChange }: SortDropdownProps) {
  const colors = useThemeColors();
  const [open, setOpen] = useState(false);

  function handleSelect(option: SortOption) {
    onChange(option);
    setOpen(false);
  }

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityLabel={`Sort by ${SORT_LABELS[value]}. Tap to change.`}
        style={({ pressed }) => [
          styles.trigger,
          { borderColor: colors.border, opacity: pressed ? 0.7 : 1 },
        ]}
      >
        <ThemedText variant="captionSemibold" style={{ color: colors.text }}>
          {SORT_LABELS[value]}
        </ThemedText>
        <Ionicons name="chevron-down-outline" size={14} color={colors.textMuted} style={{ marginLeft: 4 }} />
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          <View style={[styles.menu, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            {(Object.keys(SORT_LABELS) as SortOption[]).map((option) => {
              const isActive = option === value;
              return (
                <Pressable
                  key={option}
                  onPress={() => handleSelect(option)}
                  style={({ pressed }) => [
                    styles.menuItem,
                    {
                      backgroundColor: isActive
                        ? colors.primaryLight
                        : pressed
                        ? colors.surfaceAlt
                        : 'transparent',
                    },
                  ]}
                >
                  <ThemedText
                    variant="body"
                    style={{ color: isActive ? colors.primary : colors.text, fontWeight: isActive ? '600' : '400' }}
                  >
                    {SORT_LABELS[option]}
                  </ThemedText>
                  {isActive && <Ionicons name="checkmark" size={16} color={colors.primary} />}
                </Pressable>
              );
            })}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.md,
    borderWidth: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 160, // approximate position below the header/filter bar
    paddingRight: theme.spacing.lg,
  },
  menu: {
    borderRadius: theme.radius.md,
    borderWidth: 1,
    minWidth: 180,
    paddingVertical: theme.spacing.xs,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm + 2,
  },
});