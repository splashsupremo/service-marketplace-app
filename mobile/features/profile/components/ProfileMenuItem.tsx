import { Pressable, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ui/ThemedText';
import { useThemeColors } from '@/hooks/useThemeColors';
import { theme } from '@/constants/theme';

export interface ProfileMenuItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}

/**
 * ProfileMenuItem
 *
 * Reusable tappable row for the Profile tab's menu sections
 * (e.g. "Edit Profile", future "My Reviews", "Provider Dashboard").
 * Icon on the left, label in the middle, chevron on the right.
 */
export function ProfileMenuItem({ icon, label, onPress }: ProfileMenuItemProps) {
  const colors = useThemeColors();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.container,
        { borderBottomColor: colors.divider, opacity: pressed ? 0.7 : 1 },
      ]}
    >
      <View style={[styles.iconCircle, { backgroundColor: colors.surfaceAlt }]}>
        <Ionicons name={icon} size={18} color={colors.text} />
      </View>
      <ThemedText variant="body" style={styles.label}>
        {label}
      </ThemedText>
      <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
  },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: theme.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  label: { flex: 1 },
});