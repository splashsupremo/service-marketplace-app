import { useEffect } from 'react';
import { View, FlatList, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import { ReviewCard } from '@/features/providers/components/ReviewCard';
import { useProviderStore } from '@/store/providerStore';
import { useReviewsStore } from '@/store/reviewsStore';
import { useThemeColors } from '@/hooks/useThemeColors';
import { theme } from '@/constants/theme';

/**
 * MyReviewsScreen
 *
 * Fetches and displays real reviews for the logged-in provider's
 * listing, reusing ReviewCard (Phase 6) for visual consistency with
 * the public Provider Profile's review display.
 */
export default function MyReviewsScreen() {
  const colors = useThemeColors();
  const myProvider = useProviderStore((s) => s.myProvider);

  const reviews = useReviewsStore((s) => s.myProviderReviews);
  const isLoading = useReviewsStore((s) => s.isLoadingReviews);
  const fetchProviderReviews = useReviewsStore((s) => s.fetchProviderReviews);

  useEffect(() => {
    if (myProvider) {
      fetchProviderReviews(myProvider.id);
    }
  }, [myProvider?.id]);

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

        {isLoading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : reviews.length === 0 ? (
          <View style={styles.centerContainer}>
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
        ) : (
          <FlatList
            data={reviews}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <ReviewCard
                review={{
                  id: item.id,
                  reviewerName: item.customerName,
                  rating: item.rating,
                  comment: item.comment,
                  createdAt: item.created_at,
                }}
              />
            )}
          />
        )}
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
  centerContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: theme.spacing.xl },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: theme.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  listContent: { paddingHorizontal: theme.spacing.lg, paddingBottom: theme.spacing.xxxl },
});