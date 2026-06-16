import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/ui/Card';
import { ThemedText } from '@/components/ui/ThemedText';
import { useThemeColors } from '@/hooks/useThemeColors';
import { theme } from '@/constants/theme';
import { Review } from '@/types/providerDetail';

export interface ReviewCardProps {
  review: Review;
}

/**
 * formatRelativeDate
 *
 * Converts an ISO date string into a short relative label like "2 days ago"
 * or "3 weeks ago". Kept local to this component since review dates are
 * the only place we need this specific "relative" format for now — if
 * other screens need it later, we'll promote it to utils/.
 */
function formatRelativeDate(isoDate: string): string {
  const date = new Date(isoDate);
  const diffMs = Date.now() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 1) return 'Today';
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 7) return `${diffDays} days ago`;
  const weeks = Math.floor(diffDays / 7);
  if (weeks === 1) return '1 week ago';
  if (weeks < 5) return `${weeks} weeks ago`;
  const months = Math.floor(diffDays / 30);
  if (months <= 1) return '1 month ago';
  return `${months} months ago`;
}

/**
 * ReviewCard
 *
 * Displays a single review: star rating, reviewer name, relative date,
 * and the review comment text.
 */
export function ReviewCard({ review }: ReviewCardProps) {
  const colors = useThemeColors();

  return (
    <Card style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Ionicons
              key={i}
              name={i <= review.rating ? 'star' : 'star-outline'}
              size={13}
              color={colors.rating}
              style={{ marginRight: 1 }}
            />
          ))}
        </View>
        <ThemedText variant="caption" color="textMuted">
          {formatRelativeDate(review.createdAt)}
        </ThemedText>
      </View>

      <ThemedText variant="bodySemibold" style={styles.reviewerName}>
        {review.reviewerName}
      </ThemedText>

      <ThemedText variant="body" color="textSecondary">
        {review.comment}
      </ThemedText>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: theme.spacing.sm },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xs,
  },
  starsRow: { flexDirection: 'row' },
  reviewerName: { marginBottom: 2 },
});