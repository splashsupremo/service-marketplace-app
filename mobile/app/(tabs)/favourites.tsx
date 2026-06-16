import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import { AuthPrompt } from '@/features/auth/components/AuthPrompt';
import { useAuthStore } from '@/store/authStore';
import { useThemeColors } from '@/hooks/useThemeColors';
import { theme } from '@/constants/theme';

/**
 * FavouritesScreen
 *
 * Visitor: AuthPrompt (sign up / log in to save favourites).
 * Authenticated: placeholder for now — real saved provider list comes
 * in Phase 8 once we have a `favourites` table in Supabase.
 */
export default function FavouritesScreen() {
  const colors = useThemeColors();
  const isAuthenticated = useAuthStore((s) => !!s.user);

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
        <AuthPrompt
          icon="heart-outline"
          title="Save your favourites"
          message="Sign up to save providers you like and find them easily later."
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      <ThemedView style={styles.container}>
        <ThemedText variant="h1">Favourites</ThemedText>
        <ThemedText color="textSecondary" style={{ marginTop: theme.spacing.sm }}>
          Saved providers will appear here. (Coming in Phase 8)
        </ThemedText>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, padding: theme.spacing.lg },
});