import { StyleSheet } from 'react-native';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import { theme } from '@/constants/theme';

/**
 * Profile Screen (placeholder)
 *
 * TODO: Phase 7 — check auth state here.
 * - If not authenticated: show "Sign Up / Login" buttons.
 * - If authenticated as customer: show profile + settings (Phase 8).
 * - If authenticated as provider: show provider dashboard entry (Phase 9).
 */
export default function ProfileScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText variant="h1">Profile</ThemedText>
      <ThemedText color="textSecondary">
        Sign up or log in to manage your profile.
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
});