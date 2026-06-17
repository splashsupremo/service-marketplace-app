import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ui/ThemedText';
import { Button } from '@/components/ui/Button';
import { useThemeColors } from '@/hooks/useThemeColors';
import { theme } from '@/constants/theme';

/**
 * EmptyFavourites
 *
 * Shown on the Favourites tab when an authenticated user has no saved
 * providers yet. Distinct from AuthPrompt (Phase 7) — this is for
 * already-authenticated users who simply haven't saved anything,
 * not a "you need an account" message.
 */
export function EmptyFavourites() {
  const colors = useThemeColors();

  return (
    <View style={styles.container}>
      <View style={[styles.iconCircle, { backgroundColor: colors.primaryLight }]}>
        <Ionicons name="heart-outline" size={32} color={colors.primary} />
      </View>
      <ThemedText variant="h3" style={{ textAlign: 'center' }}>
        No favourites yet
      </ThemedText>
      <ThemedText
        color="textSecondary"
        style={{ textAlign: 'center', marginTop: theme.spacing.xs, marginBottom: theme.spacing.xl }}
      >
        Browse providers and tap the heart icon to save them here.
      </ThemedText>
      <Button
        label="Browse Providers"
        onPress={() => router.push('/listings')}
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: theme.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
  },
  button: { maxWidth: 280, width: '100%' },
});