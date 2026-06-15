import { StyleSheet } from 'react-native';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import { theme } from '@/constants/theme';

/**
 * Favourites Screen (placeholder)
 *
 * TODO: Phase 7 — check auth state here.
 * - If not authenticated: show a "Sign Up to save favourites" prompt
 *   with a Button linking to /auth/register.
 * - If authenticated: show the user's saved provider list (Phase 8).
 */
export default function FavouritesScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText variant="h1">Favourites</ThemedText>
      <ThemedText color="textSecondary">
        Saved providers will appear here.
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