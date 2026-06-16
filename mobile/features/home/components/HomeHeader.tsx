import { View, StyleSheet, ViewStyle } from 'react-native';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ui/ThemedText';
import { useThemeColors } from '@/hooks/useThemeColors';
import { theme } from '@/constants/theme';

export interface HomeHeaderProps {
  onNotificationPress?: () => void;
  style?: ViewStyle;
}

/**
 * HomeHeader
 *
 * Branded top bar for the Home screen.
 * Left: App name ("ServeNaija" — update to your preferred app name).
 * Right: Notification bell icon (wired up in Phase 8 with real notifications).
 *
 * NOTE: Replace "ServeNaija" with your actual app name once decided.
 * Also update app.json "name" and "slug" fields to match at that point.
 */
export function HomeHeader({ onNotificationPress, style }: HomeHeaderProps) {
  const colors = useThemeColors();

  return (
    <View style={[styles.container, style]}>
      {/* App Name / Logo */}
      <View style={styles.logoRow}>
        <View
          style={[
            styles.logoIcon,
            { backgroundColor: colors.primary },
          ]}
        >
          <Ionicons name="grid-outline" size={16} color={colors.textInverse} />
        </View>
        <ThemedText variant="h2" style={{ color: colors.primary }}>
          ServeNaija
        </ThemedText>
      </View>

      {/* Notification Bell */}
      <Pressable
        onPress={onNotificationPress}
        accessibilityRole="button"
        accessibilityLabel="Notifications"
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        style={({ pressed }) => [
          styles.notificationButton,
          {
            backgroundColor: colors.surfaceAlt,
            borderColor: colors.border,
            opacity: pressed ? 0.7 : 1,
          },
        ]}
      >
        <Ionicons name="notifications-outline" size={20} color={colors.text} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  logoIcon: {
    width: 30,
    height: 30,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationButton: {
    width: 38,
    height: 38,
    borderRadius: theme.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
});