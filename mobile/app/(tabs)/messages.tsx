import { StyleSheet } from 'react-native';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import { theme } from '@/constants/theme';

/**
 * Messages Screen (placeholder)
 *
 * TODO: Phase 7 — check auth state here.
 * - If not authenticated: show a "Sign Up to chat with providers" prompt.
 * - If authenticated: show chat list (Phase 10).
 */
export default function MessagesScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText variant="h1">Messages</ThemedText>
      <ThemedText color="textSecondary">
        Your conversations will appear here.
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