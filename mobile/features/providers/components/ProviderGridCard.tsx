import { View, Image, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/ui/Card';
import { ThemedText } from '@/components/ui/ThemedText';
import { useThemeColors } from '@/hooks/useThemeColors';
import { theme } from '@/constants/theme';
import { Provider } from '@/types/provider';

export interface ProviderGridCardProps {
  provider: Provider;
  onPress: () => void;
  /** Card width in px — calculated by the parent grid based on screen width */
  width: number;
  style?: ViewStyle;
}

/**
 * ProviderGridCard
 *
 * Grid variant of the provider card, used in the 2-column Listings screen.
 * Unlike ProviderCard (fixed 200px width, for horizontal carousels), this
 * component receives its width from the parent — letting the Listings
 * screen compute responsive sizing based on actual screen width, so the
 * grid adapts correctly across phones and tablets.
 *
 * Visual content is the same as ProviderCard (image, verification badge,
 * business name, category/state, rating) for consistency — only the
 * sizing model differs.
 *
 * Usage:
 *   <ProviderGridCard provider={p} width={cardWidth} onPress={() => ...} />
 */
export function ProviderGridCard({ provider, onPress, width, style }: ProviderGridCardProps) {
  const colors = useThemeColors();

  // Image height scales with card width to maintain a consistent aspect
  // ratio (roughly 4:3) across different device screen sizes.
  const imageHeight = Math.round(width * 0.75);

  return (
    <Card onPress={onPress} padding={0} style={[{ width }, style]}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: provider.imageUrl }}
          style={[
            styles.image,
            { height: imageHeight, backgroundColor: colors.surfaceAlt },
          ]}
          resizeMode="cover"
        />
        {provider.isVerified && (
          <View style={[styles.verifiedBadge, { backgroundColor: colors.verified }]}>
            <Ionicons name="checkmark" size={10} color={colors.textInverse} />
          </View>
        )}
      </View>

      <View style={styles.content}>
        <ThemedText variant="bodySemibold" numberOfLines={1}>
          {provider.businessName}
        </ThemedText>
        <ThemedText variant="caption" color="textSecondary" numberOfLines={1} style={styles.meta}>
          {provider.category}
        </ThemedText>
        <ThemedText variant="caption" color="textMuted" numberOfLines={1}>
          {provider.state}
        </ThemedText>

        <View style={styles.ratingRow}>
          <Ionicons name="star" size={12} color={colors.rating} />
          <ThemedText variant="captionSemibold" style={[styles.ratingText, { color: colors.text }]}>
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
  imageContainer: { position: 'relative' },
  image: {
    width: '100%',
    borderTopLeftRadius: theme.radius.lg,
    borderTopRightRadius: theme.radius.lg,
  },
  verifiedBadge: {
    position: 'absolute',
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    width: 18,
    height: 18,
    borderRadius: theme.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: theme.spacing.sm + 2,
    gap: 2,
  },
  meta: { marginTop: 1 },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.xs,
  },
  ratingText: { marginLeft: 3 },
});