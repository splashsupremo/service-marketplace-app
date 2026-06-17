import { View, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import { useThemeColors } from '@/hooks/useThemeColors';
import { theme } from '@/constants/theme';

/**
 * MyReviewsScreen
 *
 * Always shows the empty state for now — real customer reviews don't
 * exist until Phase 11 adds a `reviews` table tied to real providers.
 * This is an accurate reflection of current data, not a placeholder
 * cutting corners. Once Phase 11 lands, this screen's job becomes
 * fetching and listing real ReviewCard entries, with this empty state
 * remaining as the fallback for providers with genuinely no reviews.
 */
export default function MyReviewsScreen() {
  const colors = useThemeColors();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      <ThemedView style={styles.container}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Pressable onPress={() => router.back()} hitSlop={8} accessibilityLabel="Go back">
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </Pressable>
          <ThemedText variant="h3" style={{ marginLeft: theme.spacing.md }}>
            My Reviews
          </ThemedText>
        </View>

        <View style={styles.emptyContainer}>
          <View style={[styles.iconCircle, { backgroundColor: colors.primaryLight }]}>
            <Ionicons name="star-outline" size={28} color={colors.primary} />
          </View>
          <ThemedText variant="h3" style={{ textAlign: 'center' }}>
            No reviews yet
          </ThemedText>
          <ThemedText
            color="textSecondary"
            style={{ textAlign: 'center', marginTop: theme.spacing.xs }}
          >
            Reviews from customers will appear here once they start using your services.
          </ThemedText>
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
  },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: theme.spacing.xl },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: theme.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
});