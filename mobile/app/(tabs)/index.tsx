import { StyleSheet } from 'react-native';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import { theme } from '@/constants/theme';

/**
 * Home Screen (placeholder)
 *
 * This will become the main browse screen in Phase 4:
 * search bar, state selector, categories, featured/recent/popular providers.
 */
export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText variant="h1">Home</ThemedText>
      <ThemedText color="textSecondary">
        Phase 4 will build the real Home screen here.
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