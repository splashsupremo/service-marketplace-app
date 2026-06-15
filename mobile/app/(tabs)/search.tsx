import { StyleSheet } from 'react-native';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import { theme } from '@/constants/theme';

/**
 * Search Screen (placeholder)
 *
 * Dedicated search/filter screen — more advanced filtering
 * (state, city, category, rating) than the home screen's quick search.
 */
export default function SearchScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText variant="h1">Search</ThemedText>
      <ThemedText color="textSecondary">
        Advanced search and filters will live here.
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