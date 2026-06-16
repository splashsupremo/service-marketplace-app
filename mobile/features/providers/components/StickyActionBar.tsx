import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/Button';
import { useThemeColors } from '@/hooks/useThemeColors';
import { theme } from '@/constants/theme';

export interface StickyActionBarProps {
  /**
   * Label for the primary button. Differs by auth state:
   * - Visitor: "Sign Up to Contact"
   * - Authenticated: "Contact Provider"
   */
  label: string;
  onPress: () => void;
}

/**
 * StickyActionBar
 *
 * Fixed bottom bar with the primary call-to-action button, present on
 * every screen scroll position. Wrapped in SafeAreaView (bottom edge
 * only) so it clears the home indicator / gesture bar on modern devices.
 *
 * TODO: Phase 7 — the parent screen passes a different `label`/`onPress`
 * depending on real auth state once the Zustand auth store exists.
 */
export function StickyActionBar({ label, onPress }: StickyActionBarProps) {
  const colors = useThemeColors();

  return (
    <SafeAreaView edges={['bottom']} style={{ backgroundColor: colors.surface }}>
      <View style={[styles.container, { borderTopColor: colors.border }]}>
        <Button label={label} onPress={onPress} fullWidth size="lg" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
  },
});