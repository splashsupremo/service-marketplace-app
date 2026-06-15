import { View, Image, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/ui/Card';
import { ThemedText } from '@/components/ui/ThemedText';
import { useThemeColors } from '@/hooks/useThemeColors';
import { theme } from '@/constants/theme';
import { Provider } from '@/types/provider';

export interface ProviderCardProps {
  provider: Provider;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

/**
 * ProviderCard
 *
 * Displays a provider as a card suitable for horizontal carousels
 * on the Home screen, search results, and listing screens.
 *
 * Fixed width (200px) so 1.5–2 cards are visible at once, signalling
 * horizontal scrollability to the user (the "peek" pattern).
 *
 * Shows:
 * - Provider image (with loading placeholder background)
 * - Verification badge overlay (top-right of image, if verified)
 * - Business name (1 line, truncated)
 * - Category + State
 * - Star rating + review count
 *
 * Usage:
 *   <ProviderCard
 *     provider={provider}
 *     onPress={() => router.push(`/providers/${provider.id}`)}
 *   />
 */
export function ProviderCard({ provider, onPress, style }: ProviderCardProps) {
  const colors = useThemeColors();

  return (
    <Card onPress={onPress} padding={0} style={[styles.card, style]}>

      {/* ── Image + Verification Badge ── */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: provider.imageUrl }}
          style={[styles.image, { backgroundColor: colors.surfaceAlt }]}
          resizeMode="cover"
        />

        {provider.isVerified && (
          <View
            style={[
              styles.verifiedBadge,
              { backgroundColor: colors.verified },
            ]}
          >
            <Ionicons
              name="checkmark"
              size={10}
              color={colors.textInverse}
            />
          </View>
        )}
      </View>

      {/* ── Text Content ── */}
      <View style={styles.content}>

        {/* Business Name */}
        <ThemedText
          variant="bodySemibold"
          numberOfLines={1}
          style={styles.businessName}
        >
          {provider.businessName}
        </ThemedText>

        {/* Category + State */}
        <ThemedText
          variant="caption"
          color="textSecondary"
          numberOfLines={1}
          style={styles.meta}
        >
          {provider.category} • {provider.state}
        </ThemedText>

        {/* Rating Row */}
        <View style={styles.ratingRow}>
          <Ionicons
            name="star"
            size={12}
            color={colors.rating}
          />
          <ThemedText
            variant="captionSemibold"
            style={[styles.ratingText, { color: colors.text }]}
          >
            {provider.rating.toFixed(1)}
          </ThemedText>
          <ThemedText variant="caption" color="textMuted">
            {' '}({provider.reviewCount})
          </ThemedText>
        </View>

      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 200,
    marginRight: theme.spacing.md,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: theme.radius.lg,
    borderTopRightRadius: theme.radius.lg,
  },
  verifiedBadge: {
    position: 'absolute',
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    width: 20,
    height: 20,
    borderRadius: theme.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: theme.spacing.md,
    gap: theme.spacing.xs,
  },
  businessName: {
    marginBottom: 2,
  },
  meta: {
    marginBottom: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 3,
  },
});